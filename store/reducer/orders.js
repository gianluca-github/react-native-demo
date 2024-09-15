import { ADD_ORDER, SET_ORDERS } from '../actions/orders';
import Order from '../../models/order';

const initialState = {
  orders: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS:
      return {
        orders: action.orders
      };
    case ADD_ORDER:
      const newOrder = new Order(
        action.orderData.id,
        action.orderData.items,
        action.orderData.amount,
        action.orderData.date,
        action.orderData.stateOrder,  // stato dell'ordine: Inviato, In Elaborazione, ... 
        action.orderData.mode
      );
      // inserimento LIFO ultimo in testa
      const updateOrders = [newOrder];
      return {
        ...state,
        orders: updateOrders.concat( state.orders )
      };
  }

  return state;
};
