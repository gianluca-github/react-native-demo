import React from 'react';
import {createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import {FontAwesome5} from '@expo/vector-icons';
import {useSelector} from 'react-redux';
import {ShopNavigator} from './StacksDrawers/ShopNavigation';
import {NotificationNavigator} from './StacksDrawers/NotificationNavigations';
import {SettingsNavigator} from './StacksDrawers/SettingsNavigation';
import {AdminNavigator} from './StacksDrawers/AdminNavigation';

import Mode from '../constants/Mode';
import Colors from '../constants/Colors.js';


const defaultTabOptions = ({ navigation, route, options }) => ({
  headerShown: false,
  tabBarHideOnKeyboard: true,
  tabBarActiveTintColor: Colors.primary,
  tabBarInactiveTintColor: Colors.secondary,
  //tabBarStyle: { position: 'absolute' },
  tabBarIcon: ({ focused, color, size }) => {
    
    switch (route.name) {
      case "TabNotifiche": {
        return <Ionicons name={'notifications'} size={size} color={color} />
      }
      case "ReactNativeDemo": {
        return <FontAwesome5 name={'carrot'} size={size} color={color} />;
      }
      case "Impostazioni": {
        return <Ionicons name={'settings'} size={size} color={color} />
      }
      case "Amministratore": {
       return <FontAwesome5 name={'user-tie'} size={size} color={color} />;
      }
    }
  }
})

const Tab = createBottomTabNavigator();
export const TabBottomNavigator = () => {

  const mode = useSelector( state => state.auth.userData.permissions );
  const modeAuth  = useSelector( state => state.config.data ? state.config.data.ModeAuth : null );
 
  return(
    <Tab.Navigator 
      screenOptions={defaultTabOptions}
      initialRouteName="Notifiche"
      backBehavior="initialRoute"
     >
      
      <Tab.Screen name="TabNotifiche" component={NotificationNavigator} />
      <Tab.Screen name="ReactNativeDemo" component={ShopNavigator} />
      <Tab.Screen name="Impostazioni" component={SettingsNavigator} />
      {(!!modeAuth && mode === modeAuth.val.ADMIN ) &&  <Tab.Screen name="Amministratore" component={AdminNavigator} />}       
    </Tab.Navigator>
  );
}
// i nomi delle screen debbono differire dai nomi delle screen nello stack: 
// TabNotifiche con la prima sceen nello stack