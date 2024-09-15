import React, {useEffect, useState } from 'react'
import {View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native'
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-elements'
import { STEP_LOGIN, STEP_STARTSIGNUP } from './AuthScreen';

import Hr from '../../components/UI/Hr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authActions from '../../store/actions/auth';
import * as cartActions from '../../store/actions/cart';
import Colors from '../../constants/Colors';
import Names from '../../constants/StringsName';


const AuthCoverScreen = props => {

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const h = Dimensions.get('window').height;
  //
  useEffect(()=>{
    let authStorage = null;
    const autoLocalLogin = async () => {

      try{
        authStorage = await AsyncStorage.getItem(Names.STORAGE_AUTH);
        if( authStorage ){
          setIsLoading(true);  
          const authJson = JSON.parse(authStorage);
          await dispatch( authActions.login(authJson.email, authJson.password) );
          //await dispatch( cartActions.clearCart );
        }
      }
      catch ( e ){
        setIsLoading(false);
        dispatch( authActions.logout() );
      }
    }  
    
    autoLocalLogin();
  },[dispatch])


  /**
   * AuthHandler
   * @param {*} id 
   */
  const AuthHandler = (id) => {
    props.navigation.navigate( 
      'Auth',
      {mode: id}
    );
  }

      
  let Content = <ActivityIndicator size='large' color={Colors.primary} />
  if( !isLoading ){
    Content = (
       
      <React.Fragment>

        <View style={{width:'70%', marginVertical: h * .24}}>
            <Button
              title='Accedi'  
              titleStyle={{ color: 'white', fontSize:22}}
              onPress={() => { AuthHandler(STEP_LOGIN) }}
              type="clear"
            />
            <Hr />
            <Button
              title='Registrati'
              titleStyle={{ color: Colors.secondary, fontSize:22 }}
              onPress={() => { AuthHandler(STEP_STARTSIGNUP) }}
              type="clear"
            />
          
          </View>
          <View style={{marginTop: h * .10}}>
            <Button
              title='Password dimenticata'
              titleStyle={{ color: Colors.secondary, fontSize:16 }}
              onPress={() => { props.navigation.navigate('Reset') } }
              type="clear"
            />
          </View>
      </React.Fragment>

     
      
    )
  }

  return (
    <LinearGradient colors={[Colors.gradient, Colors.primary]} style={styles.gradient}> 
        {Content}  
    </LinearGradient>
  );
}

export const ScreenOptions = { 
  headerTitle : "React native demo"
};


const styles = StyleSheet.create({
  
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
  
});

export default AuthCoverScreen;



