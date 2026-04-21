import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoCartOutline } from "react-icons/io5";
import { FiHeart } from "react-icons/fi";
import { BsLightningCharge } from "react-icons/bs";
import NavBar from '../Navbar/NavBar';
import Footer from '../LandingPage/Footer/Footer';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';
import './Productdetail.css'

function ProductDetail() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [booking, setBooking] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://solesavvy.onrender.com/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(id, 1, selectedSize);
      alert('Item added to cart!');
    } catch (error) {
      alert(error.message);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBookNow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to proceed with booking');
      navigate('/login');
      return;
    }

    if (!selectedSize) {
      alert('Please select a size to book');
      return;
    }

    setBooking(true);
    try {
      await addToCart(id, 1, selectedSize);
      navigate('/checkout');
    } catch (error) {
      alert(error.message);
    } finally {
      setBooking(false);
    }
  };

  if (!product) return (
    <div className="product-loading">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="spinner"
      />
    </div>
  );

  const sizes = ['6', '7', '8', '9', '10', '11'];
  
  // Clean image url handling
  const imageUrl = product.imageUrl?.startsWith('http') 
    ? product.imageUrl 
    : `http://localhost:5000${product.imageUrl?.trim()}`;

  return (
    <React.Fragment>
    <div className='product-detail-container'>
      <motion.div 
        className="product-image-section"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <img src={imageUrl} alt={product.name} />
      </motion.div>
      
      <motion.div 
        className="product-info-section"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <div className="prod-header">
          <p className="prod-brand">{product.description}</p>
          <h1>{product.name}</h1>
          <p className="prod-category">{product.category}</p>
        </div>
        
        <div className="prod-price">
          <h2>₹{product.price}</h2>
          <p className="tax-inclusive">Inclusive of all taxes</p>
        </div>

        <div className="prod-sizes">
          <div className="size-header">
            <label>Select Size (UK/India)</label>
            <span className="size-guide">Size Guide</span>
          </div>
          <div className="size-grid">
            {sizes.map((size) => (
              <button
                key={size}
                className={`size-box ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                UK {size}
              </button>
            ))}
          </div>
        </div>

        <div className='action-buttons'>
          <button 
            className="book-now-btn" 
            onClick={handleBookNow} 
            disabled={booking || !selectedSize}
          >
            {booking ? 'Processing...' : <><BsLightningCharge /> Book Now</>}
          </button>
          
          <div className="secondary-actions">
            <button 
              className="add-cart-btn" 
              onClick={handleAddToCart} 
              disabled={addingToCart || !selectedSize}
            >
              {addingToCart ? 'Adding...' : 'Add to Bag'}
            </button>
            <button className="favorite-btn">
              <FiHeart />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
    <Footer/>
    </React.Fragment>
  );
}

export default ProductDetail;
