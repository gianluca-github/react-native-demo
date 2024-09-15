import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View } from 'react-native';
import Input from '../../components/UI/Input';
import TextLabel from '../../components/UI/TextLabel';
import EditLabel from '../../components/UI/EditLabel';
import * as globalFunc from '../../constants/Globalfunc';

/**
 * Json init input AuthScreen
 */
export const inputValuesAuth = {
    email: '',
    password: '',
    nome:'',
    cognome:'',
    cf:'',
    piva:'',
    via:'',
    nciv:'',
    citta:'',
    cap:'',
    provincia:'',
    telefono:''
}

/**
 * JSon Validities AuthScreen
 */
export const inputValiditiesAuth = ( value=false ) =>{
  return {
    nome:value,
    cognome:value,
    cf:value,
    piva:value,
    via:value,
    nciv:value,
    citta:value,
    cap:value,
    provincia:value,
    telefono:value
  }
}

export const inputValuesEdit = (userData)=> {
  
  return {
    nome: userData.nome,
    cognome: userData.cognome,
    piva: userData.piva,
    via: userData.via,
    nciv: userData.nciv,
    citta: userData.citta,
    cap: userData.cap,
    provincia: userData.provincia,
    telefono: userData.telefono
  }
}

export const inputValiditiesEdit = {
    nome:true,
    cognome:true,
    piva:true,
    via:true,
    nciv:true,
    citta:true,
    cap:true,
    provincia:true,
    telefono:true
}

/**
 * 
 * @param {*} inputFormChangeHandler 
 */
export const InputDefault = (inputFormChangeHandler) => {
  return(
    <React.Fragment>
      <Input
        id="email"
        label="E-Mail"
        keyboardType="email-address"
        required
        email
        autoCapitalize="none"
        errorText="Inserire un indirizzo Email valido."
        onInputChange={inputFormChangeHandler}
        initValue=""
      />
      <Input
        id="password"
        label="Password"
        keyboardType="default"
        secureTextEntry
        required
        minLength={5}
        autoCapitalize="none"
        errorText="Inserire una Password valida."
        onInputChange={inputFormChangeHandler}
        initValue=""
      />
    </React.Fragment>
  )
}



/**
 * Address
 * @param {*} inputFormChangeHandler 
 * @param {*} userData 
 * @param {*} edit 
 */
const addressFields = ( inputFormChangeHandler, userData, edit ) =>{ 

  return(
    <React.Fragment>
      <View style={{flexDirection:"row", justifyContent:"flex-start", width:'80%'}}>
        
        <EditLabel
          noEdit = {!edit}
          id="via"
          label="Via"
          keyboardType="default"
          required
          minLength={3}
          autoCapitalize='words'
          returnKeyType='next'
          errorText="Inserire una Via valida."
          onInputChange={inputFormChangeHandler}
          initValue={userData? userData.via: ''}
          initValid ={userData?true:false}
        />
        <EditLabel
          noEdit = {!edit}
          id="nciv"
          label="N."
          keyboardType="default"
          required
          minLength={1}
          autoCapitalize='words'
          errorText="N.invalido."
          onInputChange={inputFormChangeHandler}
          initValue={userData?userData.nciv: ''}
          initValid ={userData?true:false}
        />
      </View>  
      <EditLabel
        noEdit = {!edit}
        id="citta"
        label="Città"
        keyboardType="default"
        required
        minLength={3}
        autoCapitalize='words'
        errorText="Inserire una Città valida."
        onInputChange={inputFormChangeHandler}
        initValue={userData?userData.citta:''}
        initValid ={userData?true:false}
      />
      <View style={{flexDirection:"row", justifyContent:"flex-start", width:'70%'}}>

        <EditLabel
          noEdit = {!edit}
          id="cap"
          label="CAP"
          keyboardType="default"
          required
          numeric
          minLength={5}
          errorText="Inserire un CAP valido."
          returnKeyType='next'
          onInputChange={inputFormChangeHandler}
          initValue={userData?userData.cap:''}
          initValid ={userData?true:false}
        />
        <EditLabel
          noEdit = {!edit}
          id="provincia"
          label="Provincia"
          keyboardType="default"
          autoCapitalize="characters"
          required
          minLength={2}
          maxLength={2}
          autoCapitalize='words'
          errorText="Sigla"
          onInputChange={inputFormChangeHandler}
          initValue={userData?userData.provincia:''}
          initValid ={userData?true:false}
        />
      </View>
    </React.Fragment>
  )

};


/**
 * ProfileUserFields
 * @param {*} inputFormChangeHandler 
 * @param {*} userData 
 * @param {*} edit 
 * @param {*} editAdress 
 */
export const ProfileUserFields = ( inputFormChangeHandler, data, edit, editAdress ) =>{ 

  return(
    <React.Fragment>
      <Input
        id="nome"
        label="Nome"
        keyboardType="default"
        required
        minLength={3}
        autoCapitalize='words'
        errorText="Inserire un Nome valido."
        onInputChange={inputFormChangeHandler}
        initValue={data?data.nome:''}
        initValid ={data?true:false}
      />
      <Input
        id="cognome"
        label="Cognome"
        keyboardType="default"
        autoCompleteType="name"
        required
        minLength={2}
        autoCapitalize='words'
        errorText="Inserire un Cognome valido."
        onInputChange={inputFormChangeHandler}
        initValue={data?data.cognome:''}
        initValid ={data?true:false}
      /> 
      <EditLabel
        noEdit={!edit}
        id="cf"
        label="Codice Fiscale"
        keyboardType="default"
        cf
        required
        minLength={16}
        autoCapitalize="characters"
        errorText="Inserire un Codice Fiscale valido."
        onInputChange={inputFormChangeHandler}
        initValue={data?data.cf:''}
        initValid ={data?true:false}
      />
      <Input
        id="piva"
        label="Partita Iva"
        keyboardType="default"
        piva
        minLength={11}
        autoCapitalize="characters"
        errorText="Inserire una Partita Iva valida."
        onInputChange={inputFormChangeHandler}
        initValue={data?data.piva:''}
        initValid ={data?true:false}
      />
      {addressFields( inputFormChangeHandler, data, editAdress )}
      
      <Input
        id="telefono"
        label="Telefono"
        keyboardType="default"
        required
        numeric
        minLength={9}
        errorText="Inserire un numero telefonico valido."
        returnKeyType='next'
        onInputChange={inputFormChangeHandler}
        initValue={data?data.telefono:''}
        initValid ={data?true:false}
      />
    
    </React.Fragment>
    )
  }

/**
 * ContentProfileFields
 * @param {*} props 
 */
export const ContentProfileFields = props =>{

  const auth = useSelector(state => state.auth );
  const { email, password, userData } = auth;
  const inputFormChangeHandler = props.inputFormChangeHandler

  return(
    <React.Fragment>
      <TextLabel label='Email'> {email}  </TextLabel> 
      {/* <TextLabel label='Password'>{password} </TextLabel>  */}
      {ProfileUserFields( inputFormChangeHandler, userData, false, true )}
    </React.Fragment>
  );
} 

/*********************************************************
 * 
 *  Dati Fatturazione 
 *
 ********************************************************/

export const inputValuesBillData = (billData) =>{

  return {
    pec: globalFunc.isset(billData.pec) ? billData.pec : '',
    codiceUnico: globalFunc.isset(billData.codiceUnico) ? billData.codiceUnico : '',
    nome: billData.nome,
    cognome: billData.cognome,
    cf:billData.cf,
    piva: billData.piva,
    via: billData.via,
    nciv: billData.nciv,
    citta: billData.citta,
    cap: billData.cap,
    provincia: billData.provincia,
    telefono: billData.telefono
  }
}

export const inputValiditiesBillData = {
  pec: true,
  codiceUnico: true,
  nome:true,
  cognome:true,
  cf:true,
  piva:true,
  via:true,
  nciv:true,
  citta:true,
  cap:true,
  provincia:true,
  telefono:true
}

/**
 * ContentPayFields
 * @param {*} props 
 */
export const ContentPayFields = props =>{
  const userData = useSelector(state => state.auth.userData );
  const billData = globalFunc.isset( userData.billData ) ? userData.billData : userData;
  const inputFormChangeHandler = props.inputFormChangeHandler;

  return(

    <React.Fragment>
      <Input
        id="pec"
        label="PEC"
        keyboardType="email-address"
        required
        email
        autoCapitalize="none"
        errorText="Inserire un indirizzo PEC valido."
        onInputChange={inputFormChangeHandler}
        initValue={globalFunc.isset(billData.pec)?billData.pec: ''}
        initValid ={globalFunc.isset(billData.pec)?true:false}
      /> 
      <Input
        id="codiceUnico"
        label="Codice Univoco"
        keyboardType="default"
        codiceUnico
        required
        minLength={7}
        autoCapitalize="characters"
        errorText="Inserire un Codice Univoco valido."
        onInputChange={inputFormChangeHandler}
        initValue={globalFunc.isset(billData.codiceUnico)?billData.codiceUnico: ''}
        initValid ={globalFunc.isset(billData.codiceUnico)?true:false}
      />
      {ProfileUserFields( inputFormChangeHandler, billData, true, true )}
    </React.Fragment>
  );
} 