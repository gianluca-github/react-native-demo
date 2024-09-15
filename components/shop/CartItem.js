import React from 'react';
import {useSelector, useDispatch} from 'react-redux'
import { Alert } from 'react-native';
import Card from '../UI/Card';
import ProductDetail from './ProductDetail';
import * as cartActions from '../../store/actions/cart';


const CartItem = props => {
  // elemento del carrello
  const {
    currentElement,
    style
  } = props; 
  // sono i valori del Cart
  const productId = currentElement.productId;
  const quantity = currentElement.quantity;
  const title = currentElement.productTitle;
  const sum = currentElement.sum;
  const product = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id === productId)
  );
  

  const dispatch = useDispatch();

  return (
    <Card style={{...{paddingVertical:10, marginBottom:10}, ...style }}>
     
      <ProductDetail 
        style={{ marginBottom:5, width:'100%'}}
        short
        description = {title}
        unit = {product.unit}
        value = {quantity}
        amount = {sum}
        action
        onAdd = {()=>cartActions.updateCartItemQta(+1, quantity, product, dispatch )}
        onSub = {()=>cartActions.updateCartItemQta(-1, quantity, product, dispatch )}
        // price = {product.price}
        // qta = {product.qta}
        // cool = {product.cool}
        // label = 'Quantità'
      />

    </Card>
    
  );
};

export default CartItem;