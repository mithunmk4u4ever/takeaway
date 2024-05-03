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
    const [selectedItems, setSelectedItems] = useState(data.length ? data.map((_, index) => index) : []);
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
        // Set initial selected items based on items in the cart (if any)
        setSelectedItems(data.length ? data.map((_, index) => index) : []);
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
        let updatedSelectedItems;
        if (isSelected) {
            updatedSelectedItems = selectedItems.filter((item) => item !== index); // Remove the index from selection
        } else {
            updatedSelectedItems = [...selectedItems, index]; // Add the index to selection
        }
        setSelectedItems(updatedSelectedItems);
    };

    const handleSelectAll = () => {
        const allIndices = data.map((_, index) => index);
        setSelectedItems(selectAll ? [] : allIndices);
        setSelectAll(!selectAll);
    };



    const handleRemoveAllSelected = async () => {

    };

    const handleRemoveSingle = async (index) => {
        try {
            if (index >= 0 && index < data.length) { // Check for valid index
                const removedItem = data[index]; // Get the item to be removed
                const response = await axios.post(
                    "http://localhost:3300/api/removesinlgefromcart",
                    {
                        data: { item: removedItem, userEmail }, // Send the entire item object
                    }
                );
                console.log("remove", response.data);

                // Update local cart state (optional)
                setData(data.filter((_, i) => i !== index)); // Filter out based on index
            } else {
                console.error("Invalid index for removal:", index);
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            if (!selectedItems.length) {
                return; // Handle no items selected case (optional)
            }

            const selectedItemsWithSize = selectedItems.map((index) => data[index]);

            const response = await axios.post(
                "http://localhost:3300/api/removeselectedfromcart",
                { data: { items: selectedItemsWithSize, email: userEmail } } // Send selected items with size
            );
            console.log("remove", response.data);
        } catch (error) {
            console.error("Error removing items from cart:", error);
        }
    };




    const handleCOnfirmRemoveAllSelected = () => {
        const isTrue = window.confirm("Are you sure you want to remove all the selected items?");

        if (isTrue) {
            handleRemoveAllSelected();
        }
    }

    // ... (existing imports and component code)
    const moveSelectedToMyOrder = async () => {
        try {
            if (!selectedItems.length) {
                return; // No items selected
            }

            const selectedItemsFromCart = selectedItems.map(index => data[index]);

            const response = await axios.post(
                "http://localhost:3300/api/movetomyorder",
                { items: selectedItemsFromCart, email: userEmail }
            );

            console.log("move to myOrder", response.data);

            // Clear selectedItems after moving to myOrder
            setSelectedItems([]);
        } catch (error) {
            console.error("Error moving selected items to myOrder:", error);
        }
    };

    // Assuming this function is called when the user clicks a button to move selected items to myOrder


    const handleCheckout = async () => {
        moveSelectedToMyOrder();

    };




    return (
        <>
            {data.length > 0 ? (
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
                                    <th scope='col'></th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.map((food, index) => (
                                    <tr key={food._id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(food._id)}
                                                onChange={() => handleSelect(index)}
                                            />
                                        </td>
                                        <td>{food._id}</td>
                                        <td>{food.name}</td>
                                        <td>{food.qty}</td>
                                        <td>{food.size}</td>
                                        <td>₹{food.price}</td>
                                        <td>{food.image}</td>
                                        <td><button className='btn btn-sm btn-outline-danger' onClick={() => handleRemoveSingle(index)}>Remove</button></td>
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
                                        <button className="btn btn-danger" disabled={!selectedItems.length} onClick={handleDeleteSelected}>
                                            Delete Selected ({selectedItems.length})
                                        </button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                        <div><h1 className='text-light'>Total Price : {totalPrice}</h1></div>
                        <button className="btn btn-success" onClick={handleCheckout} disabled={!selectedItems.length}>
                            Checkout ({selectedItems.length})
                        </button>
                    </div>
                </div>
            ) : (
                <h1>Your Cart is Empty!</h1>
            )}
        </>
    );
}

export default Cart