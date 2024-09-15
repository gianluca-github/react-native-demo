import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import {Ionicons} from '@expo/vector-icons';
import {Foundation} from '@expo/vector-icons';
import {SafeAreaView, View} from 'react-native';
import { defaultStackNavOptions } from './defaultStackNavOptions';
import { defaultDrawerScreenOptions } from './defaultDrawerScreenOptions';

import ProductOverviewScreen from '../../screens/shop/ProductOverviewScreen';
import {UserScreenOptions} from '../../screens/shop/ProductOverviewScreen';
import ProductDetailScreen, {ScreenOptions as productDetailScreenOptions } from '../../screens/shop/ProductDetailScreen';
import CartScreen, {ScreenOptions as cartScreenOptions } from '../../screens/shop/CartScreen';
import PurchaseScreen, {ScreenOptions as purchaseScreenOptions } from '../../screens/shop/PurchaseScreen';
import OrdersScreen, {ScreenOptions as orderScreenOptions }  from '../../screens/shop/OrderScreen';


import Colors from '../../constants/Colors';
import Mode from '../../constants/Mode';


const ProductsStackNavigator = createStackNavigator();
export const ProductsNavigator = () => {
  return( <ProductsStackNavigator.Navigator screenOptions={defaultStackNavOptions} >
    <ProductsStackNavigator.Screen 
        name="ProductOverview" 
        component={ProductOverviewScreen}
        options={UserScreenOptions}
        initialParams={{ mode: Mode.USER, reload:true} }
    />
    <ProductsStackNavigator.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={productDetailScreenOptions}

    />
    <ProductsStackNavigator.Screen 
        name="Cart" 
        component={CartScreen}
        options={cartScreenOptions}

    />
    <ProductsStackNavigator.Screen 
        name="Purchase" 
        component={PurchaseScreen}
        options={purchaseScreenOptions}
        
    />
      
  </ProductsStackNavigator.Navigator>
  );
};

const OrdersStackNavigator = createStackNavigator();
export const OrdersNavigator = () => {
  return(
    <OrdersStackNavigator.Navigator screenOptions={defaultStackNavOptions} >
      <OrdersStackNavigator.Screen
        name="Orders"
        component={OrdersScreen}
        options={orderScreenOptions}
      />
    </OrdersStackNavigator.Navigator>
  );
};



const ShopDrawerNavigator = createDrawerNavigator();
export const ShopNavigator = () => {
  //const dispatch = useDispatch();
  
  return( 
    <ShopDrawerNavigator.Navigator
      drawerContent={props => {
        return (<View style={{ flex: 1, padding: 20 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }} >
            <DrawerItemList {...props} />
              {/* <Button title='Esci' color={Colors.secondary} onPress={() => {
                dispatch(actionsAuth.logout());
              }} /> */}
          </SafeAreaView>
        </View>);
      }}
      screenOptions={defaultDrawerScreenOptions}
    >
      <ShopDrawerNavigator.Screen
        name="Prodotti"
        component={ProductsNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={'cart'}
              size={23}
              color={props.color}
            />
          )
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Ordini"
        component={OrdersNavigator}
        options={{
          drawerIcon: props => (
            <Foundation
              name='book-bookmark'
              size={23}
              color={props.color}
            />
          )
        }}
      />
     
    </ShopDrawerNavigator.Navigator>
  );
};
