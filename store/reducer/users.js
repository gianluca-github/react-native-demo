import {
  DELETE_USER,
  FETCH_USERS,
  UPDATE_USER
} from '../actions/users';

const initialState = {
   users:[]
};

export default (state = initialState, action) => {
  switch(action.type){
    case FETCH_USERS:
      return {
        users: action.users
      };
      //cancellazione effettiva
      case DELETE_USER:
        
        return {
           ...state,
           users: state.users.filter( u => u.key !== action.key )
        }  
      case UPDATE_USER:
        const updateUIndex = state.users.findIndex( u => u.key === action.key );
        const updateUsers = [ ...state.users ];
        updateUsers[updateUIndex].data = action.userData;

        return {
          ...state,
          users: updateUsers,
        }    
    default:
      return state;

  }
};