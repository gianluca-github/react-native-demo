import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NotificationsOverviewScreen from '../../screens/notification/NotificationsOverviewScreen';
import CartScreen, {ScreenOptions as cartScreenOptions } from '../../screens/shop/CartScreen';
import {UserScreenOptions as notificationsScreenOption} from '../../screens/notification/NotificationsOverviewScreen';

import { defaultStackNavOptions } from './defaultStackNavOptions';
import Mode from '../../constants/Mode';

const NotificationStackNavigator = createStackNavigator();
export const NotificationNavigator = () => {
  return(
    <NotificationStackNavigator.Navigator screenOptions={defaultStackNavOptions} >
      <NotificationStackNavigator.Screen
        name="Notifiche"
        component={NotificationsOverviewScreen}
        options={notificationsScreenOption }
        initialParams={{mode:Mode.USER}}
      />
      <NotificationStackNavigator.Screen 
        name="Cart" 
        component={CartScreen}
        options={cartScreenOptions}

    />
    </NotificationStackNavigator.Navigator>
  );
};