import React from 'react';
import {createStackNavigator } from '@react-navigation/stack';
import {createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import {Entypo} from '@expo/vector-icons';
import {FontAwesome5} from '@expo/vector-icons';
import {SafeAreaView, View} from 'react-native';

import ProductOverviewScreen  from '../../screens/shop/ProductOverviewScreen';
import {AdminScreenOptions as productsScreenOption } from '../../screens/shop/ProductOverviewScreen';
import EditProductScreen, {ScreenOptions as editProductScreenOptions } from '../../screens/admin/EditProductScreen';

import NotificationsOverviewScreen from '../../screens/notification/NotificationsOverviewScreen';
import {AdminScreenOptions as notificationsScreenOption} from '../../screens/notification/NotificationsOverviewScreen';
import EditNotificationScreen, {ScreenOptions as editNotificationScreenOptions } from '../../screens/admin/EditNotificationScreen';

import UsersOverviewScreen, {ScreenOptions as usersScreenOptions } from '../../screens/admin/UsersOverviewScreen';
import EditUserScreen, {ScreenOptions as editUserScreenOptions } from '../../screens/admin/EditUserScreen';
import { defaultStackNavOptions } from './defaultStackNavOptions';

import Colors from '../../constants/Colors';
import Mode from '../../constants/Mode';

const ProductsStackNavigator = createStackNavigator();
const ProductsNavigator = () => {
  return(      
    <ProductsStackNavigator.Navigator screenOptions={defaultStackNavOptions} >
      <ProductsStackNavigator.Screen
        name="AdminProducts"
        component={ProductOverviewScreen}
        options={productsScreenOption}
        initialParams={{ mode:Mode.ADMIN, reload:true }}
      />
      <ProductsStackNavigator.Screen
        name="EditAdminProduct"
        component={EditProductScreen}
        options={editProductScreenOptions}
      />
    </ProductsStackNavigator.Navigator>
  );
};

const NotificationsStackNavigator = createStackNavigator();
const NotificationsNavigator = () => {
  return(
    <NotificationsStackNavigator.Navigator screenOptions={defaultStackNavOptions} >
      <NotificationsStackNavigator.Screen
        name="AdminNotifications"
        component={NotificationsOverviewScreen}
        options={notificationsScreenOption}
        initialParams={{mode:Mode.ADMIN}}
      />
      <NotificationsStackNavigator.Screen
        name="EditAdminNotification"
        component={EditNotificationScreen}
        options={editNotificationScreenOptions}
      />
    </NotificationsStackNavigator.Navigator>
  );
};

const UsersStackNavigator = createStackNavigator();
const UsersNavigator = () =>{
  return(
    <UsersStackNavigator.Navigator screenOptions={defaultStackNavOptions} >
      <UsersStackNavigator.Screen
        name="Users"
        component={UsersOverviewScreen}
        options={usersScreenOptions}
      />
      <UsersStackNavigator.Screen
        name="EditUser"
        component={EditUserScreen}
        options={editUserScreenOptions}
      />
     
    </UsersStackNavigator.Navigator>
  );
};


const AdminDrawerNavigator = createDrawerNavigator();
export const AdminNavigator = () => {
  return( 
    <AdminDrawerNavigator.Navigator
      drawerContent={props => {
        return (<View style={{ flex: 1, padding: 20 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }} >
            <DrawerItemList {...props} />
          </SafeAreaView>
        </View>);
      }}
      screenOptions={{
        headerShown:false,
        drawerActiveTintColor: Colors.primary,
        labelStyle: {
          fontFamily: 'open-sans',
          fontSize: 16
        }
      }}
    >
      <AdminDrawerNavigator.Screen
        name="Prodotti"
        component={ProductsNavigator}
        options={{
          drawerIcon: props => (
            <FontAwesome5
              name='leaf'
              size={22}
              color={props.color}
            />
        )  
      }} />
      <AdminDrawerNavigator.Screen
        name="Notifiche"
        component={NotificationsNavigator}
        options={{
          drawerIcon: props => (
            <Entypo
              name='notification'
              size={22}
              color={props.color}
            />
        )
      }} />
    <AdminDrawerNavigator.Screen
        name="Utenti"
        component={UsersNavigator}
        options={{
          drawerIcon: props => (
            <Entypo
              name='users'
              size={22}
              color={props.color}
            />
        )
      }} />
    </AdminDrawerNavigator.Navigator>
  );
};
