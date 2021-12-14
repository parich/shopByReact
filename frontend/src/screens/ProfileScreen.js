import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

export default function ProfileScreen(props) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    //เรียกใช้ userSignin state
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpate } = userUpdateProfile;

    const dispatch = useDispatch();
    useEffect(() => {
        if (!user) {
            dispatch({ type: USER_UPDATE_PROFILE_RESET })
            dispatch(detailsUser(userInfo._id));
        } else {
            setName(user.name);
            setEmail(user.email);
        }
    }, [dispatch, userInfo._id, user]);

    const submitHandler = (e) => {
        e.preventDefault();
        // update profile
        if (password !== confirmPassword) {
            alert('Password and Confirm Password Are Not Matched')
        } else {
            dispatch(updateUserProfile({ userId: user._id, name, email, password }));
        }
    }

    return (
        <div>
            <form className='form' onSubmit={submitHandler}>
                <div>
                    <h1>User Profile</h1>
                </div>
                {
                    (loading ? (
                        <LoadingBox></LoadingBox>
                    ) : error ? (
                        <MessageBox variant='danger'>{error}</MessageBox>
                    ) : (
                        <>
                            {loadingUpdate && (<LoadingBox></LoadingBox>)}
                            {errorUpdate && (<MessageBox variant='danger'>{errorUpdate}</MessageBox>)}
                            {successUpate && (<MessageBox variant='success'>Profile Udated Successfuly</MessageBox>)}
                            <div>
                                <label htmlFor='name'>name</label>
                                <input id='name' type='text' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></input>
                            </div>
                            <div>
                                <label htmlFor='email'>email</label>
                                <input id='email' type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                            </div>
                            <div>
                                <label htmlFor='password'>password</label>
                                <input id='password' type='password' placeholder='Enter password' onChange={(e) => setPassword(e.target.value)}></input>
                            </div>
                            <div>
                                <label htmlFor='confirmPassword'>Confirm Password</label>
                                <input id='confirmPassword' type='password' placeholder='Enter Confirm Password' onChange={(e) => setConfirmPassword(e.target.value)}></input>
                            </div>
                            <div>
                                <label />
                                <button className='primary' type='submit'>Update</button>
                            </div>
                        </>
                    )
                    )}
            </form>
        </div>
    )
}
