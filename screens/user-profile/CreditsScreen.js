import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image,
  Dimensions
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { LinearGradient } from 'expo-linear-gradient';

import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import Card from '../../components/UI/Card';

const CreditisScreen = props => {

  const h = Dimensions.get('window').height * .13;
  return(

    <LinearGradient colors={[Colors.gradient,Colors.primary]} style={styles.gradient}>
       
      <Card style={styles.card} >
        <View style={{ flexGrow:1, alignItems:'center', justifyContent:'space-between'}}> 
          <Text style={{fontSize:18, fontWeight:'bold', color:Colors.secondary }}>
          React native demo
          </Text>
          <Image style={{  height:h, resizeMode:'contain' }} source={require('../../assets/logo-splash.png')} />
        </View>
     
        <View style={{flexGrow:2, justifyContent:'center' }}>
          <Text style={{fontSize:14, color:Colors.text , textAlign:'center' }}>
            Progetto sviluppato e realizzato dalla Coopearativa Sociale 
          </Text>
          <Text style={{fontSize:18,fontWeight:'bold', color:Colors.primary, textAlign:'center', marginVertical:10 }}>
            P.A.Ge.F.Ha Onlus   
          </Text>
          <Text style={{fontSize:14, color:Colors.text,  textAlign:'center' }}>
            in Collaborazione con 
          </Text>
          <Text style={{fontSize:18, fontWeight:'bold', color:Colors.primary, textAlign:'center', marginVertical:10  }}>
            AgriAbilità Coop. Sociale
          </Text>
        </View>  

        <View style={{ flexGrow:1 }}>
          <Image style={{ height:h, resizeMode:'contain'}} source={require('../../assets/foot.png')} />
        </View> 
        
      </Card>
    </LinearGradient>
  )
}

export const ScreenOptions = navHandle => {
  
  return{
    headerTitle: 'Riconoscimenti',
    headerLeft: ()=>(
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
          title="Menu"
          iconName={'menu'}
          onPress={() => {
            navHandle.navigation.toggleDrawer();
          }}
        /> 
      </HeaderButtons>
    )
  }
};


/*----------------- StyleSheet --------------- */
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    flex:1,
    width: '90%',
    paddingHorizontal: 40, 
    paddingVertical: 20, 
    marginVertical:50,
    alignItems:'center',
    alignSelf:'center',
    justifyContent:'space-between'
  }
 
});

export default CreditisScreen;