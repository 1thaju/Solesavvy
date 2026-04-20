import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Intro.css'
import { FaArrowRightLong } from "react-icons/fa6";
import { motion, useScroll, useTransform } from 'framer-motion';

function Intro() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleShopClick = () => {
    // Scroll to products section
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };
  
  const title = "Find Your Fit, Flaunt Your Style.";
  const words = title.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 50,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <div className='intro' ref={ref}>
        <motion.div 
          className="intro-bg" 
          style={{ y: backgroundY }}
        />
        <div className="intro-overlay" />
        
        <motion.div className="intro-content" style={{ y: textY, opacity }}>
          <motion.h1
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {words.map((word, index) => (
              <motion.span variants={child} key={index} style={{ display: 'inline-block', marginRight: '16px' }}>
                {word}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.button 
            className='btn_intro' 
            onClick={handleShopClick}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Shop Now <FaArrowRightLong />
          </motion.button>
        </motion.div>
    </div>
  )
}

export default Intro
