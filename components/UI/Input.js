import React, {useReducer, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import Colors from '../../constants/Colors';


const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';

/* ------ function called from dispatch reducer: dispatch (in this case) ------ */
const inputReducer = ( state, action ) => {
  switch( action.type ){
    case INPUT_CHANGE:
    
      return{
        ...state,
        value:action.value,
        valid:action.valid,
      }
    case INPUT_BLUR:

      return{
        ...state,
        touched: true
      }
    default:
      return state;
  }
}

const Input = props => {

  const initialState = {
    value: props.initValue ? props.initValue : '',
    valid: props.initValid,
    touched: false
  }

  const [inputState, dispatch] = useReducer( inputReducer, initialState );

  const {onInputChange, id} = props;
  useEffect(()=>{
    if(inputState.touched){
      onInputChange( id, inputState.value, inputState.valid );
    }
  },[onInputChange, inputState, id]);


  const blurHandler = () => {
    
    if( Platform.OS==='android' && props.keyboardType === 'numeric' ){

      dispatch({ type:INPUT_BLUR })
    }
  }

  const keyPressHandler = ({ nativeEvent: { key: keyValue } }) => {

    dispatch({ type:INPUT_BLUR })
  }

  
  const textChangeHandler = text =>{
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //const cfRegex= /^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i;
    const cfRegex= /^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$/
    /*tra le parentesi tonde vi è l'identificativo del comune di nascita (codice catastale). Le lettere elencate (abcd ecc.) indicano il mese di nascita mentre l'ultima lettera è quella di controllo.*/
    const decimalDot = /^\d+(\.\d{0,2})?$/
    const pivaRegex = /^[0-9]{11}$/
    const cUniRegex= /^[a-zA-Z0-9]{7}$/   

    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if( props.numeric && isNaN( text ) ){
      isValid = false;
    }
    // Codice Fiscale
    if (props.cf && !cfRegex.test(text.toUpperCase())) {
      isValid = false;
    }
    if (props.piva && !pivaRegex.test(text.toUpperCase())) {
      isValid = false;
    }  
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    if( props.decimal && !decimalDot.test(+text) )
    {
      isValid = false;
    }
    if (props.codiceUnico && !cUniRegex.test(text.toUpperCase())) {
      isValid = false;
    }
   
    dispatch({type:INPUT_CHANGE, value:text, valid:isValid })
  }

  let inputComponent =
    <TextInput
      {...props}
      style={{...styles.input, ...props.style}}
      value={inputState.value}
      onChangeText={textChangeHandler}
      onBlur={blurHandler}
      onKeyPress={keyPressHandler}
    />

  if( props.textarea ){
    inputComponent = 
      <View style={styles.textAreaContainer}>
        <TextInput
          {...props}
          style={styles.textArea}
          value={inputState.value}
          onChangeText={textChangeHandler}
          // onBlur={keyPressHandler}
          onKeyPress={keyPressHandler}
        />
      </View>
  }

  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      {inputComponent}

      {!inputState.valid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  formControl: {
    width: '100%'
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginTop: 20,
    marginBottom:4,
    color:Colors.secondary
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1
  },
  textAreaContainer: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius:10,
    height:160,
  },
  textArea: {
    height:'95%',
    width:'98%',
    textAlignVertical:'top',
    borderRadius:10,
    backgroundColor:Colors.bgtext,
    color: Colors.text,
    fontSize:16
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    fontFamily: 'open-sans',
    color: Colors.error,
    fontSize: 13
  }
});

export default Input;