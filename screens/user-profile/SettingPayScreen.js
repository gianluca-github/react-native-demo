import React, {useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Alert,
  Platform
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';

import Hr from '../../components/UI/Hr';
import HeaderButton from '../../components/UI/HeaderButton';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import TextLabel from '../../components/UI/TextLabel';
import * as authActions from '../../store/actions/auth';
import * as globalFunc from '../../constants/Globalfunc';

import inputsForm from '../../hooks/InputsForm';
import { 
  ContentPayFields,
  inputValuesBillData, 
  inputValiditiesBillData
} from '../common/AuthFieldsForm';


const SettingPayScreen = props => {

  const {
    inputsFormInit,
    inputFormChangeHandler,
    inputsFormClear,
    inputValue,
    formIsValid
  } = inputsForm();
  
  const userData = useSelector(state => state.auth.userData );
  const config = useSelector( state => state.config.data );
  const payment = globalFunc.isset( userData.modeOrder ) ? userData.modeOrder.payment : config.ModeOrder.payment.CACHE;
  const delivery = globalFunc.isset( userData.modeOrder ) ? userData.modeOrder.delivery : config.ModeOrder.delivery.SEDE;
  const document = globalFunc.isset( userData.modeOrder ) ? userData.modeOrder.document : config.ModeOrder.document.RICEVUTA;
  const [selectedDocument, setSelectedDocument] = useState( document );
  const [selectedPayment, setSelectedPayment] = useState( payment )
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();


  /**
   * inizializzo il form reducer
   */
   useEffect(()=>{

    if( selectedDocument === config.ModeOrder.document.FATTURA ){
      const billData = globalFunc.isset( userData.billData ) ? userData.billData : userData;
      inputsFormInit( inputValuesBillData(billData), inputValiditiesBillData, false );
    }
    
    return(()=>{
      inputsFormClear();
    });

  },[inputsFormInit, inputsFormClear, userData, selectedDocument])
  
  /**
   * error
   */
  useEffect(()=>{
    if(error) {
      Alert.alert('Errore!', error.message, [{'Text':'Okay'}] );
    }
  },[error]);
  
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
              disabled= {!validateChanges()}
            />
          </HeaderButtons>
        )
      })
    },[submitHandler,
      validateChanges, 
      inputValue, 
      formIsValid, 
      selectedDocument, 
      selectedPayment,
      isLoading ]);


      
  /**
   * validateChanges
   */
  const validateChanges = useCallback( ()=>{
    let change = (selectedDocument!==document ) || (selectedPayment!==payment );
    
    if( selectedDocument === config.ModeOrder.document.FATTURA ){
      const billingData = globalFunc.isset( userData.billData ) ? userData.billData : null;
      if( !billingData && inputValue )
      {
        change =  (inputValue.pec !== '' || inputValue.codiceUnico !== '') && formIsValid;
      }
      else if(!globalFunc.equalTo( inputValue, billingData ) ){
        change = formIsValid;
      }
    }
    
    return change;
  }, [inputValue, formIsValid, selectedDocument, selectedPayment, isLoading ]);

 /**
   * changePaymentHandler
   * @param {*} value 
   * @returns 
   */
  const changePaymentHandler = ( value ) =>{
    
    setSelectedPayment(value)
    // if( value === config.ModeOrder.payment.PREPAID ) refreshData();
  }

  
  /**
   * submitHandler
   */
  const submitHandler = useCallback(async ()=>{

    const updateModeOrder ={
      delivery: delivery,
      document: selectedDocument,
      payment: selectedPayment
    }

    let updateUserData;
    if( selectedDocument === config.ModeOrder.document.FATTURA )
    {
      updateUserData = { 
        ...userData,
        modeOrder: updateModeOrder,
        billData: inputValue 
      };
    }
    else{ //ricevuta

      updateUserData = { 
        ...userData,
        modeOrder: updateModeOrder
      }
    }

    setIsLoading(true);
    setError(null);
    try{
      // aggancia i dati di fatturazione !!!!
      await dispatch( authActions.updateUserData( updateUserData ));
    }
    catch( err ){
      setIsLoading(false);
      setError(err);
     
    }
    finally{
      setIsLoading(false);
    }
  },[dispatch, inputValue, formIsValid, selectedDocument, selectedPayment]);

  let Content =  <ActivityIndicator size='small' color ={Colors.primary} />
  if(!isLoading){
   Content= (
    <Card style={styles.card}>
      <ScrollView >
        <View style={{width:'100%', alignSelf:'center', padding:10}}>
          <View style={styles.section}>
  
            <Text style={styles.labelPicker}>Documento </Text>
              <Picker
                style={[styles.pickers]} itemStyle={styles.pickerItems}
                dropdownIconColor={Colors.primary}  
                selectedValue={selectedDocument}
                onValueChange={(itemValue, itemIndex) =>setSelectedDocument(itemValue) }>
              <Picker.Item 
                label={config.ModeOrder.document.FATTURA}
                value={config.ModeOrder.document.FATTURA} />
              <Picker.Item 
                label={config.ModeOrder.document.RICEVUTA}
                value={config.ModeOrder.document.RICEVUTA} />
            </Picker>
          </View>
          <View style={styles.section}>    
            <Text style={styles.labelPicker}>Pagamento </Text> 
            <Picker
                style={[styles.pickers]} itemStyle={styles.pickerItems}
                dropdownIconColor={Colors.primary}  
                selectedValue={selectedPayment}
                onValueChange={(itemValue, itemIndex) =>setSelectedPayment(itemValue)}>
              <Picker.Item 
                label={config.ModeOrder.payment.CACHE}
                value={config.ModeOrder.payment.CACHE} />
              <Picker.Item 
                label={config.ModeOrder.payment.PREPAID}
                value={config.ModeOrder.payment.PREPAID} />
            </Picker>
          </View>
          <View style={styles.section} >
            <Text style={styles.labelPicker}>Consegna</Text> 
              <Picker
                style={[styles.pickers]} itemStyle={styles.pickerItems}
                dropdownIconColor={Colors.primary}  
                selectedValue={delivery}
                onValueChange={(itemValue, itemIndex) =>{}}>
              <Picker.Item 
                color= {Colors.text}
                label={config.ModeOrder.delivery.SEDE}
                value={config.ModeOrder.delivery.SEDE} />
            </Picker>
          </View>
          
        </View> 
      <Hr style={{width:'100%', alignSelf:'center', marginBottom:20, borderBottomColor:Colors.primary}}/>
       
        {(selectedDocument===config.ModeOrder.document.RICEVUTA ) && 
          <View>
            <View>
              <Text style={styles.paragraphTitle}>Dati ricevuta</Text>
            </View>
            <View style={{width:'95%', alignSelf:'flex-start', marginLeft:10}}>
              <TextLabel label="Nome"> {userData.nome} </TextLabel>
              <TextLabel label="Cognome"> {userData.cognome} </TextLabel>
              <TextLabel label="Codice Fiscale"> {userData.cf} </TextLabel>
              <TextLabel label="Partita Iva"> {userData.piva} </TextLabel>
              <View style={{flexDirection:"row", justifyContent:"flex-start", width:'80%'}}>
                <TextLabel label="Via"> {userData.via} </TextLabel>
                <TextLabel label="N."> {userData.nciv} </TextLabel>   
              </View> 
              <TextLabel label="Città"> {userData.citta} </TextLabel>
              <View style={{flexDirection:"row", justifyContent:"flex-start", width:'70%'}}>
                <TextLabel label="Cap"> {userData.cap} </TextLabel>
                <TextLabel label="Provincia"> {userData.provincia} </TextLabel>
              </View>
            </View>
          </View>}
        {(selectedDocument===config.ModeOrder.document.FATTURA ) && 
          <View>
            <View>
              <Text style={styles.paragraphTitle}>Dati fatturazione</Text>
            </View>
            <View style={{width:'95%',alignSelf:'flex-start', marginLeft:10}}>
              <ContentPayFields  inputFormChangeHandler={ inputFormChangeHandler }/> 
            </View>
          </View>}

      </ScrollView>
    </Card>
    
   );
  }


  return(
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={200}
    >
      <LinearGradient colors={[Colors.gradient,Colors.primary]} style={styles.gradient}>
        { Content}
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

export const ScreenOptions = navHandle => {
  
  return{
    headerTitle: 'Dati Pagamento',
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    height:'100%'
  },
  card: {
    width: '90%',
    maxWidth: 400,
    minHeight: '40%',
    padding: 20,
  },
  section:{
    flexDirection:'row', 
    marginVertical:10,
    alignContent:'center',
  },
  paragraphTitle:{
    color:Colors.secondary,
    fontSize:16,
    fontWeight:'bold',
  },
  paragraphContent:{
    color:Colors.secondary,
    fontSize:16
  },
  labelPicker:{
    color:Colors.secondary,
    fontSize:16,
    fontWeight:'bold',
    width:'36%',
    alignSelf:'center'
  },
  pickers: {
    width: '64%',
    height: 44
  },
  pickerItems: {
    height: 44,
    color: Colors.primary,
    fontFamily:"open-sans",
    fontSize:14
  }
});
export default SettingPayScreen;