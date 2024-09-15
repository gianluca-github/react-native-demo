import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthCoverScreen, {ScreenOptions as authCoverScreenOptions } from '../../screens/auth/AuthCoverScreen';
import AuthScreen, {ScreenOptions as authScreenOptions } from '../../screens/auth/AuthScreen';
import ResetPasswordScreen, {ScreenOptions as rpScreenOptions } from '../../screens/auth/ResetPasswordScreen';
import { defaultStackNavOptions } from './defaultStackNavOptions';


const AuthStackNavigator = createStackNavigator();
export const AuthNavigator = () => {
  return(
    <AuthStackNavigator.Navigator screenOptions={defaultStackNavOptions} >

      <AuthStackNavigator.Screen
        name="AuthCover"
        component={AuthCoverScreen}
      />

      <AuthStackNavigator.Screen
        name="Auth"
        component={AuthScreen}
        options={authScreenOptions}
      />
      <AuthStackNavigator.Screen
        name="Reset"
        component={ResetPasswordScreen}
        options={rpScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};