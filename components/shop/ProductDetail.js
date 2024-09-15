import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const ProductDetail = props =>{
  
  return(
    <View style={{ ...styles.mainview, ...props.style}}>
      <View style={{ marginVertical:5}}>
          <Text style={{...styles.fontbase, ...styles.description}}>{props.description}</Text>
          {!props.short &&
            <React.Fragment>
              <Text style={{...styles.fontbase, ...styles.info}}>€ {props.price.toFixed(2)} a {props.unit}</Text>
              <Text style={{...styles.fontbase, ...styles.info}}>Disponibilità {props.qta.toFixed(2)} {props.unit}</Text>
            </React.Fragment>}
      </View>
      <View style={{ alignSelf:'center',width:'50%'}}>

        {props.label &&
          <View>
            <Text style={{...styles.fontbase, ...styles.label}}>{props.label}</Text>
          </View>}

        <View style={styles.middleView}>
          {props.action && 
            <Button
              buttonStyle={{backgroundColor:Colors.secondary}}
              icon={ 
                <FontAwesome5
                  name= "minus"
                  size = {12}
                  color= "white"
                />
              }
              onPress={props.onSub} />}
          
          <Text style={{...styles.fontbase, ...styles.value}}>{props.value.toFixed(2)} {props.unit}</Text>
          {props.action && 
            <Button
              buttonStyle={{backgroundColor:Colors.secondary}}
              icon={ 
                <FontAwesome5
                  name= "plus"
                  size = {12}
                  color= "white"
                />
              }
              onPress={props.onAdd} /> }  
        </View>
        {props.cool && 
          <View>
            <Text style={styles.cool}>
              Prodotto Fresco <FontAwesome5 name="leaf" size={12} color={Colors.primary}/>
            </Text> 
          </View>}
        {props.amount && 
          <View>
            <Text style={{...styles.fontbase, ...styles.amount}}>costo € {props.amount.toFixed(2)}</Text>
          </View>}

      </View>
    </View>  
  )
}

const styles = StyleSheet.create({
  fontbase:{
    fontFamily:'open-sans-bold',
    fontSize: 14,
    textAlign: 'center',
    color:Colors.text
  },
  mainview:{
    alignSelf:'center',
  },
  middleView:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignSelf:'center',
    marginVertical:2
  },
  description: {
    fontSize: 16,
    marginVertical : 5
  },
  info: {
    color: Colors.info,
    marginVertical: 5
  },
  label:{
    marginVertical:5
  },
  value: {
    fontFamily:'open-sans',
    fontSize: 16,
    marginVertical: 5,
    paddingHorizontal:20
  },
  cool:{
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.secondary,
    marginTop: 20,
  },
  amount: {
    color:Colors.primary,
    marginTop:5
  }
});

export default ProductDetail;