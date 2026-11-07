import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  defaultRotate: number;
  hoverRotate: number;
  zIndex: number;
}

// 6 curated life and moment photos
export const PEEK_PHOTOS: PhotoItem[] = [
  {
    id: 'ph2',
    src: '/Home/Ph2.JPG',
    alt: 'Kay life moment 2',
    defaultRotate: -6,
    hoverRotate: -1,
    zIndex: 1,
  },
  {
    id: 'ph4',
    src: '/Home/Ph4.png',
    alt: 'Kay life moment 4',
    defaultRotate: 5,
    hoverRotate: 1,
    zIndex: 2,
  },
  {
    id: 'ph3',
    src: '/Home/Ph3.png',
    alt: 'Kay life moment 3',
    defaultRotate: -4.5,
    hoverRotate: -0.5,
    zIndex: 3,
  },
  {
    id: 'ph6',
    src: '/Home/Ph6.png',
    alt: 'Kay life moment 6',
    defaultRotate: 5.5,
    hoverRotate: 1,
    zIndex: 4,
  },
  {
    id: 'ph1',
    src: '/Home/Ph1.jpg',
    alt: 'Kay life moment 1',
    defaultRotate: -5,
    hoverRotate: -0.5,
    zIndex: 5,
  },
  {
    id: 'ph5',
    src: '/Home/Ph5.png',
    alt: 'Kay life moment 5',
    defaultRotate: 6,
    hoverRotate: 1.5,
    zIndex: 6,
  },
];

// 3 pairs of 2 photos arranged around the about section text to the right
export const PAIR_RIGHT_TOP: PhotoItem[] = [PEEK_PHOTOS[4], PEEK_PHOTOS[5]]; // Ph1 & Ph5
export const PAIR_RIGHT_MID: PhotoItem[] = [PEEK_PHOTOS[0], PEEK_PHOTOS[1]]; // Ph2 & Ph4
export const PAIR_RIGHT_BOTTOM: PhotoItem[] = [PEEK_PHOTOS[2], PEEK_PHOTOS[3]]; // Ph3 & Ph6

// Left 4 peek photos: aligned vertically abstract
export const LEFT_4_PEEK_PHOTOS: PhotoItem[] = [
  PEEK_PHOTOS[0], // Ph2
  PEEK_PHOTOS[1], // Ph4
  PEEK_PHOTOS[2], // Ph3
  PEEK_PHOTOS[3], // Ph6
];

// Top right peek photos (after the text)
export const PAIR_AFTER_TEXT_TOP_RIGHT: PhotoItem[] = [
  PEEK_PHOTOS[4], // Ph1
  PEEK_PHOTOS[5], // Ph5
];

// Legacy export if needed
export const PAIR_ABOUT_LEFT_BOTTOM = [PEEK_PHOTOS[0], PEEK_PHOTOS[1]];
export const PAIR_AFTER_TEXT_LEFT_BOTTOM = [PEEK_PHOTOS[2], PEEK_PHOTOS[3]];

interface PeekPhotosVerticalAbstractProps {
  photos: PhotoItem[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 4 Peek Photos aligned vertically in an abstract, artistically staggered arrangement
 */
export function PeekPhotosVerticalAbstract({
  photos = LEFT_4_PEEK_PHOTOS,
  className = '',
  size = 'md',
}: PeekPhotosVerticalAbstractProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(false);

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
    const handleOutside = () => setHoveredId(null);
    window.addEventListener('click', handleOutside);
    window.addEventListener('touchend', handleOutside);
    return () => {
      window.removeEventListener('click', handleOutside);
      window.removeEventListener('touchend', handleOutside);
    };
  }, []);

  const sizeStyles = {
    sm: 'w-[80px] xs:w-[92px] sm:w-[108px] md:w-[118px] lg:w-[128px]',
    md: 'w-[90px] xs:w-[104px] sm:w-[122px] md:w-[136px] lg:w-[148px] xl:w-[158px]',
    lg: 'w-[102px] xs:w-[118px] sm:w-[138px] md:w-[152px] lg:w-[166px] xl:w-[178px]',
  }[size];

  // Abstract horizontal offsets and rotations per index for organic rhythm
  const abstractOffsets = [
    '-translate-x-3 sm:-translate-x-5',
    'translate-x-4 sm:translate-x-6',
    '-translate-x-2 sm:-translate-x-3',
    'translate-x-3 sm:translate-x-5',
  ];

  return (
    <div
      className={`relative flex flex-col items-center -space-y-8 sm:-space-y-10 md:-space-y-11 lg:-space-y-12 select-none py-2 ${className}`}
    >
      {photos.map((photo, index) => {
        const isHovered = hoveredId === photo.id;
        const offsetClass = abstractOffsets[index % abstractOffsets.length];

        return (
          <motion.div
            key={photo.id}
            id={`peek-photo-vertical-${photo.id}`}
            className={`relative shrink-0 cursor-pointer origin-center touch-manipulation focus:outline-none ${offsetClass}`}
            role="button"
            tabIndex={0}
            aria-label={photo.alt}
            style={{
              zIndex: isHovered ? 40 : index + 10,
            }}
            initial={false}
            animate={{
              y: isHovered ? -18 : 0,
              scale: isHovered ? 1.08 : 1,
              rotate: isHovered ? photo.hoverRotate : photo.defaultRotate,
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
            {/* White polaroid frame with editorial sketchbook border & soft shadow */}
            <div
              className={`bg-white p-1.5 sm:p-2 rounded-[3px] sm:rounded-md border border-black/20 transition-shadow duration-300 ${
                isHovered
                  ? 'shadow-[0_24px_45px_-8px_rgba(0,0,0,0.35),0_12px_20px_-6px_rgba(0,0,0,0.2)] ring-1 ring-black/10'
                  : 'shadow-[0_8px_20px_-3px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.06)]'
              }`}
            >
              <div className={`${sizeStyles} aspect-[4/5] overflow-hidden rounded-[2px] bg-[#E8E6E1]`}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

interface PeekPhotoPairProps {
  photos: PhotoItem[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 2-Photo pair component for horizontal/angled polaroid placement
 */
export function PeekPhotoPair({ photos, className = '', size = 'md' }: PeekPhotoPairProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(false);

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
    const handleOutside = () => setHoveredId(null);
    window.addEventListener('click', handleOutside);
    window.addEventListener('touchend', handleOutside);
    return () => {
      window.removeEventListener('click', handleOutside);
      window.removeEventListener('touchend', handleOutside);
    };
  }, []);

  const sizeStyles = {
    sm: 'w-[76px] xs:w-[88px] sm:w-[104px] md:w-[115px] lg:w-[125px]',
    md: 'w-[88px] xs:w-[102px] sm:w-[120px] md:w-[135px] lg:w-[150px] xl:w-[160px]',
    lg: 'w-[98px] xs:w-[115px] sm:w-[135px] md:w-[150px] lg:w-[168px] xl:w-[180px]',
  }[size];

  return (
    <div className={`relative flex items-end -space-x-4 sm:-space-x-6 md:-space-x-7 select-none ${className}`}>
      {photos.map((photo, index) => {
        const isHovered = hoveredId === photo.id;

        return (
          <motion.div
            key={photo.id}
            id={`peek-photo-pair-${photo.id}`}
            className="relative shrink-0 cursor-pointer origin-bottom touch-manipulation focus:outline-none"
            role="button"
            tabIndex={0}
            aria-label={photo.alt}
            style={{
              zIndex: isHovered ? 40 : index === 0 ? 10 : 20,
            }}
            initial={false}
            animate={{
              y: isHovered ? -34 : 0,
              rotate: isHovered ? photo.hoverRotate : photo.defaultRotate,
              scale: isHovered ? 1.07 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
              mass: 0.7,
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
              className={`bg-white p-1.5 sm:p-2 rounded-[3px] sm:rounded-md border border-black/20 transition-shadow duration-300 ${
                isHovered
                  ? 'shadow-[0_24px_45px_-8px_rgba(0,0,0,0.35),0_12px_20px_-6px_rgba(0,0,0,0.2)] ring-1 ring-black/10'
                  : 'shadow-[0_6px_18px_-3px_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.06)]'
              }`}
            >
              <div className={`${sizeStyles} aspect-[4/5] overflow-hidden rounded-[2px] bg-[#E8E6E1]`}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Horizontal playful peekaboo photo row specifically designed to sit under the About section
export function PeekPhotosRow({
  photos = PEEK_PHOTOS,
  className = '',
  size = 'about',
  hoverLift = -92,
}: {
  photos?: PhotoItem[];
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'about';
  hoverLift?: number;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(false);

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
    const handleOutside = () => setHoveredId(null);
    window.addEventListener('click', handleOutside);
    window.addEventListener('touchend', handleOutside);
    return () => {
      window.removeEventListener('click', handleOutside);
      window.removeEventListener('touchend', handleOutside);
    };
  }, []);

  const sizeStyles = {
    sm: 'w-[76px] xs:w-[88px] sm:w-[100px] md:w-[112px]',
    md: 'w-[92px] xs:w-[106px] sm:w-[124px] md:w-[138px] lg:w-[148px]',
    lg: 'w-[108px] xs:w-[124px] sm:w-[142px] md:w-[158px] lg:w-[170px]',
    about: 'w-[115px] xs:w-[130px] sm:w-[146px] md:w-[162px] lg:w-[172px] xl:w-[178px]',
  }[size];

  return (
    <div
      className={`relative flex items-center justify-start -space-x-3 sm:-space-x-3.5 md:-space-x-4 lg:-space-x-4.5 xl:-space-x-5 select-none overflow-visible pt-6 pb-2 w-full max-w-[1020px] ${className}`}
    >
      {photos.map((photo, index) => {
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
              y: isHovered ? hoverLift : 0,
              rotate: isHovered ? photo.hoverRotate : photo.defaultRotate,
              scale: isHovered ? 1.1 : 1,
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
              className={`bg-white p-2 sm:p-2.5 rounded-[8px] sm:rounded-[10px] border border-black/10 transition-shadow duration-300 ${
                isHovered
                  ? 'shadow-[0_24px_45px_-6px_rgba(0,0,0,0.32),0_12px_20px_-4px_rgba(0,0,0,0.18)] ring-1 ring-black/10'
                  : 'shadow-[0_6px_20px_-3px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.04)]'
              }`}
            >
              <div className={`${sizeStyles} aspect-[4/5] overflow-hidden rounded-[4px] sm:rounded-[6px] bg-[#F0EDE8]`}>
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
}

// Fallback all-in-one shelf component
export function PeekPhotos() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
      <PeekPhotosVerticalAbstract photos={LEFT_4_PEEK_PHOTOS} />
      <PeekPhotoPair photos={PAIR_AFTER_TEXT_TOP_RIGHT} />
    </div>
  );
}

