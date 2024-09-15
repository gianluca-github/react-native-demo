import React, {useState} from 'react';
import {Text, StyleSheet} from 'react-native';
import { Button } from 'react-native-elements'
import Card from './Card';
import Hr from './Hr';
import Colors from '../../constants/Colors'


const Advice = props =>{
const [show, setShow] = useState(true);

if( show ){
    return( 
      <Card style={styles.container}>
        <Text style={{...styles.text, ...props.styleText}}>{props.text}</Text>
        <Hr style={{width:'80%', marginVertical:20}}/>
       
          <Button 
            buttonStyle={{backgroundColor:Colors.primary, borderRadius:10}}
            titleStyle={{color:'white', fontSize:14}}
            title={"OK" }
            onPress={()=>setShow(prev=>!prev)} />
      </Card>
    );
  }
  else{
    return null;
  }

}

const styles= StyleSheet.create({

  container:{
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center',
    top:'40%',
    width:'60%', 
    padding:20
  },
  text: {
    color:Colors.primary,
  }
});

export default Advice;
