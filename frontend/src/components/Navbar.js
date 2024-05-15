import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import Model from '../modeljs'
import Cart from '../pages/Cart'
import fooddeliveryImage from '../Images/fooddelivery2.png';
import { myContext, useCart } from './ContextReducer'

const Navbar = () => {

  const authToken = localStorage.getItem('authToken');

  const { data, setData, loguser } = useContext(myContext)

  const [cartlen,setCartlen]=useState(0)

  useEffect(()=>{
    setCartlen(data.length)
  },[data])
  // const data=useCart()

  const [cartView, setCartView] = useState(false)
  const navigate = useNavigate()
  console.log("loguser", loguser);
  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userId")
    setData([])
    navigate("/login")
  }

  const updateCartView = () => {
    setCartView((prevCartView) => !prevCartView);
    navigate('/cart')
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container-fluid">

          <Link className="navbar-brand fs-1" to="/">TAKE<img className='del' style={{ marginRight: "5px", width: '40px', height: '40px', paddingBottom: '7px' }} src={fooddeliveryImage} alt='img' />AWAY</Link>

          {
                  loguser && <h2>Hi, {loguser.name}!</h2>

                }
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2">
              <li className="nav-item">
                <Link className="nav-link active fs-5" aria-current="page" to="/">Home</Link>
              </li>

              {
                authToken ?
                  <li className="nav-item">
                    <Link className="nav-link active fs-5" aria-current="page" to="/myorders">My Orders</Link>
                  </li>
                  : ""
              }
              <li>
               
              </li>
            </ul>

            {
              !authToken ?
                <div className='d-flex'>
                  <Link className="btn bg-white text-success mx-1" to="/login">Login</Link>
                  <Link className="btn bg-white text-success mx-1" to="/signup">Sign Up</Link>
                </div>
                : <div>
                  <button className="btn bg-white text-success mx-1" onClick={updateCartView}>
                    My Cart <Badge pill bg="danger">{cartlen}</Badge>
                  </button>
                  {
                    cartView ? <Model onClose={() => setCartView(false)}><Cart /></Model> : null
                  }
                  <button onClick={handleLogout} className="btn bg-white text-success mx-1">Logout</button>
                </div>
            }

          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar