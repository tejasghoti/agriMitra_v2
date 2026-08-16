import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface ScrollMarqueeProps {
  images: string[];
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

export function ScrollMarquee({ images, direction = 'left', speed = 500, className = '' }: ScrollMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // If reduced motion is preferred, disable the transform completely
  const xTransform = useTransform(
    scrollYProgress, 
    [0, 1], 
    direction === 'left' ? [0, -speed] : [-speed, 0]
  );
  
  const x = prefersReducedMotion ? 0 : xTransform;

  // Duplicate the array for seamless loop
  const duplicatedImages = [...images, ...images, ...images];

  return (
    <div ref={containerRef} className={`overflow-hidden whitespace-nowrap py-4 ${className}`}>
      <motion.div style={{ x }} className="flex gap-4 md:gap-8 w-max items-center">
        {duplicatedImages.map((src, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl flex-shrink-0" style={{ height: className.includes('h-') ? undefined : '200px' }}>
            <img 
              src={src} 
              alt="Marquee item" 
              loading="lazy"
              className="h-full w-auto object-cover" 
              onError={(e) => {
                // Fallback for missing placeholder images
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2364748b'%3EPlaceholder%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
