import { useContext, useEffect, useState } from 'react';
import { myContext, useCart, useDispatchCart } from '../components/ContextReducer'
import axios from "axios"

function Cart() {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');


    console.log("cartt", token);

    // const [data, setData] = useState([])
    const { data, setData } = useContext(myContext)
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [totalItems, setTotalItems] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalItemPrice, setTotalItemPrice] = useState(0);





    // let data = useCart();
    let dispatch = useDispatchCart();

    useEffect(() => {
        if (token && userId !== null && userId !== undefined) {
            fetchCart();
        } else {
            console.log("Token or userId not available. Please log in.");
        }
    }, [token, userId, dispatch]);

    useEffect(() => {
        // Set initial selected items based on items in the cart
        setSelectedItems(data.map((_, index) => index));
    }, [data]);

    useEffect(() => {
        // Set initial total items, total quantity, and total price
        setTotalItems(data.length);
        setTotalQuantity(data.reduce((total, food) => total + parseInt(food.qty), 0));
        setTotalItemPrice(data.reduce((total, food) => total + food.price, 0));
    }, [data]);


    const fetchCart = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3300/api/getcartitems', { userId: userId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'userId': userId
                    }
                }
            );
    
            if (response && response.status === 202) {
                console.log("Cart items:", response.data.cartItems);
                setData(response.data.cartItems);
            } else {
                console.log("Error fetching data");
            }
        } catch (error) {
            console.log(error);
        }
    };
    


    if (data.length === 0) {
        return (
            <div>
                <p className='m-5 w-100 text-center fs-3 text-light' >Cart is Empty!</p>
            </div>
        )
    }

    let totalPrice = data.reduce((total, food) => total + food.price, 0)


    // Add this function to your component
    const handleSelect = (index) => {
        const isSelected = selectedItems.includes(index);
        if (isSelected) {
            setSelectedItems(selectedItems.filter((item) => item !== index));
        } else {
            setSelectedItems([...selectedItems, index]);
        }
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            const allIndices = data.map((_, index) => index);
            setSelectedItems(allIndices);
        } else {
            setSelectedItems([]);
        }
    };


    // const handleRemoveAllSelected = async () => {
    //     if (selectedItems.length > 0) {
    //         try {
    //             // Get the selected items from the data array
    //             const itemsToRemove = data.filter((_, index) => selectedItems.includes(index));

    //             // Make a DELETE request to remove selected items from the cart
    //             await axios.delete("http://localhost:3300/api/removefromcart", {
    //                 data: { itemsToRemove, email: userEmail }, // Send data in the request body
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                 }
    //             });

    //             // Update the local state after successful removal
    //             const updatedData = data.filter((_, index) => !(selectedItems.includes(index)));
    //             setData(updatedData);
    //             setTotalItems(updatedData.length); // Update total items
    //             setTotalQuantity(updatedData.reduce((total, food) => total + food.qty, 0)); // Update total quantity
    //             setTotalItemPrice(updatedData.reduce((total, food) => total + food.price, 0)); // Update total price

                
    //             setSelectedItems([]);
    //             setSelectAll(false);
    //             setData([])

    //         } catch (error) {
    //             console.log(error);
    //             alert('Error removing selected items.');
    //         }
    //     } else {
    //         alert('Please select items to remove!');
    //     }
    // };

    // const handleCOnfirmRemoveAllSelected = () => {
    //     const isTrue = window.confirm("Are you sure you want to remove all the selected items?");

    //     if (isTrue) {
    //         handleRemoveAllSelected();
    //     }
    // }

    // // ... (existing imports and component code)

    // const email = localStorage.getItem("userEmail");

    // const handleCheckout = async () => {
    //     if (token) {
    //         const selectedData = selectedItems.map((index) => data[index]);

    //         if (selectedData.length > 0) {
    //             try {
    //                 // Move selected items to myorder in the database
    //                 const moveResponse = await axios.post(
    //                     'http://localhost:3300/api/movetomyorder',
    //                     {
    //                         itemsToMove: selectedData,
    //                         userId: userId,
    //                         email: email
    //                     },
    //                     {
    //                         headers: {
    //                             Authorization: `Bearer ${token}`,
    //                         },
    //                     }
    //                 );

    //                 if (moveResponse.status === 200) {
    //                     // Remove selected items from the cart
    //                     const updatedData = data.filter((_, index) => !selectedItems.includes(index));
    //                     setData(updatedData);

    //                     // Update total items, total quantity, and total price
    //                     const newTotalItems = updatedData.length;
    //                     const newTotalQuantity = updatedData.reduce((total, food) => total + food.qty, 0);
    //                     const newTotalPrice = updatedData.reduce((total, food) => total + food.price, 0);

    //                     // Update state with new totals
    //                     setTotalItems(newTotalItems);
    //                     setTotalQuantity(newTotalQuantity);
    //                     setTotalItemPrice(newTotalPrice);

    //                     setSelectedItems([]);
    //                     setSelectAll(false);
    //                     setData([]);
    //                     // Perform checkout with selected items
    //                     let userEmail = localStorage.getItem('userEmail');
    //                     let response = await axios.post('http://localhost:3300/api/createorder', {
    //                         email: userEmail,
    //                         order_data: selectedData,
    //                         order_date: new Date().toDateString(),
    //                     },
    //                     {
    //                         headers: {
    //                             Authorization: `Bearer ${token}`,
    //                         },
    //                     });

    //                     console.log('order', response);

    //                     if (response.status === 200) {
    //                         // Clear selected items data
    //                         setSelectedItems([]);

    //                         // Optionally, you can redirect the user to the 'myorder' page
    //                         // history.push('/myorder');
    //                     }
    //                 } else {
    //                     console.log('Error moving items to myorder');
    //                 }
    //             } catch (error) {
    //                 console.log('Error:', error);
    //             }
    //         } else {
    //             alert('Please select items to checkout!');
    //         }
    //     } else {
    //         alert('Please login to checkout!!');
    //     }
    // };




    return (
        <div>
            <div className='container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md'>
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                            </th>
                            <th scope='col'>#</th>
                            <th scope='col'>Name</th>
                            <th scope='col'>Quantity</th>
                            <th scope='col'>Option</th>
                            <th scope='col'>Amount</th>
                            <th scope='col'></th>
                            <th scope='col'>
                                {/* <button className='btn btn-sm btn-outline-danger' onClick={handleCOnfirmRemoveAllSelected}>
                                    Remove All Selected
                                </button> */}
                            </th>
                        </tr>
                    </thead>


                    <tbody>
                        {data.map((food) => (
                            <tr key={food.id}> {/* Assuming 'id' is the unique identifier for each item */}
                                <td><input type="checkbox" checked={selectedItems.includes(food.id)} onChange={() => handleSelect(food.id)} /></td>
                                <td>{food.id}</td>
                                <td>{food.name}</td>
                                <td>{food.qty}</td>
                                <td>{food.size}</td>
                                <td>₹{food.price}</td>
                                <td>{food.image}</td>
                                <td><button className='btn btn-sm btn-outline-danger' onClick={() => { dispatch({ type: "REMOVE", id: food.id }) }}>Remove</button></td>
                            </tr>
                        ))}
                    </tbody>


                    <tfoot>
                        <tr>
                            <td colSpan="1"></td>
                            <td><b>Total:</b></td>
                            <td><b>Items: {totalItems}</b></td>
                            <td><b>Qty: {totalQuantity}</b></td>
                            <td colSpan="1"></td>

                            <td><b>Amount: ₹{totalItemPrice}</b></td>
                            <td></td>
                            <td>
                                {/* <button className='btn btn-sm btn-outline-danger' onClick={handleRemoveAllSelected}>
                                    Remove All Selected
                                </button> */}
                            </td>
                        </tr>
                    </tfoot>


                </table>
                <div><h1 className='text-light'>Total Price : {totalPrice}</h1></div>
                <div>
                    {/* <button className='btn btn-success' onClick={handleCheckout}>Checkout</button> */}
                </div>
            </div>
        </div>
    )
}

export default Cart