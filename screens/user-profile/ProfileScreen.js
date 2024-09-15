import React, { useState, useEffect, useCallback , useLayoutEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ScrollView,
  KeyboardAvoidingView, 
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';

import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { LinearGradient } from 'expo-linear-gradient';
import {
  ContentProfileFields, 
  inputValuesEdit, 
  inputValiditiesEdit
} from '../common/AuthFieldsForm';

import HeaderButton from '../../components/UI/HeaderButton';
import inputsForm from '../../hooks/InputsForm';
import * as authActions from '../../store/actions/auth';
import * as globlaFunc from '../../constants/Globalfunc';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';


const ProfileScreen = props => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [hasChanged, setHasChanged] = useState(false);
  const userData = useSelector(state => state.auth.userData );
 

  /**
   * inputForm Hook
   */
  const {
    inputsFormInit,
    inputFormChangeHandler,
    inputsFormClear,
    inputValue,
    formIsValid,
  } = inputsForm();

  //
  const dispatch = useDispatch();

  /**
   * inizializzazione
   */
  useEffect(()=>{
    
    inputsFormInit( inputValuesEdit(userData), inputValiditiesEdit, false );

    return(()=>{
      inputsFormClear();
    });
  },[inputsFormInit, inputsFormClear])
  

  /**
   * Error alert
   */
  useEffect(()=>{
    if(error) {
      Alert.alert('Errore!', error.message, [{'Text':'Okay'}] );
    }
  },[error]);

  /**
   * check changed
   */
  useEffect(()=>{
    setHasChanged( !globlaFunc.equalTo(inputValue, userData) );
  },[setHasChanged, inputValue, userData])

  /** 
  * Pulsante save
  */
 useEffect(()=>{

  props.navigation.setOptions({
    headerRight: ()=>(
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={'checkmark'}
          onPress={submitHandler}
          disabled= {!(hasChanged&&formIsValid)}
        />
      </HeaderButtons>
    )
  })
}, [submitHandler, inputValue, hasChanged, formIsValid]);
  
/**
 * 
 */
  const submitHandler = useCallback( async ()=>{
      
    if( !formIsValid){
      Alert.alert("Errore nell'inserimento!", 'Controlla in campi inseriti!', [{text:'Ok'}]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try{
      const upDateRecord = { ...userData, ...inputValue };
      await dispatch( authActions.updateUserData( upDateRecord ));
    }
    catch( err ){
      setIsLoading(false);
      setError(err);
    }
    finally{
      setIsLoading(false);
    }

  },[dispatch, inputValue, formIsValid ]);


  /**
   * JSX 
   */
  let Content =  <ActivityIndicator size='small' color ={Colors.primary} />
  if(!isLoading){
   Content= (
     <Card style={styles.card}>
       <ScrollView>

         <ContentProfileFields inputFormChangeHandler={inputFormChangeHandler} />
       </ScrollView>
     </Card>
   );
  }

  return(
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <LinearGradient colors={[Colors.gradient,Colors.primary]} style={styles.gradient}>
   
       {Content}
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}


export const ScreenOptions = navHandle => {
  
  return{
    headerTitle: 'Profilo',
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
    )
  }
};


/*----------------- StyleSheet --------------- */
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height:'100%'
  },
  card: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
    padding: 20
  }
});

export default ProfileScreen;