import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { detailsOrder, payOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_PAY_RESET } from '../constants/orderConstants';


export default function OrderScreen(props) {

    const orderId = props.match.params.id;
    const [sdkReady, setSdkReady] = useState(false);
    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const orderPay = useSelector((state) => state.orderPay);
    const {
        loading: loadingPay,
        error: errorPay,
        success: successPay
    } = orderPay;

    const dispatch = useDispatch();

    useEffect(() => {
        const addPayPalScript = async () => {
            const { data } = await axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            };
            document.body.appendChild(script);
        };
        if (!order || successPay || (order && order._id !== orderId)) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch(detailsOrder(orderId));
        } else {
            if (!order.isPaid) {
                if (!window.paypal) {
                    addPayPalScript();
                } else {
                    setSdkReady(true);
                }
            }
        }
    }, [dispatch, order, orderId, sdkReady, successPay]);

    const successPaymentHandler = (paymentResult) => {

        // dispatch ไป payOrder ส่ง order และ paymetResultจากปุ่มpaypal
        dispatch(payOrder(order, paymentResult))
    };

    // if statment // ถ้ามี loadingbox  ถ้ามี error ต่อกันไป
    return loading ? (<LoadingBox></LoadingBox>) : error ? (<MessageBox variant="danger"></MessageBox>) : (
        <>
            <h1>Order NO: {order._id}</h1>
            <div className="row top">
                <div className="col-2">
                    <ul>
                        <li>
                            <div className="card card-body">
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                                    <strong>Address:</strong> {order.shippingAddress.address},
                                    {order.shippingAddress.city},
                                    {order.shippingAddress.postalCode},
                                    {order.shippingAddress.country},
                                </p>
                                {order.isDelivered ? (
                                    <MessageBox variant="success">Delivered at {order.deliveredAt}</MessageBox>
                                ) : (
                                    <MessageBox variant="danger">Not Delivered</MessageBox>
                                )}
                            </div>
                        </li>

                        <li>
                            <div className="card card-body">
                                <h2>Payment</h2>
                                <p>
                                    <strong>Method:</strong> {order.paymentMethod}
                                </p>
                                {order.isPaid ? (
                                    <MessageBox variant="success">Paid at {order.paidAt}</MessageBox>
                                ) : (
                                    <MessageBox variant="danger">Not Paid</MessageBox>
                                )}
                            </div>
                        </li>

                        <li>
                            <div className="card card-body">
                                <h2>Order Items</h2>

                                <ul>
                                    {order.orderItems.map((item) => (
                                        <li key={item.product}>
                                            <div className="row">
                                                <div>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="small"
                                                    ></img>
                                                </div>
                                                <div className="min-30">
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </div>

                                                <div>
                                                    {item.qty} X {item.price} = {item.qty * item.price} Bath
                                                </div>

                                            </div>
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        </li>

                    </ul>
                </div>
                <div className="col-1">
                    <div className="card card-body">
                        <ul>
                            <il>
                                <h2>Order Summery</h2>
                            </il>
                            <il>
                                <div className="row">
                                    <div>Items</div>
                                    <div>{order.itemsPrice.toFixed(2)}{' '}Bath</div>
                                </div>
                                <div className="row">
                                    <div>Shipping</div>
                                    <div>{order.shippingPrice.toFixed(2)}{' '}Bath</div>
                                </div>
                                <div className="row">
                                    <div>Tax</div>
                                    <div>{order.taxPrice.toFixed(2)}{' '}Bath</div>
                                </div>
                                <div className="row">
                                    <div><strong>Order Total</strong></div>
                                    <div><strong>{order.totalPrice.toFixed(2)}{' '}Bath</strong></div>
                                </div>
                            </il>

                            {!order.isPaid && (
                                <li>
                                    {!sdkReady ? (
                                        <LoadingBox></LoadingBox>
                                    ) : (
                                        <>
                                            {errorPay && (
                                                <MessageBox variant="danger">{errorPay}</MessageBox>
                                            )}
                                            {loadingPay && <LoadingBox></LoadingBox>}

                                            <PayPalButton
                                                amount={order.totalPrice}
                                                onSuccess={successPaymentHandler}
                                            ></PayPalButton>
                                        </>
                                    )}
                                </li>
                            )}

                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
