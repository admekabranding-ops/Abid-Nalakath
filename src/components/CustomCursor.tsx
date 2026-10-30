import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable for pointer fine (mouse) and no reduced motion
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchDevice || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('a') ||
        target?.closest('button') ||
        target?.closest('input') ||
        target?.closest('textarea') ||
        target?.closest('select') ||
        target?.closest('[role="button"]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-50 transition-transform duration-75 ease-out"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      }}
    >
      {/* Center dot */}
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
          isHovering
            ? 'w-10 h-10 bg-[#FF5A1F]/30 backdrop-blur-[2px] border border-[#FF5A1F]'
            : 'w-3 h-3 bg-[#FF5A1F] shadow-[0_0_12px_#FF5A1F]'
        }`}
      />
    </div>
  );
};
