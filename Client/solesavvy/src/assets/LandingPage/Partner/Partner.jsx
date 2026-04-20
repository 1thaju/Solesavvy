import React, { useRef } from 'react'
import { motion, useScroll, useVelocity, useSpring, useTransform, useAnimationFrame, useMotionValue } from 'framer-motion'
import './Partner.css'

const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

function Partner() {
  const baseVelocity = -2;
  const directionFactor = useRef(1);
  const baseX = useMotionValue(0);
  
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-45, -20, v)}%`);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className='par'>
      <div className="partner-header">
        <h2>Allies</h2>
      </div>
      <div className='marquee-container'>
        <motion.div className='partners-track' style={{ x }}>
          {/* Double the list for seamless looping */}
          {[1, 2, 3, 4].map((_, i) => (
            <React.Fragment key={i}>
              <div className='Part_nike partner-item'></div>
              <div className='Part_vans partner-item'></div>
              <div className='Part_adidas partner-item'></div>
              <div className='Part_puma partner-item'></div>
              <div className='Part_converse partner-item'></div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Partner
