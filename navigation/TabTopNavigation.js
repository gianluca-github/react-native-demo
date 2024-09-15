import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector} from 'react-redux';

// import { useDispatch } from 'react-redux';
// import { FontAwesome } from '@expo/vector-icons';
// import {Button} from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';

import {AdminNavigator} from './StacksDrawers/Navigation';
import Mode from '../constants/Mode';

import ProfileScreen, {ScreenOptions as profileScreenOptions }  from '../screens/user/ProfileScreen';

import Colors from '../constants/Colors.js';

//import * as actionsAuth from '../store/actions/auth';

const defaultTabOptions =  ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName = 'create';
  
    if( route.name ==="Amministratore" && focused){
      iconName = 'trash'
    }
    
    // You can return any component that you like here!
    return <Ionicons name={iconName} size={size} color={color} />;
  }
})


const Tab = createMaterialTopTabNavigator();
export const TabTopNavigator = () => {

  const mode = useSelector( state => state.auth.userData.permissions );
  const modeAuth  = useSelector( state => state.config.data );

  return(
    <Tab.Navigator 
      screenOptions={defaultTabOptions} 
      backBehavior="order"
      screenOptions={{
        activeTintColor: Colors.primary,
        inactiveTintColor: Colors.secondary,
        showIcon: true, 
        indicatorStyle: { backgroundColor:Colors.primary },
        tabStyle: { marginTop:5 },
        labelStyle: {fontSize: 14, textTransform:'none'},

      }}
     // initialLayout= {{ width: Dimensions.get('window').width }}
     >

      {(mode === modeAuth.val.ADMIN ) &&  <Tab.Screen name="Amministratore" component={AdminNavigator} />}


      <Tab.Screen name="Profilo" component={ProfileScreen}  />

    </Tab.Navigator>
  );
}



// const Tab = createBottomTabNavigator();
// export const TabAppNavigator = () => {
//   return(
//     <Tab.Navigator 
//       screenOptions={defaultTabOptions} 
//       tabBarOptions={{
//         activeTintColor: Colors.primary,
//         inactiveTintColor: Colors.secondary,
//       }}
//      >

//       <Tab.Screen name="Notifiche" component={NotificationNavigator} />
//       <Tab.Screen name="Negozio" component={ShopNavigator} />
//       <Tab.Screen name="Esci" component={Dummy} 
//         options={{
//           tabBarButton: () => (<QuitBtn />)
//         }}
//       />
      
//     </Tab.Navigator>
//   );
// }
// const Dummy = () => {
//   return null
// }

// const QuitBtn = () =>{
//   const dispatch = useDispatch();

//   /**
//    * exitFunc
//    * @param {*} dispatch 
//    */
//   const exitFunc = (dispatch ) =>{

//     Alert.alert('Sei Sicuro di vole uscire?','',[
//       { text:'No', style:'default'},
//       { 
//         text:'Si', style:'destructive',
//         onPress: ()=>{ dispatch( actionsAuth.logout() ) }
//       }]
//     );
//   }

//   return(
//     <Button
      
//     title="Esci"
//     buttonStyle ={{backgroundColor:'white'}} 
//     titleStyle = {{color:Colors.primary, marginHorizontal:10}}
      
//       onPress={ ()=>{exitFunc( dispatch )} }
//     />
//   );
// };