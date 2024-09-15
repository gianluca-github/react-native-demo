import React from 'react';
import { View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Dimensions
} from 'react-native';

import Card from '../UI/Card';
import Colors from '../../constants/Colors';
import Mode from '../../constants/Mode';

const NotificationItem = props => {
  let TouchableCmp = TouchableOpacity;
 
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    /* <View> TouchableNativeFeedback Only expected a child!  */
    TouchableCmp = TouchableNativeFeedback;
  }
  

const content = (
  <View style={styles.touchable}>
    <TouchableCmp onPress={props.onSelect} useForeground >
      <View style={styles.cover}> 

        <View style={styles.summary}>
          <Text style={styles.date}>{props.date}</Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.title}> {props.title} </Text> 
          <Text style={styles.text}> {props.description} </Text> 
        </View>

      </View>
    </TouchableCmp>
  </View> );

  if( props.mode == Mode.USER )
  {
    return (
      <Card style={styles.card}>
        {content}
      </Card>
    );
  }
 
  return( 

    <View style={{ flexDirection: 'row', justifyContent: 'center', width: Dimensions.get('window').width, marginVertical:10 }}>

      <Card style={{  padding: 10, width:'75%'}}>
          {content}
      </Card>

      <Card style={{ width: '20%', marginLeft:3 }}>
        <View style={{ flex:1, justifyContent:'center', alignItems:'center'}}>
          {props.children}
        </View>
      </Card>

    </View>
  ) 
};

const styles = StyleSheet.create({
  card: {
    margin: 20,
    padding: 10,
    minHeight:200
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden'
  },
  cover: {
    maxWidth: '100%',
  },
  summary:{
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10
  },
  date: {
    fontSize: 14,
    fontFamily: 'open-sans',
    color: Colors.date
  },
  container: {
    flex:1,
    justifyContent:'flex-start',
    minHeight:100,
    width:'100%',
  },
  title:{
    fontFamily: 'open-sans-bold',
    fontSize:15,
    color:Colors.secondary,
    marginVertical:10,
  },
  text:{
    fontFamily: 'open-sans',
    fontSize:14,
    color:Colors.text,
  }
});

export default NotificationItem;
