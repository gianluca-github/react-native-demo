import React, {useState, useCallback, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator, 
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-elements';

import Colors from '../../constants/Colors';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import UserItem from '../../components/users/UserItem';
import inputsForm from '../../hooks/InputsForm';

import * as globalFunc from '../../constants/Globalfunc';
import * as usersActions from '../../store/actions/users';

/**
 * 
 * @param {*} props 
 */
const EditUserScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();  
  const key = props.route.params ? props.route.params.key : null;
  const user = key ? useSelector(state => state.users.users.find( u => u.key === key )) : null;
  const dispatch = useDispatch();
  const {
    inputsFormInit,
    inputFormChangeHandler,
    inputsFormClear,
    inputValue,
    inputValidities,
    formIsValid
  } = inputsForm();
    
  /**
   * Initialize State Reducer 
   */
  useEffect(()=>{
    inputsFormInit( { qtaAdd: 0.0 }, { qtaAdd: false }, false );

    return(()=>{
      inputsFormClear();
    })
  },[inputsFormInit, inputsFormClear])


  /**
   * submitHandler
   */
  const submitHandler = useCallback( async ()=>{

    Alert.alert("Stai inserendo " + inputValue.qtaAdd + "€ al Credito Prepagato", "Confermi l'inserimento?",[
      { text:'No', style:'default'},
      { text:'Si', style:'destructive', 
        onPress: async()=>{
       
          setIsLoading(true);
          setError(null);
          let total = globalFunc.isset( user.data.prepaid )? user.data.prepaid: 0.0; 
          total += parseFloat(inputValue.qtaAdd);
          user.data.prepaid = total;      
          // const updateUserData = {
          //   ...user.data,
          //   prepaid: +total
          // }

          try{
            await dispatch(usersActions.updateUser( key, user.data ));
          }
          catch( err ){
            setError(err);
            setIsLoading(false);
          }
          finally{
            //props.navigation.goBack();
            setIsLoading(false);
          }
        }}])
  },[dispatch, key, inputValue ]);

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

  /**
   * render Component
   */
  return (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS == "ios" ? "padding" : "height"}  
        keyboardVerticalOffset={100}
      >
      <LinearGradient colors={[Colors.gradient,Colors.primary]} style={{flex:1}} >
        
        <ScrollView style={{margin:10}} >
          {/* <View style={styles.form}> */}

            <UserItem  userData = {user.data} />
            <Card style={{padding:20, margin:10, minHeight:Dimensions.get('window').height * .25 }}>
              <View style={{flexDirection:'row', alignSelf:'center', width:'50%', flexGrow:2}}>
                <Input
                  id='qtaAdd'
                  label='Credito Prepagato'
                  errorText='Valore non valido!'
                  returnKeyType="next"
                  keyboardType= 'numeric'
                  placeholder='Quota Credito' 
                  onInputChange={inputFormChangeHandler}
                  initValue= {0.0}
                  initValid= {true}
                  required
                  min={0.50}
                  max={300.00}
                  numeric
                />   
                <Text style={{color:Colors.secondary, fontSize:18, fontWeight:'bold',marginTop:50, marginLeft:10 }}>€</Text>
              </View>
              <View style={{alignSelf:'center', alignItems:'center', padding:10, marginTop:10, width:'100%'}}>
              
                <Text style={{color:Colors.date, fontSize:14, fontWeight:'bold' }}>
                  Inserisci un valore tra 0.50 e 300 €
                </Text>
                
                  <Button
                    containerStyle={{marginTop:20}}
                    buttonStyle={{backgroundColor:Colors.secondary, paddingHorizontal:40,  borderRadius:8}}
                    titleStyle={{color:'white', fontSize:18, fontWeight:'bold'}}
                    title="Aggiungi Credito"
                    disabledStyle={{backgroundColor:Colors.bgtext}}
                    disabled = {!formIsValid}
                    onPress={()=>submitHandler()}
                  />
              </View>
            </Card>
            
          {/* </View> */}
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  form: {
    margin: 10,
  },
  centered:{
    flex:1, 
    justifyContent:'center',
    alignItems:'center'
  }
});

export const ScreenOptions = { headerTitle :'Gestione Credito', headerRight:null };

export default EditUserScreen;