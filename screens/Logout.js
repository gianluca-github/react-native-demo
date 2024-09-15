import React from 'react';
import {
  View, 
  StyleSheet,
  Text
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useDispatch } from 'react-redux';
import { Button } from 'react-native-elements';

import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/Colors';
import * as actionsAuth from '../store/actions/auth';

const Logout = props => {
  const dispatch = useDispatch();
  return (
    <LinearGradient colors={[Colors.gradient,Colors.primary]} style={styles.view}>
      <Text style={styles.text}> Sei sicuro di voler Uscire? </Text>
       <Button
    
          buttonStyle = {styles.button}
          titleStyle = {{color:Colors.secondary, marginHorizontal:10}}
          icon={
            <Icon
              name="sign-out"
              size={22}
              color={Colors.primary}
            />
          }
          onPress={() => {
            dispatch(actionsAuth.logout());
          }}
          iconRight
          title="Esci"
        />

    </LinearGradient>
  )

}

const styles = StyleSheet.create({
  view:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: Colors.primary,
    height:400
  },
  text:{
    fontFamily:'open-sans-bold',
    fontSize:20,
    marginVertical:40,
    color:'white',
    width:'70%',
    textAlign:'center'
  },
  button:{
    width:100, 
    height:50, 
    backgroundColor:'white',
    borderRadius: 10
  }
})

export default Logout