import React from 'react';
import {View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';


const TextLabel = props =>{

  const {
    horizontal,
    label,
    children,
    style,
    labelStyle,
    textStyle
  } = props; 
 
  const builtLabelStyle = {
      ...styles.label,
      ...(horizontal? styles.labelHorizSpace : styles.labelVertSpace),
      ...labelStyle
    }
  return (
      <View style={{...(horizontal? styles.horizontal : styles.vertical), ...style }} >
        <Text style={builtLabelStyle}>
          {label}
        </Text>
        <Text style={{...styles.testo, ...textStyle} }>{children}</Text>
      </View>
  )
};

const styles = StyleSheet.create({
  vertical:{
    width:'100%',
    height:70,  
    borderBottomColor: Colors.border,
    borderBottomWidth:1
  },
  horizontal:{
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems:'flex-start',
    width:'100%',
    height:25
  },
  label: {
    fontFamily: 'open-sans-bold',
    color:Colors.secondary
  },
  labelVertSpace:{
    marginTop: 20,
    marginBottom:4
  },
  labelHorizSpace:{
    marginHorizontal:5
  },
  testo:{
    paddingHorizontal: 2,
    color: Colors.disabled,
    fontFamily: 'open-sans'
  }
});


export default TextLabel;