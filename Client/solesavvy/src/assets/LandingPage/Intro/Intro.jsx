import React from 'react'
import './Intro.css'
import { FaArrowRightLong } from "react-icons/fa6";
function Intro() {
  return (
    <div className='intro'>
        <h1>Find Your Fit, Flaunt Your Style.</h1>
        <button className='btn_intro'>Shop <FaArrowRightLong /></button>
    </div>
  )
}

export default Intro
