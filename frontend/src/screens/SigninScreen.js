import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signin } from '../actions/userActions';

export default function SigninScreen(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // ส่งมาจาก Url ด้วย props.history.push('/signin?redirect=shipping');
    // http://localhost:3000/signin?redirect=shipping 
    // split('=')[1] คือหลัง = 
    // ถ้ามีการส่งค่ามา (props.location.search) ให้ไป shipping ถ้าไม่มีการส่งค่ามาให้ไป /
    const redirect = props.location.search ? props.location.search.split('=')[1] : '/';
    console.log(redirect);

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo, loading, error } = userSignin;

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(signin(email, password));
    };

    // useEffect เริ่มทำงานทันที่เมื่อมีการเรียกใช้ และจะเริิ่มทำงานใหม่อีกครั้งเมื่อค่าใน [พารามิเตอร์] มีการเปลียนแปลง
    useEffect(() => {
        if (userInfo) {
            props.history.push(redirect);
        }
    }, [props.history, redirect, userInfo]);

    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Signin</h1>
                </div>

                <div>
                    <label htmlFor="email">Email address</label>
                    <input type="email" id="email" placeholder="Enter email" required
                        onChange={e => setEmail(e.target.value)}></input>
                </div>
                <div>
                    <label htmlFor="password">password address</label>
                    <input type="password" id="password" placeholder="Enter password" required
                        onChange={e => setPassword(e.target.value)}></input>
                </div>
                <div>
                    <label />
                    <button className="primary" type="submit">Sign In</button>
                </div>
                <div>
                    <label />
                    <div>
                        New customer? <Link to="/register">Create yout account</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
