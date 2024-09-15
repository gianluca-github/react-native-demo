import React from 'react';
import {View, StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';


const Hr = props =>{
  return <View style={{...styles.hr, ...props.style}}/>
}


const styles = StyleSheet.create({

  hr:{
    borderBottomColor: Colors.secondary,
    borderBottomWidth: 1,
    marginVertical:8,
    alignSelf:'center',
    width:'50%'
  }
})

export default Hr;