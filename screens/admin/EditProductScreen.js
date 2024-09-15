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
import { CheckBox } from 'react-native-elements'
import Input from '../../components/UI/Input';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import inputsForm from '../../hooks/InputsForm';
import * as globalFunc from '../../constants/Globalfunc';
import * as prodActions from '../../store/actions/products';

const DEFAULT_PRICE = '0.10';
const DEFAULT_QTA = '0.10';


const EditProductScreen = props => {

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

  const prodId = props.route.params ? props.route.params.productId : null;
  const editProduct = prodId
    ? useSelector(state =>
      state.products.availableProducts.find(p => p.id === prodId))
    : null;
  const dispatch = useDispatch();
  
  const initValues = {
    title: editProduct ? editProduct.title : '',
    imageUrl: editProduct ? editProduct.imageUrl : '',
    description: editProduct ? editProduct.description : '',
    price: editProduct ? editProduct.price.toFixed(2) : DEFAULT_PRICE,
    qta: editProduct ? editProduct.qta.toFixed(2) : DEFAULT_QTA,
    unit: editProduct ? editProduct.unit : '',
    scaleQta: (editProduct && globalFunc.isset(editProduct.scaleQta)) ? editProduct.scaleQta.toFixed(2) : DEFAULT_QTA,
    cool: (editProduct && globalFunc.isset(editProduct.cool)) ? editProduct.cool : false
  };

  const initValidities = {
    title: editProduct ? true : false,
    imageUrl: editProduct ? true : false,
    description: editProduct ? true : false,
    price: true, /* ha un valore di default: DEFAULT_PRICE */
    qta: true, /* ha un valore di default */
    unit: editProduct ? true : false,
    scaleQta: true, /* ha un valore di default */
    cool: true, /* cool è un check ed è sempre validato */
  };
  const initFormIsValid = editProduct ? true : false;

  /*------------ Initialize State Reducer  ----------*/
  useEffect(() => {
    
    inputsFormInit(initValues, initValidities, initFormIsValid);
    
    return(()=>{
      inputsFormClear();
    })
  }, [editProduct])
  


  const submitHandler = useCallback(async ()=>{
    
    if( !formIsValid){
      Alert.alert("Errore nell'inserimento!", 'Effetua un controllo!', [{text:'Ok'}]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try{
      if( !editProduct){
        await dispatch(prodActions.createProduct(
          inputValue.title,
          inputValue.description,
          inputValue.imageUrl,
          +inputValue.price,
          +inputValue.qta,
          inputValue.unit,
          +inputValue.scaleQta,
          inputValue.cool
        ));
      }
      else{
        await dispatch(prodActions.updateProduct(
          prodId,
          inputValue.title,
          inputValue.description,
          inputValue.imageUrl,
          +inputValue.price,
          +inputValue.qta,
          inputValue.unit,
          +inputValue.scaleQta,
          inputValue.cool
        ));
      }
      props.navigation.goBack();
    }
    catch( err ){
      setError(err);
    };

    setIsLoading(false);
  },[dispatch, prodId, inputValue, formIsValid ]);


  useEffect(()=>{
    
    setHasChangend( editProduct? !globalFunc.equalTo(inputValue, editProduct) : true );
  },[inputValue, editProduct]);
  
  /**
   * 
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
      keyboardVerticalOffset={120}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id='title'
            label='Nome'
            errorText='Inserisci un valore valido!'
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputFormChangeHandler}
            required
            minLength={2}
            initValue= {initValues.title}
            initValid= {initValidities.title}
          />
        <Input
            id='imageUrl'
            label='URL immagine'
            errorText='inserisci un URL valido!'
            keyboardType="default"
            returnKeyType="next"
            onInputChange={inputFormChangeHandler}
            initValue= {initValues.imageUrl}
            initValid= {initValidities.imageUrl}
            required
          />
          <Input
            id='description'
            label='Descrizione'
            errorText='Inserisci una descrizione valida!'
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            multiline
            numberOfLines={2}
            onInputChange={inputFormChangeHandler}
            initValue= {initValues.description}
            initValid={initValidities.description}
            required
            minLength={5}
          />
          <Input
            id='price'
            label='Prezzo'
            errorText='Inserisci un prezzo valido!'
            keyboardType='decimal-pad'
            returnKeyType="next"
            onInputChange={inputFormChangeHandler}
            initValue= {initValues.price}
            initValid= {initValidities.price}
            required
            decimal
            min={+DEFAULT_PRICE}
          />
          <Input
            id='unit'
            label='Unità di Misura'
            errorText='Inserisci una unità valida!'
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            multiline
            numberOfLines={1}
            onInputChange={inputFormChangeHandler}
            initValue={initValues.unit}
            initValid={initValidities.unit}
            required
            minLength={2}
          />
          <Input
            id='qta'
            label='Quantià disponibile'
            errorText='Inserisci una quantità valida!'
            keyboardType="default"
            returnKeyType="next"
            multiline
            numberOfLines={1}
            onInputChange={inputFormChangeHandler}
            initValue={initValues.qta}
            initValid={initValidities.qta}
            required
            numeric
            min={+DEFAULT_QTA}
          />
          <Input
            id='scaleQta'
            label='Quantià scalabile'
            errorText='Inserisci una quantità valida!'
            keyboardType="default"
            returnKeyType="next"
            multiline
            numberOfLines={1}
            onInputChange={inputFormChangeHandler}
            initValue= {initValues.scaleQta}
            initValid= {initValidities.scaleQta}
            required
            numeric
            min={+DEFAULT_QTA}
          />
          
           <CheckBox
            containerStyle={{backgroundColor:'transparent', marginTop:10, marginHorizontal:0, paddingLeft:0}}
            textStyle={{color:Colors.secondary,marginLeft:0 }}
            title='Prodotto fresco'
            checkedColor={Colors.primary}
            iconRight  
            checked={inputValue ? inputValue.cool : initValues.cool}
            onPress={() => inputFormChangeHandler('cool', !inputValue.cool, true) }
            fontFamily={'open-sans-bold'}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  form: {
    margin: 20
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
    headerTitle : routeParams.productId 
    ? 'Modifica Prodotto'
    : 'Nuovo Prodotto',
  }
}

export default EditProductScreen;