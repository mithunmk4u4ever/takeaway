import React, { useState } from 'react'
import axios from 'axios'
function AddAddress() {
    const [house, setHouse] = useState("")
    const [street, setStreet] = useState("")
    const [city, setCity] = useState("")
    const [pin, setPin] = useState("")
    const [phone, setPhone] = useState("")
    const [userAddress, setUserAddress] = useState([])

    const userEmail = localStorage.getItem("userEmail")

    const handleSaveAddress = () => {
        axios.post("http://localhost:3300/api/addaddress", {
            email: userEmail,
            house,
            street,
            city,
            pin,
            phone
        })
            .then((res) => {
                console.log(res.data.userAd)
                setUserAddress(res.data.userAd)
                setHouse("")
                setCity("")
                setPin("")
                setPhone("")
                setStreet("")
            })
            .catch(err => console.log(err))


    }
    return (
        <div>
            <div>
                <h3>Select Address</h3>
                <table>
                    <tr>
                        t
                    </tr>
                    {
                        userAddress.map(address =>
                            <tr>
                                <td>{address.house}</td>
                                <td>{address.street}</td>
                                <td>{address.city}</td>
                                <td>{address.pin}</td>
                                <td>{address.phone}</td>
                            </tr>
                        )
                    }

                </table>
            </div>
            <div>
                <input type="text" placeholder='Enter House Name or Number' onChange={(e) => setHouse(e.target.value)} />
                <input type="text" placeholder='Enter street' onChange={(e) => setStreet(e.target.value)} />

                <input type="text" placeholder='Enter City' onChange={(e) => setCity(e.target.value)} />

                <input type="text" placeholder='Enter PIN Number' onChange={(e) => setPin(e.target.value)} />
                <input type="text" placeholder='Enter Phone Number' onChange={(e) => setPhone(e.target.value)} />

                <button onClick={handleSaveAddress}>Save Address</button>
            </div>
        </div>
    )
}

export default AddAddress