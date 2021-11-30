import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { cartReducers } from './reducers/cartReducers';
import { productDetailsReducer, productListReducer } from "./reducers/productReducers";
import { userRegisterReducer, userSigninReducer } from './reducers/userReducers';

const initialStare = {
    //เริ่ม get ข้อมูล localstorage เมือมีการโหลดหน้าเว็บใหม่
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
    userSignin: userSigninReducer,
    userRegister: userRegisterReducer

})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialStare, composeEnhancer(applyMiddleware(thunk)));

export default store;