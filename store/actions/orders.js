import Order from '../../models/order';
import DbLink from '../../constants/DbLink';
import * as globalFunc from '../../constants/Globalfunc';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';


export const fetchOrders = () => {

  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const stateOrder = getState().config.data.StateOrder;
    const modeOrder = getState().config.data.ModeOrder;

    const modeBase = { 
        delivery: modeOrder.delivery.SEDE, 
        payment:modeOrder.payment.CACHE,
        document: modeOrder.document.RICEVUTA
      }

    try {
      const response = await fetch(
        `${DbLink.ENDPOINT}/orders/${userId}.json?auth=${token}`
      );
      
      if( !response.ok )
      {
        const errJson = await response.json();
        let message = 'Errore Caricamento Ordini: ' + errJson.error.message;
        throw new Error(message);
      }

      const resData = await response.json();
      const loadOrders = [];
   
      for( const key in resData ){
        // Only to the orders didn't have state and mode 
        const state = globalFunc.isset( resData[key].state ) ? resData[key].state : stateOrder[0];
        const mode = globalFunc.isset( resData[key].mode ) ? resData[key].mode : modeBase;
        // loadOrders.unshift() non è affidabile: push e sort ;)
        loadOrders.push(new Order(
          key,
          resData[key].cartItems,
          resData[key].totalAmount,
          // resData[key].date is string, i need a object
          new Date( resData[key].date ),
          state,
          mode
        ));
      }
      // riordino per data decrescente: 
      loadOrders.sort((a,b)=> 
          a.date < b.date ? 1 : -1
      );
      dispatch({type: SET_ORDERS, orders:loadOrders});
    } 
    catch(err){
      throw err;
    }
  }
};

export const addOrder = (cartItems, totalAmount, mode ) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const stateOrder = getState().config.data.StateOrder;

    const date = new Date();
    const response = await fetch(
      `${DbLink.ENDPOINT}/orders/${userId}.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString(),
          state: stateOrder[0],
          mode: mode
        })
      }
    );

    if (!response.ok) {
      const errJson = await response.json();
      let message = "Errore nell'insermento dell'ordine!: " + errJson.error.message;
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch({
      type: ADD_ORDER, //clear Cart in reducer cart.js
      orderData: {
        id: resData.name,
        items: cartItems,
        amount: totalAmount,
        date: date,
        stateOrder: stateOrder[0],
        mode: mode
      }
    });
  };
};