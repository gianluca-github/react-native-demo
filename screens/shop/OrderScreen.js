import React, {useState, useCallback, useEffect} from 'react';
import { 
  FlatList, 
  View, 
  Text, 
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Button } from 'react-native-elements';
import { useSelector, useDispatch} from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { LinearGradient } from 'expo-linear-gradient'

import * as orderActions from '../../store/actions/orders';
import Colors from '../../constants/Colors';
import OrderItem from '../../components/shop/OrderItem';
import HeaderButton from '../../components/UI/HeaderButton';
import Advice from '../../components/UI/Advice';

const OrdersScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] =useState();
  const orders = useSelector(state => state.orders.orders);
  const dispatch = useDispatch();

  /**
   * loadOrders 
   */
  const loadOrders = useCallback( async () =>{
    setError(null);
    setIsLoading(true);
    try{
      await dispatch( orderActions.fetchOrders() );
    }
    catch(err){
      setError(err.message);
    }
    finally{
      setIsLoading(false);
    }
  },[dispatch, setIsLoading, setError]);

  /**
   *  useEffect Listener : loadORders
   */
  useEffect(()=>{
    const unsubscribe = props.navigation.addListener(
      'focus',
      loadOrders );

    return ()=> {
      unsubscribe();
    }  
  },[loadOrders]);

  /**
   *  useEffect when Componendt Did Mount 
   */
  useEffect(()=>{
    loadOrders();
  },[dispatch] );

  /*------------- default Spinner: isLoading ------------------- */
  let Content =  "" 
  //
  if( error ){
    Content = (
      <View style={styles.centered}>
        <Text>Si è verificato un errore: {error}</Text>
        <Button 
          buttonStyle={{backgroundColor:Colors.primary, borderRadius:10}}
          titleStyle={{color:'white'}}
          title="riprova!" 
          onPress={loadOrders} />
      </View>
    )
  }
  if( isLoading ){
    Content = (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    )
  }

  if( !isLoading ){

    if( orders.length === 0 )
    {
      Content = <Advice text= 'Non ci sono ordini da visualizzare!' />
    }
    else (
     Content = 
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={itemData => 
          <OrderItem 
              amount={itemData.item.totalAmount}
              date={itemData.item.readableDate}
              state={itemData.item.state}
              items={itemData.item.items}
              mode={itemData.item.mode}
          />
        }
      />
    );
  }
  return (
    <LinearGradient colors={[Colors.gradient,Colors.primary]} style={styles.gradient} >
      {Content}
    </LinearGradient>
  );
  
};

/**
 * ScreenOptions
 * @param {*} navHandle 
 * @returns 
 */
export const ScreenOptions = navHandle => {
  return {
    headerTitle: 'I tuoi ordini',
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
  };
};

/**
 * styles
 */
const styles = StyleSheet.create({
  centered:{
    flex:1, 
    justifyContent:'center',
    alignItems:'center',
  },
  gradient: {
    height:'100%'
  }
});

export default OrdersScreen;
