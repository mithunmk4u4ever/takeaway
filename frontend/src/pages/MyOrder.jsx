import React, { useEffect, useState,useContext } from 'react';
import {myContext} from '../components/ContextReducer'
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function MyOrder() {
   
    const [orderData, setOrderData] = useState({});

   

    const fetchMyOrder = async () => {
        console.log(localStorage.getItem('userEmail'));
        try {
            const res = await fetch("http://localhost:3300/api/myorder", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: localStorage.getItem('userEmail'),
                }),
            });

            const response = await res.json();
            console.log(response);
            setOrderData(response);
        } catch (error) {
            console.error('Error fetching my order:', error);
        }
    };

    useEffect(() => {
        fetchMyOrder();
    }, []);

    return (
        <div>
            <div>
                <Navbar />
            </div>

            <div className='container'>
                <div className='row'>
                    {Object.keys(orderData).length !== 0 ? (
                        orderData.orderData ? (
                            orderData.orderData.order_data
                                .slice(0)
                                .reverse()
                                .map((item, index) => (
                                    <div key={index}>
                                        {item.map((arrayData) => (
                                            <div key={arrayData.id}>
                                                 {console.log("ad",arrayData)}
                                                {arrayData.Order_date ? (
                                                    <div className='m-auto mt-5'>
                                                        {arrayData.Order_date}
                                                        <hr />
                                                    </div>
                                                ) : (
                                                    <div className='col-12 col-md-6 col-lg-3'>
                                                        {console.log(arrayData.img)}
                                                        <div className='card mt-3' style={{ width: '16rem', maxHeight: '360px' }}>
                                                          
                                                            <img
                                                                src={arrayData.img}
                                                                className='card-img-top'
                                                                alt='...'
                                                                style={{ height: '120px', objectFit: 'fill' }}
                                                            />
                                                           
                                                            <div className='card-body'>
                                                                <h5 className='card-title'>{arrayData.name}</h5>
                                                                <div className='container w-100 p-0' style={{ height: '38px' }}>
                                                                    <span className='m-1'>{arrayData.qty}</span>
                                                                    <span className='m-1'>{arrayData.size}</span>
                                                                    {/* <span className='m-1'>{data}</span> */}
                                                                    <div className='d-inline ms-2 h-100 w-20 fs-5'>
                                                                        ₹{arrayData.price}/-
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))
                        ) : null
                    ) : null}
                </div>
            </div>

            <Footer />
        </div>
    );
}
