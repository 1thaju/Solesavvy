import React from 'react'
import './land.css'
import Intro from './Intro/Intro';
import Partner from './Partner/Partner';
import Products from '../Products/Products'
import Footer from './Footer/Footer';
import { motion, useScroll, useSpring } from 'framer-motion';

function Land() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className='land'>
      <motion.div className="progress-bar" style={{ scaleX }} />
      <Intro/>
      <Partner/>
      <Products/>
      <Footer/>
    </div>
  );
}

export default Land;
