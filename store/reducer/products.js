import {DELETE_PRODUCT, CREATE_PRODUCT, UPDATE_PRODUCT, UPDATE_PRODUCT_FIELDS, SET_PRODUCTS } from '../actions/products';
import Product from '../../models/product';

const initialState = {
	availableProducts: [],
};

export default (state = initialState, action) => {
	
	switch (action.type){
		case SET_PRODUCTS:
			return{
				availableProducts: action.products,
			}
		case CREATE_PRODUCT:
			const newProduct = new Product(
				 action.productData.id,
				 action.productData.ownerId,
				 action.productData.title,
				 action.productData.imageUrl,
				 action.productData.description,
				 action.productData.price,
				 action.productData.qta,
				 action.productData.unit,
				 action.productData.scaleQta,
				 action.productData.cool
				);
			return {
				...state,
				availableProducts: state.availableProducts.concat( newProduct ),
			}
		case UPDATE_PRODUCT:

			const productIndex = state.availableProducts.findIndex( p => p.id === action.pid );

			const updateProduct = new Product(
				action.pid,
				action.productData.ownerId,
				action.productData.title,
				action.productData.imageUrl,
				action.productData.description,
				action.productData.price,
				action.productData.qta,
				action.productData.unit,
				action.productData.scaleQta,
				action.productData.cool
			)
	
			const updateProducts = [...state.availableProducts];
			updateProducts[productIndex] = updateProduct;

			return {
				...state,
				availableProducts: updateProducts,
			} 
		case UPDATE_PRODUCT_FIELDS:
			const idx = state.availableProducts.findIndex( p => p.id === action.pid );
			const updateQtaProducts = [...state.availableProducts];
			updateQtaProducts[idx] = action.product;
			//
			return {
				...state,
				availableProducts: updateQtaProducts,
			} 
		case DELETE_PRODUCT:
		 
			return{
				...state,
				availableProducts: state.availableProducts.filter( p => p.id !== action.pid ),
			}
		default:
			return state;
	}
	   
};