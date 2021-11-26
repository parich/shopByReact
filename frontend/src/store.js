import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { cartReducers } from './reducers/cartReducers';
import { productDetailsReducer, productListReducer } from "./reducers/productReducers";
import { userSigninReducer } from './reducers/userReducers';

const initialStare = {
    // เก็บข้อมูลไว้ใน localstorage เมื่อมีการรีโหลดหน้าเว็บ ข้อมูลจะไม่หายจาก Redux store
    userSignin: {
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
    },
    cart: {
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    }
};
const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducers,
    userSignin: userSigninReducer

})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialStare, composeEnhancer(applyMiddleware(thunk)));

export default store;