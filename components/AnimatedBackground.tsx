'use client';

import { useEffect, useState } from 'react';
import styles from './AnimatedBackground.module.css';

interface Circle {
  id: number;
  x: string | number;
  y: string | number;
  size: number;
  mobileSize: number;
  gradient: string;
}

const AnimatedBackground = () => {
  const [circles, setCircles] = useState<Circle[]>([]);

  const fixedCircles = [
    { x: '10%', y: '20%', size: 400, mobileSize: 200, gradient: 'from-purple-300/30 to-violet-300/30' },
    { x: '80%', y: '10%', size: 500, mobileSize: 250, gradient: 'from-pink-300/20 to-purple-300/20' },
    { x: '50%', y: '60%', size: 600, mobileSize: 300, gradient: 'from-violet-400/20 to-purple-400/20' },
    { x: '85%', y: '70%', size: 450, mobileSize: 225, gradient: 'from-fuchsia-300/25 to-purple-300/25' },
    { x: '25%', y: '85%', size: 550, mobileSize: 275, gradient: 'from-purple-400/20 to-pink-400/20' },
    { x: '40%', y: '30%', size: 480, mobileSize: 240, gradient: 'from-violet-300/25 to-fuchsia-300/25' },
    { x: '70%', y: '40%', size: 520, mobileSize: 260, gradient: 'from-purple-500/20 to-violet-500/20' },
    { x: '15%', y: '50%', size: 430, mobileSize: 215, gradient: 'from-pink-400/20 to-violet-400/20' },
    { x: '60%', y: '15%', size: 470, mobileSize: 235, gradient: 'from-purple-300/30 to-violet-300/30' },
    { x: '30%', y: '65%', size: 580, mobileSize: 290, gradient: 'from-violet-400/20 to-purple-400/20' },
    { x: '75%', y: '85%', size: 490, mobileSize: 245, gradient: 'from-fuchsia-300/25 to-purple-300/25' },
    { x: '90%', y: '35%', size: 510, mobileSize: 255, gradient: 'from-purple-500/20 to-violet-500/20' }
  ];

  useEffect(() => {
    const generateCircles = () => {
      const newCircles = fixedCircles.map((circle, i) => ({
        id: i,
        x: circle.x,
        y: circle.y,
        size: window.innerWidth <= 768 ? circle.mobileSize : circle.size,
        mobileSize: circle.mobileSize,
        gradient: circle.gradient
      }));
      setCircles(newCircles);
    };

    generateCircles();
    window.addEventListener('resize', generateCircles);
    return () => window.removeEventListener('resize', generateCircles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {circles.map((circle) => (
        <div
          key={circle.id}
          className={`
            absolute rounded-full bg-gradient-to-r ${circle.gradient} 
            blur-3xl opacity-70 ${styles.breathingCircle}
            max-md:opacity-40 max-md:blur-2xl
          `}
          style={{
            left: circle.x,
            top: circle.y,
            width: `${circle.size}px`,
            height: `${circle.size}px`
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;