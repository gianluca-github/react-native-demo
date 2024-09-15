import React from 'react';
import {createStackNavigator } from '@react-navigation/stack';
import { defaultStackNavOptions } from './defaultStackNavOptions';
import Logout from '../../screens/Logout';


const LogoutStackNavigator = createStackNavigator();
export const LogoutNavigator = () => {
  return(
    <LogoutStackNavigator.Navigator screenOptions={defaultStackNavOptions} >
      <LogoutStackNavigator.Screen
        name="Logout"
        component={Logout}
        options={
          {tabBarLabel:'Logout'}
        }
      />
    </LogoutStackNavigator.Navigator>
  );
};