import React, { useEffect, useRef, useState } from 'react';

interface ThreeDCarouselCardProps {
  children: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

/**
 * ThreeDCarouselCard - Positions work cards in a true 3D Perspective Horizontal Carousel.
 * Active strictly on desktop screens (>= 1024px) with horizontal scroll.
 * - Center card: faces viewer directly (rotateY: 0deg, scale: 1, translateZ: 0px).
 * - Left/right cards: smooth 3D perspective yaw (rotateY) angled toward the viewer,
 *   receding naturally in Z-space.
 * - Smaller screens (< 1024px): completely disabled, standard flat responsive layout.
 */
export const ThreeDCarouselCard: React.FC<ThreeDCarouselCardProps> = ({
  children,
  scrollContainerRef,
  className = '',
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (!desktop && innerRef.current) {
        innerRef.current.style.transform = 'none';
        innerRef.current.style.opacity = '1';
      }
    };
    handleResize();

    let ticking = false;

    const update3D = () => {
      ticking = false;
      if (!innerRef.current || !outerRef.current) return;

      if (window.innerWidth < 1024) {
        innerRef.current.style.transform = 'none';
        innerRef.current.style.opacity = '1';
        return;
      }

      const rect = outerRef.current.getBoundingClientRect();
      // Skip transform computation if card is completely out of viewport
      if (rect.right < -400 || rect.left > window.innerWidth + 400) {
        return;
      }

      const cardCenter = rect.left + rect.width / 2;
      const screenCenter = window.innerWidth / 2;
      const dist = cardCenter - screenCenter;

      const maxDist = Math.max(680, window.innerWidth * 0.52);
      const factor = Math.max(-1, Math.min(1, dist / maxDist));

      // Perspective yaw: left cards rotate right (positive), right cards rotate left (negative)
      const maxRotateY = 18; // degrees
      const rotateY = -factor * maxRotateY;

      // Recedes back in Z-space as card moves away from center
      const absFactor = Math.abs(factor);
      const translateZ = -absFactor * 120; // px
      const scale = Math.max(0.93, 1 - absFactor * 0.08);
      const opacity = Math.max(0.88, 1 - absFactor * 0.16);

      innerRef.current.style.transform = `perspective(1200px) translate3d(0, 0, ${translateZ.toFixed(1)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      innerRef.current.style.opacity = opacity.toFixed(3);

      // Elevate center card z-index so neighboring 3D perspective cards never obstruct clicks
      const zIndex = Math.round((1 - absFactor) * 50) + 10;
      outerRef.current.style.zIndex = String(zIndex);
    };

    const handleScroll = () => {
      if (window.innerWidth >= 1024 && !ticking) {
        ticking = true;
        requestAnimationFrame(update3D);
      }
    };

    if (window.innerWidth >= 1024) {
      update3D();
    }

    const scrollEl = scrollContainerRef?.current || document.getElementById('main-horizontal-container');
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      if (scrollEl) {
        scrollEl.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollContainerRef]);

  // For mobile & tablet screens: standard responsive layout without 3D perspective
  if (!isDesktop) {
    return (
      <div ref={outerRef} className={`w-full ${className}`}>
        <div ref={innerRef} className="w-full h-full">
          {children}
        </div>
      </div>
    );
  }

  // Desktop (>= 1024px): 3D Perspective Horizontal Carousel
  return (
    <div
      ref={outerRef}
      className={`relative shrink-0 overflow-visible cursor-pointer ${className}`}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        ref={innerRef}
        className="w-full h-full overflow-visible transition-[opacity,transform] duration-75 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 50%',
          backfaceVisibility: 'hidden',
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </div>
    </div>
  );
};
