import React from 'react';
import Input from '../components/UI/Input';

export const configAuthLogin = {
  email:{
    key:'email',
    value: '',
    valid: false,
    renderInput : (key, value, valid, inputFormChangeHandler)=> {
      return(
        <Input
          id={key}
          onInputChange={inputFormChangeHandler}
          initValue={value}
          initValid={valid}
          label="E-Mail"
          keyboardType="email-address"
          required
          email
          autoCapitalize="none"
          errorText="Inserire un indirizzo Email valido."
        />
      )
    }
  },

  password:{
    key:'password',
    value:'',
    valid:false,
    renderInput : (key, value, valid, inputFormChangeHandler)=> {
      return(
        <Input
          id= {key}
          onInputChange={inputFormChangeHandler}
          initValue={value}
          initValid={valid}
          minLength={5}
          label="Password"
          keyboardType="default"
          secureTextEntry
          required
          autoCapitalize="none"
          errorText="Inserire una Password valida."
        />
      )
    }
  },
}


const useForm = ( cfgForm ) => {
 
  const renderForm = (inputFormChangeHandler ) =>{
    return (
      <React.Fragment>
        {  
          Object.values(cfgForm).map( (inputObj) => {
            const { key, value, valid, renderInput } = inputObj;         
            return renderInput(key, value, valid, inputFormChangeHandler)
          })
        }
      </React.Fragment>
    )
  }

  const inputValues = () =>{
    let jsonData = {}
    Object.values(cfgForm).map( (inputObj) => {
      const { key, value } = inputObj;
      jsonData[key] = value;
   })
   return jsonData;
  }


  const inputValidities = () =>{
    let jsonData = {}
    Object.values(cfgForm).map( (inputObj) => {
      const { key, valid } = inputObj;
      jsonData[key] = valid;

   })
   return jsonData;
  }

  return{
    inputValues: inputValues,
    inputValidities: inputValidities,
    renderForm: renderForm
  }
};

export default useForm;
