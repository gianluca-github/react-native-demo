import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';;
import {createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { MaterialCommunityIcons, MaterialIcons, Entypo, AntDesign } from '@expo/vector-icons';
import { SafeAreaView, View} from 'react-native';
import { defaultStackNavOptions } from './defaultStackNavOptions';
import { defaultDrawerScreenOptions } from './defaultDrawerScreenOptions';

import ProfileScreen, {ScreenOptions as profileScreenOptions } from '../../screens/user-profile/ProfileScreen';
import SettingsPayScreen, {ScreenOptions as settingsPayScreenOptions } from '../../screens/user-profile/SettingPayScreen';
import BriefScreen, {ScreenOptions as briefScreenOptions } from '../../screens/user-profile/BriefScreen';
import CreditsScreen, { ScreenOptions as creditsScreenOptions } from '../../screens/user-profile/CreditsScreen';
import ContactsScreen, {ScreenOptions as contactsScreenOptions } from '../../screens/user-profile/ContactsScreen';

/**
 * Profile Stack
 */
const ProfileStackNavigator = createStackNavigator();
const ProfileNavigator = () => {
  return(
    <ProfileStackNavigator.Navigator screenOptions={defaultStackNavOptions} >
      <ProfileStackNavigator.Screen
        name="ProfiloUtente"
        component={ProfileScreen}
        options={profileScreenOptions}
      />
    </ProfileStackNavigator.Navigator>
  );
};

/**
 * Pay Stack
 */
const SettingsPayStackNavigator = createStackNavigator();
const SettingsPayNavigator = () => {
  return(
    <SettingsPayStackNavigator.Navigator screenOptions={defaultStackNavOptions} >
      <SettingsPayStackNavigator.Screen
        name="Pagamento"
        component={SettingsPayScreen}
        options={settingsPayScreenOptions}
      />
    </SettingsPayStackNavigator.Navigator>
  );
};

/**
 * Brief Stack
 */
 const BriefStackNavigator = createStackNavigator();
 const BriefNavigator = () => {
   return(
     <BriefStackNavigator.Navigator screenOptions={defaultStackNavOptions} >
       <BriefStackNavigator.Screen
         name="StackRiepilogo"
         component={BriefScreen}
         options={briefScreenOptions}
       />
     </BriefStackNavigator.Navigator>
   );
 };

/**
 * Credit Stack
 */
 const CreditsStackNavigator = createStackNavigator();
 const CreditsNavigator = () => {
   return(
     <CreditsStackNavigator.Navigator screenOptions={defaultStackNavOptions} >
       <CreditsStackNavigator.Screen
         name="StackRiconoscimenti"
         component={CreditsScreen}
         options={creditsScreenOptions}
       />
     </CreditsStackNavigator.Navigator>
   );
 };

/**
* Contact Stack
*/
const ContactsStackNavigator = createStackNavigator();
const ContactsNavigator = () => {
  return (
    <ContactsStackNavigator.Navigator screenOptions={defaultStackNavOptions} >
      <ContactsStackNavigator.Screen
        name="Contacts"
        component={ContactsScreen}
        options={contactsScreenOptions}
      />
    </ContactsStackNavigator.Navigator>
  );
};

/**
 * Drawer 
 */
const SettingsDrawerNavigator = createDrawerNavigator();
export const SettingsNavigator = () => {
 
  return( 
    <SettingsDrawerNavigator.Navigator
      initialRouteName="Profilo"
      drawerContent={props => {
        return (<View style={{ flex: 1, padding: 20 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }} >
            <DrawerItemList {...props} />
          </SafeAreaView>
        </View>);
      }}
      screenOptions={defaultDrawerScreenOptions}
    >
     
      <SettingsDrawerNavigator.Screen
        name="Profilo"
        component={ProfileNavigator}
        options={{
          drawerIcon: props => (
            <Entypo
              name= 'user'
              size={22}
              color={props.color}
            />
          )
        }}
      />
      <SettingsDrawerNavigator.Screen
        name="Dati Pagamento"
        component={SettingsPayNavigator}
        options={{
          drawerIcon: props => (
            <MaterialCommunityIcons
              name='transfer-right'
              size={22}
              color={props.color}
            />
          )
        }}
      />
    <SettingsDrawerNavigator.Screen
        name="Riepilogo"
        component={BriefNavigator}
        options={{
          drawerIcon: props => (
            <AntDesign name="tags" size={24} color={props.color}/>
        
          )
        }}
      />

      <SettingsDrawerNavigator.Screen
        name="Riconoscimenti"
        component={CreditsNavigator}
        options={{
          drawerIcon: props => (
            <Entypo
              name='bookmarks'
              size={22}
              color={props.color}
            />
          )
        }}
      />
      <SettingsDrawerNavigator.Screen
        name="Contatti"
        component={ContactsNavigator}
        options={{
          drawerIcon: props => (
            <MaterialIcons
              name="quick-contacts-dialer"
              size={22}
              color={props.color}/>
          )
        }}
      />
      
    </SettingsDrawerNavigator.Navigator>
  );
};
