
import { 
  AUTHENTICATE, 
  LOGOUT, 
  SAVE_USERDATA,
  UPDATE_USERDATA 
} from '../actions/auth';

const initialState = {
  token: null,
  refreshToken:null,
  userId: null,
  email: null,
  password: null,
  expirationDate: null,
  userDataKey: null, // id record tabella usedata
  userData: null   // oggetto record dati utente, tabella userdata
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        refreshToken: action.refreshToken,
        userId: action.userId,
        email: action.email,
        password: action.password,
        expirationDate: action.expirationDate,
        userDataKey : action.userDataKey,
        userData: action.userData
      };
    case SAVE_USERDATA:
      return{
        ...state,
        userDataKey : action.userDataKey,
        userData: action.userData
      }
    case UPDATE_USERDATA:
      return{
        ...state,
        userData: action.userData
      }  
    case LOGOUT:
      return {
        ...initialState,
      };
        
    default:
      return state;
  }
};