import React, {useState} from 'react';
import {
   View,
   Text,
   FlatList,
   StyleSheet,
   ActivityIndicator,
   Dimensions
} from 'react-native';
import { Button } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import {LinearGradient} from'expo-linear-gradient'

import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';

const selectCart = createSelector(
  state => state.cart.items,
  items => {
      const transformedCartItems = [];
      for (const key in items) {
        
        transformedCartItems.push({
          productId: key,
          productTitle: items[key].productTitle,
          productPrice: items[key].productPrice,
          quantity: items[key].quantity,
          sum: items[key].sum
        });
      }
      return transformedCartItems.sort((a, b) =>
        a.productId > b.productId ? 1 : -1
      );
  }
);

const CartScreen = props => {

  const [isLoading, setIsloading] = useState(false);
  const cartTotalAmount = useSelector(state => state.cart.totalAmount);   
  const cartItems = useSelector(selectCart); 
  
  const purchaseHandler = async ()=> {

    props.navigation.navigate( 'Purchase', {cartItems:cartItems} );
  }
  //
  return (
    <LinearGradient colors={[Colors.gradient,Colors.primary]} style={styles.gradient}>
      <View style={styles.screen}>
        <Card style={styles.summary}>
          <Text style={styles.summaryText}>
            Totale:{' '}
            <Text style={styles.amount}>€ {cartTotalAmount.toFixed(2)}</Text>
          </Text>
          {isLoading
            ? <View >
                <ActivityIndicator size='large' color={Colors.primary} />
              </View>
            : <Button
                buttonStyle={{backgroundColor:Colors.secondary, padding:5, borderRadius:8}}
                titleStyle={{color:'white', fontSize:14, fontWeight:'bold'}}
                title="Procedi con l'ordine"
                disabledStyle={{marginHorizontal:10}}
                disabled={cartItems.length === 0}
                deletable
                onPress={purchaseHandler}
              />
            }
        </Card>  
        
      </View>
     

        <FlatList
          data={cartItems}
          keyExtractor={item => item.productId}
          contentContainerStyle={{width:Dimensions.get('window').width*0.8,  overflow: 'hidden' }}
          renderItem={itemData => (
              <CartItem currentElement = {itemData.item} />
            )} 
        />
     
    </LinearGradient>      
  );
};


export const ScreenOptions  = {
  headerTitle: 'Il tuo carrello'
};

const styles = StyleSheet.create({
  gradient:{
    flex:1,
    justifyContent:'flex-start',
    alignItems:'center'
  },
  screen: {
    margin: 20,
    width:'80%'
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10
  },
  summaryText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18
  },
  amount: {
    color: Colors.primary
  }
});

export default CartScreen;
