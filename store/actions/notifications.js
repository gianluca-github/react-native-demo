import Notification from '../../models/notification';
import DbLink from '../../constants/DbLink';

export const FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
export const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION';
export const UPDATE_NOTIFICATION = 'UPDATE_NOTIFICATION';





const  compare = (a, b) =>{
  const dA = a.date;
  const dB = b.date;

  let comparison = 0;
  if (dA > dB) {
    comparison = 1;
  } else if (dA < dB) {
    comparison = -1;
  }
  return comparison * -1;
}
/**
 * fetchNotifications
 */
export const fetchNotifications = () => {

  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try{
        
        const response = await fetch(
          `${DbLink.ENDPOINT}/notifications.json?auth=${token}&orderBy"date"%20desc`
        );
        
        if( !response.ok )
        {
          throw new Error('Errore interno alle Notifiche!')
        }
    
        const resData = await response.json();
        const loadNotifications= [];
       
        // inserimento in ordine inverso!!! desc!
        for( const key in resData ){
          loadNotifications.unshift(new Notification(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].description,
            new Date( resData[key].date )
          ));
        }
       // loadNotifications.sort(compare);
        dispatch({type: FETCH_NOTIFICATIONS, notifications:loadNotifications});
    }
    catch (err){
      throw( err );
    };
  };
};

/**
 * 
 * @param {*} title 
 * @param {*} description 
 */
export const createNotification = ( title, description  ) => {
  return async (dispatch, getState) => {
    // any async code you want!
    const token = getState().auth.token;
    const ownerId = getState().auth.userId;
    const date = new Date();

    const response = await fetch(
      `${DbLink.ENDPOINT}/notifications.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          ownerId, // sempre il super user
          description,
          date: date.toISOString()
        })
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_NOTIFICATION,
      noteData: {
        id: resData.name,
        ownerId,
        title,
        description,
        date
      }
    });
  };
};


/**
 *  deleteNotification
 * @param {*} notificationId 
 */
export const deleteNotification = notificationId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `${DbLink.ENDPOINT}/notifications/${notificationId}.json?auth=${token}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.error.message);
    }
    dispatch({ type: DELETE_NOTIFICATION, nid: notificationId });
  };
};


/**
 * updateNotification
 * @param {*} id 
 * @param {*} title 
 * @param {*} description 
 */
export const updateNotification = (id, title, description ) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const ownerId = getState().auth.userId;
    const date = new Date();
    
    const response = await fetch(
      `${DbLink.ENDPOINT}/notifications/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ownerId,
          title,
          description,
          date: date.toISOString()
        })
      }
    );

    if (!response.ok) {
      
      const errorResData = await response.json();
      throw new Error( errorResData.error.message );
    }

    dispatch({
      type: UPDATE_NOTIFICATION,
      nid: id,
      noteData: {
        ownerId,
        title,
        description,
        date
      }
    });
  };
};