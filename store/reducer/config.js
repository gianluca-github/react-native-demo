import {FETCH_CONFIG} from '../actions/config';

const initialState = {
    data:null
};

export default (state = initialState, action) => {
   switch(action.type){
      case FETCH_CONFIG:
        return{
          data: Object.create( action.data )
        }
      default:
         return state;
   }
};