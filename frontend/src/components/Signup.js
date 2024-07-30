import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PopUp from "./PopUp";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState("");
    const [popUpVisible, setPopupVisible] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post('http://localhost:3300/api/createuser', { name, email, password })
            .then(res => {
                console.log(res.data);
                setPopupVisible(true);
                setShowPopup(`${name} has been registered successfully!! You will be redirected to Login Page`);
                setTimeout(() => {
                    setPopupVisible(false);
                    navigate('/login');
                }, 3000); // Redirect after 3 seconds
            })
            .catch(err => {
                console.log(err);
                setShowPopup("Error: Failed to register user. Please try again.");
                setPopupVisible(true);
                setTimeout(() => {
                    setPopupVisible(false);
                }, 3000); // Hide popup after 3 seconds
            })
            .finally(() => setLoading(false));
    }

    const closePopup = () => {
        setPopupVisible(false);
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name">
                            <strong>Name</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            autoComplete="off"
                            name="name"
                            className="form-control rounded-0"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            className="form-control rounded-0"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p>Already Have an Account?<Link to='/login' style={{textDecoration:"None",color:'black',fontWeight:"bold"}}> Please Login Here</Link></p>
                <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    Login
                </Link>
            </div>
            {popUpVisible && <PopUp message={showPopup} onClose={closePopup} />}
        </div>
    );
}

export default Signup;
