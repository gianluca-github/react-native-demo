import { Alert } from 'react-native';

export const ADD_TO_CART = 'ADD_REMOVE_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const DELETE_FROM_CART = 'DELETE_FROM_CART';
export const CLEAR_CART = 'CLEAR_CART';

export const addToCart = (product, quantity ) =>{

   return { type: ADD_TO_CART, product: product, quantity: quantity };
};
export const removeQuantityFromCart = (productId, quantity) =>{

   return { type: REMOVE_FROM_CART, pid: productId, quantity: quantity  };
};
export const deleteFromCart = (productId ) =>{

   return { type: DELETE_FROM_CART, pid: productId  };
};

/**
 * timer per gestione carrello
 */
 let cartTimer;

/**
 * clearCart
 * @returns 
 */
export const clearCart = () =>{
  
   clearTimeout( cartTimer );
   return { type: CLEAR_CART };
};


/**
 * stopTimeCart
 */
export const stopTimeCart = ()=>{
   clearTimeout( cartTimer );
}


/**
 * checkTimeCart
 * @returns 
 */
const EXIT     = -1;
const INIT     = 0;
const ADVISE   = 1;
const END      = 2;
const STOP     = 3;
//
const TIME_ADVISE = 600000; // 10 min
const TIME_END    = 900000; // 15 min
//
const checkTimeCart = ( actionCheck=INIT )=> {

   return async ( dispatch, getState )=>{
      
      const cart = getState().cart;
      const durationTime = cart.time? Date.now() - cart.time: 0;
      let action = actionCheck;
      let m1 = '';
      let m2 = '';
      //
      switch( actionCheck ){
         case INIT:
            // se il carrello esiste già il controllo è partito all'INIT precedente quindi esco
            action = EXIT;    
            if (!cart.time) {
               // se il carrello non esiste faccio partire il controllo 
               action = ADVISE;
               m1 = 'Attenzione, hai 15 min per concludere i tuoi acquisti!';
            }
            break;
         case ADVISE:
            if (durationTime > TIME_ADVISE ){ // 10 min
               m1 = "Attenzione, hai ancora 5 min per concludere l'acquisto:";
               m2 = "Vai al carrello e concludi l'ordine!";
               action = END;
            }
            break;
         case END:
            if (durationTime > TIME_END ){ // 15 min
               m1 = 'Il tempo per concludere i tuoi acquisti è terminato:';
               m2 = 'Il carrello è stato eliminato!';
               action = STOP;
            }
      }
      if (action === EXIT) return;

      if( m1 !== '') Alert.alert( m1, m2, [{ text: 'Ok' }] );

      if( action === STOP ){
         dispatch( clearCart() ); 
         return;  
      }

      clearTimeout( cartTimer );
      cartTimer = setTimeout(() => { dispatch( checkTimeCart( action ) )}, 60*1000); //1 min 
   }
}
 /**
  * addToCartHandler
  * @param {*} product 
  * @param {*} quantity 
  * @param {*} dispatch 
  */
 export const addToCartHandler =  ( product, quantity ) =>{

   return async ( dispatch )=>{

      Alert.alert(
      "Vuoi aggiungere l'articolo al carrello?",
      '',
      [
         {
            text: 'No',
            style: 'destructive'
         },
         { text: 'Si',
            onPress: () => {
               dispatch( checkTimeCart() );
               dispatch( addToCart(product, quantity) );
            },
            style: 'cancel'
         } 
      ]
      )
   }
 }

/**
 * 
 * @param {*} pid 
 * @returns 
 */
const eraseProductFromCart = ( pid ) =>{
   return async( dispatch, getState )=>{

      dispatch( deleteFromCart( pid ) );
      //getState.cart.items dopo deleteFromCart altrimenti non è aggiornato!
      if( Object.keys( getState().cart.items ).length === 0 ){
         clearTimeout( cartTimer );
      }
   }
}

/**
 * updateCartItemQta
 * @param {*} segno 
 * @param {*} quantity 
 * @param {*} product 
 * @param {*} dispatch 
 * @returns 
 */
export const updateCartItemQta = ( segno, quantity, product, dispatch )=>{

   const qta = segno * product.scaleQta;
   const quota = quantity + qta;
   
   // product.qta  = quantità disponibile
   if( quota > product.qta ){
      Alert.alert( 
      'Hai raggiunto la quantità massima disponibile!', 
      '', 
      [{ text: 'Ok' }] 
      );
      //
      return;
   }
   
   if( quota< product.scaleQta ){
      
      Alert.alert( 
      'Hai raggiunto la quantità minima acquistabile!', 
      'Vuoi Eliminare il prodotto dal carrello?', 
      [
         { text: 'No',style: 'destructive' },
         { 
            text: 'Si',
            style: 'cancel',
            onPress: () => dispatch( eraseProductFromCart(product.id) )
         }
      ]);
      return;
   }
   // dispatch action
   const action = segno>0 
      ? addToCart( product, qta )
      : removeQuantityFromCart( product.id, Math.abs(qta) );

   dispatch(action);
 }
 
//  /**
//  * endTimeCart
//  * @returns 
//  */
// const endTimeCart = ()=>{

//    return async ( dispatch )=>{ 
//       const message ='Il tempo per concludere i tuoi acquisti è terminato:';
//       Alert.alert( message, 'Il carrello è stato eliminato!', [{ text: 'Ok', }] );
//       dispatch( clearCart() );     
//    }
// }

// /**
//  * adviseTimeCart
//  * @returns 
//  */
// const adviseTimeCart = ()=>{
//    return async ( dispatch )=>{ 
//       const message ="Attenzione, hai ancora 5 min per concludere l'acquisto:";
//       Alert.alert( message, "Vai al carrello e concludi l'ordine!", [{ text: 'Ok' }] );     
//       clearTimeout( cartTimer );
//       cartTimer = setTimeout(() => { dispatch( endTimeCart() )}, 300000); //5 min
//    }
// }
// /**
//  * startTimeCart
//  * @returns 
//  */
// const startTimeCart = ()=>{

//    return async ( dispatch, getState )=>{
      
//       const cart = getState().cart;
//       if ( JSON.stringify(cart.items) === '{}') {
//          const message ='Attenzione, hai 15 min per concludere i tuoi acquisti!';

//          Alert.alert( message, '', [{ text: 'Ok' }] ); 
         
//          clearTimeout( cartTimer );
//          cartTimer = setTimeout(() => { dispatch( adviseTimeCart() )}, 600000); //10 min
//       }
//    }
// }
