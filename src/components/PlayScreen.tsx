import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    id: 'mandance',
    fileName: 'MAnDance.gif',
    mediaUrl: '/PLAY/MAnDance.gif',
    title: 'Dance Groove',
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
    id: 'crock-2020',
    fileName: '2020 Crock.png',
    mediaUrl: '/PLAY/2020%20Crock.png',
    title: 'Crock',
    category: 'Character Design',
  },
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
    id: 'cash-dollar',
    fileName: '$.PNG',
    mediaUrl: '/PLAY/%24.PNG',
    title: 'Cash Experiment',
    category: 'Graphic Design',
  },
  {
    id: 'pondy',
    fileName: 'Pondy.PNG',
    mediaUrl: '/PLAY/Pondy.PNG',
    title: 'Pondy Series',
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
    id: 'billie',
    fileName: 'Billie E.PNG',
    mediaUrl: '/PLAY/Billie%20E.PNG',
    title: 'Billie',
    category: 'Illustration',
  },
  {
    id: 'img-2778',
    fileName: 'IMG_2778.PNG',
    mediaUrl: '/PLAY/IMG_2778.PNG',
    title: 'Sketchbook Study',
    category: 'Illustration',
  },
  {
    id: 'img-3431',
    fileName: 'IMG_3431.PNG',
    mediaUrl: '/PLAY/IMG_3431.PNG',
    title: 'Freehand Line & Color',
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

// Circular hero ring items matching the user's reference mockup
const HERO_RING_ITEMS = [
  { item: PLAY_ITEMS[0], angleDeg: -90, tilt: 4, width: 'w-[110px] sm:w-[145px] md:w-[170px]', aspect: 'aspect-[4/3]' },   // 12 o'clock (Puffy)
  { item: PLAY_ITEMS[1], angleDeg: -45, tilt: 32, width: 'w-[95px] sm:w-[130px] md:w-[155px]', aspect: 'aspect-[3/4]' },    // 1:30 (Boxing)
  { item: PLAY_ITEMS[12], angleDeg: 0, tilt: 3, width: 'w-[115px] sm:w-[155px] md:w-[185px]', aspect: 'aspect-[16/10]' },   // 3 o'clock (Cards)
  { item: PLAY_ITEMS[15], angleDeg: 45, tilt: -34, width: 'w-[105px] sm:w-[140px] md:w-[165px]', aspect: 'aspect-[4/3]' },  // 4:30 (Color & Rhythm)
  { item: PLAY_ITEMS[3], angleDeg: 90, tilt: 5, width: 'w-[95px] sm:w-[130px] md:w-[155px]', aspect: 'aspect-[3/4]' },     // 6 o'clock (Gooey)
  { item: PLAY_ITEMS[8], angleDeg: 135, tilt: -28, width: 'w-[105px] sm:w-[140px] md:w-[165px]', aspect: 'aspect-[4/3]' }, // 7:30 (Fox)
  { item: PLAY_ITEMS[2], angleDeg: 180, tilt: -3, width: 'w-[115px] sm:w-[155px] md:w-[180px]', aspect: 'aspect-[16/10]' }, // 9 o'clock (Macarena)
  { item: PLAY_ITEMS[7], angleDeg: 225, tilt: -38, width: 'w-[100px] sm:w-[135px] md:w-[160px]', aspect: 'aspect-[3/4]' },  // 10:30 (Crock)
];

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

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return PLAY_ITEMS;
    return PLAY_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const selectedIndex = useMemo(() => {
    if (!selectedItem) return -1;
    return filteredItems.findIndex((i) => i.id === selectedItem.id);
  }, [selectedItem, filteredItems]);

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
    <div className="w-full min-h-screen bg-[#FFFFFF] text-[#1D1D1F] font-sans selection:bg-[#0071E3] selection:text-white flex flex-col relative overflow-x-hidden">
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

      {/* 1. HERO SECTION: CIRCULAR WREATH AROUND "PLAYGROUND" TITLE MATCHING USER MOCKUP */}
      <section className="relative w-full min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-12 [--ring-radius:140px] sm:[--ring-radius:220px] lg:[--ring-radius:310px]">
        {/* Orbit Ring of Cards radiating around the center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-full max-w-[1000px] max-h-[1000px] flex items-center justify-center">
            {HERO_RING_ITEMS.map(({ item, angleDeg, tilt, width, aspect }) => (
              <div
                key={`ring-${item.id}`}
                onClick={() => setSelectedItem(item)}
                style={{
                  transform: `translate(-50%, -50%) rotate(${angleDeg}deg) translate(var(--ring-radius)) rotate(${-angleDeg + tilt}deg)`,
                }}
                className={`absolute left-1/2 top-1/2 pointer-events-auto ${width} ${aspect} bg-white p-1 sm:p-1.5 rounded-[14px] sm:rounded-[18px] border border-black/[0.1] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer select-none group`}
              >
                <div className="w-full h-full rounded-[10px] sm:rounded-[14px] overflow-hidden bg-[#F5F5F7] relative">
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Typographic Focal Point matching Home Page UI */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 pointer-events-auto select-none">
          {/* Playground Title in Home Page Ugly Dave Heading */}
          <h1 className="font-ugly-dave text-[50px] sm:text-[68px] md:text-[80px] lg:text-[88px] font-normal leading-[0.98] text-black tracking-[0.015em]">
            Playground
          </h1>

          {/* (2019 – 2026) in Home Page caps typography */}
          <p className="mt-2.5 font-caps text-[12px] sm:text-[13px] tracking-[0.12em] text-[#86868B] font-semibold">
            (2019 – 2026)
          </p>

          {/* Scroll ↓ Indicator */}
          <button
            onClick={scrollToGallery}
            className="mt-6 sm:mt-8 group flex flex-col items-center gap-1.5 font-caps text-[11px] tracking-[0.14em] text-[#86868B] hover:text-black transition-colors cursor-pointer"
            aria-label="Scroll down to gallery"
          >
            <span>Scroll</span>
            <ArrowDown
              size={15}
              className="stroke-[2.2] animate-bounce text-[#86868B] group-hover:text-black transition-colors"
            />
          </button>
        </div>
      </section>

      {/* 2. STICKY CATEGORY FILTER BAR */}
      <div
        id="gallery"
        className="sticky top-14 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-black/[0.06] py-3.5"
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-center">
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto max-w-full py-0.5 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[12.5px] sm:text-[13px] font-medium tracking-tight whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-black text-white'
                      : 'border border-black/15 bg-white text-[#1D1D1F] hover:bg-black/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. MASONRY GALLERY CANVAS: ONE TAG PER IMAGE, NO DOTTED BG, NO SHADOWS */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-10">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 sm:gap-6 [column-fill:_balance]">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="break-inside-avoid mb-5 sm:mb-6 group relative overflow-hidden rounded-[20px] sm:rounded-[24px] bg-[#F5F5F7] border border-black/[0.08] cursor-pointer select-none"
            >
              <div className="relative w-full overflow-hidden">
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  loading={index < 6 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full h-auto block object-cover group-hover:scale-[1.015] transition-transform duration-300 ease-out"
                />

                {/* Exactly one tag on the image */}
                <div className="absolute bottom-3 left-3 sm:bottom-3.5 sm:left-3.5 pointer-events-none z-10">
                  <span className="bg-[#1D1D1F]/80 backdrop-blur-md text-white text-[11.5px] sm:text-[12px] font-sans font-medium px-3.5 py-1.5 rounded-full inline-block">
                    {item.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

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
                  <span className="bg-white/15 text-white/90 text-[11px] px-2.5 py-0.5 rounded-full font-caps tracking-wide">
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
