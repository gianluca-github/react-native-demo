import React, {useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  View,  
  Text, 
  StyleSheet, 
  ActivityIndicator,
  Alert
} from 'react-native';

import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { LinearGradient } from 'expo-linear-gradient';


import HeaderButton from '../../components/UI/HeaderButton';
import Hr from '../../components/UI/Hr';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';
import * as globalFunc from '../../constants/Globalfunc';
import * as Notifications from 'expo-notifications';


const BriefScreen = props => {

  const userData = useSelector(state => state.auth.userData );
  const config = useSelector( state => state.config.data );
  const billData = globalFunc.isset( userData.billData ) ? userData.billData : null;
  const payment = globalFunc.isset( userData.modeOrder ) ? userData.modeOrder.payment : config.ModeOrder.payment.CACHE;
  const delivery = globalFunc.isset( userData.modeOrder ) ? userData.modeOrder.delivery : config.ModeOrder.delivery.SEDE;
  const document = globalFunc.isset( userData.modeOrder ) ? userData.modeOrder.document : config.ModeOrder.document.RICEVUTA;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  /**
   * Refresh UserData
   */
   const refreshData = useCallback( async () =>{
    setError(null);
    setIsLoading(true);
    try{
      await dispatch( authActions.refreshUserData() );
    }
    catch(err){
      setError(err);
      setIsLoading(false);
    }
    finally{
      setIsLoading(false);
    }
  },[dispatch]);

  /**
   * Refresh listener
   */
  useEffect(()=>{
    
    const unsubscribe = props.navigation.addListener(
      'focus',
      refreshData );

    return ()=> {
      unsubscribe();
    }  
  },[refreshData]);

  /**
   * refreshData
   */
   useEffect(()=>{

      refreshData();
   }, [refreshData])
  
  
  /**
   * error
   */
  useEffect(()=>{
    if(error) {
      Alert.alert('Errore!', error, [{'Text':'Okay'}] );
    }
  },[error]);
  
   
  return(
    
    <LinearGradient colors={[Colors.gradient,Colors.primary]} style={styles.gradient}>
      {isLoading && <ActivityIndicator size='large' color ={Colors.primary} /> }
      {!isLoading &&
        <Card style={styles.card}> 
          <Text style={styles.title}>{userData.nome} {userData.cognome}</Text>
          <Text style={styles.text}>{userData.email} </Text>
          <Text style={styles.text}>{userData.cf} </Text>
          <View style={styles.dummyLine}/> 
          <View style={styles.viewLine}>
            <Text style={styles.text}>Via {userData.via} </Text>
            <Text style={styles.text}>{userData.nciv} </Text>   
          </View>
          <Text style={styles.text}>{userData.citta} </Text>
          <View style={styles.viewLine}>
            <Text style={styles.text}>{userData.cap} </Text>
            <Text style={styles.text}>({userData.provincia}) </Text>
          </View>


          <View style={styles.dummyLine}/> 
        
          {globalFunc.isset(userData.piva) && userData.piva!=='' && <Text style={styles.text}>Partita Iva: {userData.piva} </Text>}
          {(document===config.ModeOrder.document.FATTURA && billData ) && 
            <View >
              {globalFunc.isset(billData.pec) && billData.codiceUnico!=='' && <Text style={styles.text}>Pec: {billData.pec} </Text>}
              {globalFunc.isset(billData.codiceUnico) && billData.codiceUnico!=='' && <Text style={styles.text} >Codice Unico: {billData.codiceUnico} </Text>}
            </View>      
          }
          <View style={{marginTop:10}}/> 
          <Hr style={{width:'90%', alignSelf:'flex-start', marginBottom:20, borderBottomColor:Colors.primary}}/>
          <Text style={styles.title}>Modalità di Pagamento</Text>
          <Text style={styles.text}>Documento: {document} </Text>
          <Text style={styles.text}>Pagamento: {payment} </Text> 
          <Text style={styles.text}>Consegna: {delivery}</Text> 
          <Text style={styles.text}>Credito Residuo:  
                € {userData&&userData.prepaid? userData.prepaid.toFixed(2):'0.0'}</Text>
        </Card> }
      </LinearGradient>
  );
}

export const ScreenOptions = navHandle => {
  
  return{
    headerTitle: 'Riepilogo',
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
    padding: 20,
    minWidth:'90%',
    marginHorizontal:20,
  },
  title:{
    color:Colors.secondary,
    fontSize:16,
    fontWeight:'bold',
    marginTop:5,
    marginBottom:10
  },
  dummyLine:{
    marginTop:4
  },
  text:{
    fontSize:15,
    marginVertical:2,
    marginLeft:10
  },
  viewLine:{ 
    flexDirection:"row", 
    justifyContent:"flex-start"
  }
});
export default BriefScreen;