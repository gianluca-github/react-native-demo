import DbLink from '../../constants/DbLink';

export const FETCH_CONFIG = 'FETCH_CONFIG';

/**
 * Legge la tabella di configurazione
 * @returns 
 */
export const fetchConfigData = () => {

  return async (dispatch, getState) => {
    const token = getState().auth.token;

    try{
      const response = await fetch(
        `${DbLink.ENDPOINT}/config.json?auth=${token}`
      );
      
      if( !response.ok )
      {
        const err = await response.json();
        throw new Error( err.error );
      }
      //
      const resData = await response.json();   
      await dispatch({ type: FETCH_CONFIG, data: resData } );
    }
    catch(err){
      throw err;
    }
  }
};