import axios from 'axios';
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from '../constants/cartConstants';

export const addToCart = (id, qty) => async (dispatch, getState) => {
  /*
    IMPORTANT  NOTE 
    we have to save our cart to localstorage here so  along with dispatch we can actually pass and getStage and that allows us to get our entire state tree so anything we want like product list, product details or cart we can grab that with the getStage   */

  const { data } = await axios.get(`/api/products/${id}`);
  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

/*
    IMPORTANT  NOTE 
    So once we dispatch this we want to save it in localstorage so we can use our localstorage API we call setItem in localstorage we are gonna save it as cartItems Now we want to save the entire cart so here we use getState()
    it return JSON/js object and we can only save string in our localstorage so we stringify it 
    Now we saved the item in local storage no we have to get it so we get Item from localstorage from store.js
    ... to be continued in store.js
    */

export const removeFromCart = id => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = data => dispatch => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem('shippingAddress', JSON.stringify(data));
};

export const savePaymentMethod = data => dispatch => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem('paymentMethod', JSON.stringify(data));
};
