import './App.css';
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import FIleUpload from './components/FIleUpload';
import NewSession from './components/NewSession';
import { CartProvider } from './components/ContextReducer';
import MyOrder from './pages/MyOrder';
import { useState } from 'react';
import Rough from './components/rough';
import Cart from './pages/Cart';
import Adminlogin from './components/Adminlogin';
import Admindashboard from './components/Admindashboard';


function App() {
  const authToken = localStorage.getItem('authToken');


  return (
    <BrowserRouter>
    <Rough/>
      {/* <NewSession/> */}
      {/* <State></State> */}
      <CartProvider>
        <div>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignUpPage />} />
            {/* <Route path='/fileupload' element={<FIleUpload />} /> */}
            {/* <Route path='/state' element={<State />} /> */}
            <Route path='/myorders' element={<MyOrder />} />
            <Route path='/cart' element={<Cart/>} />

            <Route path='/admin/login' element={<Adminlogin/>} />
            <Route path='/admin/dashboard' element={<Admindashboard/>} />

          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
