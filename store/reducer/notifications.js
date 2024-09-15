import { 
  FETCH_NOTIFICATIONS,
  DELETE_NOTIFICATION,
  CREATE_NOTIFICATION,
  UPDATE_NOTIFICATION
 } from '../actions/notifications';
import Notification from '../../models/notification';
import NotificationItem from '../../components/notification/NotificationsItem';

const initialState = {
  notifications: []
}


export default (state=initialState, action ) => {

  switch( action.type ){
    case FETCH_NOTIFICATIONS:
      return {
        notifications: action.notifications
      };
    case CREATE_NOTIFICATION:
      const newNotification = new Notification(
          action.noteData.id,
          action.noteData.ownerId,
          action.noteData.title,
          action.noteData.description,
          action.noteData.date
        );
      return {
        ...state,
        notifications: state.notifications.unshift( newNotification )
      }  
    case DELETE_NOTIFICATION: 
      return{
        ...state,
        notifications: state.notifications.filter( n => n.id !== action.nid ),
      }  
    case UPDATE_NOTIFICATION:

      const notificationIndex = state.notifications.findIndex( n => n.id === action.nid );
      const updateNotification = new Notification(
        action.nid,
        action.noteData.ownerId,
        action.noteData.title,
        action.noteData.description,
        action.noteData.date
      )
  
      const updateNotifications = [...state.notifications];
      updateNotifications[notificationIndex] = updateNotification;

      return {
        ...state,
        notifications: updateNotifications
      } 
  
    default:
      return state;
  }
}

