import {
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_RSEGISTER_SUCCESS,
    USER_SIGNIN_FAIL,
    USER_SIGNIN_REQUEST,
    USER_SIGNIN_SUCCESS,
    USER_SIGNOUT,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS
} from "../constants/userConstants"
import axios from "axios";

export const register = (name, email, password) => async (dispatch) => {
    dispatch({ type: USER_REGISTER_REQUEST, payload: { name, email, password } });
    try {
        const { data } = await axios.post('/api/users/register', { name, email, password });
        dispatch({ type: USER_RSEGISTER_SUCCESS, payload: data });
        dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const signin = (email, password) => async (dispatch) => {
    dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
    try {
        const { data } = await axios.post('/api/users/signin', { email, password });
        dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
        // เก็บข้อมูลใส่ Local Storage แบบถาวร localStorage.setItem(key, value) 
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_SIGNIN_FAIL,
            payload:
                error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const signout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    dispatch({ type: USER_SIGNOUT });
};

export const detailsUser = (userId) => async (dispatch, getState) => {
    dispatch({ type: USER_DETAILS_REQUEST, payload: { userId } });

    //เรียกใช้ userInfo  ที่เก็บอยู่ใน state
    const { userSignin: { userInfo } } = getState();

    try {
        // send to server
        const { data } = await axios.get(`/api/users/${userId}`, {
            headers: { Authorization: `zxrAcho${userInfo.token}` }
        });
        // dispatch
        dispatch({ type: USER_DETAILS_SUCCESS, payload: data });

    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: message,
        });
    }
}

export const updateUserProfile = (user) => async (dispatch, getState) => {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST, payload: user });

    //เรียกใช้ userInfo  ที่เก็บอยู่ใน state
    const { userSignin: { userInfo } } = getState();

    try {
        // send to server
        const { data } = await axios.put(`/api/users/profile`, user, {
            // authen
            headers: { Authorization: `zxrAcho${userInfo.token}` }
        });
        // dispatch data
        dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
        dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
        // การเก็บข้อมูลลงใน Local Storage
        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: message,
        });
    }
}





//localStorage.setItem(key, value) คือ การเก็บข้อมูลลงใน Local Storage
//localStorage.getItem(key) คือ การเรียกใช้ข้อมูล key ของ Local Storage
//localStorage.removeItem(key) คือ การลบข้อมูลที่ key เก็บไว้
//localStorage.clear() คือ การลบข้อมูลทั้งหมดในโดเมน

