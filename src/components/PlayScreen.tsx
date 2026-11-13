import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EditorialFooter } from './EditorialFooter';

export interface PlayItem {
  id: string;
  fileName: string;
  mediaUrl: string;
  title: string;
  category: 'Graphic Design' | 'Animation' | 'Character Design' | 'Illustration';
}

const PLAY_ITEMS: PlayItem[] = [
  // Animation / GIFs
  {
    id: 'puffy',
    fileName: 'Puffy.gif',
    mediaUrl: '/PLAY/Puffy.gif',
    title: 'Puffy',
    category: 'Animation',
  },
  {
    id: 'boxing',
    fileName: 'Boxing.gif',
    mediaUrl: '/PLAY/Boxing.gif',
    title: 'Boxing',
    category: 'Animation',
  },
  {
    id: 'macarena',
    fileName: 'MAcarena.gif',
    mediaUrl: '/PLAY/MAcarena.gif',
    title: 'Macarena',
    category: 'Animation',
  },
  {
    id: 'gooey',
    fileName: 'Gooey.gif',
    mediaUrl: '/PLAY/Gooey.gif',
    title: 'Gooey Dynamics',
    category: 'Animation',
  },
  {
    id: 'quicksketch',
    fileName: 'QuickSketch.gif',
    mediaUrl: '/PLAY/QuickSketch.gif',
    title: 'Quick Motion Study',
    category: 'Animation',
  },
  {
    id: 'sangi',
    fileName: 'Sangi.gif',
    mediaUrl: '/PLAY/Sangi.gif',
    title: 'Sangi',
    category: 'Animation',
  },

  // Character Design
  {
    id: 'fox-2020',
    fileName: '2020 fox.png',
    mediaUrl: '/PLAY/2020%20fox.png',
    title: 'Fox in Motion',
    category: 'Character Design',
  },
  {
    id: 'elephant',
    fileName: 'Elephant.PNG',
    mediaUrl: '/PLAY/Elephant.PNG',
    title: 'Elephant',
    category: 'Character Design',
  },
  {
    id: 'purple-villain',
    fileName: 'Purple Villian.PNG',
    mediaUrl: '/PLAY/Purple%20Villian.PNG',
    title: 'Purple Villain',
    category: 'Character Design',
  },
  {
    id: 'sushi-bug',
    fileName: 'sushi bug.PNG',
    mediaUrl: '/PLAY/sushi%20bug.PNG',
    title: 'Sushi Bug',
    category: 'Character Design',
  },

  // Graphic Design / Posters / Visual Studies
  {
    id: 'cards-2020',
    fileName: '2020 cards.png',
    mediaUrl: '/PLAY/2020%20cards.png',
    title: 'Card Deck Systems',
    category: 'Graphic Design',
  },
  {
    id: 'poster-2021',
    fileName: '2021.png',
    mediaUrl: '/PLAY/2021.png',
    title: 'Form & Typography',
    category: 'Graphic Design',
  },
  {
    id: 'graphic-2022',
    fileName: '2022.png',
    mediaUrl: '/PLAY/2022.png',
    title: 'Visual Synthesis',
    category: 'Graphic Design',
  },
  {
    id: 'color-2023',
    fileName: '2023.png',
    mediaUrl: '/PLAY/2023.png',
    title: 'Color & Rhythm',
    category: 'Graphic Design',
  },
  {
    id: 'glowil',
    fileName: 'glowil.jpg',
    mediaUrl: '/PLAY/glowil.jpg',
    title: 'Glow & Light',
    category: 'Graphic Design',
  },

  // Illustration / Digital Art
  {
    id: 'img-2778',
    fileName: 'IMG_2778.PNG',
    mediaUrl: '/PLAY/IMG_2778.PNG',
    title: 'Sketchbook Study',
    category: 'Illustration',
  },
  {
    id: 'night',
    fileName: 'Night.PNG',
    mediaUrl: '/PLAY/Night.PNG',
    title: 'Night Atmosphere',
    category: 'Illustration',
  },
  {
    id: 'portrait',
    fileName: 'Potrait.png',
    mediaUrl: '/PLAY/Potrait.png',
    title: 'Portrait Study',
    category: 'Illustration',
  },
  {
    id: 'stay',
    fileName: 'Stay.jpg',
    mediaUrl: '/PLAY/Stay.jpg',
    title: 'Stay',
    category: 'Illustration',
  },
];

// Curated items rotating in circular orbit around center title
const HERO_ORBIT_ITEMS: PlayItem[] = [
  'puffy',
  'elephant',
  'poster-2021',
  'boxing',
  'night',
  'fox-2020',
  'cards-2020',
  'gooey',
]
  .map((id) => PLAY_ITEMS.find((item) => item.id === id))
  .filter((item): item is PlayItem => Boolean(item));

const CATEGORIES = [
  'All',
  'Graphic Design',
  'Animation',
  'Character Design',
  'Illustration',
] as const;

type Category = (typeof CATEGORIES)[number];

interface PlayScreenProps {
  onBack: () => void;
}

export function PlayScreen({ onBack }: PlayScreenProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedItem, setSelectedItem] = useState<PlayItem | null>(null);

  // Orbit Cards State & Refs
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isOrbitHoveredRef = useRef(false);
  const orbitAngleRef = useRef(0);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return PLAY_ITEMS;
    return PLAY_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const selectedIndex = useMemo(() => {
    if (!selectedItem) return -1;
    return filteredItems.findIndex((i) => i.id === selectedItem.id);
  }, [selectedItem, filteredItems]);

  // Continuous Smooth Orbit Animation Around "Playground" (Always 100% Upright, never upside-down or sideways)
  useEffect(() => {
    let lastTime = performance.now();
    let animId: number;

    const updateOrbit = (now: number) => {
      const dt = Math.min((now - lastTime) * 0.001, 0.1);
      lastTime = now;

      // Advance circular orbit angle smoothly if not hovered (full circle in ~36 seconds)
      if (!isOrbitHoveredRef.current) {
        orbitAngleRef.current = (orbitAngleRef.current + dt * (360 / 36)) % 360;
      }

      const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const h = typeof window !== 'undefined' ? window.innerHeight : 800;

      // Compute ellipse radii that orbit cleanly AROUND "Playground" without overlapping it
      let rx = Math.min(w * 0.44, 460);
      let ry = Math.min(h * 0.32, 270);

      if (w < 640) {
        // Mobile screen clearance: keeps cards orbiting around "Playground" while staying safely inside screen
        rx = Math.max(130, Math.min(w * 0.38, 160));
        ry = Math.max(140, Math.min(h * 0.27, 180));
      } else if (w < 1024) {
        // Tablet clearance
        rx = Math.max(220, Math.min(w * 0.42, 340));
        ry = Math.max(180, Math.min(h * 0.28, 230));
      }

      const n = HERO_ORBIT_ITEMS.length;
      for (let i = 0; i < n; i++) {
        const el = cardElementsRef.current[i];
        if (!el) continue;

        const angleDeg = (orbitAngleRef.current + (i * 360) / n) % 360;
        const angleRad = (angleDeg * Math.PI) / 180;

        const x = Math.cos(angleRad) * rx;
        const y = Math.sin(angleRad) * ry;

        // Strictly translate without any rotation: ALWAYS 100% UPRIGHT!
        el.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), 0)`;
      }

      animId = requestAnimationFrame(updateOrbit);
    };

    animId = requestAnimationFrame(updateOrbit);
    return () => cancelAnimationFrame(animId);
  }, []);

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

  // Ensure normal vertical scrolling is fully enabled on all screens when PlayScreen is active
  useEffect(() => {
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
    <div className="w-full min-h-screen bg-[#F6F6F7] text-[#1D1D1F] font-sans selection:bg-[#0071E3] selection:text-white flex flex-col relative overflow-x-hidden">
      {/* TOP BAR WITH BORDERLESS BACK BUTTON ON SEAMLESS CANVAS */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-5 sm:px-8 lg:px-12 py-5 sm:py-6">
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
        className="relative w-full h-[90vh] sm:h-screen min-h-[600px] max-h-[1050px] flex items-center justify-center overflow-hidden select-none bg-[#FAFAFA]"
      >
        {/* Ambient background depth grid and soft vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.7)_0%,#F5F5F7_100%)] z-0" />

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
                <div className="w-[72px] h-[92px] sm:w-[100px] sm:h-[130px] md:w-[125px] md:h-[160px] lg:w-[145px] lg:h-[185px] rounded-[10px] sm:rounded-[14px] overflow-hidden bg-[#F5F5F7] border border-black/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.22)] hover:scale-110 hover:border-black/20 transition-all duration-200 select-none">
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                  />
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

            {/* (2019 – 2026) */}
            <p className="mt-1.5 sm:mt-2 font-caps text-[10.5px] sm:text-[11.5px] md:text-[12.5px] tracking-[0.14em] text-[#555555] font-semibold">
              (2019 – 2026)
            </p>

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

      {/* 2. STICKY CATEGORY FILTER BAR */}
      <div
        id="gallery"
        className="sticky top-14 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-black/[0.08] py-2"
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-center">
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

      {/* 3. MASONRY GALLERY CANVAS: MULTI-COLUMN DUMP GRID MATCHING SCREENSHOT WITH WORKCARD-STYLE TAGS */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8">
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 sm:gap-4 lg:gap-4.5 [column-fill:_balance]">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="break-inside-avoid mb-3 sm:mb-4 lg:mb-4.5 group relative overflow-hidden rounded-[8px] sm:rounded-[10px] bg-[#F5F5F7] border border-black/[0.08] hover:border-black/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer select-none"
            >
              <div className="relative w-full overflow-hidden bg-[#F0F0F2]">
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  loading={index < 10 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full h-auto block object-cover group-hover:scale-[1.02] transition-transform duration-300 ease-out"
                />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* EDITORIAL FOOTER (matching design screenshot) */}
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
                  <span className="text-white font-medium text-[14px] sm:text-[15px]">
                    {selectedItem.title}
                  </span>
                  <span className="font-caps text-[9px] sm:text-[9.5px] tracking-[0.06em] px-2.5 py-1 rounded-[6px] bg-white/10 text-white border border-white/20 font-bold">
                    {selectedItem.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
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
                <img
                  src={selectedItem.mediaUrl}
                  alt={selectedItem.title}
                  className="max-h-[74vh] max-w-full w-auto h-auto object-contain select-none"
                />

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
    </div>
  );
}
