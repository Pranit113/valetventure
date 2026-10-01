import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { TripDay } from '../../types/api';
import DayCard from './DayCard';
import { cn } from '../../lib/utils';

interface DaySwiperProps {
  days: TripDay[];
  tripCurrency: string;
  onDayChange?: (index: number) => void;
}

export default function DaySwiper({ days, tripCurrency, onDayChange }: DaySwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  // Calculate width for snapping
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      // 85% of container width + gap
      setCardWidth(containerRef.current.offsetWidth * 0.85 + 16);
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        setCardWidth(containerRef.current.offsetWidth * 0.85 + 16);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragEnd = (e: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    // Determine direction based on drag distance and velocity
    let direction = 0;
    if (offset < -50 || velocity < -500) direction = 1;
    else if (offset > 50 || velocity > 500) direction = -1;

    let nextIndex = currentIndex + direction;
    // Bound the index
    nextIndex = Math.max(0, Math.min(nextIndex, days.length - 1));

    setCurrentIndex(nextIndex);
    if (onDayChange) onDayChange(nextIndex);
    
    // Snap to the new index
    controls.start({
      x: -nextIndex * cardWidth,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    });
  };

  // Allow clicking on dots to navigate
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    if (onDayChange) onDayChange(index);
    controls.start({
      x: -index * cardWidth,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    });
  };

  if (!days || days.length === 0) return null;

  return (
    <div className="w-full py-4 flex flex-col items-center overflow-hidden touch-none" ref={containerRef}>
      <motion.div
        drag="x"
        dragConstraints={{
          left: -(days.length - 1) * cardWidth,
          right: 0
        }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="flex gap-4 w-full px-[7.5%]"
      >
        {days.map((day, index) => (
          <div 
            key={day.id} 
            className="w-[85vw] max-w-[340px] shrink-0" 
            style={{ height: '400px' }}
          >
            <DayCard day={day} tripCurrency={tripCurrency} />
          </div>
        ))}
      </motion.div>
      
      {/* Dots Indicator */}
      <div className="flex gap-2 mt-6">
        {days.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              currentIndex === index 
                ? "bg-primary w-6" 
                : "bg-border dark:bg-border-dark hover:bg-primary/50"
            )}
            aria-label={`Go to day ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
