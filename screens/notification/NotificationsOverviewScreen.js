import React, {useState, useEffect, useCallback } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  FlatList,
  View,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
  StatusBar
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';  
import { Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import Advice from '../../components/UI/Advice';
import NotificationItem from '../../components/notification/NotificationsItem';
import Colors from '../../constants/Colors';
import Mode from '../../constants/Mode';

import * as notifActions from '../../store/actions/notifications';

const NotificationsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notify.notifications);
  const mode =  props.route.params.mode;

  /**
   * 
   */
  const loadNotifications = useCallback( async () =>{
    setError(null);
    setIsRefreshing( true )
    setIsLoading( true );

    try{
      dispatch ( notifActions.fetchNotifications() ); 
    }
    catch(err){
      setError(err.message);
    }
    finally{
      setIsRefreshing( false )
      setIsLoading( false );
    }
  },[dispatch, setError, setIsRefreshing, setIsLoading]);


  /* -------- useEffect Listener ------- */
  useEffect(()=>{
    const unsubscribe = props.navigation.addListener(
      'focus',
      loadNotifications );

    return ()=> {
      unsubscribe();
    }  
  },[loadNotifications]);
  
  /**
   *  -------- useEffect Load ------- */ 
  useEffect(()=>{
   
    loadNotifications();
  },[loadNotifications] );

  /**
   * -------- useEffect Error -------
   */
  useEffect(()=>{
    if(error){
      Alert.alert('Si è verificato un errore: ', error, [{text:'Ok'}]);
    }
  },[error]);


  /**----------------- Edit -----------------**/
  const editNotificationtHandler = id => {
    if( mode===Mode.ADMIN){
      props.navigation.navigate('EditAdminNotification', { notificationId: id });
    }
    else{
      return null;
    }
  };

  /**----------------- Delete -----------------**/
  const deleteHandler = (id) =>{
    Alert.alert('Attenzione', 'Confermi di eliminare questa notifica ?',[
    { text:'No', style:'default'},
    { text:'Si', style:'destructive', 
        onPress: async()=>{
          setError(null);
          try{
           await dispatch(notifActions.deleteNotification(id));
          }
          catch (err) {
            setError( err );
          }
        }}]
    );
  };

  /* -------- renderNotificationItem ------- */
  const renderNotificationItem = itemData => {

    // -------
    const btnDelete = 
      <Button
      
        buttonStyle = {{ backgroundColor:'white'}}
        titleStyle = {{color:Colors.primary,marginLeft:5, fontSize:12}}
        title="Elimina"
        onPress={ ()=>{deleteHandler(itemData.item.id)} }
        icon={
          <Ionicons
            name={'trash'}
            size={22}
            color={Colors.error}
          />
        }
      /> 

    return(
      <NotificationItem 
        mode = {mode}
        title = {itemData.item.title}
        description = {itemData.item.description}
        date={itemData.item.readableDate}
        items={itemData.item.items}
        onSelect = {()=>{ editNotificationtHandler(itemData.item.id)}}
      >
        { mode===Mode.ADMIN && btnDelete }
      </NotificationItem>
    );
  }

  /*------------- default Spinner: isLoading ------------------- */
  let Content =  
    <View style={styles.centered}>
      <ActivityIndicator size='large' color={Colors.primary} />
    </View>;


  if( !isLoading ){
    if( notifications.length === 0 ){
      Content = <Advice text= 'Non ci sono notifiche da mostrare!' />
    }
    else{
      Content =
        <FlatList
          onRefresh={loadNotifications}
          refreshing={isRefreshing}
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderNotificationItem}
        />
    }
  }
  
  

  return (
   
    <LinearGradient colors={[Colors.gradient, Colors.primary]} style={styles.gradient}>
      {// STATUSBAR: => se messa nella prima screen del primo stack del tabBottom è settata ovunque!!!
        // SU AppHeader viene ricoperta da quella blu di default
        Platform.OS === 'android' && <StatusBar backgroundColor={Colors.bgWhite} barStyle={'dark-content'} />
      }
      
      {Content}
    </LinearGradient>
  )
}

/*----------------- StyleSheet --------------- */
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height:'100%'
  },
  centered:{
    flex:1, 
    justifyContent:'center',
    alignSelf:'center',
    width:'70%'
  },
  container:{
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height:'90%',
    width:'90%',
    backgroundColor: Colors.gradient,
    color: Colors.primary
  }
});

/*----------------- UserScreenOptions --------------- */
export const UserScreenOptions = navHandle => {
  return {
    headerTitle: 'Notifiche',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton} >
        <Item
          title="Carrello"
          iconName={'cart'}
          onPress={()=>{
            navHandle.navigation.navigate('Cart');
          } }
        />
      </HeaderButtons>
    )
  }
}

/*----------------- AdminScreenOptions --------------- */
export const AdminScreenOptions = navHandle => {

  return {
    headerTitle: 'Gestione Notifiche',
    headerLeft: ()=>(
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
          title="Menu"
          iconName={'menu'}
          onPress={() => {
            navHandle.navigation.toggleDrawer();
          }}
        /> 
      </HeaderButtons>
    ),
    headerRight: ()=>(
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Aggiungi"
          iconName={'create'}
          onPress={() => {
            navHandle.navigation.navigate('EditAdminNotification');
          }}
        />
      </HeaderButtons>
    )
  }
};


export default NotificationsOverviewScreen;