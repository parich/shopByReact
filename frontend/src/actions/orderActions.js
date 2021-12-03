import Axios from 'axios';
import { CART_EMPTY } from '../constants/cartConstants';
import {
    ORDER_CREATE_FAIL,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
} from '../constants/orderConstants';

//order คือรายการที่ส่งเข้ามา
export const createOrder = (order) => async (dispatch, getState) => {
    dispatch({ type: ORDER_CREATE_REQUEST, payload: order });
    try {
        //getState เรียกใช้ข้อมูล userInfo ใน state
        const { userSignin: { userInfo }, } = getState();
        //ส่งข้อมูลไป server
        const { data } = await Axios.post('/api/orders', order, {
            headers: {
                Authorization: `zxrAcho${userInfo.token}`,
            },
        });
        dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.order });
        // dispatch ใน cartReducers.js ใ้ห้เป็นค่าว่าง
        dispatch({ type: CART_EMPTY });
        //ลบข้อมูลใน localStorage ที่ชื่อ cartItems
        localStorage.removeItem('cartItems');
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const detailsOrder = (orderId) => async (dispatch, getState) => {

    dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId });
    const { userSignin: { userInfo }, } = getState();
    try {
        const { data } = await Axios.get(`/api/orders/${orderId}`, {
            headers: {
                Authorization: `zxrAcho${userInfo.token}`,
            },
        });
        dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: ORDER_DETAILS_FAIL, payload: message });
    }
};