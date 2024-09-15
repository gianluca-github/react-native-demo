import React, { useState, useEffect, useCallback } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import { thunk } from 'redux-thunk';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { StyleSheet, AppState} from 'react-native';
import * as cartActions from './store/actions/cart';
import productsReducer from './store/reducer/products';
import cartReducer from './store/reducer/cart';
import ordersReducer from './store/reducer/orders';
import authReducer from './store/reducer/auth';
import notificationReducer from './store/reducer/notifications';
import configReducer from './store/reducer/config';
import usersReducer from './store/reducer/users';

import AppNavigator from './navigation/AppNavigator';

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer,
  notify: notificationReducer,
  config:configReducer,
  users:usersReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);


  const appStateChangeHandler = (appState) => {
    cartActions.clearCart();
  }

  useEffect(() => {
    
    
    const subscription = AppState.addEventListener("change", appStateChangeHandler);
    
  
    async function prepare() {
      try {

        await Font.loadAsync({
          'open-sans': require('./assets/fonts/opensans-regular.ttf'),
          'open-sans-bold': require('./assets/fonts/opensans-bold.ttf'),
          'open-sans-italic': require('./assets/fonts/opensans-italic.ttf')
        });

        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
    return () => {
      subscription.remove();

    };
  }, []);


  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.warn(e);
        }
      }
    }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }


  return (    
      <Provider store={store} >
        <AppNavigator  onLayoutRoot={onLayoutRootView}/>
      </Provider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    width:'90%',
    fontFamily:'open-sans-bold',
    fontSize: 20,
    padding: 8,
    textAlign: 'center',
    color:'#050'
  }
});
