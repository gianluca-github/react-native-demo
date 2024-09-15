import React, { useState } from 'react';
import {useSelector} from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';

import Card from '../UI/Card';
import Hr from '../UI/Hr';
import TextLabel from '../UI/TextLabel';
import Colors from '../../constants/Colors';

const OrderItem = props => {
  const products = useSelector(state => state.products.availableProducts );
  const [showDetails, setShowDetails] = useState(false);
  const {
    amount,
    date,
    items,
    state,
    mode,
  } = props;
  const modePrint = (
    <View style={{flexDirection:'row', justifyContent:'space-evenly', paddingHorizontal:10, marginVertical:15, flex:1  }}>
     
      <View style={{flexGrow:1, alignItems:'flex-start', alignSelf:'center'}}>
        <Text style={{color:Colors.secondary, fontWeight:'bold' }} > Consegna </Text>
        <Text style={{color:Colors.text}} > {mode.delivery} </Text>
      </View>
      <View style={{flexGrow:1, alignItems:'flex-start', alignSelf:'center'}}>
        <Text style={{color:Colors.secondary, fontWeight:'bold'}} > Documento </Text>
        <Text style={{color:Colors.text }} > {mode.document} </Text>
      </View>
      <View style={{flexGrow:1, alignItems:'flex-start', alignSelf:'center' }}>
        <Text style={{color:Colors.secondary, fontWeight:'bold' }} > Pagamento </Text>
        <Text style={{color:Colors.text}} > {mode.payment} </Text>
      </View>
    </View>
  );

  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.totalAmount}>€ {amount.toFixed(2)}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
  
      <Button
        buttonStyle={{
          backgroundColor:Colors.secondary, 
          borderRadius:10, 
          marginVertical:10,
          width:200,
        }}
        titleStyle={{color:'white' }}
        title={showDetails ? 'Nascondi Dettagli' : 'Mostra Dettagli'}
        // occhio a prevState !!!!!!
        onPress={() => {
          setShowDetails(prevState => !prevState);
        }}
      /> 
       
      <TextLabel  
        horizontal 
        label= 'Stato:' style={{justifyContent:'center'}} 
        textStyle = {{color:Colors.text, fontFamily:'open-sans-bold'}} > 
        {state} 
      </TextLabel> 

      {showDetails && (
        <View style={styles.detailItems}>
          <Hr style={{width:'100%', alignSelf:'center', marginVertical:5, borderBottomWidth:1, borderBottomColor:Colors.primary}}/>
          
          {modePrint}
          <Hr style={{width:'100%', alignSelf:'center', marginVertical:5, borderBottomWidth:1, borderBottomColor:Colors.primary}}/>
          {items.map((cartItem, idx) => {
            let product = products.find( p => p.id == cartItem.productId);
            return(
              <View key={cartItem.productId} style={styles.detailCard} >    
                  <Text style={styles.textTitle}> {cartItem.productTitle}</Text>
                  <Text style={styles.textDetail}>Quantità: {cartItem.quantity.toFixed(2)} {product.unit}</Text>
                  <Text style={styles.textDetail}>Prezzo unitario: € {cartItem.productPrice.toFixed(2)} a {product.unit}</Text>
                  <Text style={styles.textDetail}>Costo Totale: € {cartItem.sum.toFixed(2)}</Text>
                  {product.cool && 
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                      <Text style={{...styles.textDetail,...{marginRight:10, color:Colors.secondary}}}>Prodotto fresco 
                      </Text>
                      <FontAwesome5 name="leaf" size={12} color={Colors.primary}/>
                    </View>}
                  { (idx<items.length-1 ) &&
                  <Hr style={{width:'90%', alignSelf:'flex-start', marginTop:10}}/>}
              </View>
            );
          })}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    margin: 10,
    padding: 10,
    alignItems: 'center'
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15
  },
  totalAmount: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
    color:Colors.text
  },
  date: {
    fontSize: 16,
    fontFamily: 'open-sans',
    color: Colors.date
  },
  button:{
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 30,
    backgroundColor: Colors.secondary
  },
  detailItems: {
    width: '100%',
    marginTop:20
  },
  detailCard:{
    marginBottom:10, 
    padding:20, 
    alignItems:'flex-start'
  },
  textTitle:{
    fontSize:16,
    fontWeight:'bold',
    color:Colors.secondary,
    marginBottom:10
  },
  textDetail:{
    fontSize:14,
    fontWeight:'bold',
    color:Colors.date,
    marginLeft:10,
    marginBottom:5

  }

});

export default OrderItem;
