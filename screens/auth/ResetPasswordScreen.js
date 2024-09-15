import React, { useState, useEffect } from 'react';
import {
  View,
  Text, 
  KeyboardAvoidingView, 
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Button } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';

import Input from '../../components/UI/Input';
import inputsForm from '../../hooks/InputsForm';
import * as authActions from '../../store/actions/auth';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';

const ResetPassword = props =>{
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sendResetPwd, setSendResetPwd] = useState( false );
  const titleButton  = 'Ripristina Password';
  const w = Dimensions.get('window').width * .85;
  
  const {
    inputsFormInit,
    inputFormChangeHandler,
    inputsFormClear,
    inputValue,
    inputValidities,
    formIsValid
  } = inputsForm();
  
  const dispatch = useDispatch();

  const  initFormLogin = {
    inputValues: { email: '' },
    inputValidities: { email:false },
    formIsValid:false
  };


  /**
   * inizializzo il form reducer
   */
  useEffect(()=>{
   
    if( !sendResetPwd ){
      inputsFormInit( initFormLogin.inputValues, initFormLogin.inputValidities, false );
    }
    return(()=>{
      inputsFormClear();
    });

  },[inputsFormInit, inputsFormClear])
  
  /**
   * Error
   */
  useEffect(()=>{
    if(error) {
      
      if( error.message==='EMAIL_NOT_FOUND'){
        Alert.alert( 'Attenzione', "L'Email inserita non è corretta!", [{'Text':'Okay'}] );
      }
      else{
        const n = error.name === 'Error'? 'Errore!': error.name ;
        Alert.alert( n, error.message, [{'Text':'Okay'}] );
      }
    }
  },[error]);

 

  /**
   * sendResetPasswordHandle
   */
   const sendResetPasswordHandle = async () =>{

    setIsLoading(true);
    setError( null );

    try{
      await dispatch( authActions.resetPassword( inputValue.email ) );
      setSendResetPwd( true );
      setIsLoading( false );
    }
    catch (err){
      setError( err );
      setIsLoading(false);
      setSendResetPwd( false );
    }
    
  }

  let content = (
        <View style={{padding:40, justifyContent:'center', flexGrow:1}}>
          <Text style={{fontSize:17, color:Colors.text, textAlign:'center'}}>
            Ti abbiamo inviato un messaggio all' indirizzo di posta elettronica
          </Text>
          <Text style={{fontSize:16, fontWeight:'bold', color:Colors.secondary, textAlign:'center'}}>
            {inputValue && inputValue.email}
          </Text>
          <Text style={{fontSize:17, color:Colors.text, textAlign:'center'}}>
            Segui le istruizioni ed esegui l'accesso con la nuova password.
          </Text>
        </View>
      );
  
  if( !sendResetPwd ) {
    content = (
      <React.Fragment >
        <View style={{padding:40, justifyContent:'flex-end', flexGrow:1}}>
          <Text style={{fontSize:17, color:Colors.text, textAlign:'center'}}>
            Inserisci il tuo indirizzo di posta elettronica con cui ti sei registrato e 
            premi il tasto 
          </Text>
          <Text style={{fontSize:16, fontWeight:'bold', color:Colors.secondary, textAlign:'center'}}>
            {titleButton}
          </Text>
        </View>
        <View style={{flexGrow:2, padding:20, justifyContent:'flex-start', alignItems:'center'}}>

          <Card style={{padding:20, width:w }}>
              <Input
                id="email"
                label="Email di registrazione"
                keyboardType="email-address"
                required
                email
                autoCapitalize="none"
                errorText="Inserire un indirizzo Email valido."
                onInputChange={inputFormChangeHandler}
                initValue={ inputValue? inputValue.email:''}
              />
              
          </Card>
          <Button 
              containerStyle={{marginTop:20, width:w }}
              disabled={!formIsValid }
              title={ titleButton }
              buttonStyle = {{backgroundColor:Colors.secondary, marginHorizontal:10}}
              titleStyle = {{color:Colors.bgWhite, fontWeight:'bold'}}
              onPress={sendResetPasswordHandle} 
            />
        </View>
      </React.Fragment>
    );
  }  
  return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
      <LinearGradient colors={[Colors.gradient,Colors.primary]} style={styles.gradient}>
        {
          isLoading
              ? <ActivityIndicator size='large' color ={Colors.primary} />
              : content
        }
      
      </LinearGradient>
      </KeyboardAvoidingView>
    );
}

export const ScreenOptions  = { headerTitle : "Reimposta la Password" };

const styles = StyleSheet.create({
 
  gradient: {
    flex: 1,
    justifyContent:'space-evenly',
    alignItems: 'center'
  },
  container: {
    width: '90%',
    padding: 20
  }
});

export default ResetPassword;