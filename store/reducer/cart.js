import CartItem from '../../models/cart';
import {ADD_ORDER} from '../actions/orders';
import {
   ADD_TO_CART,
   REMOVE_FROM_CART,
   DELETE_FROM_CART,
   CLEAR_CART
} from '../actions/cart';

const initialState = {
    items:{},
    totalAmount: 0,
    time:null
};

export default (state = initialState, action) => {
   switch(action.type){
      case ADD_TO_CART:
         const product = action.product;
         const quantity = action.quantity;
         const prodPrice = product.price;
         const prodTitle = product.title;
         const sum = (prodPrice*quantity); // la quantità può essere anche negativa

         let upadteOrNewCartItem;
         if (state.items[product.id]) {
            upadteOrNewCartItem = new CartItem(
               state.items[product.id].quantity + quantity,
               prodPrice,
               prodTitle,
               state.items[product.id].sum + sum
            );
         }
         else {
            upadteOrNewCartItem = new CartItem( quantity, prodPrice, prodTitle, sum );
         }
         
         const updateTime = Object.keys( state.items ).length === 0 ? Date.now(): state.time;
         return {  
            ...state,
            items:{ ...state.items, [product.id]:upadteOrNewCartItem},
            totalAmount : state.totalAmount + sum,
            time: updateTime
         }
      case REMOVE_FROM_CART:
         const selCartItem = state.items[action.pid];
         const qtaRemove = action.quantity;
         const sumPrice = (selCartItem.productPrice*qtaRemove);
         
         let updateCartItems;
         if( selCartItem.quantity > qtaRemove ){
            const updateCartItem = new CartItem(
               selCartItem.quantity-qtaRemove,
               selCartItem.productPrice,
               selCartItem.productTitle,
               selCartItem.sum - sumPrice
            );

            updateCartItems = { ...state.items, [action.pid]:updateCartItem };
         }
         else{
            updateCartItems = { ...state.items };
            delete updateCartItems[action.pid];
         }
         
         return {
            ...state,
            items: updateCartItems,
            totalAmount: Math.abs(  state.totalAmount - sumPrice )
         }
      case DELETE_FROM_CART:
         if( !state.items[action.pid] ){
            return state;
         }

         const updateItems = { ...state.items };
         const itemSum = updateItems[action.pid].sum;
         delete updateItems[action.pid];

         // cart vouto 
         if( Object.keys(updateItems).length===0 ){
            return initialState;
         }
         //  
         return {
            ...state,
            items: updateItems,
            totalAmount : state.totalAmount - itemSum
         }
      // add order => clear the cart ;) !!!!
      case ADD_ORDER:
      case CLEAR_CART:
         return initialState;
      default:
         return state;

   }
};