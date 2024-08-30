import React, { useState } from 'react';
import Signup from '../src/assets/signup/Signup'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './assets/login/Login';
import Dash from './assets/dash/Dash'
import Land from './assets/LandingPage/Land';
import ProductDetail from './assets/ProductDetails/ProductDetail';
import Category from './assets/Category/Category';
import NavBar from './assets/Navbar/NavBar';

function App() {
  const [category, setCategory] = useState('');
  return (
   <Router>
     <NavBar setCategory={setCategory} />
    <Routes>
      <Route path='/signup' element={<Signup/>} />
      <Route path='/login' element = {<Login/>}/>
      <Route path='/dash' element={<Dash/>} />
      <Route path='/' element={<Land/>} />
      <Route path='/product/:id' element={<ProductDetail/>} />
      <Route path="/category" element={<Category category={category} />} />    </Routes>
   </Router>
  )
}

export default App
