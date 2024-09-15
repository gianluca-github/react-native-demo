import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import { Button } from 'react-native-elements'
import { useSelector, useDispatch} from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import ProductDetail from '../../components/shop/ProductDetail';
import * as cartActions from '../../store/actions/cart';
import * as glbFunc from '../../constants/Globalfunc';

const ProductDetailScreen = props => {
  const dispatch = useDispatch();
  const productId = props.route.params.productId;
  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id == productId)
  );

  const cartItem = useSelector( state => state.cart.items[productId] );
  const scaleQta = glbFunc.isset(selectedProduct.scaleQta)?selectedProduct.scaleQta:1.0;
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : scaleQta);

  /**
   * modifiche del cartItem su variabile State quantity
   */
  useEffect(()=>{
    if( cartItem ){
      setQuantity( cartItem.quantity );
    }

  },[cartItem]);

  /**
  * actionHandler
  */
  const actionHandler = ( ) => {
    if( cartItem ){
      props.navigation.navigate( 'Cart' );
    }else{
      dispatch (cartActions.addToCartHandler( selectedProduct, quantity ));
    }
  }
  /**
   * setQtaHandler
   * @param {*} segno 
   * @returns 
   */
  const setQtaHandler = ( segno )=>{
    const qta = quantity + (segno*selectedProduct.scaleQta);
    let message = ''; 
    if( qta > selectedProduct.qta ){
      message = 'Hai raggiunto la quantità massima disponibile!';
    }
    else if( qta < selectedProduct.scaleQta ){
      message = 'Hai raggiunto la quantità minima acquistabile!';
    }

    if( message!='' ){
      Alert.alert( message, '', [{ text: 'Ok' }] );
      return;
    }

    setQuantity( qta );
  }

  /**
   * quantityHandler
   * @param {*} segno 
   */
  const quantityHandler =( segno )=>{
    if( cartItem ){
       cartActions.updateCartItemQta( segno, cartItem.quantity, selectedProduct, dispatch );
    }else{
      setQtaHandler( segno );
    }
  }
  

  return (
    <ScrollView style={styles.view}>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <ProductDetail 
        style={{ width:'100%', marginBottom:25}}
        description = {selectedProduct.title}
        price = {selectedProduct.price}
        unit = {selectedProduct.unit}
        qta = {selectedProduct.qta}
        cool = {selectedProduct.cool}
        label = 'Quantità'
        value = {quantity}
        //action = {!(!!cartItem)}
        action
        onAdd = {()=>quantityHandler(+1)}
        onSub = {()=>quantityHandler(-1)}
      />
      
        <View style={styles.actions}>
          <Button 
              buttonStyle={{backgroundColor:Colors.primary, borderRadius:10}}
              titleStyle={{color:'white'}}
              title={cartItem? "Vai al carrello" :"Aggiungi al carrello" }
              onPress={actionHandler} />

        </View>
    </ScrollView>
  );
};

export const ScreenOptions = navHandle => {
  return {
    headerTitle: navHandle.route.params.productTitle,
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton} >
        <Item
          title="Carrello"
          iconName={'cart'}
          onPress={()=>{
            navHandle.navigation.navigate('Cart');
          } }
        />
      </HeaderButtons>
    ),
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton} >
        <Item
          title="Indietro"
          iconName={'arrow-back-outline'}
          onPress={() =>{
            navHandle.navigation.navigate('ProductOverview', {reload:false })
          }}
        />
      </HeaderButtons>
    ),

  };
};

const styles = StyleSheet.create({
  view:{
    backgroundColor:Colors.beige,
  },
  image: {
    width: '100%',
    height: 300
  },
  updateQta: {
    width:'40%',
    flexDirection:'row',
    justifyContent:'space-between',
    alignSelf:'center',
    marginTop:2,
    marginBottom:30
  },
  actions: {
    marginVertical: 20,
    alignItems: 'center',
  },
  description: {
    fontFamily:'open-sans-italic',
    fontSize: 18,
    textAlign: 'center',
    marginVertical : 10
  },
  info: {
    fontSize: 16,
    color: Colors.info,
    textAlign: 'center',
    marginVertical: 5
  },
  cool:{
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.secondary,
    textAlign: 'center',
    marginTop: 12,
  }
});

export default ProductDetailScreen;
