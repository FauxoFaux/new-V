import React, { useRef, useState, useEffect } from 'react';

interface TvCurvedMediaProps {
  id?: string;
  type: 'image' | 'video';
  src: string;
  alt?: string;
  bg?: string;
  poster?: string;
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
 * Crisp, modern rectangle with subtle rounded corners (rounded-[10px]) and frosted badges inside the image.
 * Immediate video playback with native autoplay, loop, and auto-recovery.
 */
export const TvCurvedMedia: React.FC<TvCurvedMediaProps> = React.memo(({
  id,
  type,
  src,
  alt = '',
  bg = 'bg-black/[0.03]',
  poster,
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
  const [isNearViewport, setIsNearViewport] = useState(false);

  // Default lightweight posters for video cards to display immediately
  const resolvedPoster =
    poster ||
    (id === 'justickets'
      ? '/JT/J_Hero.webp'
      : id === 'myblockcounts'
      ? '/MBC/MB_Hero.webp'
      : id === 'mise'
      ? '/Home/Mise_poster.webp'
      : id === 'netflix'
      ? '/Home/Netflix_poster.webp'
      : undefined);

  // Stage 1: attach video src/metadata near viewport; Stage 2: play only when actually visible
  useEffect(() => {
    if (type !== 'video') return;

    const container = containerRef.current;
    if (!container) return;

    const preloadObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setIsNearViewport(true);
          preloadObserver.disconnect();
        }
      },
      { rootMargin: '420px 420px 420px 420px', threshold: 0.01 }
    );

    const playObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (!video) return;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: '40px 40px 40px 40px', threshold: 0.05 }
    );

    preloadObserver.observe(container);
    playObserver.observe(container);
    return () => {
      preloadObserver.disconnect();
      playObserver.disconnect();
    };
  }, [type, src]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.(e as unknown as React.MouseEvent);
        }
      }}
      className={`relative w-full aspect-[16/10] md:aspect-[16/10] lg:aspect-auto lg:h-[480px] xl:h-[530px] 2xl:h-[570px] rounded-[10px] overflow-hidden border border-black/10 shadow-[0_8px_24px_rgba(0,0,0,0.05)] group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.1)] group-hover:border-black/20 transition-[box-shadow,border-color] duration-300 flex items-center justify-center cursor-pointer [contain:layout_style_paint] ${bg} ${className}`}
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
          className="w-full h-full object-cover block group-hover:scale-[1.025] transition-transform duration-500 ease-out select-none"
        />
      ) : (
        <video
          ref={videoRef}
          src={isNearViewport ? src : undefined}
          poster={resolvedPoster}
          loop
          muted
          playsInline
          preload={isNearViewport ? 'metadata' : 'none'}
          aria-label={alt}
          onLoadedData={(e) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect && rect.right > 0 && rect.left < window.innerWidth && rect.bottom > 0 && rect.top < window.innerHeight) {
              e.currentTarget.play().catch(() => {});
            }
          }}
          className="h-full w-auto max-w-full object-contain block group-hover:scale-[1.02] transition-transform duration-500 ease-out select-none"
        />
      )}

      {/* Card Tags inside the image - positioned in bottom right corner (desktop only) */}
      {tags && tags.length > 0 && (
        <div className="hidden lg:flex pointer-events-none absolute bottom-3.5 sm:bottom-4 right-3.5 sm:right-4 z-20 flex-wrap items-center justify-end gap-1.5 max-w-[85%]">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-caps text-[9px] sm:text-[9.5px] tracking-[0.06em] px-2.5 py-1 rounded-[6px] bg-[#141416]/85 text-white border border-white/15 font-bold shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});
