import React from 'react';
import Input from '../components/UI/Input';
import {useReducer, useCallback} from 'react';

  const initialState = {
    inputValues: null,
    inputValidities: null,
    formIsValid: false,
   // formHasChanged: false
  };

  const FORM_INPUT_INIT = 'FORM_INPUT_INIT';
  const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
  const FORM_INPUT_CLEAR = 'FORM_INPUT_CLEAR';

  /* ------ function called from dispatch reducer: dispatchFormState (in this case) ------ */
  const formReducer = ( state, action ) => {

    switch (action.type){
      case FORM_INPUT_INIT:

        return{
          inputValues: action.values,
          inputValidities: action.validities,
          formIsValid: action.formIsValid,
          //formHasChanged: false
        }

      case FORM_INPUT_UPDATE:

        const updateInputValues = {
          ...state.inputValues,
          [action.inputId]:action.value
        };

        const updateInputValidities = {
          ...state.inputValidities,
          [action.inputId]: action.valid
        };

        let updateFormIsValid = true;
        for( const key in updateInputValidities ){
          updateFormIsValid = updateFormIsValid && updateInputValidities[key];
        }

        return {
          inputValues: updateInputValues,
          inputValidities: updateInputValidities,
          formIsValid: updateFormIsValid,
        }
      case FORM_INPUT_CLEAR:
        return initialState;
    }
  };


const inputsForm = () =>{

  /**
   * ------------ Initialize State Reducer  ---------- */
  const [formState, dispatchFormState] = useReducer( formReducer, initialState );

  /**
   * 
   */
  const inputsFormInit = useCallback(( inputValues, inputValidities, formIsValid ) => { 
    
    dispatchFormState({
      type: FORM_INPUT_INIT, 
      values: inputValues,
      validities: inputValidities,
      formIsValid: formIsValid
    });
  },[dispatchFormState]);

  /**
  * ----- inputChangeHandler  inside a component Input!!!! 
  */
  const inputFormChangeHandler = useCallback((inputIdentifier, inputValue, inputValid) => { 

    dispatchFormState({
      type: FORM_INPUT_UPDATE, 
      inputId: inputIdentifier,
      value: inputValue,
      valid: inputValid
    });
  },[dispatchFormState]);


  /**
   * 
   * @param {*} key 
   */
  const renderField = ( key ) =>{
    const {inputValues, inputValidities} = formState;
   
    return (
      <Input
        id={key}
        label={key}
        onInputChange={inputFormChangeHandler}
        initValue = {inputValues[key]}
        initValid = {inputValidities[key]}

        keyboardType="default"
        required
        minLength={3}
        autoCapitalize='words'
        errorText="Inserire un Nome valido."
      />
    );
    
  }

  const renderForm = () => {
    const {inputValues, inputValidities} = formState;
    if( !inputValues ){
      return;
    }

    return Object.keys(inputValues).map((key) => {
      return renderField( key );
    });
  }
  


  /**
   * inputsFormClear
   */
  const inputsFormClear = useCallback( ()=>{

    dispatchFormState({type:FORM_INPUT_CLEAR})
  },[]);

  /**
   * return 
   */
  return{
    inputsFormInit: inputsFormInit,
    inputFormChangeHandler: inputFormChangeHandler,
    inputsFormClear: inputsFormClear,
    inputValue: formState.inputValues,
    inputValidities: formState.inputValidities,
    formIsValid: formState.formIsValid,
    renderForm: renderForm
  }
};

export default inputsForm;


