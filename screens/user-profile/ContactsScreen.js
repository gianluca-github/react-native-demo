import React, {useCallback} from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image,
  Dimensions,
  Linking,
  Alert
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { LinearGradient } from 'expo-linear-gradient';

import HeaderButton from '../../components/UI/HeaderButton';
import Link from '../../components/UI/Link';
import Colors from '../../constants/Colors';
import Card from '../../components/UI/Card';

const ContactsScreen = props => {
  const h = Dimensions.get('window').height * .18;
  return(

    <LinearGradient colors={[Colors.gradient,Colors.primary]} style={styles.gradient}>
       
      <Card style={styles.card} >
        <View style={{ flexGrow:1, alignItems:'center', justifyContent:'space-between'}}> 
          <Image style={{  height:h, resizeMode:'contain' }} source={require('../../assets/logo-splash.png')} />
        </View>
        <View style={{flexGrow:1, justifyContent:'flex-start', marginBottom:20 }}>
          <Text style={{ fontSize: 18, fontWeight:'bold', color:Colors.primary , textAlign:'center' }}>
            Via dei Meli 199{'\n'}63100 Ascoli Piceno (AP)
          </Text>
        </View>
        <View style={{ flexGrow: 2, justifyContent: 'center' }}>
          <Link
            textStyle={styles.link}
            text='392 070 3098'
            url='tel:3920703098' />
          
          <Link
            textStyle = {styles.link}
            text='gianluca.tappata@gmail.com'
            url='mailto:gianluca.tappata@gmail.com' />
        </View>          
      </Card>
    </LinearGradient>
  )
}

export const ScreenOptions = navHandle => {
  
  return{
    headerTitle: 'Contatti',
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
    marginVertical: 80, //Dimensions.get('window').height * .18,
    alignItems:'center',
    alignSelf:'center',
    justifyContent:'space-between'
  },
  link: {
    fontSize: 16, 
    color: Colors.beige, 
    textAlign: 'center', 
    marginVertical: 5,
    backgroundColor: Colors.secondary,
    padding: 5,
    borderRadius:5
  }
 
});

export default ContactsScreen;