import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight, ArrowDown, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EditorialFooter } from './EditorialFooter';

interface PlayItem {
  id: string;
  mediaUrl: string;
  posterUrl?: string;
  mediaType: 'image' | 'video';
  title: string;
  category: 'Graphic Design' | 'Animation' | 'Illustration';
  width: number;
  height: number;
  linkUrl?: string;
}

const PLAY_ITEMS: PlayItem[] = [
  // Animation (H.264 MP4)
  {
    id: 'puffy',
    mediaUrl: '/PLAY/Puffy.mp4',
    posterUrl: '/PLAY/Puffy_poster.webp',
    mediaType: 'video',
    title: 'Puffy',
    category: 'Animation',
    width: 658,
    height: 642,
  },
  {
    id: 'boxing',
    mediaUrl: '/PLAY/Boxing.mp4',
    posterUrl: '/PLAY/Boxing_poster.webp',
    mediaType: 'video',
    title: 'Boxing',
    category: 'Animation',
    width: 720,
    height: 720,
  },
  {
    id: 'macarena',
    mediaUrl: '/PLAY/MAcarena.mp4',
    posterUrl: '/PLAY/MAcarena_poster.webp',
    mediaType: 'video',
    title: 'Macarena',
    category: 'Animation',
    width: 720,
    height: 1002,
  },
  {
    id: 'gooey',
    mediaUrl: '/PLAY/Gooley%20Gum.mp4',
    posterUrl: '/PLAY/Gooley_Gum_poster.webp',
    mediaType: 'video',
    title: 'Gooley Gum',
    category: 'Animation',
    width: 720,
    height: 720,
  },
  {
    id: 'quicksketch',
    mediaUrl: '/PLAY/Quick%20Sketch.mp4',
    posterUrl: '/PLAY/Quick_Sketch_poster.webp',
    mediaType: 'video',
    title: 'Quick Sketch',
    category: 'Animation',
    width: 720,
    height: 540,
  },
  {
    id: 'sangi',
    mediaUrl: '/PLAY/Sangi.mp4',
    posterUrl: '/PLAY/Sangi_poster.webp',
    mediaType: 'video',
    title: 'Sangi',
    category: 'Animation',
    width: 720,
    height: 832,
  },

  // Illustration - Character Design (WebP)
  {
    id: 'eggosonic',
    mediaUrl: '/PLAY/Eggosonic.webp',
    mediaType: 'image',
    title: 'Eggosonic',
    category: 'Illustration',
    width: 1280,
    height: 1280,
  },
  {
    id: 'elephant',
    mediaUrl: '/PLAY/Elephant%20Character%20Illustration.webp',
    mediaType: 'image',
    title: 'Elephant Character Illustration',
    category: 'Illustration',
    width: 1280,
    height: 1280,
  },
  {
    id: 'purple-villain',
    mediaUrl: '/PLAY/Purple%20Villian.webp',
    mediaType: 'image',
    title: 'Purple Villain',
    category: 'Illustration',
    width: 1280,
    height: 1280,
  },
  {
    id: 'sushi-bug',
    mediaUrl: '/PLAY/Sushi%20Bug.webp',
    mediaType: 'image',
    title: 'Sushi Bug',
    category: 'Illustration',
    width: 1280,
    height: 1280,
  },

  // Graphic Design / Posters / Visual Studies (WebP)
  {
    id: 'cards-2021',
    mediaUrl: '/PLAY/2021%20cards.webp',
    mediaType: 'image',
    title: '2021 Cards',
    category: 'Graphic Design',
    width: 1280,
    height: 936,
  },
  {
    id: 'calendar-2021',
    mediaUrl: '/PLAY/2021%20Calendar.webp',
    mediaType: 'image',
    title: '2021 Calendar',
    category: 'Graphic Design',
    width: 1280,
    height: 852,
    linkUrl: 'https://www.behance.net/gallery/129547425/2021-Calendar-Cards',
  },
  {
    id: 'calendar-2022',
    mediaUrl: '/PLAY/2022%20Calendar.webp',
    mediaType: 'image',
    title: '2022 Calendar',
    category: 'Graphic Design',
    width: 1280,
    height: 936,
    linkUrl: 'https://www.behance.net/gallery/136242803/2022-Tribute-Calendar-Printable',
  },
  {
    id: 'calendar-2023',
    mediaUrl: '/PLAY/2023%20Calendar.webp',
    mediaType: 'image',
    title: '2023 Calendar',
    category: 'Graphic Design',
    width: 1280,
    height: 1026,
    linkUrl: 'https://www.behance.net/gallery/208813495/2023-Character-Illustrated-Calendar-Cards',
  },
  {
    id: 'calendar-2024',
    mediaUrl: '/PLAY/2024%20Calendar.webp',
    mediaType: 'image',
    title: '2024 Calendar',
    category: 'Graphic Design',
    width: 1280,
    height: 968,
    linkUrl: 'https://www.behance.net/gallery/208813801/2024-Marvel-Calendar-and-Card-Collection',
  },

  // Illustration / Digital Art (WebP)
  {
    id: 'character-luminescence',
    mediaUrl: '/PLAY/Character%20Luminescence.webp',
    mediaType: 'image',
    title: 'Character Luminescence',
    category: 'Illustration',
    width: 1280,
    height: 1280,
  },
  {
    id: 'night',
    mediaUrl: '/PLAY/Night.webp',
    mediaType: 'image',
    title: 'Night',
    category: 'Illustration',
    width: 1280,
    height: 1706,
  },
  {
    id: 'portrait',
    mediaUrl: '/PLAY/Potrait.webp',
    mediaType: 'image',
    title: 'Portrait',
    category: 'Illustration',
    width: 1280,
    height: 1300,
  },
  {
    id: 'stay',
    mediaUrl: '/PLAY/Stay%20Typography.webp',
    mediaType: 'image',
    title: 'Stay Typography',
    category: 'Illustration',
    width: 610,
    height: 638,
  },
];

// Curated items rotating in circular orbit around center title
const HERO_ORBIT_ITEMS: PlayItem[] = [
  'puffy',
  'elephant',
  'calendar-2021',
  'boxing',
  'night',
  'eggosonic',
  'cards-2021',
  'gooey',
]
  .map((id) => PLAY_ITEMS.find((item) => item.id === id))
  .filter((item): item is PlayItem => Boolean(item));

let heroMediaPrefetched = false;

/** Pre-warms hero orbit images and lightweight video posters before entering Playground. */
export function prefetchPlayHeroMedia() {
  if (heroMediaPrefetched || typeof window === 'undefined') return;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return;

  heroMediaPrefetched = true;
  const urls = new Set<string>();
  HERO_ORBIT_ITEMS.forEach((item) => {
    if (item.mediaType === 'image') urls.add(item.mediaUrl);
    if (item.posterUrl) urls.add(item.posterUrl);
  });
  PLAY_ITEMS.forEach((item) => {
    if (item.posterUrl) urls.add(item.posterUrl);
  });

  urls.forEach((url) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
  });
}

const CATEGORIES = [
  'All',
  'Graphic Design',
  'Animation',
  'Illustration',
] as const;

type Category = (typeof CATEGORIES)[number];

interface PlayScreenProps {
  onBack: () => void;
}

function PlayMedia({
  item,
  variant,
  eager = false,
  fetchPriority,
}: {
  item: PlayItem;
  variant: 'orbit' | 'masonry';
  eager?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const setImgNode = (node: HTMLImageElement | null) => {
    imgRef.current = node;
    if (node && node.complete && node.naturalWidth > 0 && !loaded) {
      setLoaded(true);
    }
  };

  useEffect(() => {
    if (item.mediaType === 'image' && imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    } else if (item.mediaType === 'image') {
      setLoaded(false);
    }
  }, [item.id, item.mediaType]);

  if (item.mediaType === 'video') {
    const isOrbit = variant === 'orbit';
    return (
      <video
        src={isOrbit ? item.mediaUrl : undefined}
        data-src={isOrbit ? undefined : item.mediaUrl}
        poster={item.posterUrl}
        width={item.width}
        height={item.height}
        autoPlay={isOrbit}
        loop
        muted
        playsInline
        preload={isOrbit ? 'auto' : 'none'}
        aria-label={item.title}
        className={`w-full ${
          isOrbit ? 'h-full pointer-events-none' : 'h-auto group-hover:scale-[1.02] transition-transform duration-300 ease-out'
        } block object-cover`}
      />
    );
  }

  return (
    <img
      ref={setImgNode}
      src={item.mediaUrl}
      alt={item.title}
      width={item.width}
      height={item.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={fetchPriority}
      onLoad={() => setLoaded(true)}
      className={`w-full ${
        variant === 'orbit'
          ? 'h-full pointer-events-none group-hover:scale-105'
          : 'h-auto group-hover:scale-[1.02]'
      } block object-cover transition-[transform,opacity] duration-200 ease-out ${
        loaded || eager ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}

export function PlayScreen({ onBack }: PlayScreenProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedItem, setSelectedItem] = useState<PlayItem | null>(null);

  // Orbit Cards State & Refs
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const galleryRootRef = useRef<HTMLElement | null>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isOrbitHoveredRef = useRef(false);
  const isHeroVisibleRef = useRef(true);
  const isLightboxOpenRef = useRef(false);
  const orbitAngleRef = useRef(0);
  isLightboxOpenRef.current = Boolean(selectedItem);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return PLAY_ITEMS;
    return PLAY_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const selectedIndex = useMemo(() => {
    if (!selectedItem) return -1;
    return filteredItems.findIndex((i) => i.id === selectedItem.id);
  }, [selectedItem, filteredItems]);

  // Continuous Smooth Orbit Animation Around "Playground" (pauses when scrolled out of viewport)
  useEffect(() => {
    let lastTime = performance.now();
    let animId = 0;
    let disposed = false;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cachedRx = 400;
    let cachedRy = 240;

    const computeRadii = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w < 640) {
        cachedRx = Math.max(130, Math.min(w * 0.38, 160));
        cachedRy = Math.max(140, Math.min(h * 0.27, 180));
      } else if (w < 1024) {
        cachedRx = Math.max(220, Math.min(w * 0.42, 340));
        cachedRy = Math.max(180, Math.min(h * 0.28, 230));
      } else {
        cachedRx = Math.min(w * 0.44, 460);
        cachedRy = Math.min(h * 0.32, 270);
      }
    };

    const positionOrbitCards = () => {
      const n = HERO_ORBIT_ITEMS.length;
      for (let i = 0; i < n; i++) {
        const el = cardElementsRef.current[i];
        if (!el) continue;

        const angleDeg = (orbitAngleRef.current + (i * 360) / n) % 360;
        const angleRad = (angleDeg * Math.PI) / 180;

        const x = Math.cos(angleRad) * cachedRx;
        const y = Math.sin(angleRad) * cachedRy;

        el.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), 0)`;
      }
    };

    computeRadii();
    positionOrbitCards();

    if (reduceMotion) {
      const onResizeStatic = () => {
        computeRadii();
        positionOrbitCards();
      };
      window.addEventListener('resize', onResizeStatic, { passive: true });
      return () => window.removeEventListener('resize', onResizeStatic);
    }

    const updateOrbit = (now: number) => {
      if (disposed || !isHeroVisibleRef.current) {
        animId = 0;
        return;
      }

      const dt = Math.min((now - lastTime) * 0.001, 0.1);
      lastTime = now;

      // Advance circular orbit angle smoothly if not hovered or previewing lightbox
      if (!isOrbitHoveredRef.current && !isLightboxOpenRef.current) {
        orbitAngleRef.current = (orbitAngleRef.current + dt * (360 / 36)) % 360;
      }

      positionOrbitCards();
      animId = requestAnimationFrame(updateOrbit);
    };

    const startOrbit = () => {
      if (!animId && !disposed && isHeroVisibleRef.current) {
        lastTime = performance.now();
        animId = requestAnimationFrame(updateOrbit);
      }
    };

    const onResize = () => {
      computeRadii();
      positionOrbitCards();
    };

    const heroEl = heroSectionRef.current;
    let observer: IntersectionObserver | null = null;
    if (heroEl && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.some((e) => e.isIntersecting);
          isHeroVisibleRef.current = visible;
          if (visible) {
            startOrbit();
          } else if (animId) {
            cancelAnimationFrame(animId);
            animId = 0;
          }
          heroEl.querySelectorAll('video').forEach((v) => {
            if (visible) {
              v.play().catch(() => {});
            } else {
              v.pause();
            }
          });
        },
        { threshold: 0.02 }
      );
      observer.observe(heroEl);
    }

    const handleVisibility = () => {
      if (document.hidden) {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = 0;
        }
        heroEl?.querySelectorAll('video').forEach((v) => v.pause());
      } else if (isHeroVisibleRef.current) {
        startOrbit();
        heroEl?.querySelectorAll('video').forEach((v) => v.play().catch(() => {}));
      }
    };

    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    startOrbit();
    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animId) cancelAnimationFrame(animId);
      if (observer) observer.disconnect();
    };
  }, []);

  // Stream and play masonry videos only when near/in viewport (and pause while lightbox is open)
  useEffect(() => {
    const heroEl = heroSectionRef.current;
    if (selectedItem && heroEl) {
      heroEl.querySelectorAll('video').forEach((v) => v.pause());
    } else if (!selectedItem && heroEl && isHeroVisibleRef.current) {
      heroEl.querySelectorAll('video').forEach((v) => {
        v.play().catch(() => {});
      });
    }

    const root = galleryRootRef.current;
    if (!root) return;

    const videos: HTMLVideoElement[] = Array.prototype.slice.call(
      root.querySelectorAll('video')
    );
    if (videos.length === 0) return;

    if (selectedItem) {
      videos.forEach((v) => v.pause());
      return;
    }

    if (!('IntersectionObserver' in window)) {
      videos.forEach((v) => {
        if (!v.src && v.dataset.src) v.src = v.dataset.src;
        v.preload = 'metadata';
        v.play().catch(() => {});
      });
      return;
    }

    // Stage 1: attach video src when approaching viewport
    const preloadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const video = entry.target as HTMLVideoElement;
          if (!video.src && video.dataset.src) {
            video.src = video.dataset.src;
            video.preload = 'metadata';
          }
          preloadObserver.unobserve(video);
        });
      },
      { rootMargin: '250px 0px', threshold: 0.01 }
    );

    // Stage 2: play strictly while visible in viewport to prevent 6-stream decode spikes
    const playObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            if (!video.src && video.dataset.src) {
              video.src = video.dataset.src;
            }
            if (video.preload !== 'auto') {
              video.preload = 'auto';
            }
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: '0px', threshold: 0.08 }
    );

    videos.forEach((v) => {
      preloadObserver.observe(v);
      playObserver.observe(v);
    });
    return () => {
      preloadObserver.disconnect();
      playObserver.disconnect();
    };
  }, [filteredItems, selectedItem]);

  // Preload adjacent lightbox slides so Prev/Next switches feel instantaneous
  useEffect(() => {
    if (selectedIndex === -1 || filteredItems.length <= 1) return;
    const prevItem = filteredItems[selectedIndex > 0 ? selectedIndex - 1 : filteredItems.length - 1];
    const nextItem = filteredItems[selectedIndex < filteredItems.length - 1 ? selectedIndex + 1 : 0];
    [prevItem, nextItem].forEach((neighbor) => {
      if (neighbor?.mediaType === 'image') {
        const img = new Image();
        img.decoding = 'async';
        img.src = neighbor.mediaUrl;
      }
    });
  }, [selectedIndex, filteredItems]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === -1) return;
      if (e.key === 'Escape') {
        setSelectedItem(null);
      } else if (e.key === 'ArrowRight') {
        const nextIdx = selectedIndex < filteredItems.length - 1 ? selectedIndex + 1 : 0;
        setSelectedItem(filteredItems[nextIdx]);
      } else if (e.key === 'ArrowLeft') {
        const prevIdx = selectedIndex > 0 ? selectedIndex - 1 : filteredItems.length - 1;
        setSelectedItem(filteredItems[prevIdx]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredItems]);

  // Ensure normal vertical scrolling is fully enabled and anchored at top when PlayScreen opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    const rootEl = document.getElementById('root');
    const prevHtmlOverflowY = document.documentElement.style.overflowY;
    const prevBodyOverflowY = document.body.style.overflowY;
    const prevRootOverflowY = rootEl ? rootEl.style.overflowY : '';
    const prevRootHeight = rootEl ? rootEl.style.height : '';

    document.documentElement.style.overflowY = 'auto';
    document.body.style.overflowY = 'auto';
    if (rootEl) {
      rootEl.style.overflowY = 'visible';
      rootEl.style.height = 'auto';
    }

    return () => {
      document.documentElement.style.overflowY = prevHtmlOverflowY;
      document.body.style.overflowY = prevBodyOverflowY;
      if (rootEl) {
        rootEl.style.overflowY = prevRootOverflowY;
        rootEl.style.height = prevRootHeight;
      }
    };
  }, []);

  const scrollToGallery = () => {
    const gallery = document.getElementById('gallery');
    if (gallery) {
      gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="w-full min-h-screen bg-[#F6F6F7] text-[#1D1D1F] font-sans selection:bg-[#0071E3] selection:text-white flex flex-col relative overflow-x-hidden"
    >
      {/* TOP BAR WITH NO BACKGROUND */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-5 sm:px-8 lg:px-12 py-4 sm:py-5">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="pointer-events-auto group inline-flex items-center gap-1.5 text-[#1D1D1F] hover:text-black transition-colors font-caps text-[12px] tracking-[0.09em] font-semibold cursor-pointer py-1"
            aria-label="Back to portfolio"
          >
            <ArrowLeft size={15} className="stroke-[2.5] transition-transform group-hover:-translate-x-0.5" />
            <span>BACK</span>
          </button>
        </div>
      </div>

      {/* 1. HERO SECTION: ORBITING REVOLUTION AROUND "PLAYGROUND" */}
      <section
        ref={heroSectionRef}
        className="relative w-full h-[90vh] sm:h-screen min-h-[600px] max-h-[1050px] flex items-center justify-center overflow-hidden select-none bg-[#F6F6F7]"
      >
        {/* Ambient soft radial highlight */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.65)_0%,#F6F6F7_100%)] z-0" />

        {/* Orbit Cards Container: Absolutely centered, cards translated with 0deg rotation (always 100% upright) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
            {HERO_ORBIT_ITEMS.map((item, idx) => (
              <div
                key={`orbit-card-${item.id}-${idx}`}
                ref={(el) => { cardElementsRef.current[idx] = el; }}
                onMouseEnter={() => { isOrbitHoveredRef.current = true; }}
                onMouseLeave={() => { isOrbitHoveredRef.current = false; }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(item);
                }}
                className="absolute top-1/2 left-1/2 pointer-events-auto will-change-transform cursor-pointer"
                style={{
                  transform: 'translate3d(-50%, -50%, 0)',
                }}
              >
                <div className="w-[72px] h-[92px] sm:w-[100px] sm:h-[130px] md:w-[125px] md:h-[160px] lg:w-[145px] lg:h-[185px] rounded-[10px] sm:rounded-[14px] overflow-hidden bg-[#EAEAEF] border border-black/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.22)] hover:scale-110 hover:border-black/20 transition-[transform,box-shadow,border-color] duration-200 select-none [contain:layout_style_paint]">
                  <PlayMedia item={item} variant="orbit" eager fetchPriority="high" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Typographic Focal Point - "Playground" stays in the center, cards orbit around it */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none select-none">
          <div className="relative flex flex-col items-center max-w-[280px] sm:max-w-[360px] md:max-w-[440px]">
            {/* Title in Ugly Dave font */}
            <h1 className="font-ugly-dave text-[36px] sm:text-[48px] md:text-[60px] lg:text-[72px] xl:text-[80px] font-normal leading-[0.96] text-black tracking-[0.015em] drop-shadow-xs">
              Playground
            </h1>

            {/* Scroll Indicator button */}
            <button
              onClick={scrollToGallery}
              className="pointer-events-auto mt-3 sm:mt-4 md:mt-5 group flex flex-col items-center gap-1 font-caps text-[10px] sm:text-[11px] tracking-[0.14em] text-[#86868B] hover:text-black transition-colors cursor-pointer"
              aria-label="Scroll down to gallery"
            >
              <span>Explore Collection</span>
              <ArrowDown
                size={14}
                className="stroke-[2.2] animate-bounce text-[#86868B] group-hover:text-black transition-colors"
              />
            </button>
          </div>
        </div>
      </section>

      {/* 2. STICKY CATEGORY FILTER BAR (SOLID #F6F6F7) */}
      <div
        id="gallery"
        className="sticky top-0 z-40 w-full bg-[#F6F6F7] border-b border-black/[0.08] py-2.5 sm:py-3"
      >
        <div className="max-w-[1500px] mx-auto pl-20 pr-4 sm:pl-24 sm:pr-8 md:px-12 flex items-center justify-center">
          <div className="flex items-center gap-6 sm:gap-8 lg:gap-10 overflow-x-auto max-w-full py-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative text-[13px] sm:text-[14.5px] whitespace-nowrap pb-2.5 pt-1.5 font-medium tracking-tight transition-colors cursor-pointer ${
                    isActive
                      ? 'text-black font-semibold'
                      : 'text-[#86868B] hover:text-black'
                  }`}
                >
                  <span>{cat}</span>
                  {isActive && (
                    <motion.div
                      layoutId="playActiveCategoryUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. MASONRY GALLERY CANVAS */}
      <main ref={galleryRootRef} className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8">
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 sm:gap-4 lg:gap-4.5">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="break-inside-avoid mb-3 sm:mb-4 lg:mb-4.5 group relative overflow-hidden rounded-[8px] sm:rounded-[10px] bg-[#F5F5F7] border border-black/[0.08] hover:border-black/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-[box-shadow,border-color] duration-200 cursor-pointer select-none [contain:layout_style_paint]"
            >
              <div className="relative w-full overflow-hidden bg-[#EAEAEF]">
                <PlayMedia
                  item={item}
                  variant="masonry"
                  eager={index < 8}
                  fetchPriority={index < 4 ? 'low' : 'auto'}
                />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* EDITORIAL FOOTER */}
      <EditorialFooter />

      {/* FULLSCREEN LIGHTBOX DETAIL MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[1080px] w-full max-h-[92vh] flex flex-col bg-[#111111] rounded-[22px] overflow-hidden border border-white/10"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-b border-white/10 bg-black/40">
                <div className="flex items-center gap-2.5">
                  {selectedItem.linkUrl && (
                    <span className="text-white font-medium text-[14px] sm:text-[15px]">
                      {selectedItem.title}
                    </span>
                  )}
                  <span className="font-caps text-[9px] sm:text-[9.5px] tracking-[0.06em] px-2.5 py-1 rounded-[6px] bg-white/10 text-white border border-white/20 font-bold">
                    {selectedItem.category}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  {selectedItem.linkUrl && (
                    <a
                      href={selectedItem.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors text-[12px] font-medium"
                      aria-label={`View ${selectedItem.title} on Behance`}
                    >
                      <span>View on Behance</span>
                      <ArrowUpRight size={14} className="stroke-[2.2]" />
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Media Content */}
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden p-2 sm:p-6 min-h-[320px] max-h-[78vh]">
                {selectedItem.mediaType === 'video' ? (
                  <video
                    key={selectedItem.id}
                    src={selectedItem.mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    aria-label={selectedItem.title}
                    className="max-h-[74vh] max-w-full w-auto h-auto object-contain select-none"
                  />
                ) : (
                  <img
                    src={selectedItem.mediaUrl}
                    alt={selectedItem.title}
                    className="max-h-[74vh] max-w-full w-auto h-auto object-contain select-none"
                  />
                )}

                {/* Left navigation arrow */}
                {filteredItems.length > 1 && (
                  <button
                    onClick={() => {
                      const prevIdx = selectedIndex > 0 ? selectedIndex - 1 : filteredItems.length - 1;
                      setSelectedItem(filteredItems[prevIdx]);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 transition-all cursor-pointer backdrop-blur-sm"
                    aria-label="Previous artwork"
                  >
                    <ChevronLeft size={22} />
                  </button>
                )}

                {/* Right navigation arrow */}
                {filteredItems.length > 1 && (
                  <button
                    onClick={() => {
                      const nextIdx = selectedIndex < filteredItems.length - 1 ? selectedIndex + 1 : 0;
                      setSelectedItem(filteredItems[nextIdx]);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 transition-all cursor-pointer backdrop-blur-sm"
                    aria-label="Next artwork"
                  >
                    <ChevronRight size={22} />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
