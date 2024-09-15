import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, StyleSheet, SafeAreaView} from 'react-native';
import { Header, Button, Image } from 'react-native-elements'
import { DrawerActions } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/Colors';
import * as actionsAuth from '../store/actions/auth';
import * as cartAction from '../store/actions/cart';


/**
 * LeftButton
 * @param {*} props 
 */
const LeftButton = props =>{
 // const navigation = useNavigation();

  const navHandle = props.nav.current;
  const dispatch = useDispatch();
  return (
  <Icon
      name='user-circle-o'
      color= {Colors.primary}
      size={22}
      onPress={() => navHandle?.dispatch (DrawerActions.toggleDrawer() ) }
    />
  )
}

/**
 * exitFunc
 * @param {*} dispatch 
 */
const exitFunc = (dispatch ) =>{

  Alert.alert('Sei Sicuro di vole uscire?','',[
    { text:'No', style:'default'},
    { 
      text:'Si', style:'destructive',
      onPress: ()=>{ 
        dispatch( cartAction.clearCart() );
        dispatch( actionsAuth.logout() );
       }
    }]
  );
}

/**
 * RightButton
 * @param {*} props 
 */
const RightButton = props =>{
  const dispatch = useDispatch();

  return(
    <Button
      title="Esci"
      buttonStyle ={{backgroundColor:Colors.bgWhite}} 
      titleStyle = {styles.default}
      onPress={ ()=>{exitFunc( dispatch )} }
    />
  )
}

const AppHeader = (props) =>{
  const config = useSelector( state => state.config.data );
  const title = config? config.TitleApp: "React native demo";
  
  
  return (
    <SafeAreaView style={styles.container} ref={props.navRef}>
      <Header
        leftComponent={<Image style={{ width: 35, height: 35, marginLeft: 10 }} source={require('../assets/adaptive-icon.png')} />}
        barStyle='light-content'
        centerComponent={{ text: title, style: styles.title }}
        rightComponent={<RightButton />}
        containerStyle={{ backgroundColor: Colors.bgWhite, height: 90 }}
        centerContainerStyle={{ alignSelf: 'center' }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  default:{
    fontSize:16,
    fontFamily:'open-sans-bold',
    color: Colors.primary,
  },
  title:{
    fontSize:16,
    color: Colors.primary,
    textAlign: 'center',
  }
});

export default AppHeader;