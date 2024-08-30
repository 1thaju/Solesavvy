import React from 'react'
import './Footer.css'
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";
function Footer() {
  return (
    <div className='foot'>
    <div className='footer'>    
        <ul>
        <h3>Company Information</h3>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press Releases</li>
        </ul>
        <ul>
            <h3>Customer Service</h3>
            <li>FAQs</li>
            <li>Shipping & Returns</li>
            <li>Order Tracking</li>
            <li>Size Guide</li>
            <li>Payment Methods</li>
        </ul>
        <ul>
            <h3>Legal Information</h3>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Cookie Policy</li>
            <li>Accessibility Statement</li>
        </ul>
        <div className="social">
        <FaFacebook />
        <RiInstagramFill />
        <FaXTwitter />
        </div>
    </div>
    <div className='copy'>
        <label>In Case Of Concern,<b>Contact us</b></label>
        <label>www.solesavvy.com|All rights Reserved</label>
        <label>thajulniyas100@gmail.com</label>
    </div>
    </div>
  )
}

export default Footer
