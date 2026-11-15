import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  defaultRotate: number;
  hoverRotate: number;
}

// 6 curated life and moment photos (using optimized WebP)
const PEEK_PHOTOS: PhotoItem[] = [
  {
    id: 'ph2',
    src: '/Home/Ph2.webp',
    alt: 'Kay life moment 2',
    defaultRotate: -6,
    hoverRotate: -1,
  },
  {
    id: 'ph4',
    src: '/Home/Ph4.webp',
    alt: 'Kay life moment 4',
    defaultRotate: 5,
    hoverRotate: 1,
  },
  {
    id: 'ph3',
    src: '/Home/Ph3.webp',
    alt: 'Kay life moment 3',
    defaultRotate: -4.5,
    hoverRotate: -0.5,
  },
  {
    id: 'ph6',
    src: '/Home/Ph6.webp',
    alt: 'Kay life moment 6',
    defaultRotate: 5.5,
    hoverRotate: 1,
  },
  {
    id: 'ph1',
    src: '/Home/Ph1.webp',
    alt: 'Kay life moment 1',
    defaultRotate: -5,
    hoverRotate: -0.5,
  },
  {
    id: 'ph5',
    src: '/Home/Ph5.webp',
    alt: 'Kay life moment 5',
    defaultRotate: 6,
    hoverRotate: 1.5,
  },
];

// Horizontal playful peekaboo photo row specifically designed to sit under the About section
export const PeekPhotosRow = React.memo(function PeekPhotosRow({
  hoverLift = -136,
}: {
  size?: 'about';
  hoverLift?: number;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
      setCanHover(mq.matches);
      const listener = (e: MediaQueryListEvent) => setCanHover(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth < 640);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  useEffect(() => {
    if (!hoveredId) return;
    const handleOutside = () => setHoveredId(null);
    window.addEventListener('click', handleOutside);
    window.addEventListener('touchend', handleOutside);
    return () => {
      window.removeEventListener('click', handleOutside);
      window.removeEventListener('touchend', handleOutside);
    };
  }, [hoveredId]);

  const photoWidthClass =
    'w-[48px] min-[360px]:w-[50px] min-[375px]:w-[54px] min-[414px]:w-[60px] sm:w-[100px] md:w-[136px] lg:w-[166px] xl:w-[178px]';

  return (
    <div
      className="relative flex items-center justify-start -space-x-1.5 min-[375px]:-space-x-2 sm:-space-x-3 md:-space-x-4 lg:-space-x-4.5 xl:-space-x-5 select-none overflow-visible pt-4 sm:pt-6 pb-2 w-full max-w-[1020px] [contain:layout_style]"
    >
      {PEEK_PHOTOS.map((photo, index) => {
        const isHovered = hoveredId === photo.id;

        return (
          <motion.div
            key={photo.id}
            id={`peek-photo-row-${photo.id}`}
            className="relative shrink-0 cursor-pointer origin-bottom touch-manipulation focus:outline-none"
            role="button"
            tabIndex={0}
            aria-label={photo.alt}
            style={{
              zIndex: isHovered ? 80 : index + 10,
            }}
            initial={false}
            animate={{
              y: isHovered ? (isMobile ? -56 : hoverLift) : 0,
              rotate: isHovered ? photo.hoverRotate : photo.defaultRotate,
              scale: isHovered ? (isMobile ? 1.06 : 1.1) : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 24,
              mass: 0.65,
            }}
            onMouseEnter={canHover ? () => setHoveredId(photo.id) : undefined}
            onMouseLeave={canHover ? () => setHoveredId((current) => (current === photo.id ? null : current)) : undefined}
            onClick={(e) => {
              e.stopPropagation();
              setHoveredId((current) => (current === photo.id ? null : photo.id));
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                setHoveredId((current) => (current === photo.id ? null : photo.id));
              }
            }}
          >
            <div
              className={`bg-white p-1 sm:p-2.5 rounded-[5px] sm:rounded-[10px] border border-black/10 transition-shadow duration-300 ${
                isHovered
                  ? 'shadow-[0_24px_45px_-6px_rgba(0,0,0,0.32),0_12px_20px_-4px_rgba(0,0,0,0.18)] ring-1 ring-black/10'
                  : 'shadow-[0_4px_14px_-2px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.04)]'
              }`}
            >
              <div className={`${photoWidthClass} aspect-[4/5] overflow-hidden rounded-[3px] sm:rounded-[6px] bg-[#F0EDE8]`}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover pointer-events-none brightness-[1.04] contrast-[1.02]"
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});
