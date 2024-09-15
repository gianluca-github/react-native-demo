import React, { useState, useEffect } from 'react';
import {
  ScrollView, 
  View,
  Text, 
  KeyboardAvoidingView, 
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { CheckBox, Button } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';

import inputsForm from '../../hooks/InputsForm';
//import useForm, {configAuthLogin} from '../../hooks/useForm';
import * as authActions from '../../store/actions/auth';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import {
  InputDefault, 
  ProfileUserFields,
  inputValuesAuth,
  inputValiditiesAuth,
} from '../common/AuthFieldsForm';



export const STEP_LOGIN        = 0;
export const STEP_STARTSIGNUP  = 1;
export const STEP_VERIFYEMAIL  = 2;
export const STEP_ENDSIGNUP    = 3;
const titleButton  = ['Entra', 'Prosegui', 'Verifica', 'Continua'];

const AuthScreen = props =>{
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [enablePersonalData, setEnablePersonalData] = useState(false);
  const [stepAuth, setStepAuth] = useState( props.route.params.mode );
  const auth = useSelector(state => state.auth );
  
  const {
    inputsFormInit,
    inputFormChangeHandler,
    inputsFormClear,
    inputValue,
    formIsValid
  } = inputsForm();
  
  const dispatch = useDispatch();

  const  initFormLogin = {
    inputValues:{
      email: '',
      password: ''
    },
    inputValidities:{
      email:false,
      password:false
    },
    formIsValid:false
  };


  /**
   * inizializzo il form reducer
   */
  useEffect(()=>{
    if( stepAuth == STEP_LOGIN ){
      inputsFormInit( initFormLogin.inputValues, initFormLogin.inputValidities, false );

    } else if( stepAuth == STEP_STARTSIGNUP ){
      inputsFormInit( inputValuesAuth, inputValiditiesAuth, false );
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
      const n = error.name === 'Error'? 'Errore!': error.name ;
      Alert.alert( n, error.message, [{'Text':'Okay'}] );
    }
  },[error]);

  /**
   * Disable headerLeft (back arrow) 
   */
  useEffect(()=>{
    props.navigation.setOptions({
      headerLeft: stepAuth >= STEP_VERIFYEMAIL? null: props.navigation.headerLeft
    })
  }, [stepAuth]);
  
  /**
   * authHandler
   */
  const authHandler = async () =>{
  
    if(  inputValue.email === undefined
      || inputValue.password === undefined
      || inputValue.email === ''
      || inputValue.password === '' )
    {
      Alert.alert('Attenzione!', 'Inserire indirizzo email e password validi!', [{'Text':'Okay'}] );
      setStepAuth(props.route.params.mode);

      return;
    }
  
    let action;
    switch( stepAuth ){
      case STEP_LOGIN:
        action = authActions.login( 
          inputValue.email, 
          inputValue.password
        );
        break;
      case STEP_STARTSIGNUP:
        action = authActions.signUp( 
          inputValue.email, 
          inputValue.password
        );
        setStepAuth(STEP_VERIFYEMAIL);
        break;
      case STEP_ENDSIGNUP:
        action = authActions.endSignUp( auth, inputValue );
        break;
      default:
        setStepAuth( STEP_LOGIN );
    }
    
    setError(null);
    setIsLoading(true);
    
    try{
      await dispatch( action );
    }
    catch (err){
      setError( err );
      setIsLoading(false);
      setStepAuth(props.route.params.mode);
    }
  };

  /**
   * verifyCodeHandle
   */
  const verifyCodeHandle = async () =>{
    
    setIsLoading(false);
    try{
      await dispatch( authActions.verifyCodeEmail(auth) );
      setStepAuth(STEP_ENDSIGNUP);
    }
    catch (err){
      setError( err );
      setEnablePersonalData(false);
      setStepAuth(props.route.params.mode);
    }
  }

  /**
   * message signup
   */
  const messageSignUp = (
    <View style={{  justifyContent:'flex-start',paddingHorizontal:24, marginBottom:20, width:'80%', height:'15%'}}>
      <Text style={{fontSize:18, color:Colors.secondary,textAlign:'center'}}>
        Inserisci un'indirizzo di posta elettroniaca valido e una password di almeno 6 caratteri alfanumerici!
      </Text>
    </View>
  )

  /**
   * InputSignUp
   */
  const InputSignUp = (
    <View>
      {ProfileUserFields(inputFormChangeHandler, null, true, true)}

      <View style={{marginTop:20}}>
      <CheckBox
        title='Autorizzo il trattamento dei dati personali.'
        checked={enablePersonalData}
        onPress= {() => setEnablePersonalData(!enablePersonalData)}
        fontFamily={'open-sans-italic'}
      />
    </View>
  </View>
  )

  if( stepAuth === STEP_VERIFYEMAIL  ) {
    return(
    <LinearGradient colors={[Colors.gradient,Colors.primary]} style={styles.gradient}>
      <View style={styles.verifyScreen}>
        <Text style={styles.verifyText}>
          Controlla la tua posta elettronica!! {'\n'}
          Ti abbiamo inviato un messaggio di verifica
          all'indirizzo:
        </Text> 
        <Text style={{color:Colors.secondary,fontSize:16,fontWeight:'bold'}}> {auth.email}</Text>
        <Text style={styles.verifyText}> 
          Segui il collegamento e poi premi 
          il tasto Verifica qui sotto!!  
        </Text>
        <View style={styles.hr}></View>
         <Button  
            title={titleButton[STEP_VERIFYEMAIL]}
            onPress = {verifyCodeHandle}
            buttonStyle = {{backgroundColor:'white'}}
            titleStyle = {{color:Colors.primary}}
            color={Colors.primary} 
          />
        </View>
      </LinearGradient>
    )
  }
  

  return (
    
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <LinearGradient colors={[Colors.gradient,Colors.primary]} style={styles.gradient}>
         {stepAuth === STEP_STARTSIGNUP && messageSignUp }
        <Card style={styles.authContainer}>
          <ScrollView>
            
            { stepAuth < STEP_VERIFYEMAIL && InputDefault(inputFormChangeHandler)}
            {/* { stepAuth < STEP_VERIFYEMAIL && renderForm(inputFormChangeHandler) } */}

            { stepAuth === STEP_ENDSIGNUP && InputSignUp }
            
            <View style={styles.buttonContainer}>
              {isLoading
                ? <ActivityIndicator size='small' color ={Colors.primary} />
                : <Button 
                    disabled={  stepAuth === STEP_ENDSIGNUP && (!enablePersonalData || !formIsValid)}
                    title={ titleButton[stepAuth] }
                    buttonStyle = {{backgroundColor:'white'}}
                    titleStyle = {{color:Colors.primary}}
                    onPress={authHandler} 
                  />
              }
              
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
};

export const ScreenOptions = navHandle => { 

  return {
    headerTitle : navHandle.route.params.mode === STEP_LOGIN? "Accedi" : "Registrati",
  }
};


const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
    padding: 20
  },
  buttonContainer: {
    marginTop: 10,
    height:120,
    width:'70%',
    justifyContent:'center',
    alignSelf:'center'
  },
  hr:{
    borderBottomColor:Colors.secondary,
    borderBottomWidth: 1,
    marginVertical:8,
    width:'50%',
    alignSelf:'center'
  },
  verifyScreen:{
    flex:1, 
    justifyContent:'center', 
    alignItems:'center',
    alignSelf:'center',
    width:'80%'
  },
  verifyText:{
    fontFamily:'open-sans',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 40,
  }

})


export default AuthScreen;