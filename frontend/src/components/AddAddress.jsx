import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AddAddress() {
    const [house, setHouse] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [pin, setPin] = useState("");
    const [phone, setPhone] = useState("");
    const [userAddress, setUserAddress] = useState([]);
    const [isAddNew, setIsAddNew] = useState(false);
    const [editRaw, setEditRaw] = useState(null);

    const userEmail = localStorage.getItem("userEmail");

    const handleSaveAddress = async () => {
        try {
            const res = await axios.post("http://localhost:3300/api/addaddress", {
                email: userEmail,
                house,
                street,
                city,
                pin,
                phone
            });
            console.log(res.data);
            setHouse("");
            setCity("");
            setPin("");
            setPhone("");
            setStreet("");
            setIsAddNew(false);
            fetchUserAddress();
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleEditAddress = (addressId) => {
        setEditRaw(addressId);
    };

    const handleUpdateAddress = async (addressId) => {
        try {
            await axios.put(`http://localhost:3300/api/updateaddress/${addressId}`, {
                house,
                street,
                city,
                pin,
                phone
            });
            setEditRaw(null);
            fetchUserAddress();
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        fetchUserAddress();
    }, []);

    const fetchUserAddress = () => {
        axios.get(`http://localhost:3300/api/address/${userEmail}`)
            .then((res) => {
                setUserAddress(res.data.userAd);
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <div>
                <div>
                    <h3>Select Address</h3>
                    <table border={1} style={{ border: "1px solid black", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <td>House Name/No.</td>
                                <td>Street</td>
                                <td>City</td>
                                <td>PIN</td>
                                <td>Phone</td>
                                <td>Edit/Delete</td>
                            </tr>
                        </thead>
                        <tbody>
                            {userAddress.map(address =>
                                <tr key={address.id}>
                                    <td>
                                        {editRaw === address.id ?
                                            <input type="text" value={house} onChange={(e) => setHouse(e.target.value)} />
                                            :
                                            address.house
                                        }
                                    </td>
                                    <td>
                                        {editRaw === address.id ?
                                            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} />
                                            :
                                            address.street
                                        }
                                    </td>
                                    <td>
                                        {editRaw === address.id ?
                                            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                                            :
                                            address.city
                                        }
                                    </td>
                                    <td>
                                        {editRaw === address.id ?
                                            <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} />
                                            :
                                            address.pin
                                        }
                                    </td>
                                    <td>
                                        {editRaw === address.id ?
                                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                            :
                                            address.phone
                                        }
                                    </td>
                                    <td>
                                        {editRaw === address.id ?
                                            <button onClick={() => handleUpdateAddress(address.id)}>Save</button>
                                            :
                                            <button onClick={() => handleEditAddress(address.id)}>Edit</button>
                                        }
                                        {/* Add delete functionality here */}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <button onClick={() => setIsAddNew(true)}>Add New</button>
                </div>
            </div>
            {isAddNew &&
                <div>
                    <input type="text" placeholder='Enter House Name or Number' value={house} onChange={(e) => setHouse(e.target.value)} />
                    <input type="text" placeholder='Enter street' value={street} onChange={(e) => setStreet(e.target.value)} />
                    <input type="text" placeholder='Enter City' value={city} onChange={(e) => setCity(e.target.value)} />
                    <input type="text" placeholder='Enter PIN Number' value={pin} onChange={(e) => setPin(e.target.value)} />
                    <input type="text" placeholder='Enter Phone Number' value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <button onClick={handleSaveAddress}>Save Address</button>
                </div>
            }
        </div>
    );
}

export default AddAddress;
