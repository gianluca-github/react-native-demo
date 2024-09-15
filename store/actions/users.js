import DbLink from '../../constants/DbLink';
export const FETCH_USERS = 'FETCH_USERS';
export const DELETE_USER = 'DELETE_USER';
export const UPDATE_USER = 'UPDATE_USER';


/**
 * fetchUsers
 * @returns 
 */
export const fetchUsers = () => {
  
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try {
      const response = await fetch(
        `${DbLink.ENDPOINT}/usersData.json?auth=${token}`
      );
      
      if( !response.ok )
      {
        throw new Error('Errore lettura dati utenti!')
      }

      const resData = await response.json();
      let users = [];
      for( const key in resData ){

        // users.push( `${key}` );
        // users[`${key}`] = resData[key];
        users.push( {
          key,
          data: resData[key]
        });
      }
      //riordino per data decrescente: 
      users.sort((a,b)=> 
          a.data.cognome > b.data.cognome ? 1 : -1
      );

      dispatch({type: FETCH_USERS, users:users});
      users = resData;
    } 
    catch(err){
      throw err;
    }
  }
};

/**
 * 
 * @param {*} key
 * @returns 
 */
export const deleteUser = key => {

  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const user = getState().users.users.find( u => u.key === key );
    user.data.deleted = true;

    const response = await fetch(
      `${DbLink.ENDPOINT}/usersData/${key}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData) 
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.error.message);
    }
    //
    dispatch({
      type: UPDATE_USER,
      key: key,
      userData: userData
    });
  };
};

/**
 * updateUser
 * @param {*} key
 * @param {*} userData 
 */
 export const updateUser = (key, userData ) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    
    const response = await fetch(
      `${DbLink.ENDPOINT}/usersData/${key}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData) 
      }
    );

    if (!response.ok) {
      
      const errorResData = await response.json();
      throw new Error( errorResData.error.message );
    }

    dispatch({
      type: UPDATE_USER,
      key: key,
      userData: userData
    });

  };
};