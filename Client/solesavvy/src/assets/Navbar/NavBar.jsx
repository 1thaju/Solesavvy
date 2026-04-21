import React, { useState } from 'react';
import './Navbar.css';
import { IoCartOutline } from "react-icons/io5";
import { FiHeart, FiMenu, FiX, FiLogOut, FiPackage, FiGrid } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

function NavBar({ setCategory }) {
    const elements = ["Men", "Women", "Kids", "Collections"];
    const [visible, setVisible] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const nav = useNavigate();
    const { getCartItemCount, getCart } = useCart();

    const handleCategory = async (category) => {
        setCategory(category);
        setMobileMenuOpen(false); // Close mobile menu if open
        try {
            const response = await axios.post('https://solesavvy.onrender.com/api/products', { category });
            console.log(response.data);  
            nav('/category');
        } catch (error) {
            console.error('Error fetching products:', error.message);
        }
    };

    const handleCartClick = () => {
        if (!token) {
            alert('Please login to view your cart');
            nav('/login');
            return;
        }
        nav('/cart');
    };

    const togglePop = () => {
        if (token) {
            setVisible(!visible);
        } else {
            nav('/login');
        }
    };

    const signout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setVisible(false);
        setMobileMenuOpen(false);
        window.dispatchEvent(new Event('tokenChanged'));
        nav('/login');
    };

    return (
        <motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className='navbar-container'
        >
            <div className='navbar'>
                <div className='nav-left'>
                    <a className='logo' onClick={() => nav('/')}>SoleSavvy</a>
                </div>
                
                <div className='nav-center hidden-mobile'>
                    <div className='Category'>
                        {elements.map((element, index) => (
                            <a key={index} className='elements' onClick={() => handleCategory(element)}>
                                {element}
                            </a>
                        ))}
                    </div>
                </div>

                <div className='nav-right'>
                    <div className='nav_elements'>
                        <motion.a 
                            onClick={handleCartClick} 
                            className="cart-link"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <IoCartOutline />
                            {token && getCartItemCount() > 0 && (
                                <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="cart-badge"
                                >
                                    {getCartItemCount()}
                                </motion.span>
                            )}
                        </motion.a>
                        <motion.a className="hidden-mobile" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <FiHeart />
                        </motion.a>
                        <div className="profile-wrapper">
                            <motion.a onClick={togglePop} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <RxAvatar />
                            </motion.a>
                            <AnimatePresence>
                                {visible && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className='profile-dropdown'
                                    >
                                        <div className="dropdown-header">
                                            <p className="greet">Hey, <b>{username || 'User'}</b></p>
                                        </div>
                                        <hr className="dropdown-divider" />
                                        <button className="dropdown-item" onClick={() => { nav('/dash'); setVisible(false); }}>
                                            <FiGrid className="drp-icon"/> Dashboard
                                        </button>
                                        <button className="dropdown-item" onClick={() => { nav('/orders'); setVisible(false); }}>
                                            <FiPackage className="drp-icon"/> My Orders
                                        </button>
                                        <hr className="dropdown-divider" />
                                        <button className="dropdown-item logout-btn" onClick={signout}>
                                            <FiLogOut className="drp-icon"/> Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        {/* Hamburger Icon for Mobile */}
                        <div className="mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
                            <FiMenu />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div 
                            className="mobile-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div 
                            className="mobile-drawer"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "tween", duration: 0.3 }}
                        >
                            <div className="drawer-header">
                                <h2>SoleSavvy</h2>
                                <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
                                    <FiX />
                                </button>
                            </div>
                            <div className="drawer-links">
                                {elements.map((element, index) => (
                                    <button key={index} className="drawer-item" onClick={() => handleCategory(element)}>
                                        {element}
                                    </button>
                                ))}
                            </div>
                            <div className="drawer-footer">
                                {!token ? (
                                    <button className="drawer-login-btn" onClick={() => { nav('/login'); setMobileMenuOpen(false); }}>
                                        Login / Sign Up
                                    </button>
                                ) : (
                                    <button className="drawer-logout-btn" onClick={signout}>
                                        <FiLogOut /> Sign Out
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

export default NavBar;
