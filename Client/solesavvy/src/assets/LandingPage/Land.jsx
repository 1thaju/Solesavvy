import React from 'react'
import './land.css'
import Intro from './Intro/Intro';
import Partner from './Partner/Partner';
import Products from '../Products/Products'
import Footer from './Footer/Footer';

function Land() {
  return (
    <div className='land'>
      <Intro/>
      <Partner/>
      <Products/>
      <Footer/>
    </div>
  );
}

export default Land;
