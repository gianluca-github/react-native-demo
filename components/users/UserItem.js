import React from 'react';
import {useSelector} from 'react-redux'
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from 'react-native';

import Card from '../UI/Card';
import Colors from '../../constants/Colors';
import * as globalFunc from '../../constants/Globalfunc'


const UserItem = props => {
  const config = useSelector( state => state.config.data );
  const modeAuth = config.ModeAuth;
  let TouchableCmp = TouchableOpacity;
 
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    /* <View> TouchableNativeFeedback Only expected a child!  */
    TouchableCmp = TouchableNativeFeedback;
  }
  
  const {userData} = props; 
  const prepaid = globalFunc.isset( userData.prepaid )? +userData.prepaid : 0.0; 
  const piva = globalFunc.isset(userData.piva) && userData.piva!=="" ?  'P.Iva: ' + userData.piva+'\n' : '';
  
  return( 
      <Card style={{ margin:10, backgroundColor:userData.deleted? Colors.disabled: Colors.bgWhite }}>
        <View style={styles.touchable}>
          <TouchableCmp onPress={props.onSelect} useForeground >
            <View style={{flex:1, margin:10}} > 
             <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                <Text style={styles.note} >{ modeAuth.desc[userData.permissions]}</Text>
              </View>

              <View style={styles.summary}>
                <Text style={styles.name}>{userData.nome} {userData.cognome}</Text>
              </View>

              <View style={styles.summary}>
                <Text style={styles.textMain}> 
                  
                  Via {globalFunc.substituteDot(userData.via, 12)} n. {userData.nciv} {'\n'} 
                  {userData.cap}  {globalFunc.substituteDot(userData.citta, 12)}   ({userData.provincia}){'\n'}
                  {userData.email} 
                </Text> 
               
                <Text style={styles.textMain}> 
                  {userData.cf}{'\n'}
                  {piva}
                  Tel: {userData.telefono} {'\n'}  
                </Text> 
              </View>
              
              
              <View style={styles.summary }>
                <View style={{justifyContent:'space-between'}}>
                  <Text style={styles.text}> Credito Residuo </Text>
                  <Text style={styles.textMain}> {prepaid.toFixed(2)} € </Text> 
                  </View>
                {props.children}
              </View>

            </View>
          </TouchableCmp>
        </View>
      </Card>

  ) 
};

const styles = StyleSheet.create({
  card: {
    margin: 20,
    padding: 10
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden'
  },
  summary:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin:10
  },
  container: {
    flex:1,
    justifyContent:'flex-start',
    paddingHorizontal:10,
  },
  name: {
    fontSize: 15,
    color: Colors.secondary,
    fontWeight:'bold',
  },
  note:{
    fontFamily: 'open-sans',
    fontSize:14,
    color:Colors.date,
  },
  text:{
    fontFamily: 'open-sans-bold',
    fontSize:14,
    color:Colors.secondary,
  },
  textMain:{
    fontFamily: 'open-sans',
    fontSize:14,
    color:'black',
  }
});

export default UserItem;
