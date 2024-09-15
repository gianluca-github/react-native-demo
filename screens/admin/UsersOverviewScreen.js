import React, {useState, useEffect, useCallback} from 'react';
import { 
  View, 
  Text,
  TextInput, 
  FlatList, 
  Platform, 
  StyleSheet, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';
import { Button } from 'react-native-elements';
import { useSelector, useDispatch  } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { LinearGradient } from 'expo-linear-gradient';

import HeaderButton from '../../components/UI/HeaderButton';
import * as actionsUsers  from '../../store/actions/users'
import Colors from '../../constants/Colors';
import UserItem from '../../components/users/UserItem';

const FILTER = { ALL:0, ENABLED:1, DISABLED: 2 }

/**
 * UsersOverviewScreen
 * @param {*} props 
 * @returns 
 */
const UsersOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterText, onChangeFilterText] = useState('');
  const [error, setError] = useState();
  const [filterBtn, setFilterBtn] = useState(FILTER.ALL);
  const dispatch = useDispatch();
  const config = useSelector( state => state.config.data );
  // Filter
  const users = useSelector( state => {

    let list = state.users.users;
    if( filterBtn !== FILTER.ALL ){
      const flag = filterBtn === FILTER.DISABLED;
      list = state.users.users.filter( u => u.data.deleted===flag );
    }
    if( filterText!=='' ){
      return list.filter( u => { if( u.data.cognome.includes(filterText) ) return u;  } )
    }
    return list;
  });
  
  /**
   * loader
   */
  const loadUsers = useCallback( async () =>{
    setError(null);
    try{
      await dispatch( actionsUsers.fetchUsers() );
    }
    catch(err){
      setError(err.message);
    }
  },[dispatch, setError]);

  /**
   * listner
   */
  useEffect(()=>{
    const unsubscribe = props.navigation.addListener(
      'focus',
      loadUsers );

    return ()=> {
      unsubscribe();
    }  
  },[loadUsers]);

  /**
   * Supply
   */
  useEffect(()=>{
    setIsLoading(true);
    setIsRefreshing(true);

    loadUsers().then(()=>{
      setIsLoading(false);
      setIsRefreshing(false);
    });
  },[ loadUsers] );


  /**
   * Error
   */
  useEffect(()=>{
    if(error){
      Alert.alert('Si è verificato un errore: ', error, [{text:'Ok'}]);
    }
  },[error]);

  /**
   * 
   * @param {*} itemData 
   * @returns 
   */
   const actionHandler = ( user ) =>{

    const key = user.key; 
    const name = user.data.nome + " " + user.data.cognome;
    const message = user.data.deleted 
        ? 'Attenzione stai per abilitare il cliente ' + name + '!!'
        : 'Attenzione stai per disabilitare il cliente ' + name + '!!';

    Alert.alert( message, 'Vuoi proseguire con l\'azione?',[
    { text:'No', style:'default'},
    { text:'Si', style:'destructive', 
        onPress: async()=>{
          setError(null);
          try{
            // const uData = {...user.data }
            // uData.deleted = !user.data.deleted;
            user.data.deleted = !user.data.deleted
            await dispatch(actionsUsers.updateUser( key, user.data ));
          }
          catch (err) {
            setError( err );
          }
        }}]
    );
  };


  /**
   * 
   * @param {*} itemData 
   * @returns 
   */
    const renderItem = itemData => {
      //       
      const uData = itemData.item.data;
      return(
        <UserItem 
            userData = {itemData.item.data}
            onSelect = {()=>{
              if( !uData.deleted ) props.navigation.navigate('EditUser', { key: itemData.item.key });
            } }
        >
          {uData.permissions === config.ModeAuth.val.CUSTOMER &&
            <Button
              buttonStyle={ {...styles.btnFilter,...{backgroundColor: btnActive(!uData.deleted)}} }
              titleStyle={{...styles.btnFilterTitle, ...{color: btnTitleActive(!uData.deleted) } }}
              containerStyle = {styles.btnFilterContainer }
              title={uData.deleted?  "Abilita" : "Disabilita" } 
              onPress={() => actionHandler(itemData.item)} 
            />}

      </UserItem>
    );
  }

  /**
   * The Content
   * ------------- default Spinner: isLoading -------------------
   */
  let Content =  
    <View style={styles.centered}>
      <ActivityIndicator size='large' color={Colors.primary} />
    </View>;

  if( !isLoading ){
    if( users.length === 0 ){
      Content = 
        <View style={styles.centered}>
          <Text style={{color:Colors.secondary, fontSize:16}}>Nessuna corrisponedenza con la selezione</Text>
        </View>
    }
    else{
      Content =
        <FlatList
          onRefresh={loadUsers}
          refreshing={isRefreshing}
          data={users}
          keyExtractor={item => item.key}
          renderItem ={renderItem}
        />;
    }
  }

  /**
   * Render component
   */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <LinearGradient colors={[Colors.gradient,Colors.primary]} style={{flex:1}} >
        <View style={{margin:10, padding:20, justifyContent:'flex-start' }}>
          <TextInput
            style={{borderBottomColor:Colors.border, borderBottomWidth:1, fontSize:16}}
            value={filterText}
            onChangeText={onChangeFilterText}
            placeholder="Inserisci il cognome"
            keyboardType="default"
          />
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
          <Button
              buttonStyle={ {...styles.btnFilter,...{backgroundColor: btnActive(filterBtn===FILTER.ALL)}} }
              titleStyle={{...styles.btnFilterTitle, ...{color: btnTitleActive(filterBtn===FILTER.ALL) } }}
              containerStyle = {styles.btnFilterContainer }
              title={"Tutti"} 
              onPress={()=>setFilterBtn(FILTER.ALL)} 
            />
          <Button
              buttonStyle={ {...styles.btnFilter,...{backgroundColor: btnActive(filterBtn===FILTER.ENABLED)}} }
              titleStyle={{...styles.btnFilterTitle, ...{ color: btnTitleActive(filterBtn===FILTER.ENABLED) } }}
              containerStyle = {styles.btnFilterContainer}
              title={"Abilitati"} 
              onPress={()=>setFilterBtn(FILTER.ENABLED)} 
            />
            <Button
              buttonStyle={ {...styles.btnFilter,...{backgroundColor: btnActive(filterBtn===FILTER.DISABLED)}} }
              titleStyle={{...styles.btnFilterTitle, ...{color: btnTitleActive(filterBtn===FILTER.DISABLED) } }}
              containerStyle = {styles.btnFilterContainer }
              title={"Disabilitati"} 
              onPress={()=>setFilterBtn(FILTER.DISABLED)} 
            />
        </View>
        {Content}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

/**
 * ScreenOptions
 * @param {*} navHandle 
 * @returns 
 */
export const ScreenOptions = navHandle => {
  return{
    headerTitle: "Clienti",
    headerLeft: ()=>(
      <HeaderButtons HeaderButtonComponent={HeaderButton}  >
        <Item
          title="Menu"
          iconName={'menu'}
          onPress={() => {
            navHandle.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    )
  }
};

const btnActive =  on => { return on ? Colors.secondary : Colors.bgWhite; }
const btnTitleActive =  on => { return on ? Colors.bgWhite : Colors.secondary; }

const styles = StyleSheet.create({
  centered:{
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  btnFilter:{
    backgroundColor:Colors.beige, 
    width:Math.floor( Dimensions.get('window').width * .25 ),
    paddingVertical:4,
  },
  btnFilterTitle:{
    color:Colors.secondary, 
    fontWeight:'bold', 
    fontSize:14
  },
  btnFilterContainer:{
    borderWidth:1,
    borderColor:Colors.secondary,
    marginVertical:10
  }

});

export default UsersOverviewScreen;