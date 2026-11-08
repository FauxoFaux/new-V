import React, { useRef, useState, useEffect } from 'react';

interface TvCurvedMediaProps {
  id?: string;
  type: 'image' | 'video';
  src: string;
  alt?: string;
  bg?: string;
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  tags?: string[];
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Rectangular card media preview.
 * Clean, modern rectangle with subtle rounded corners and frosted badges inside the image.
 * Uses high-performance lazy loading for videos with IntersectionObserver to avoid network congestion.
 */
export const TvCurvedMedia: React.FC<TvCurvedMediaProps> = ({
  type,
  src,
  alt = '',
  bg = 'bg-black/[0.03]',
  width,
  height,
  loading = 'lazy',
  fetchPriority = 'auto',
  className = '',
  tags,
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    if (type !== 'video' || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
            videoRef.current?.play().catch(() => {});
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { rootMargin: '350px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [type]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative w-full h-[250px] sm:h-[310px] md:h-[370px] lg:h-[480px] xl:h-[530px] 2xl:h-[570px] rounded-[22px] overflow-hidden border border-black/10 shadow-[0_12px_28px_rgba(0,0,0,0.06)] group-hover:shadow-[0_22px_44px_rgba(0,0,0,0.12)] group-hover:border-black/20 transition-all duration-300 flex items-center justify-center cursor-pointer ${bg} ${className}`}
    >
      {type === 'image' ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          draggable={false}
          className="w-full h-full object-cover block group-hover:scale-[1.025] transition-transform duration-500 ease-out select-none pointer-events-none"
        />
      ) : (
        <video
          ref={videoRef}
          src={shouldLoadVideo ? src : undefined}
          loop
          muted
          playsInline
          preload="none"
          aria-label={alt}
          className="h-full w-auto max-w-full object-contain block group-hover:scale-[1.02] transition-transform duration-500 ease-out select-none pointer-events-none"
        />
      )}

      {/* Card Tags inside the image - positioned in bottom right corner */}
      {tags && tags.length > 0 && (
        <div className="pointer-events-none absolute bottom-4 sm:bottom-5 right-4 sm:right-5 z-20 flex flex-wrap items-center justify-end gap-1.5 max-w-[85%]">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-caps text-[9px] sm:text-[9.5px] tracking-[0.06em] px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 font-bold shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
