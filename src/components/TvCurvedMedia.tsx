import React, { useRef, useEffect } from 'react';

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
  tags?: string[];
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
  width,
  height,
  loading = 'lazy',
  fetchPriority = 'auto',
  tags,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Default lightweight posters for video cards to display immediately
  const resolvedPoster =
    id === 'justickets'
      ? '/JT/J_Hero.webp'
      : id === 'myblockcounts'
      ? '/MBC/MBC_poster.webp'
      : id === 'mise'
      ? '/Home/Mise_poster.webp'
      : id === 'netflix'
      ? '/Home/Netflix_poster.webp'
      : undefined;

  useEffect(() => {
    if (type !== 'video') return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.play().catch(() => {});

    const container = containerRef.current;
    if (!container || !('IntersectionObserver' in window)) return;

    const resumeObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && video.paused) {
          video.muted = true;
          video.play().catch(() => {});
        }
      },
      { threshold: 0.01 }
    );

    resumeObserver.observe(container);
    return () => resumeObserver.disconnect();
  }, [type, src]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[16/10] md:aspect-[16/10] lg:aspect-auto lg:h-[480px] xl:h-[530px] 2xl:h-[570px] rounded-[10px] overflow-hidden border border-black/10 shadow-[0_8px_24px_rgba(0,0,0,0.05)] group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.1)] group-hover:border-black/20 transition-[box-shadow,border-color] duration-300 flex items-center justify-center cursor-pointer ${bg}`}
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
          src={src}
          poster={resolvedPoster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-label={alt}
          onLoadedData={(e) => {
            e.currentTarget.muted = true;
            e.currentTarget.play().catch(() => {});
          }}
          onCanPlay={(e) => {
            if (e.currentTarget.paused) {
              e.currentTarget.muted = true;
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
