import React, { useState } from 'react';
import Signup from '../src/assets/signup/Signup'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './assets/login/Login';
import Dash from './assets/dash/Dash'
import Land from './assets/LandingPage/Land';
import ProductDetail from './assets/ProductDetails/ProductDetail';
import Category from './assets/Category/Category';
import NavBar from './assets/Navbar/NavBar';
import Cart from './assets/Cart/Cart';
import Checkout from './assets/Checkout/Checkout';
import Orders from './assets/Orders/Orders';
import AdminDashboard from './assets/Admin/AdminDashboard';
import SmoothScroll from './assets/LandingPage/SmoothScroll';

function App() {
  const [category, setCategory] = useState('');
  return (
   <Router>
    <SmoothScroll>
     <NavBar setCategory={setCategory} />
     <Routes>
      <Route path='/signup' element={<Signup/>} />
      <Route path='/login' element = {<Login/>}/>
      <Route path='/dash' element={<Dash/>} />
      <Route path='/' element={<Land/>} />
      <Route path='/product/:id' element={<ProductDetail/>} />
      <Route path="/category" element={<Category category={category} />} />
      <Route path="/cart" element={<Cart/>} />
      <Route path="/checkout" element={<Checkout/>} />
      <Route path="/orders" element={<Orders/>} />
      <Route path="/admin" element={<AdminDashboard/>} />
     </Routes>
    </SmoothScroll>
   </Router>
  )
}

export default App
