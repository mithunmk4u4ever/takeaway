import React, { useEffect, useRef, useState } from 'react'

import { useCart, useDispatchCart } from './ContextReducer'
import axios from 'axios'

const Card = (props) => {

    const [qty, setQty] = useState(1)
    const [size, setSize] = useState("")

    const token = localStorage.getItem("authToken")
    const userId = localStorage.getItem("userId")
    console.log("Token:", token);
    console.log("User ID:", userId);



    const priceRef = useRef()

    let data = useCart()

    let dispatch = useDispatchCart()

    console.log("card", props)

    let options = props.options || {}
    let priceOptions = Object.keys(options)

    let finalPrice = qty * parseInt(options[size])

    useEffect(() => {
        setSize(priceRef.current.value)
    }, [])

    // const handleAddtoCart = async () => {
    // let food = []
    // if(token){

    //     for (const item of data) {
    //         if (item.id === props.foodItem._id) {
    //             food = item
    //             break;
    //         }
    //     }
    //     if (food !== -1) {
    //         if (food.size === size) {
    //             await dispatch({ type: "UPDATE", id: props.foodItem._id, price: finalPrice, qty: qty })
    //             return
    //         }

    //         else if (food.size !== size) {
    //             await dispatch({ type: "ADD", id: props.foodItem._id, name: props.foodItem.name, price: finalPrice, qty: qty, size: size })
    //             return
    //             // console.log(data)
    //         }
    //     }
    //     await dispatch({ type: "ADD", id: props.foodItem._id, name: props.foodItem.name, price: finalPrice, qty: qty, size: size })
    // }


    const handleAddtoCart = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3300/api/addtocart',
                {
                    userId: userId,
                    foodItemId: props.foodItem._id,
                    name: props.foodItem.name,
                    price: finalPrice,
                    qty,
                    size,
                    imgUrl: props.foodItem.img,
                    date:new Date().toISOString()  
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            ).then(response => {
                response.send(response.data);
                console.log("resdata",response.data);
                localStorage.setItem("authToken", response.data.authToken)
                localStorage.setItem("userId", response.data.userId)
                console.log("Cart items:", response.data.cartItems);
            })
            if (response.status === 200) {
                console.log(response.data.message);
            } else {
                console.error(response.data.error);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };



    // }



    return (
        <div>
            <div>

                <div className="card mt-3" style={{ 'width': '18rem', 'maxHeight': '406px' }}>
                    <img src={props.foodItem.img} className="card-img-top" alt="..." style={{ height: "120px", objectFit: "fill" }} />
                    <div className="card-body">
                        <h5 className="card-title">{props.foodItem.name}</h5>
                        <p className="card-text" style={{ textAlign: "justify" }}>{props.foodItem.description}</p>
                        <div className='container w-100'>

                            <select className='m-2 h-100 bg-success' name="" id="" onChange={(e) => setQty(e.target.value)}>
                                {Array.from(Array(6), (e, i) => {
                                    return (
                                        <option key={i + 1} value={i + 1} >{i + 1}</option>
                                    )
                                })}
                            </select>

                            <select className='bg-success m-2 h-100 rounded' name="" id="" ref={priceRef} onChange={(e) => setSize(e.target.value)}>
                                {
                                    priceOptions.map(item =>
                                        <option key={item} value={item} >{item}</option>)
                                }
                            </select>

                            <div className='d-inline h-100 fs-5'>
                                ₹{finalPrice}/-
                            </div>


                        </div>
                        <hr />
                        <button className='btn btn-success justify-center ms-2' onClick={handleAddtoCart}>Add to Cart</button>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default Card