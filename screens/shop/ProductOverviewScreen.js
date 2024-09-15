import React, {useState, useEffect, useCallback} from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import { useSelector, useDispatch  } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { LinearGradient } from 'expo-linear-gradient';

import Card from '../../components/UI/Card';
import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton';
import * as cartActions from '../../store/actions/cart';
import * as prodActions from '../../store/actions/products';
import * as authActions from '../../store/actions/auth';
import * as Notifications from 'expo-notifications';

import Colors from '../../constants/Colors';
import Mode from '../../constants/Mode';

const ProductsOverviewScreen = props => {
  const products = useSelector(state => state.products.availableProducts);
  const cart = useSelector(state => state.cart);
  const userData = useSelector(state => state.auth.userData);
  const config = useSelector(state => state.config.data);
  //
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  // determina la fetchData nel listener focus
  const { route: { params: { reload } } } = props;
  //const mode = useSelector(state => state.auth.userData.permissions );
  const mode =  props.route.params.mode;
  const staticDispatch = useCallback(dispatch, []);
  //--- loadProaducts ------------------------------ 
  const loadProaducts = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    setIsRefreshing(true);
    try {
      await staticDispatch( prodActions.fetchProducts() );
    }
    catch(err){
      setError(err.message);
    }
    finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [staticDispatch]);


  const fetchUsereData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await staticDispatch(authActions.refreshUserData());
    }
    catch (err) {
      setError(err);
      setIsLoading(false);
    }
    finally {
      setIsLoading(false);
    }
  }, [staticDispatch]);
  

  useEffect(() => {
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        //const { myData } = response.notification.request.content.data;
        fetchUsereData().then(() => {
          if (!props.navigation.isFocused())
            console.log('NOTIFICATION', userData.prepaid);
            props.navigation.navigate('ProductOverview')
        });
      }
    );

    // const foregroundSubscription = Notifications.addNotificationReceivedListener(
    //   (notification) => {
    //     console.log('FOREGROUND', notification.request.content.data.myData);
    //     passThrough = 2;
    //     console.log('FORE PASSTHROUGH', passThrough)

    //   }
    // );
  
    return () => {
      backgroundSubscription.remove();
      //foregroundSubscription.remove();
    };
  }, [fetchUsereData]);

  /**
   * fetchData 
   */
  useEffect(() => {
      const unsubscribe = props.navigation.addListener('focus', () => {
        if (reload) {
            // carico i dati user solo se Customer e modalità pagamento prepagato
          if (mode === config.ModeAuth.val.CUSTOMER && userData.modeOrder.payment === config.ModeOrder.payment.PREPAID) {
            fetchUsereData();
          }
        }
        else {
          props.navigation.dispatch(CommonActions.setParams({ reload: true }));
        }
      }
    );

    return () => {
      unsubscribe();
    }
    
  }, [fetchUsereData, reload]);


  /* -------- useEffect Listener ------- */
  // useEffect(() => {
    
  //   const unsubscribe = props.navigation.addListener(
  //     'focus',
  //     loadProaducts );

  //   return () => {
  //     unsubscribe();
  //   }  
  // },[loadProaducts]);

  /* -------- useEffect when Componendt Did Mount ------- */
  useEffect(() => {
    loadProaducts();
  },[loadProaducts] );

  /* -------- useEffect Error ------- */
  useEffect(()=>{
    if(error){
      Alert.alert('Si è verificato un errore: ', error.message, [{text:'Ok'}]);
    }
  },[error]);

  /**----------------- Edit -----------------**/
  const editProductHandler = id => {
    props.navigation.navigate('EditAdminProduct', { productId: id });
  };

  /**----------------- Delete -----------------**/
  const deleteHandler = (id) =>{
    Alert.alert('Sei Sicuro', 'Vuoi cancellare davvero questo prodotto?',[
    { text:'No', style:'default'},
    { text:'Si', style:'destructive', 
        onPress: async()=>{
          setError(null);
          try{
            await dispatch(prodActions.deleteProduct(id));
          }
          catch (err) {
            setError( err );
          }
        }}]
    );
  };

  /**----------------- Select -----------------**/
  const selectItemHandler = (id, title) => {
    
    props.navigation.navigate( 
      'ProductDetail',
      {productId: id, productTitle: title}
    );
  }
  
  /**----------------- OnSelect -----------------**/
  const onSelectHandler = itemData =>{
    if( mode === Mode.USER){
      if(itemData.item.qta > 0 ){
        selectItemHandler(itemData.item.id, itemData.item.title);
      }
    } else {
      editProductHandler( itemData.item.id );
    }
  }

  /**----------------- OnAction -----------------**/
  const onActionHandler = itemData =>{
    if( mode === Mode.USER){
      const cartItem = cart? cart.items[itemData.item.id]: null;
      if( cartItem ){
        props.navigation.navigate( 'Cart' )
      }else{
        const product = itemData.item;
        dispatch( cartActions.addToCartHandler( product, product.scaleQta ) );
      }
    } else {
      deleteHandler( itemData.item.id );
    }
  }

  /**----------------- RenderItem -----------------**/
  const renderProductsItem = itemData => {

    return(
      <ProductItem 
        title={itemData.item.title}
        price={itemData.item.price}
        qta={itemData.item.qta}
        unit={itemData.item.unit}
        cool={itemData.item.cool}
        imageUrl={itemData.item.imageUrl}
        onSelect={()=>{
          onSelectHandler( itemData )
        }}
        styleActionPosition = {{justifyContent:'space-between'}}
      >
          <Button 
            buttonStyle={{backgroundColor:'white'}}
            titleStyle={{color:Colors.primary}}
            title={mode===Mode.USER? "Dettagli" : "Modifica"}
            onPress={()=> { 
              onSelectHandler( itemData )
            }}
          />
          <Button
            buttonStyle={{backgroundColor:'white'}}
            titleStyle={{color:Colors.primary}}
            disabled ={ mode===Mode.USER && itemData.item.qta===0 }
            title={mode===Mode.USER? "Carrello" : "Elimina"} 
            onPress={() => {
              onActionHandler( itemData )
            }} 
          />
      </ProductItem>
    );
  }
 
  /*------------- default Spinner: isLoading ------------------- */
  let Content =  
    <View style={styles.centered}>
      <ActivityIndicator size='large' color={Colors.primary} />
    </View>;
  
  if (!isLoading) {
    if (products.length === 0) {
      Content = 
        <View style={styles.centered}>
          <Text>Inserisci nuovi prodotti! </Text>
        </View>
    } else {
      const showCredit = (mode === config.ModeAuth.val.CUSTOMER
        && userData.modeOrder.payment === config.ModeOrder.payment.PREPAID);
      Content = 
      <View style={{justifyContent:'space-evenly'}}>
        
        {showCredit && <Card style={{ marginHorizontal: 20, marginTop: 10, height: 50, justifyContent: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 13, color: Colors.secondary, textAlign: 'center' }}>
            Il tuo Credito Prepagato è di {userData.prepaid.toFixed(2)}€!
          </Text>
        </Card>}
       <FlatList
          onRefresh={loadProaducts}
          refreshing={isRefreshing}
          data={products}
          keyExtractor={item => item.id}
          renderItem={renderProductsItem}
          initialNumToRender={25}
        />
      </View>
    }
  }

  return (
    <LinearGradient colors={[Colors.gradient, Colors.primary]} style={styles.gradient} >
      {Content}
    </LinearGradient>
  );
};


export const UserScreenOptions = navHandle => {
  return{
    headerTitle: "Prodotti",
    headerTitleStyle: {
      fontFamily: 'open-sans',
      fontSize: 16,
      textAlign: 'center',
    },
    headerLeft: ()=>(
      <HeaderButtons HeaderButtonComponent={HeaderButton}  >
        <Item
          title="Menu"
          iconName={'menu'}
          onPress={() => {
            navHandle.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton} >
        <Item
          title="Carrello"
          iconName={'cart'}
          onPress={()=>{
            navHandle.navigation.navigate('Cart');
          } }
        />
      </HeaderButtons>
    )
  }
};


export const AdminScreenOptions = navHandle => {
  
  return{
    headerTitle: 'Gestione Prodotti',
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
    ),
    headerRight: ()=>(
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Aggiungi"
          iconName={'create'}
          onPress={() => {
            navHandle.navigation.navigate('EditAdminProduct');
          }}
        />
      </HeaderButtons>
    )
  }
};


const styles = StyleSheet.create({
  centered:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignContent:'center'
  }
});

export default React.memo( ProductsOverviewScreen );
