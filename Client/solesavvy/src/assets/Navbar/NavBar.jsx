import React, { useState } from 'react';
import './Navbar.css';
import { IoCartOutline } from "react-icons/io5";
import { FiHeart } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import { MdOutlineWavingHand } from "react-icons/md";
import axios from 'axios';

function NavBar({ setCategory }) {
    const elements = ["Male", "Women", "Kids", "Sports"];
    const [visible, setVisible] = useState(false);
    const token = localStorage.getItem('token');
    const nav = useNavigate();

    const handleCategory = async (category) => {
        setCategory(category);
        try {
            const response = await axios.post('http://localhost:5000/api/products', { category });
            console.log(response.data);  // For debugging
            nav('/category');
        } catch (error) {
            console.error('Error fetching products:', error.message);
        }
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
        nav('/login');
    };

    return (
        <div>
            <div className='navbar'>
                <a className='logo'>SoleSavvy</a>
                <div className='Category'>
                    {elements.map((element, index) => (
                        <a key={index} className='elements' onClick={() => handleCategory(element)}>
                            {element}
                        </a>
                    ))}
                </div>
                <div className='nav_elements'>
                    <a><IoCartOutline /></a>
                    <a><FiHeart /></a>
                    <a onClick={togglePop}><RxAvatar /></a>
                </div>
            </div>
            {visible && (
                <div className='signup'>
                    <label>Hi Boss <MdOutlineWavingHand /> You are Currently Logged In</label>
                    <button onClick={signout}>SignOut</button>
                </div>
            )}
        </div>
    );
}

export default NavBar;
