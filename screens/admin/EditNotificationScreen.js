import React, {useState, useCallback, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {
  ScrollView,
  View,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
//
import Input from '../../components/UI/Input';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import inputsForm from '../../hooks/InputsForm';
import * as globalFunc from '../../constants/Globalfunc';
import * as noteActions from '../../store/actions/notifications';

/**
 * 
 * @param {*} props 
 */
const EditNotificationScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [hasChangend, setHasChangend] = useState(false);
  const {
    inputsFormInit,
    inputFormChangeHandler,
    inputsFormClear,
    inputValue,
    formIsValid
  } = inputsForm();

  const noteId = props.route.params ? props.route.params.notificationId : null;
  const editNote = noteId 
      ? useSelector(state => state.notify.notifications.find( n => n.id === noteId ) )
      : null;

  const dispatch = useDispatch();
    
  /*------------ Initialize State Reducer  ----------*/
  useEffect(()=>{
    inputsFormInit(  
      {
        title: editNote? editNote.title : '',
        description: editNote? editNote.description : '',
      },
      {
        title: editNote? true: false,
        description: editNote? true: false,
      },
      editNote? true: false
    );

    return(()=>{
      inputsFormClear();
    })
  },[inputsFormInit, inputsFormClear])


  /**
   * submitHandler
   */
  const submitHandler = useCallback(async ()=>{
    
    if( !formIsValid){
      Alert.alert("Errore nell'inserimento!", 'Effetua un controllo!', [{text:'Ok'}]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try{
      if( !editNote){
        await dispatch(noteActions.createNotification(
          inputValue.title,
          inputValue.description,
        ));
      }
      else{
        await dispatch(noteActions.updateNotification(
          noteId,
          inputValue.title,
          inputValue.description
        ));
      }
      props.navigation.goBack();
    }
    catch( err ){
      setError(err);
      setIsLoading(false);
    };

  },[dispatch, noteId, inputValue, formIsValid ]);

  /**
   * setHasChangend
   */
  useEffect(()=>{
    setHasChangend( editNote? !globalFunc.equalTo(inputValue, editNote) : true );
  },[setHasChangend, editNote, inputValue]);

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
            disabled= {!(hasChangend&&formIsValid)}
          />
        </HeaderButtons>
      )
    })
  }, [submitHandler, hasChangend, formIsValid]);

  /**
   * Alert Error
   */
  useEffect(()=>{
    if(error){
      Alert.alert('Errore!', error.message, [{text:'Ok'}]);
    }
  },[error]);

  if( isLoading ){
    return(
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    )
  }

  return (
   
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS == "ios" ? "padding" : "height"}  
        keyboardVerticalOffset={180}
      >
      <ScrollView >
        <View style={styles.form}>
          <Input
            id='title'
            label='Titolo'
            errorText='Inserisci un titolo valido!'
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputFormChangeHandler}
            required
            minLength={2}
            initValue= {editNote? editNote.title:''}
            initValid= {editNote? true: false}
          />          
          <Input
            id='description'
            label='Testo'
            errorText='Inserisci un testo valido!'
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            multiline
            textarea
            numberOfLines={10}
            onInputChange={inputFormChangeHandler}
            initValue= {editNote? editNote.description:' '}
            initValid= {editNote? true: false}
            required
            minLength={5}
          />   
                
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered:{
    flex:1, 
    justifyContent:'center',
    alignItems:'center'
  }
});

export const ScreenOptions = navHandle => {
    
  const routeParams = navHandle.route.params ? navHandle.route.params : {};
  return {
    headerTitle : routeParams.notificationId 
    ? 'Modifica Notifica'
    : 'Nuova Notifica',
  }
}
export default EditNotificationScreen;