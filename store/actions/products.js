import Product from '../../models/product';
import DbLink from '../../constants/DbLink';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const UPDATE_PRODUCT_FIELDS = 'UPDATE_PRODUCT_FIELDS';
export const SET_PRODUCTS = 'SET_PRODUCTS';

/**
 * 
 */
export const fetchProducts = () => {

  return async (dispatch, getState) => {
    const token = getState().auth.token;
    
    try {
      const response = await fetch(
        `${DbLink.ENDPOINT}/products.json?auth=${token}`
      );
      
      if(! response.ok )
      {
        const errorResData = await response.json();
        throw new Error( errorResData.error.message );
      }

      const resData = await response.json();
      const loadProducts = [];
   
      for( const key in resData ){
        loadProducts.push(new Product(
          key,
          resData[key].ownerId,
          resData[key].title,
          resData[key].imageUrl, 
          resData[key].description,
          resData[key].price,
          resData[key].qta,
          resData[key].unit,
          resData[key].scaleQta,
          resData[key].cool
        ));
      }

      dispatch({type: SET_PRODUCTS, products:loadProducts} );
    } 
    catch(err){
      throw err;
    }
  }
};

/**
 * 
 * @param {*} productId 
 */
export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `${DbLink.ENDPOINT}/products/${productId}.json?auth=${token}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.error.message);
    }
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

/**
 * createProduct
 * @param {*} title 
 * @param {*} description 
 * @param {*} imageUrl 
 * @param {*} price 
 */
export const createProduct = (title, description, imageUrl, price, qta, unit, scaleQta, cool) => {
  return async (dispatch, getState) => {
    // any async code you want!
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    const response = await fetch(
      `${DbLink.ENDPOINT}/products.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ownerId: userId, // sempre il super user
          title,
          description,
          imageUrl,
          price,
          qta,
          unit,
          scaleQta,
          cool
        })
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        ownerId: userId,
        title,
        description,
        imageUrl,
        price, 
        qta,
        unit,
        scaleQta,
        cool
      }
    });
  };
};

/**
 * updateProduct
 * @param {*} id 
 * @param {*} title 
 * @param {*} description 
 * @param {*} imageUrl 
 */
export const updateProduct = (id, title, description, imageUrl, price, qta, unit, scaleQta, cool) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const ownerId = getState().auth.userId;

    const response = await fetch(
      `${DbLink.ENDPOINT}/products/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          qta,
          unit,
          scaleQta,
          cool
        })
      }
    );

    if (!response.ok) {
      
      const errorResData = await response.json();
      throw new Error( errorResData.error.message );
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        ownerId,
        title,
        description,
        imageUrl, 
        price,
        qta,
        unit,
        scaleQta,
        cool
      }
    });
  };
};


/**
 * updateQtaProduct
 * @param {*} id 
 * @param {*} qta 
 */
 export const updateQtaProduct = (id, qta ) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const prod = getState().products.availableProducts.find( p => p.id === id );
    const upQta = Math.round( prod.qta - qta );
    const upProd = { ...prod, qta:upQta }

    const response = await fetch(
      `${DbLink.ENDPOINT}/products/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( upProd )
      }
    );

    if (!response.ok) {
      
      const errorResData = await response.json();
      throw new Error( errorResData.error.message );
    }

    dispatch({
      type: UPDATE_PRODUCT_FIELDS,
      pid: id,
      product: upProd
    });
  };
};
