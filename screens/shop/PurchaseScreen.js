import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch} from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';

import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import Hr from '../../components/UI/Hr';
import * as ordersActions from '../../store/actions/orders';
import * as cartActions from '../../store/actions/cart';
import * as authActions from '../../store/actions/auth';
import * as prodActions from '../../store/actions/products';
import * as globalFunc from '../../constants/Globalfunc';
import * as Notifications from 'expo-notifications';

/**
 * 
 * @param {*} props 
 * @returns 
 */
const LocalHeader = props =>{

  return(
    <View style={{flexDirection:'row', margin:10}}>
      <View style={{width:'50%'}}>
        <Text style={{fontWeight:'bold', fontSize:16, color:Colors.text}} > {props.label}</Text>
      </View>
      <View style={{width:'50%'}}>
        <Text style={{fontWeight:'bold', fontSize:16, color:Colors.text }} >   
        € {props.value.toFixed(2)} </Text>
      </View>
    </View>
  );
}

const PurchaseScreen = props =>{
  const cart = useSelector(state => state.cart);
  const cartTotalAmount = cart.totalAmount;
  // vettore trasformato in CartScreen
  const cartItems = props.route.params ? props.route.params.cartItems : null;

  const userData = useSelector(state => state.auth.userData );
  const config = useSelector( state => state.config.data );
  const billData = globalFunc.isset( userData.billData ) ? userData.billData : null; 
  const payment = globalFunc.isset( userData.modeOrder ) ? userData.modeOrder.payment : config.ModeOrder.payment.CACHE;
  const delivery = globalFunc.isset( userData.modeOrder ) ? userData.modeOrder.delivery : config.ModeOrder.delivery.SEDE;
  const document = globalFunc.isset( userData.modeOrder ) ? userData.modeOrder.document : config.ModeOrder.document.RICEVUTA;
  //
  const [selectedPayment, setSelectedPayment] = useState(payment);
  const [selectedDocument, setSelectedDocument] = useState(document);
  const [isLoading, setIsLoading] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  


  /**
     * Refresh UserData
     */
  const refreshData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(authActions.refreshUserData());
    }
    catch (err) {
      setError(err);
      setIsLoading(false);
    }
    finally {
      setIsLoading(false);
    }
  }, [dispatch]);
 
  /**
   * 
   */
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });


  useEffect( () => {

    Notifications.getPermissionsAsync()
      .then((status) => {
        if (status !== 'granted') {
          return Notifications.requestPermissionsAsync();
        }
        return status;
      })
      .then((status) => {
        if (status !== 'granted') {
          return;
        }
      });
    
  }, []);

  /**
   * 
   * @param {*} qtaPrepaid 
   */
  const triggerNotificationHandler = async (qtaPrepaid) => {

    // const { status: existingStatus } = await Notifications.getPermissionsAsync();
    // let finalStatus = existingStatus;
    // if (existingStatus !== 'granted') {
    //   const { status } = await Notifications.requestPermissionsAsync();
    //   finalStatus = status;
    // }
    // if (finalStatus !== 'granted') {
    //   alert('Failed to get push token for push notification!');
    //   return;
    // }

    Notifications.scheduleNotificationAsync({
      content: {
        title: "React native demo",
        body: "Il tuo Credito Prepagato sta per terminare, ti ricordiamo di ricaricarlo!",
        data: { myData: qtaPrepaid }
      },
      trigger: {
        seconds: 5,
      },
    });
  };
  /**
   * sendOrderHandler
   */
  const sendOrderHandler = async ()=> {

    Alert.alert("Stai procedendo con l'acquisto", "Confermi l'ordine?",[
      { text:'No', style:'default'},
      { text:'Si', style:'destructive', 
        onPress: async()=>{
          setIsLoading(true);
          setOrderSent(false);
          setError(null);
          //
          cartActions.stopTimeCart();
          
          const mode = { 
            delivery,
            document:selectedDocument, 
            payment:selectedPayment
          };
          try{
            await dispatch( ordersActions.addOrder(cartItems, cartTotalAmount, mode) );

            Object.values(cartItems).map((item) => {
              dispatch( prodActions.updateQtaProduct(
                item.productId,
                item.quantity
              ));
            })

            // cartItems.forEach( item => {
            //    dispatch( prodActions.updateQtaProduct(
            //     item.productId,
            //     item.quantity
            //   ));
            // });
            
            let prepaid = userData.prepaid - cartTotalAmount;
            // pagamento corrente
            if( selectedPayment === config.ModeOrder.payment.PREPAID){
              const upDateRecord = { ...userData, prepaid };
              await dispatch(authActions.updateUserData(upDateRecord));
            }
            // pagamento impostato dal cliente
            if (payment === config.ModeOrder.payment.PREPAID && prepaid < 10.0 ) {
              triggerNotificationHandler(prepaid);
            }

          }
          catch (err) {
            setError( err );
            setIsLoading(false);

          }
          finally{   
            setIsLoading(false);
            setOrderSent(true);
          }
        }}]
      );
  }

  /**
   * changeDocumentHandler
   * @param {*} value 
   * @returns 
   */
  const changeDocumentHandler = ( value ) =>{

    if( value === config.ModeOrder.document.FATTURA && !billData ){
      // Alert.alert("I dati di fatturazione non sono stati inseriti!", "Vai alla pagina Dati pagamento.",[
      //   { text:'No', style:'default'},
      //   { text:'Si', style:'destructive', 
      //     onPress: async()=>{ props.navigation.navigate('Pagamento') }
      //   }]
      //);

      Alert.alert("I dati di fatturazione non sono stati inseriti!", "Vai alla pagina \nImpostazioni -> Dati Pagamento.",
        [{ text:'Ok', style:'default'}]
      );
      return;
    }
    setSelectedDocument( value );
  }

  /**
   * changePaymentHandler
   * @param {*} value 
   * @returns 
   */
  const changePaymentHandler = ( value ) =>{
    
    // if (value === config.ModeOrder.payment.PREPAID) {
    //   // attende il refresh
    //   refreshData().then(()=>{
    //     setSelectedPayment(value);
    //   });
    // } else {
    //     setSelectedPayment(value);
    // }
    setSelectedPayment(value);

  }
  
  
  /**
   * 
   */
  useEffect(()=>{
    if (selectedPayment === config.ModeOrder.payment.PREPAID) {
     
      const prepaid = globalFunc.isset(userData.prepaid) ? userData.prepaid : 0;
      if (prepaid < cartTotalAmount) {

        Alert.alert(
          `Attenzione, il tuo Credito Residuo di ${prepaid.toFixed(2)} € è insufficiente!`,
          "Utilizza un'altra modalità di pagamento o ricarica il tuo Credito Prepagato!",
          [{ text: 'Ok' }]
        );

        setSelectedPayment(config.ModeOrder.payment.CACHE);
      } 
   }

 }, [selectedPayment])

  /**
   * refresData 
   */
  useEffect(()=>{
    const unsubscribe = props.navigation.addListener( 'focus', ()=>{
      // if( selectedPayment === config.ModeOrder.payment.PREPAID ){
      //   refreshData();
      // }
      // sempre refreshData !!!
      refreshData();

    });

    return ()=> {
      unsubscribe();
    }  
  }, [selectedPayment, refreshData]);

  /**
   * Error
   */
  useEffect(()=>{
    if(error){
      Alert.alert("Errore nell'invio dell'ordine: ", error.message, [{text:'Ok'}]);
    }
  },[error]);

  /**
   * se il carrello è cancellato dal timeOut torno ai prodotti
   * qui se sei sulla pagina corrente
   */
  useEffect(()=>{
    
    const focus = props.navigation.isFocused();
    if ( JSON.stringify(cart.items) === '{}' && focus && !isLoading ) {
      
      props.navigation.navigate('ProductOverview');
    }
  },[cart])

  /**
   * se il carrello è cancellato dal timeOut torno ai prodotti
   * qui se torni sulla pagina corrente
   */
  useEffect(()=>{
    const unsubscribe = props.navigation.addListener(
      'focus',
      ()=>{ 
        if ( JSON.stringify(cart.items) === '{}'  ) {
          props.navigation.navigate('ProductOverview');
        }
      }
    );

    return ()=> {
      unsubscribe();
    }  
  },[cart]);

  /**
   * disable back arrow
   */
  useEffect(()=>{
    if( orderSent ){

      props.navigation.setOptions({ headerLeft: null })
    }
  }, [orderSent]);

  /**
   * dataPerson
   * @returns 
   */
  const dataPerson = () =>{

    const modeBill = (selectedDocument===config.ModeOrder.document.FATTURA );
    const items = (selectedDocument===config.ModeOrder.document.RICEVUTA ) ? userData : billData; 
    return(
      <View style={{width:'95%', padding:10, alignSelf:'center'}}>
         <Text style = {styles.dataPersonTitle}>Intestatario </Text>
        <View style={styles.dataPersonSection}>
          <Text style = {styles.dataPersonText} >{items.nome}</Text>
          <Text style = {styles.dataPersonText} >{items.cognome} </Text>
        </View>
        <View style={styles.dataPersonSection}>
          <Text style = {styles.dataPersonText} >{items.cf}</Text>
        </View>
        <Text style = {styles.dataPersonTitle} >Indirizzo</Text>
        <View style={styles.dataPersonSection}>
          <Text  style = {styles.dataPersonText} >Via {items.via} n. {items.nciv}</Text>
          <Text style = {styles.dataPersonText} >{items.cap}   {items.citta}  ({items.provincia})</Text>
        </View>
        
        {globalFunc.isset(items.piva) && items.piva !=='' && <View>   
            <Text style = {styles.dataPersonTitle} >Partita Iva</Text>
            <View style={styles.dataPersonSection}> 
              <Text style = {styles.dataPersonText} >{items.piva}</Text>
            </View>
          </View>}
        

        {modeBill && globalFunc.isset(items.pec) && items.pec !=='' && <View>
           <Text style = {styles.dataPersonTitle} >Pec</Text>
           <View style={styles.dataPersonSection}> 
             <Text style = {styles.dataPersonText} >{items.pec}</Text>
           </View> 
         </View>
        }
      
        { modeBill && globalFunc.isset(items.codiceUnico) && items.codiceUnico !=='' && <View>
           <Text style = {styles.dataPersonTitle} >Codice Univoco</Text>
           <View style={styles.dataPersonSection}> 
             <Text style = {styles.dataPersonText} > {items.codiceUnico}</Text>
           </View> 
         </View> }
      </View>
    );
   
  }
  

  let markPrePaid = '';
  if (payment === config.ModeOrder.payment.PREPAID) {
    markPrePaid =
      <Text style={{ fontWeight: 'bold', fontSize: 14, color: Colors.secondary, textAlign: 'center', padding: 20, margin: 20 }}>
        Ti ricordiamo che il tuo Credito Residuo è di {userData.prepaid.toFixed(2)}€
      </Text>
  }
    
  const screen = isLoading ? 'SPINNER' : orderSent? 'END': 'DEFAULT';
  return(
    <LinearGradient colors={[Colors.gradient,Colors.primary]} style={styles.gradient}>
      <ScrollView style={styles.screen}>
      { screen !== 'DEFAULT'  &&
        <Card style={styles.cardCenter}>
          {screen === 'SPINNER' && <ActivityIndicator size='small' color={Colors.primary} />}
          {screen === 'END' &&
            <View>
              <Text style={{fontWeight:'bold', fontSize:16, color:Colors.primary, textAlign:'center'}}>
                L'ordine è stato inviato correttamente!
            </Text>
            {markPrePaid}
            </View>
          }
        </Card>
      }
      { screen === 'END' &&
        <Button
          buttonStyle={{backgroundColor:Colors.secondary, padding:5, borderRadius:8}}
          titleStyle={{color:'white', fontSize:18, fontWeight:'bold'}}
          title="Torna ai prodotti!"
          disabledStyle={{marginHorizontal:10}}
          deletable
          onPress={() => props.navigation.navigate('ProductOverview', {reload:true})}
        />
      }

      { screen == 'DEFAULT' &&  
      <React.Fragment>
        
        <Card style={styles.card}> 
          <LocalHeader label='Costo Totale:' value={cartTotalAmount} />
          {/* <LocalHeader label='Credito Residuo:' value={userData && userData.prepaid ? userData.prepaid : 0.0}/> */}
          {(selectedPayment===config.ModeOrder.payment.PREPAID) && 
            <LocalHeader 
              label='Credito Residuo:'
              value= {userData&&userData.prepaid? userData.prepaid :0.0 } 
            /> }
          <Hr style={{width:'95%', alignSelf:'center', marginBottom:20, borderBottomColor:Colors.primary}}/>

          <View style={{width:'95%', alignSelf:'center', padding:10}}>

            <View style={styles.interViewRow}>
              <Text style={styles.labelPicker}> Documento </Text>
              <Picker
                style={[styles.pickers]} itemStyle={styles.pickerItems}
                dropdownIconColor={Colors.primary}  
                selectedValue={selectedDocument}
                onValueChange={(itemValue, itemIndex) =>changeDocumentHandler(itemValue) }>
              <Picker.Item 
                // color={Colors.secondary}
                label={config.ModeOrder.document.FATTURA}
                value={config.ModeOrder.document.FATTURA} />
              <Picker.Item 
                label={config.ModeOrder.document.RICEVUTA}
                value={config.ModeOrder.document.RICEVUTA} />
            </Picker>
          
            </View>
            <View style={styles.interViewRow}>
              <Text style={styles.labelPicker}> Pagamento </Text>
              <Picker
                style={[styles.pickers]} itemStyle={styles.pickerItems}
                dropdownIconColor={Colors.primary}  
                selectedValue={selectedPayment}
                onValueChange={(itemValue, itemIndex) =>changePaymentHandler(itemValue)}>
                <Picker.Item 
                  label={config.ModeOrder.payment.CACHE}
                  value={config.ModeOrder.payment.CACHE} />
                <Picker.Item 
                  label={config.ModeOrder.payment.PREPAID}
                  value={config.ModeOrder.payment.PREPAID} />
            </Picker>
          
            </View>   
            <View style={styles.interViewRow}>
              <Text style={styles.labelPicker}> Consegna </Text>
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
          <Hr style={{width:'95%', alignSelf:'center', marginBottom:20, borderBottomColor:Colors.primary}}/>
          { dataPerson() }
          
        </Card>  
        <Button
          buttonStyle={{backgroundColor:Colors.secondary, padding:5, borderRadius:8}}
          titleStyle={{color:'white', fontSize:18, fontWeight:'bold'}}
          title="Ordina"
          disabledStyle={{marginHorizontal:10}}
          deletable
          onPress={sendOrderHandler}
        />
      </React.Fragment>
    }
        
      </ScrollView>
    </LinearGradient>      
  );
}

export const ScreenOptions = {

   headerTitle: 'Riepilogo Ordine'
};

const styles = StyleSheet.create({
  gradient:{
    flex:1,
    justifyContent:'flex-start',
    alignItems:'center'
  },
  screen: {
    margin: 20,
    width:'90%'
  },
  card: {
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 10
  },
  cardCenter:{
    justifyContent:'center', 
    alignItems:'center', 
    width:'100%', 
    height:300,
    padding:10,
    marginBottom: 20,
  },
  interView:{
    marginHorizontal:10,
    justifyContent:'center',
    alignItems:'center'
  },
  interViewRow:{
    flexDirection:'row',
    marginVertical:10,
    alignContent:'center',
  },
  label: {
    fontSize: 18,
    color:Colors.primary,
  },
  value: {
    fontSize: 16,
    color:Colors.secondary,
    marginRight:10,
    flexGrow:2
  },
  amount: {
    color: Colors.primary
  },
  dataPersonText: {
    fontSize: 14,
    color: Colors.text,
    marginRight:5
  },
  dataPersonTitle:{
    fontSize:16, 
    fontWeight:'bold', 
    color:Colors.secondary, 
    alignSelf:'flex-start', 
    marginBottom:5
  },
  dataPersonSection:{
    flexDirection:'row',
    flexWrap:'wrap', 
    alignSelf:'flex-start', 
    justifyContent:'flex-start', 
    marginBottom:12
  },
  labelPicker:{
    fontSize:16, 
    fontWeight:'bold', 
    color:Colors.secondary, 
    alignSelf:'center',
    width:'36%'
  },
  pickers: {
    width: '64%',
    height: 44
  },
  pickerItems: {
    height: 44,
    color: Colors.primary,
    // backgroundColor: Colors.primary,
    fontFamily:"open-sans",
    fontSize:14
  }
});

export default PurchaseScreen;