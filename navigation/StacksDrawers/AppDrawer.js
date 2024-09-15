import React from 'react';
import {createStackNavigator } from '@react-navigation/stack';
import {createDrawerNavigator, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import {SafeAreaView, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { defaultStackNavOptions } from './defaultStackNavOptions';
import { defaultDrawerScreenOptions } from './defaultDrawerScreenOptions';

import { TabBottomNavigator } from '../TabBottomNavigation';
import ProfileScreen, {ScreenOptions as profileOptionScreen }from '../../screens/user-profile/ProfileScreen';


import Colors from '../../constants/Colors';


const AppStackNavigator = createStackNavigator();
export const AppNavigator = () => {
  return( <AppStackNavigator.Navigator screenOptions={defaultStackNavOptions} >
    <AppStackNavigator.Screen 
        name="TabBottom" 
        // options={{headerTitle:'aaa'}}
        component={TabBottomNavigator}
    />
    <AppStackNavigator.Screen 
        name="Profilo" 
        component={ProfileScreen}
        options={profileOptionScreen}
    />

  </AppStackNavigator.Navigator>
  );
};



const AppDrawerNavigator = createDrawerNavigator();
export const MainNavigator = () => {
  
  return( 
    <AppDrawerNavigator.Navigator
      drawerContent={props => {
        return (<View style={{ flex: 1, padding: 20 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }} >
            <DrawerItemList {...props} />
            
            <DrawerItem
                label="Help"
                onPress={() => { props.navigation.navigate('Profilo') }}

              />
              <DrawerItem
                label="Close"
                onPress={() => {
                  props.navigation.closeDrawer();
              }} 
              />
          </SafeAreaView>
        </View>);
      }}
      screenOptions={defaultDrawerScreenOptions} 
    >
      <AppDrawerNavigator.Screen
        name="App Nav"
        component={AppNavigator}
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
     
    </AppDrawerNavigator.Navigator>
  );
};
