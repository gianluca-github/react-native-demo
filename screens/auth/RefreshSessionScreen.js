import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector } from 'react-redux';
import {
  View, 
  ActivityIndicator
} from 'react-native';

import Colors from '../../constants/Colors';
import * as actionAuth from '../../store/actions/auth';

const RefreshSessionScreen = props => {
  
  const [isCheck, setIsCheck] = useState(false);
  const [error, setError] = useState();
  const expirationDate = useSelector( state => state.auth.expirationDate );
  const dispatch = useDispatch();

  useEffect(()=> {

    const checkSession = async () => {
    
      const expiryDate = new Date( expirationDate );
      if( expiryDate <= new Date() )
      {
        setIsCheck( true ); 
        //console.log( ' Expiry Date: ', expiryDate)
  
        try{   
           await dispatch( actionAuth.refreshSessione()  );
           setIsCheck(false);
        }
        catch( err ){
          setError( err );
          setIsCheck(false);
        }
      }
    };
    // esegue la funzione scritta sopra ...
    checkSession();
  },[dispatch]);


  useEffect(()=>{
    if(error) {
    
      Alert.alert('Errore!', error.message, [{'Text':'Okay'}] );
    }
  },[error])

  if( isCheck ){
    return(
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <ActivityIndicator size='large' color={Colors.primary} />
        </View> 
    )
  }
  // 
  return null;

};


export default RefreshSessionScreen;




