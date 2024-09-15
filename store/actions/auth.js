import AsyncStorage from '@react-native-async-storage/async-storage';
import DbLink from '../../constants/DbLink';
import Mode from '../../constants/Mode'
import Names from '../../constants/StringsName';

export const AUTHENTICATE = 'AUTHENTICATE';
export const SAVE_USERDATA = 'SAVE_USERDATA';
export const UPDATE_USERDATA = 'UPDATE_USERDATA';
export const LOGOUT = 'LOGOUT';
export const EXPIRATION_DATE = 'EXPIRATION_DATE';

//let timer;

/**  
 * https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
 * ".read": "now < 1632178800000",  // Date.parse('21 Sep 2021 00:00:00 GMT+1');
 */

// Java async functio example

// const verifyUser = async function(username, password){
//   try {
//       const userInfo = await dataBase.verifyUser(username, password);
//       const rolesInfo = await dataBase.getRoles(userInfo);
//       const logStatus = await dataBase.logAccess(userInfo);
//       return userInfo;
//   }catch (e){
//       //handle errors as needed
//   }
// };

/**
 * signUp
 * @param {*} email 
 * @param {*} password 
 */
export const signUp = ( email, password ) =>{
  return async dispatch =>{

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${DbLink.API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'applications/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );
   
    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Qualcosa è andato storto!!';
   
      if (errorId === 'EMAIL_EXISTS') {
        message = 'Questa email è già esistente nel sistema!';
      }
      throw new Error(message);
    }
    

    const resData = await response.json();
    // lancia verifica email
    const rve = await dispatch( verifyEmail( resData.idToken ) );
    dispatch( saveAuthToReducer( AUTHENTICATE, email, password, resData, null ) );
  };
};


/**
 * endSignUp
 * 
 * @param {*} auth 
 * @param {*} inputValues 
 * @returns 
 */
export const endSignUp = ( auth, inputValues ) =>{

  return async (dispatch, getState ) =>{
    const { token, userId } = auth;
    const { cf } = inputValues; 
    
    const resCheck = await dispatch( checkUserData( token, cf )); 
    if( resCheck  ){
      
      await dispatch( deleteUser(token) );
      await dispatch(logout())
      throw new Error( "Quest'utente è già stato inserito! ");
    }
    else
    {
      const userData = { 
        email:inputValues.email,
        //password:inputValues.password,
        nome: inputValues.nome,
        cognome: inputValues.cognome,
        cf: inputValues.cf,
        piva: inputValues.piva,
        via: inputValues.via,
        nciv: inputValues.nciv,
        citta: inputValues.citta,
        cap: inputValues.cap,
        provincia: inputValues.provincia,
        telefono: inputValues.telefono,
        emailVerified: true,
        permissions: Mode.USER,         // da gestire per ora hard code
        deleted: false,                 // deleted per gestione eliminati 
        prepaid: 0.0,                   // credito prepagato
      };
      //
      const dataName = await dispatch( registerUserData( token, userId, userData ));
      const recordUserData = {};
      recordUserData[dataName] = userData;
      //
      await dispatch( saveAuthToReducer( SAVE_USERDATA, null, null, null, recordUserData ) );
      const auth = getState().auth;
      saveDataToStorage(auth);
    }
  };
};

/**
 * Login
 * @param {*} email 
 * @param {*} password 
 */
export const login = ( email, password ) =>{

  return async ( dispatch, getState )=>{
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${DbLink.API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'applications/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorResData.error.message;

      if (errorId === 'EMAIL_NOT_FOUND') 
      {
        message = 'Indirizzo email non trovato!';
      } 
      else if (errorId === 'INVALID_PASSWORD') 
      {
        message = 'Password non valida!';
      }

      throw new Error(message);
    }
    
    const resData = await response.json();
    const recordUserData = await dispatch( fetchUserData(resData.idToken, resData.localId));

    if( Object.entries(recordUserData).length === 0 && recordUserData.constructor === Object)
    {
      await dispatch( deleteUser(resData.idToken) );
      throw new Error( "Quest'utente non è registrato!! ");
    }
    else if ( recordUserData[Object.keys(recordUserData)[0]].deleted ){

      const e = new Error( "Quest'utente è stato disabilitato!! ");
      e.name = "Attenzione!";
      throw e;
    }
    else
    {
      await dispatch( saveAuthToReducer( AUTHENTICATE, email, password, resData, recordUserData ) );
      const auth = getState().auth;
      saveDataToStorage(auth);
    }
  };
};

/**
 * verifyCodeEmail
 * @param {*} auth 
 */
export const verifyCodeEmail = ( auth ) => {
  return async dispatch =>{
    const {token, userId } = auth 
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${DbLink.API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'applications/json'
        },
        body: JSON.stringify({
          oobCode: "[VERIFICATION_CODE]",
          idToken: token
        })
      }
    );
   
    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      throw new Error(message);
    }

    const resData = await response.json();
    
    if( !resData.emailVerified || resData.localId !== userId ){
      
      await dispatch( deleteUser( token ) );
      dispatch( logout() );
      throw new Error("Attenzione: utente non congruente, email non verificata!");
     
    }
  
    return resData;
  }
}

/**
 * verifyEmail
 * @param {*} idToken 
 */
export const verifyEmail = ( idToken ) => {
  return async dispatch =>{
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${DbLink.API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'applications/json',
          'X-Firebase-Locale': 'it'
        },
        body: JSON.stringify({
          requestType: "VERIFY_EMAIL",
          idToken: idToken,
        })
      }
    );
   
    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      throw new Error(message);
    }

    const resData = await response.json();
    return resData;
  }
}

/**
 * deleteUser
 * @param {*} idToken 
 */
const deleteUser = ( idToken ) =>{
  return async ( ) => {  
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${DbLink.API_KEY}`,  
      {
        method: 'POST',
        headers: {
          'Content-Type': 'applications/json'
        },
        body: JSON.stringify({
          idToken : idToken
        })
      }
    );

    if( !response.ok )
    {
      const errorResData = await response.json();
      throw new Error(errorResData.error.message);
    }
    //const resData = await response.json();
  }
}

/**
 * checkUserData
 * @param {*} idToken 
 * @param {*} cf 
 * 
 * cerco in userData l'utente con il cf passato: 
 *   se lo trovo l'inserimento del nuovo utente non è valido
 */
const checkUserData = ( idToken, cf ) =>{

  return async () => {
   
    const response = await fetch(
      `${DbLink.ENDPOINT}/usersData.json?auth=${idToken}&orderBy="cf"&equalTo="${cf}"`  
    );
    
    if( !response.ok ) {
      const errorResData = await response.json();
      throw new Error(errorResData);
    } 

    const resData = await response.json();
    return !( Object.entries(resData).length === 0 && resData.constructor === Object);
  }
}

/**
 * deleteUserData
 * @param {*} id 
 * @param {*} idToken 
 */
const deleteUserData = ( userDataKey, idToken ) =>{

  return async () => {
    const response = await fetch(
      `${DbLink.ENDPOINT}/usersData/${userDataKey}.json?auth=${idToken}`,
      {
        method: 'DELETE'
      }
    );
    
    if( !response.ok ) {
      const errorResData = await response.json();
      throw new Error(errorResData.error.message);
    } 
  }
}

/**
 *  updateUserData
 * @param {*} upDateRecord 
 */
export const updateUserData = (upDateRecord) =>{
  
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userDataKey = getState().auth.userDataKey;
    
    const response = await fetch(
      `${DbLink.ENDPOINT}/usersData/${userDataKey}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(upDateRecord) 
      }
    );

    if (!response.ok) {
      const err = await response.json();
      const msg = err.error.message + ' Aggiornamento dati utente!'
      throw new Error(msg);
    }

    const resData = await response.json();    
    dispatch({ type: UPDATE_USERDATA, userData: upDateRecord });
  }
}

/**
 * registerUserData
 * @param {*} token 
 * @param {*} userId 
 * @param {*} values 
 */
const registerUserData = ( token, userId, userData ) => {
  return async () => {

    // aggiungo userId per connettere la tabella con l'authentication user
    
    const bodyJson ={ userId, ...userData }; 
    const response = await fetch(
      `${DbLink.ENDPOINT}/usersData.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyJson) 
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.error.message);
    }

    const resData = await response.json();
    return resData.name;
  }
}

/**
 * fetchUserData
 * @param {*} idToken 
 * @param {*} userId 
 */
const fetchUserData = (idToken, localId) => {
  return async () => {
    // Nota:
    // non posso leggere direttamente il record con userDataKey perchè non ancora valorizzato
    // uso la query sull'indice userId
    const response = await fetch(
      `${DbLink.ENDPOINT}/usersData.json?auth=${idToken}&orderBy="userId"&equalTo="${localId}"` 
       
    );
    
    if( !response.ok ) {
      const errorResData = await response.json();
      throw new Error(errorResData);
    } 

    const resData = await response.json();
    return resData;
  }
}

/**
 * refreshdUserData
 */
 export const refreshUserData = () => {

  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userDataKey = getState().auth.userDataKey;

    const response = await fetch(
      `${DbLink.ENDPOINT}/usersData/${userDataKey}.json?auth=${token}`,
    );
    
    if( !response.ok ) {
      const errorResData = await response.json();

      throw new Error('Lettura Dati Utente' + errorResData);
    } 

    const resData = await response.json(); 
    dispatch({ type: UPDATE_USERDATA, userData: resData });
  }
}

/**
 * time2date
 * @param {*} time 
 */
const time2date =  time =>{
  const iTime = parseInt( time ) * 1000;
  return new Date( new Date().getTime() + iTime );
}

/**
 * saveAuthToReducer
 * @param {*} dispatch 
 * @param {*} email 
 * @param {*} password 
 * @param {*} resData 
 * @param {*} recordUserData 
 */
const saveAuthToReducer = ( type, email, password, resData, recordUserData ) => {

  /**
   * type AUTHENTICATE : login => informazioni complete
   * type AUTHENTICATE : signup => manca userData 
   * type SAVE_USERDATA : endSignup => solo userData
   */

  return async dispatch =>{

    let recordName = null; 
    let objUserData = null; 
    if( recordUserData ){
      const keys = Object.keys(recordUserData);
      recordName = keys[0]; 
      objUserData = recordUserData[keys[0]];
    }

    if( type === AUTHENTICATE ){
      const expirationDate = time2date( resData.expiresIn ).toISOString();
      dispatch({ 
        type: AUTHENTICATE, 
        email: email, 
        password: password, 
        token: resData.idToken,
        refreshToken: resData.refreshToken,
        userId: resData.localId,
        expirationDate: expirationDate,
        userDataKey: recordName, 
        userData: objUserData 
      });
    }
    else if( type === SAVE_USERDATA ){
      dispatch({ 
        type: SAVE_USERDATA, 
        userDataKey: recordName, 
        userData: objUserData 
      });
    }
  }
}

/**
 * copyAuthToReducer
 * @param {*} authJson 
 */
export const copyAuthToReducer = ( authJson ) => {
  return async dispatch =>{
    dispatch({ 
      type: AUTHENTICATE, 
      ...authJson
    });
  }
}    

/**
 * saveDataToStorage
 * @param {*} auth 
 */
const saveDataToStorage = async ( auth ) =>{
  // ------------------------------------------------------------
  // autologin in AuthCoverScreen:
  // se vuoi usare copyAuthToReducer invece di rifare il Login
  // salva l'intero auth !!!!!
  // ------------------------------------------------------------
  try {
    await AsyncStorage.setItem( Names.STORAGE_AUTH, JSON.stringify({email:auth.email, password:auth.password}) );
  } catch (e) {
    // console.log( 'saveDataToStorage Error', e );
  }
};

/**
 * removeDataStoragea
 */
const removeDataStorage = async () =>{

  try {
    await AsyncStorage.removeItem( Names.STORAGE_AUTH );
  } catch (e) {
    // saving error
  }
};

/**
 * Logout
 */
export const logout = () => {

  removeDataStorage();
  return { type: LOGOUT };
};

/**
 * refreshSession
 * @param {*} token 
 * @param {*} rToken 
 */
export const  refreshSession = ( token, rToken ) => {

  return async ( dispatch ) => {
   
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${DbLink.API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'applications/json'
        },
        body: JSON.stringify({
          idToken: token,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Disguido Interno: ' + errorId;
      throw new Error(message);
    }

    const resData = await response.json();

    const { idToken, refreshToken, expiresIn } = resData;

    if (idToken !== token || refreshToken !== rToken ) {

      throw new Error("Errore nell'aggiornamento sessione!");
    }
    else {
      const expirationDate = time2date(expiresIn).toISOString();
      dispatch({ type: EXPIRATION_DATE, expirationDate: expirationDate });
    };
  };
}


/**
 * resetPassword
 * @param {*} email 
 * @returns 
 */
 export const resetPassword = ( email ) => {
  return async () =>{
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${DbLink.API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'applications/json',
          'X-Firebase-Locale': 'it'
        },
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email: email
        })
      }
    );
   
    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      throw new Error(message);
    }

    const resData = await response.json();
    return resData;
  }
}

/**
 * getAccountsInfo
 * 
 */
 export const getAccountsInfo= (  ) => {
  return async ( getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${DbLink.API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'applications/json'
        },
        body: JSON.stringify({
          idToken: token
        })
      }
    );
   
    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      throw new Error(message);
    }

    const resData = await response.json();
    
    return resData;
  }
}