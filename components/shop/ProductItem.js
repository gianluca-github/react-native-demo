import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Card from '../UI/Card';

const ProductItem = props => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  /** Set to true to add the ripple effect to the foreground of the view, 
   * instead of the background */

  return (
    <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: props.imageUrl }} />
            </View>
            <View style={styles.details}>
              <Text style={styles.title} >{props.title} </Text>
              <Text style={styles.info}>
                € {props.price.toFixed(2)} a {props.unit }
              </Text>
              <Text style={styles.info}> Disponibilità: {props.qta.toFixed(2)} {props.unit}
              </Text>
              {props.cool && 
              <Text style={styles.cool}> 
                fresco <FontAwesome5 name="leaf" size={12} color={Colors.primary}/>
              </Text> }
            </View>
            <View style={{...styles.actions, ...props.styleActionPosition} }>
              {props.children}
            </View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    height: 360,
    margin: 20
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden'
  },
  imageContainer: {
    width: '100%',
    height: '56%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  details: {
    alignItems: 'center',
    height: '30%',
    paddingHorizontal: 10,
    paddingVertical:4
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
    marginVertical: 4
  },
  info: {
    fontFamily: 'open-sans',
    fontSize: 14,
    color: '#888',
    marginVertical:2
  },
  cool: {
    fontFamily: 'open-sans-bold',
    fontSize: 12,
    color: Colors.secondary,
    marginTop:2,
    marginBottom:10
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '14%',
    paddingHorizontal: 20
  }
});

export default ProductItem;
