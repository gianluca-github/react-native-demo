import React, {useRef, useCallback, useEffect } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { NavigationContainer, DefaultTheme} from '@react-navigation/native';
import { AuthNavigator } from './StacksDrawers/AuthNavigations';
import { TabBottomNavigator } from './TabBottomNavigation';
import { SafeAreaView, StyleSheet } from 'react-native';
import * as configActions from '../store/actions/config';
import AppHeader from './AppHeader';
import Colors from '../constants/Colors'


const AppNavigator = props => {
  const navigationRef = useRef(null);
  const dispatch = useDispatch();
  //
  const auth = useSelector( state => state.auth );
  const { token, userData } = auth
  const isAuth = !!token && !!userData;
  const customTheme = {
    //...DefaultTheme,
    colors: {
      primary: Colors.primary,
      background: Colors.bgWhite,
      card: Colors.bgWhite,
      text: Colors.primary,
      border: Colors.bgWhite,
      notification: Colors.secondary
    }
  }

  /**
   * loadConfing
   */
  const loadConfig = useCallback( async () => {
    try{     
      await dispatch( configActions.fetchConfigData() );   

    } catch( e ) {
        alert("Error Init ", e.message, [{text:'Ok'}]);
    }
  }, [dispatch, token]);

  return (
    <SafeAreaView style={styles.container} onLayout={props.onLayoutRoot} >
      <NavigationContainer >  
        {!isAuth  && <AuthNavigator />} 
      </NavigationContainer>
    
      {isAuth && (
        <NavigationContainer 
          ref ={navigationRef}
          onReady={() => { loadConfig(); }}
          theme={customTheme}
         >
          <AppHeader navRef={navigationRef}/> 
          <TabBottomNavigator />
        </NavigationContainer> )
      }

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default AppNavigator;
