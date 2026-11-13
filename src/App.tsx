import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight, Lock } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  PeekPhotosRow,
} from './components/PeekPhotos';
import { HoverMaskCutout } from './components/HoverMaskCutout';
import { TvCurvedMedia } from './components/TvCurvedMedia';
import { ThreeDCarouselCard } from './components/ThreeDCarouselCard';

const PlayScreen = React.lazy(() =>
  import('./components/PlayScreen').then((m) => ({ default: m.PlayScreen }))
);

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

export default function App() {
  const shouldReduceMotion = useReducedMotion();
  const [currentScreen, setCurrentScreen] = useState<'home' | 'play'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const cursorPillRef = useRef<HTMLDivElement>(null);
  const [cardCursor, setCardCursor] = useState<{ visible: boolean; label: string }>({
    visible: false,
    label: 'View Case Study',
  });

  const handleCardMouseEnter = (e: React.MouseEvent<HTMLElement>, label = 'View Case Study') => {
    if (cursorPillRef.current) {
      cursorPillRef.current.style.transform = `translate3d(${e.clientX + 14}px, ${e.clientY - 12}px, 0)`;
    }
    setCardCursor((prev) =>
      prev.visible && prev.label === label ? prev : { visible: true, label }
    );
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>, label = 'View Case Study') => {
    if (cursorPillRef.current) {
      cursorPillRef.current.style.transform = `translate3d(${e.clientX + 14}px, ${e.clientY - 12}px, 0)`;
    }
    if (!cardCursor.visible || cardCursor.label !== label) {
      setCardCursor({ visible: true, label });
    }
  };

  const handleCardMouseLeave = () => {
    setCardCursor((prev) => (prev.visible ? { ...prev, visible: false } : prev));
  };

  const handleCardClick = (e: React.MouseEvent, projectId: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    const targetUrl = `/case-study.html?project=${projectId}`;
    try {
      window.location.assign(targetUrl);
    } catch {
      window.location.href = targetUrl;
    }
  };

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile hamburger menu when clicking/tapping outside
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const header = document.getElementById('main-navigation-header');
      if (header && !header.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchend', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchend', handleOutsideClick);
    };
  }, [mobileMenuOpen]);

  // Horizontal mouse wheel and trackpad listener on desktop (>= 1024px)
  useEffect(() => {
    if (currentScreen === 'play') return;

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 1024) return; // Vertical flow on tablet & mobile
      const container = horizontalScrollRef.current;
      if (!container) return;
      if (mobileMenuOpen) return;

      // If vertical wheel movement is dominant or present, translate to horizontal scroll
      if (Math.abs(e.deltaY) > 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.innerWidth < 1024) return;
      const container = horizontalScrollRef.current;
      if (!container) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        container.scrollBy({ left: 400, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        container.scrollBy({ left: -400, behavior: 'smooth' });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentScreen, mobileMenuOpen]);

  // Active section scroll observer for navigation highlight (both horizontal on desktop & vertical on mobile/tablet)
  useEffect(() => {
    if (currentScreen === 'play') return;
    const sections = ['work', 'things-i-built', 'mentorship', 'about', 'contact'];
    let ticking = false;

    const updateActiveTab = () => {
      ticking = false;
      const isDesktop = window.innerWidth >= 1024;
      const container = horizontalScrollRef.current;

      if (isDesktop && container) {
        const scrollLeft = container.scrollLeft + 350;
        let current = '';
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const left = el.offsetLeft;
            const width = el.offsetWidth;
            if (scrollLeft >= left && scrollLeft < left + width) {
              if (id === 'things-i-built') current = '';
              else if (id === 'contact') current = 'contact';
              else current = id;
            }
          }
        }
        setActiveTab(current);
      } else {
        const scrollPos = window.scrollY + 280;
        let current = '';
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
              if (id === 'things-i-built') current = '';
              else if (id === 'contact') current = 'contact';
              else current = id;
            }
          }
        }
        setActiveTab(current);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActiveTab);
      }
    };

    const container = horizontalScrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    updateActiveTab();

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentScreen]);

  // Hash Navigation Handler
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const navEntry = performance.getEntriesByType?.('navigation')?.[0] as PerformanceNavigationTiming | undefined;
    const isReload = navEntry?.type === 'reload';
    const fromCaseStudy = document.referrer.includes('case-study.html');

    const handleHashNav = (isInitialMount = false) => {
      const hash = window.location.hash.replace('#', '');

      if (isInitialMount && (!fromCaseStudy || isReload)) {
        if (hash === 'play') {
          setCurrentScreen('play');
          setActiveTab('play');
          window.scrollTo(0, 0);
          return;
        }
        if (hash) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        const container = horizontalScrollRef.current;
        if (container && window.innerWidth >= 1024) {
          container.scrollTo(0, 0);
        } else {
          window.scrollTo(0, 0);
        }
        return;
      }

      if (hash === 'resume') {
        window.open('https://drive.google.com/file/d/1ZJWXJ0DoubaRd7qDoCK57abnknj8BDMq/view?usp=sharing', '_blank', 'noopener,noreferrer');
      } else if (hash === 'play') {
        setCurrentScreen('play');
        setActiveTab('play');
        window.scrollTo(0, 0);
      } else if (hash) {
        setCurrentScreen('home');
        const mappedTab = (hash === 'things-i-built') ? 'projects' : (hash === 'contact') ? 'contact' : hash;
        setActiveTab(mappedTab);
        setTimeout(() => {
          const target = document.getElementById(hash);
          const container = horizontalScrollRef.current;
          const isDesktop = window.innerWidth >= 1024;
          if (target) {
            if (isDesktop && container) {
              container.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
            } else {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }, 100);
      } else if (isInitialMount) {
        setCurrentScreen('home');
        const container = horizontalScrollRef.current;
        if (container && window.innerWidth >= 1024) {
          container.scrollTo(0, 0);
        } else {
          window.scrollTo(0, 0);
        }
      }
    };

    handleHashNav(true);
    const onHashChange = () => handleHashNav(false);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavClick = (tab: string, e: React.MouseEvent) => {
    if (tab === 'resume') {
      return;
    }
    e.preventDefault();

    if (tab === 'play') {
      setCurrentScreen('play');
      setActiveTab('play');
      window.scrollTo(0, 0);
      window.history.pushState(null, '', '#play');
      return;
    }

    if (currentScreen === 'play') {
      setCurrentScreen('home');
    }

    setActiveTab(tab);
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    const container = horizontalScrollRef.current;
    const isDesktop = window.innerWidth >= 1024;

    if (tab === 'top' || tab === '') {
      if (isDesktop && container) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const targetId = (tab === 'projects' || tab === 'things-i-built')
      ? 'things-i-built'
      : tab;

    const target = document.getElementById(targetId);
    if (target) {
      if (isDesktop && container) {
        container.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleMobileNavClick = (tab: string, e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    handleNavClick(tab, e);
  };

  if (currentScreen === 'play') {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-white" />}>
        <PlayScreen
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('');
            if (window.location.hash === '#play') {
              window.history.pushState('', document.title, window.location.pathname);
            }
          }}
        />
      </React.Suspense>
    );
  }

  return (
    <div className="w-full h-full min-h-screen bg-[#FFFFFF] text-[#1D1D1F] selection:bg-[#0071E3] selection:text-white flex flex-col font-sans lg:overflow-hidden">
      {/* Navigation Header - White background on mobile / hamburger menu nav, transparent on desktop */}
      <motion.header
        id="main-navigation-header"
        initial={shouldReduceMotion ? false : { y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_EDITORIAL }}
        className={`fixed top-0 left-0 right-0 z-50 w-full px-5 sm:px-8 md:px-12 lg:px-16 py-4 transition-all bg-white border-b border-black/[0.08] lg:bg-transparent lg:border-transparent pointer-events-auto lg:pointer-events-none ${
          mobileMenuOpen ? 'bg-white border-b border-black/[0.08]' : ''
        }`}
      >
        <nav className="mx-auto max-w-[1340px] w-full flex items-center justify-between pointer-events-auto">
          {/* Logo */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('');
              setMobileMenuOpen(false);
              const container = horizontalScrollRef.current;
              if (window.innerWidth >= 1024 && container) {
                container.scrollTo({ left: 0, behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
              if (window.location.hash) {
                window.history.pushState('', document.title, window.location.pathname + window.location.search);
              }
            }}
            className="flex items-center text-[#1D1D1F] hover:text-black transition-colors shrink-0"
            aria-label="Home"
          >
            <svg
              viewBox="0 0 1562 1627"
              fill="none"
              stroke="currentColor"
              className="h-7 w-auto shrink-0"
              aria-hidden="true"
            >
              <path
                d="M750.96 943.507L1237.42 1327.32L1032.02 1559.19L77.7012 771.093L732.33 46.8096L1124.09 46.8086L713.221 519.729"
                strokeWidth="134.7"
                strokeMiterlimit="10"
              />
              <path
                d="M732.33 46.8089L1124.09 46.8079C1125.05 46.5059 1180.99 43.4059 1189.94 43.7979C1282.57 47.8479 1445.55 86.7719 1495.31 299.955C1565.49 600.662 1309.7 741.189 1309.7 741.189C1309.7 741.189 1247.5 766.919 1187.72 770.91C1127.94 774.901 77.7012 771.092 77.7012 771.092"
                strokeWidth="104.7"
                strokeMiterlimit="10"
              />
            </svg>
          </a>

          {/* Desktop Navigation Items: WORK, ABOUT, PLAY, RESUME, CONTACT */}
          <a
            href="#work"
            onClick={(e) => handleNavClick('work', e)}
            className={`hidden lg:inline-flex items-center font-caps text-[12px] tracking-[0.09em] transition-all whitespace-nowrap ${activeTab === 'work' ? 'text-black font-bold' : 'text-[#1D1D1F]/70 hover:text-black font-semibold'}`}
          >
            WORK
          </a>

          <a
            href="#about"
            onClick={(e) => handleNavClick('about', e)}
            className={`hidden lg:inline-flex items-center font-caps text-[12px] tracking-[0.09em] transition-all whitespace-nowrap ${activeTab === 'about' ? 'text-black font-bold' : 'text-[#1D1D1F]/70 hover:text-black font-semibold'}`}
          >
            ABOUT
          </a>

          {/* PLAY (Opens separate Instagram-style screen) */}
          <a
            href="#play"
            onClick={(e) => handleNavClick('play', e)}
            className={`hidden lg:inline-flex items-center font-caps text-[12px] tracking-[0.09em] transition-all whitespace-nowrap ${currentScreen === 'play' || activeTab === 'play' ? 'text-black font-bold' : 'text-[#1D1D1F]/70 hover:text-black font-semibold'}`}
          >
            PLAY
          </a>

          <a
            href="https://drive.google.com/file/d/1ZJWXJ0DoubaRd7qDoCK57abnknj8BDMq/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center font-caps text-[12px] tracking-[0.09em] text-[#1D1D1F]/70 hover:text-black transition-all whitespace-nowrap font-semibold"
          >
            RESUME
          </a>

          <a
            href="#contact"
            onClick={(e) => handleNavClick('contact', e)}
            className={`hidden lg:inline-flex items-center font-caps text-[12px] tracking-[0.09em] transition-all whitespace-nowrap ${activeTab === 'contact' ? 'text-black font-bold' : 'text-[#1D1D1F]/70 hover:text-black font-semibold'}`}
          >
            CONTACT
          </a>

          {/* Mobile & Tablet Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-black bg-white hover:text-[#444444] transition-colors rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 cursor-pointer"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation Dropdown Drawer - Covers half of screen, not a modal */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed top-[57px] sm:top-[65px] left-0 right-0 w-full h-[50vh] min-h-[300px] max-h-[460px] bg-white border-b border-black/15 px-6 sm:px-10 py-6 flex flex-col justify-between overflow-y-auto z-50 animate-in slide-in-from-top-3 fade-in duration-200 pointer-events-auto">
            <div className="space-y-1.5">
              <a
                href="#work"
                onClick={(e) => handleMobileNavClick('work', e)}
                className={`block px-3 py-2.5 rounded-lg font-caps text-[13px] tracking-[0.1em] transition-colors ${activeTab === 'work' ? 'text-black font-bold' : 'text-[#6E6E73] hover:text-black font-semibold'}`}
              >
                WORK
              </a>
              <a
                href="#about"
                onClick={(e) => handleMobileNavClick('about', e)}
                className={`block px-3 py-2.5 rounded-lg font-caps text-[13px] tracking-[0.1em] transition-colors ${activeTab === 'about' ? 'text-black font-bold' : 'text-[#6E6E73] hover:text-black font-semibold'}`}
              >
                ABOUT
              </a>
              {/* PLAY (Opens separate Instagram-style screen) */}
              <a
                href="#play"
                onClick={(e) => handleMobileNavClick('play', e)}
                className={`block px-3 py-2.5 rounded-lg font-caps text-[13px] tracking-[0.1em] transition-colors ${currentScreen === 'play' || activeTab === 'play' ? 'text-black font-bold' : 'text-[#6E6E73] hover:text-black font-semibold'}`}
              >
                PLAY
              </a>
              <a
                href="https://drive.google.com/file/d/1ZJWXJ0DoubaRd7qDoCK57abnknj8BDMq/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg font-caps text-[13px] tracking-[0.1em] text-[#6E6E73] hover:text-black transition-colors font-semibold"
              >
                <span>RESUME</span>
                <ArrowUpRight size={15} className="text-black shrink-0 stroke-[2.5]" aria-hidden="true" />
              </a>
              <a
                href="#contact"
                onClick={(e) => handleMobileNavClick('contact', e)}
                className={`block px-3 py-2.5 rounded-lg font-caps text-[13px] tracking-[0.1em] transition-colors ${activeTab === 'contact' ? 'text-black font-bold' : 'text-[#6E6E73] hover:text-black font-semibold'}`}
              >
                CONTACT
              </a>
            </div>

            <div className="pt-4 border-t border-black/[0.08] flex items-center justify-between text-[#86868B] font-caps text-[11px] tracking-[0.12em]">
              <span>KAY RAVICHANDRAN</span>
              <a href="mailto:itskeerthanaravichandran@gmail.com" className="hover:text-black transition-colors font-medium">GET IN TOUCH</a>
            </div>
          </div>
        )}
      </motion.header>

      {/* Outside click area & subtle darkened background overlay when mobile menu is opened */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed top-[57px] sm:top-[65px] inset-x-0 bottom-0 bg-black/20 z-40 lg:hidden cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* MAIN CONTENT CANVAS: Horizontal scroll for web/desktop, vertical scroll for tablet/mobile */}
      <div
        id="main-horizontal-container"
        ref={horizontalScrollRef}
        className="horizontal-scroll-container w-full h-full lg:h-screen lg:overflow-x-auto lg:overflow-y-hidden overflow-y-auto lg:flex lg:flex-row flex-col select-text"
      >
        {/* HERO SECTION: Fills 100vw on desktop */}
        <section 
          id="top" 
          className="relative w-full lg:w-screen lg:min-w-[100vw] h-auto min-h-[90vh] lg:h-screen flex flex-col justify-between pt-28 sm:pt-32 md:pt-36 lg:pt-20 pb-12 sm:pb-16 md:pb-20 lg:pb-0 px-6 sm:px-10 lg:px-20 xl:px-24 shrink-0"
        >
          <div className="flex-1 flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-16 w-full max-w-[1340px] mx-auto lg:mx-0">
            {/* Typographic Headline */}
            <div className="relative z-20 pointer-events-none max-w-[580px] lg:max-w-[640px] pb-6 lg:pb-16 flex flex-col justify-end">
              {/* 1. Hi, I'm Kay */}
              <h1 className="font-ugly-dave text-[52px] sm:text-[70px] md:text-[82px] lg:text-[90px] xl:text-[100px] font-normal leading-[0.96] text-black tracking-[0.015em]">
                <motion.span
                  className="inline-block transform -rotate-1 origin-left"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 28, rotate: -3 }}
                  animate={{ opacity: 1, y: 0, rotate: -1 }}
                  transition={{ duration: 0.8, delay: 0.08, ease: EASE_EDITORIAL }}
                >
                  Hi, I'm Kay
                </motion.span>
              </h1>

              {/* 2. Ambiguous problems quote */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.22, ease: EASE_EDITORIAL }}
                className="mt-6 sm:mt-8 text-[18px] sm:text-[21px] md:text-[22px] lg:text-[24px] font-sans-display leading-[1.45] text-[#222222] font-medium max-w-[560px]"
              >
                <p>
                  I love turning{' '}
                  <span className="text-black font-extrabold">
                    ambiguous problems
                  </span>{' '}
                  into products people can{' '}
                  <span className="text-black font-extrabold">
                    actually use.
                  </span>
                </p>
              </motion.div>

              {/* 3. Product · Research · Visuals · Code placed below */}
              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.36, ease: EASE_EDITORIAL }}
                className="mt-6 sm:mt-8 font-caps text-[11px] sm:text-[12px] tracking-[0.14em] text-[#555555] font-bold"
              >
                Product &middot; Research &middot; Visuals &middot; Code
              </motion.p>
            </div>

            {/* Cutout portrait with Hover Mask Reveal - aligned to right on mobile and desktop */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.46, ease: EASE_EDITORIAL }}
              className="flex items-end justify-end shrink-0 lg:self-end leading-none overflow-hidden w-full lg:w-auto"
            >
              <HoverMaskCutout />
            </motion.div>
          </div>
        </section>

        {/* 1. SELECTED WORK */}
        <section 
          id="work" 
          className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-0 lg:h-screen lg:flex lg:flex-row lg:items-center lg:gap-12 xl:gap-14 px-6 sm:px-10 lg:px-20 xl:px-24 shrink-0 w-full lg:w-auto max-w-[1340px] lg:max-w-none mx-auto lg:mx-0"
        >
          {/* Header */}
          <div className="mb-8 sm:mb-10 lg:mb-0 lg:w-[320px] xl:w-[360px] lg:shrink-0 flex flex-col justify-center">
            <h2 className="font-ugly-dave text-[38px] sm:text-[46px] lg:text-[50px] font-normal leading-[1.05] text-black tracking-[0.015em]">
              Selected Work
            </h2>
          </div>

          {/* Cards: 3D Perspective Horizontal Carousel on desktop, 2-per-row on tablet, full-width on mobile */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row lg:items-center gap-8 sm:gap-10 lg:gap-10 xl:gap-14 w-full lg:w-auto lg:shrink-0 overflow-visible py-4"
          >
            {/* PROJECT 1: YOUTOPIA */}
            <div className="w-full lg:max-w-none lg:w-[740px] xl:w-[820px] 2xl:w-[880px] lg:shrink-0 overflow-visible">
              <ThreeDCarouselCard
                scrollContainerRef={horizontalScrollRef}
                onClick={(e) => handleCardClick(e, 'youtopia')}
              >
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.65, ease: EASE_EDITORIAL }}
                  className="w-full"
                >
                  <a
                    href="/case-study.html?project=youtopia"
                    onClick={(e) => handleCardClick(e, 'youtopia')}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    className="group block text-black w-full cursor-pointer transition-all"
                  >
                    <TvCurvedMedia
                      id="youtopia"
                      type="image"
                      src="/Home/Y_WC.webp"
                      alt="Youtopia Work Preview"
                      width={1200}
                      height={633}
                      loading="eager"
                      fetchPriority="high"
                      scrollContainerRef={horizontalScrollRef}
                      tags={['AI', '0→1', 'Systems', 'Product Strategy']}
                      onClick={(e) => handleCardClick(e, 'youtopia')}
                    />
                    <div
                      className="pt-4 sm:pt-5 flex flex-col gap-1.5 cursor-pointer"
                      onClick={(e) => handleCardClick(e, 'youtopia')}
                    >
                      <h3 className="font-sans text-[19px] sm:text-[20px] font-semibold text-[#1D1D1F] tracking-tight group-hover:text-black transition-colors flex items-center justify-between">
                        <span>Youtopia</span>
                        <ArrowUpRight className="w-4 h-4 text-[#86868B] group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100" />
                      </h3>
                      <p className="text-[13px] sm:text-[13.5px] text-[#6E6E73] leading-relaxed mt-0.5">
                        Designing six interconnected products, from consumer onboarding to restaurant operations, around an AI nutrition platform that was still being defined.
                      </p>
                    </div>
                  </a>
                </motion.div>
              </ThreeDCarouselCard>
            </div>

            {/* PROJECT 2: JUSTICKETS */}
            <div className="w-full lg:max-w-none lg:w-[740px] xl:w-[820px] 2xl:w-[880px] lg:shrink-0 overflow-visible">
              <ThreeDCarouselCard
                scrollContainerRef={horizontalScrollRef}
                onClick={(e) => handleCardClick(e, 'justickets')}
              >
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.65, delay: 0.08, ease: EASE_EDITORIAL }}
                  className="w-full"
                >
                  <a
                    href="/case-study.html?project=justickets"
                    onClick={(e) => handleCardClick(e, 'justickets')}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    className="group block text-black w-full cursor-pointer transition-all"
                  >
                    <TvCurvedMedia
                      id="justickets"
                      type="video"
                      src="/JT/JT_GIF.mp4"
                      alt="Justickets Mobile App Interface Preview"
                      bg="bg-[#3B0F66]"
                      scrollContainerRef={horizontalScrollRef}
                      tags={['Consumer', 'Design Systems', 'Production']}
                      onClick={(e) => handleCardClick(e, 'justickets')}
                    />
                    <div
                      className="pt-4 sm:pt-5 flex flex-col gap-1.5 cursor-pointer"
                      onClick={(e) => handleCardClick(e, 'justickets')}
                    >
                      <h3 className="font-sans text-[19px] sm:text-[20px] font-semibold text-[#1D1D1F] tracking-tight group-hover:text-black transition-colors flex items-center justify-between">
                        <span>Justickets</span>
                        <ArrowUpRight className="w-4 h-4 text-[#86868B] group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100" />
                      </h3>
                      <p className="text-[13px] sm:text-[13.5px] text-[#6E6E73] leading-relaxed mt-0.5">
                        Scaling a production movie-ticketing product without slowing feature delivery.
                      </p>
                    </div>
                  </a>
                </motion.div>
              </ThreeDCarouselCard>
            </div>

            {/* PROJECT 3: REVLR */}
            <div className="w-full lg:max-w-none lg:w-[740px] xl:w-[820px] 2xl:w-[880px] lg:shrink-0 overflow-visible">
              <ThreeDCarouselCard
                scrollContainerRef={horizontalScrollRef}
                onClick={(e) => handleCardClick(e, 'revlr')}
              >
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.65, ease: EASE_EDITORIAL }}
                  className="w-full"
                >
                  <a
                    href="/case-study.html?project=revlr"
                    onClick={(e) => handleCardClick(e, 'revlr')}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    className="group block text-black w-full cursor-pointer transition-all"
                  >
                    <TvCurvedMedia
                      id="revlr"
                      type="image"
                      src="/Home/R_WC.webp"
                      alt="REVLR Work Preview"
                      width={1584}
                      height={1042}
                      loading="lazy"
                      scrollContainerRef={horizontalScrollRef}
                      tags={['Spatial', 'Interaction', 'Research']}
                      onClick={(e) => handleCardClick(e, 'revlr')}
                    />
                    <div
                      className="pt-4 sm:pt-5 flex flex-col gap-1.5 cursor-pointer"
                      onClick={(e) => handleCardClick(e, 'revlr')}
                    >
                      <h3 className="font-sans text-[19px] sm:text-[20px] font-semibold text-[#1D1D1F] tracking-tight group-hover:text-black transition-colors flex items-center justify-between">
                        <span>REVLR</span>
                        <ArrowUpRight className="w-4 h-4 text-[#86868B] group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100" />
                      </h3>
                      <p className="text-[13px] sm:text-[13.5px] text-[#6E6E73] leading-relaxed mt-0.5">
                        Spatial interaction framework for complex system modeling in virtual reality.
                      </p>
                    </div>
                  </a>
                </motion.div>
              </ThreeDCarouselCard>
            </div>

            {/* PROJECT 4: MY BLOCK COUNTS */}
            <div className="w-full lg:max-w-none lg:w-[740px] xl:w-[820px] 2xl:w-[880px] lg:shrink-0 overflow-visible">
              <ThreeDCarouselCard
                scrollContainerRef={horizontalScrollRef}
                onClick={(e) => handleCardClick(e, 'myblockcounts')}
              >
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.65, delay: 0.08, ease: EASE_EDITORIAL }}
                  className="w-full"
                >
                  <a
                    href="/case-study.html?project=myblockcounts"
                    onClick={(e) => handleCardClick(e, 'myblockcounts')}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    className="group block text-black w-full cursor-pointer transition-all"
                  >
                    <TvCurvedMedia
                      id="myblockcounts"
                      type="video"
                      src="/MBC/MBC_GIF.mp4"
                      alt="My Block Counts Mobile App Interface Preview"
                      bg="bg-[#1bab51]"
                      scrollContainerRef={horizontalScrollRef}
                      tags={['Civic Tech', 'Accessibility', 'Research']}
                      onClick={(e) => handleCardClick(e, 'myblockcounts')}
                    />
                    <div
                      className="pt-4 sm:pt-5 flex flex-col gap-1.5 cursor-pointer"
                      onClick={(e) => handleCardClick(e, 'myblockcounts')}
                    >
                      <h3 className="font-sans text-[19px] sm:text-[20px] font-semibold text-[#1D1D1F] tracking-tight group-hover:text-black transition-colors flex items-center justify-between">
                        <span>My Block Counts</span>
                        <ArrowUpRight className="w-4 h-4 text-[#86868B] group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100" />
                      </h3>
                      <p className="text-[13px] sm:text-[13.5px] text-[#6E6E73] leading-relaxed mt-0.5">
                        Redesigning an abandoned civic app so that filling out a survey felt like activism, not a form.
                      </p>
                    </div>
                  </a>
                </motion.div>
              </ThreeDCarouselCard>
            </div>
          </div>
        </section>

        {/* 2. THINGS I BUILT */}
        <section 
          id="things-i-built" 
          className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-0 lg:h-screen lg:flex lg:flex-row lg:items-center lg:gap-12 xl:gap-14 px-6 sm:px-10 lg:px-20 xl:px-24 shrink-0 w-full lg:w-auto max-w-[1340px] lg:max-w-none mx-auto lg:mx-0"
        >
          {/* Header */}
          <div className="mb-8 sm:mb-10 lg:mb-0 lg:w-[320px] xl:w-[360px] lg:shrink-0 flex flex-col justify-center">
            <h2 className="font-ugly-dave text-[36px] sm:text-[44px] lg:text-[48px] font-normal leading-[1.05] text-black tracking-[0.015em] mb-3">
              Things I built
            </h2>
            <p className="text-[14px] lg:text-[14.5px] leading-relaxed text-[#383838]">
              Products that started as “I wish this existed” and became working interfaces.
            </p>
          </div>

          {/* Cards: 3D Horizontal Carousel on desktop, 2-per-row on tablet, full-width on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row lg:items-center gap-8 sm:gap-10 lg:gap-10 xl:gap-14 w-full lg:w-auto lg:shrink-0 overflow-visible py-4">
            {/* BUILD 1: MISE */}
            <div className="w-full lg:max-w-none lg:w-[700px] xl:w-[760px] 2xl:w-[820px] lg:shrink-0 overflow-visible">
              <ThreeDCarouselCard scrollContainerRef={horizontalScrollRef}>
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.65, ease: EASE_EDITORIAL }}
                  className="w-full"
                >
                  <a
                    href="https://misemobileapp.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={(e) => handleCardMouseEnter(e, 'View App')}
                    onMouseMove={(e) => handleCardMouseMove(e, 'View App')}
                    onMouseLeave={handleCardMouseLeave}
                    className="group block text-black w-full cursor-pointer transition-all"
                  >
                    <TvCurvedMedia
                      id="mise"
                      type="video"
                      src="/Home/Mise_GIF.mp4"
                      alt="MISE Recipe App Preview"
                      bg="bg-black"
                      scrollContainerRef={horizontalScrollRef}
                      tags={['Vibe Coding', 'AI UX', 'Mobile']}
                    />
                    <div className="pt-4 sm:pt-5 flex flex-col gap-1.5 cursor-pointer">
                      <h3 className="font-sans text-[19px] sm:text-[20px] font-semibold text-[#1D1D1F] tracking-tight group-hover:text-black transition-colors flex items-center justify-between">
                        <span>MISE</span>
                        <ArrowUpRight className="w-4 h-4 text-[#86868B] group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100" />
                      </h3>
                      <p className="text-[13px] sm:text-[13.5px] text-[#6E6E73] leading-relaxed mt-0.5">
                        I kept saving recipes from TikTok, YouTube, and Instagram and never actually making them. MISE turns those saved recipes into meals I can actually cook.
                      </p>
                    </div>
                  </a>
                </motion.div>
              </ThreeDCarouselCard>
            </div>

            {/* BUILD 2: NETFLIX */}
            <div className="w-full lg:max-w-none lg:w-[700px] xl:w-[760px] 2xl:w-[820px] lg:shrink-0 overflow-visible">
              <ThreeDCarouselCard scrollContainerRef={horizontalScrollRef}>
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.65, delay: 0.08, ease: EASE_EDITORIAL }}
                  className="w-full"
                >
                  <a
                    href="https://netflix-social-feature.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={(e) => handleCardMouseEnter(e, 'View Feature')}
                    onMouseMove={(e) => handleCardMouseMove(e, 'View Feature')}
                    onMouseLeave={handleCardMouseLeave}
                    className="group block text-black w-full cursor-pointer transition-all"
                  >
                    <TvCurvedMedia
                      id="netflix"
                      type="video"
                      src="/Home/NETFLIX_GIF.mp4"
                      alt="Netflix Social Feature Preview"
                      bg="bg-neutral-950"
                      scrollContainerRef={horizontalScrollRef}
                      tags={['Full Stack', 'Vibe Coding', 'Social UX']}
                    />
                    <div className="pt-4 sm:pt-5 flex flex-col gap-1.5 cursor-pointer">
                      <h3 className="font-sans text-[19px] sm:text-[20px] font-semibold text-[#1D1D1F] tracking-tight group-hover:text-black transition-colors flex items-center justify-between">
                        <span>Netflix, but a little more personal</span>
                        <ArrowUpRight className="w-4 h-4 text-[#86868B] group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100" />
                      </h3>
                      <p className="text-[13px] sm:text-[13.5px] text-[#6E6E73] leading-relaxed mt-0.5">
                        I kept getting tired of scrolling through my Netflix list trying to figure out what to watch. I wanted a simpler way to discover something good, so I built a social layer where friends can share what they think I’ll love and help me find something worth watching.
                      </p>
                    </div>
                  </a>
                </motion.div>
              </ThreeDCarouselCard>
            </div>
          </div>
        </section>

        {/* 3. MENTORSHIP SECTION */}
        <section 
          id="mentorship" 
          className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-0 lg:h-screen lg:w-screen lg:min-w-[100vw] lg:flex lg:flex-col lg:items-center lg:justify-center px-6 sm:px-10 lg:px-20 xl:px-24 shrink-0 w-full max-w-[1340px] lg:max-w-none mx-auto lg:mx-0"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.65, ease: EASE_EDITORIAL }}
            className="w-full max-w-none lg:max-w-[760px] text-left"
          >
            <span className="font-caps text-[11px] sm:text-[12px] tracking-[0.14em] text-[#555555] block mb-3 font-bold">
              Mentorship & Teaching
            </span>
            <h2 className="font-ugly-dave text-[34px] sm:text-[40px] lg:text-[46px] font-normal leading-[1.12] text-black tracking-[0.015em] mb-6">
              Helping other designers grow
            </h2>
            <div className="space-y-4 sm:space-y-5 text-[15px] sm:text-[16px] leading-[1.75] text-[#2a2a2a] font-normal">
              <p>
                Great product design isn't just about making good decisions. It's also about helping other people make them.
              </p>
              <p>
                At Qube Cinema, I mentored design interns through real product work, helping them navigate design decisions, feedback, and cross-functional collaboration. At Outcome School, I designed curriculum that turns product design practice into structured learning for hundreds of aspiring designers.
              </p>
              <p>
                Teaching and mentoring have made me a clearer communicator, a stronger collaborator, and a more thoughtful product designer.
              </p>
            </div>
          </motion.div>
        </section>

        {/* 4. ABOUT SECTION & PEEK PHOTOS */}
        <section 
          id="about" 
          className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-0 lg:h-screen lg:w-screen lg:min-w-[100vw] lg:flex lg:flex-col lg:justify-between lg:pt-24 xl:pt-28 lg:pb-0 px-6 sm:px-10 lg:px-20 xl:px-24 shrink-0 w-full max-w-[1340px] lg:max-w-none mx-auto lg:mx-0 overflow-hidden"
        >
          {/* Portrait + Bio Content: side-by-side on tablet (md:) & desktop (lg:), reordered on mobile */}
          <div className="w-full max-w-[1240px] mx-auto flex flex-col md:flex-row items-start md:items-center gap-8 sm:gap-10 lg:gap-14 pt-2">
            {/* Portrait card on tablet & desktop in original aspect ratio (side-by-side) */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
              className="hidden md:block shrink-0"
            >
              <div className="card-apple overflow-hidden w-[220px] sm:w-[240px] lg:w-[230px] xl:w-[255px] aspect-[1111/1600] rounded-[10px] shadow-lg border border-black/[0.06] bg-[#FAFAFA]">
                <picture className="w-full h-full block">
                  <source srcSet="/Home/about.webp" type="image/webp" />
                  <img
                    src="/Home/about.webp"
                    alt="Kay portrait illustration"
                    className="w-full h-full object-contain"
                    width={1111}
                    height={1600}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
            </motion.div>

            {/* Bio Content - never cut in height */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.65, delay: 0.08, ease: EASE_EDITORIAL }}
              className="flex-1 max-w-[660px] w-full"
            >
              <h2 className="font-ugly-dave text-[34px] sm:text-[40px] lg:text-[46px] font-normal leading-[1.05] text-black mb-3.5 tracking-[0.015em]">
                Hi, I'm Kay
              </h2>

              {/* Photo on small screens (<md): placed directly under Hi, I'm Kay */}
              <div className="block md:hidden my-4 sm:my-5 w-[180px] sm:w-[220px] aspect-[1111/1600] card-apple rounded-[10px] overflow-hidden shadow-lg border border-black/[0.06] bg-[#FAFAFA]">
                <picture className="w-full h-full block">
                  <source srcSet="/Home/about.webp" type="image/webp" />
                  <img
                    src="/Home/about.webp"
                    alt="Kay portrait illustration"
                    className="w-full h-full object-contain"
                    width={1111}
                    height={1600}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>

              <div className="space-y-3.5 sm:space-y-4 text-[14.5px] sm:text-[15.5px] leading-[1.72] text-[#444446] font-normal">
                <p>
                  I didn't start in product design. I started in illustration, drawing characters and building visual worlds long before I touched Figma. That instinct never really left, it's why I still care as much about how something feels as how it functions.
                </p>
                <p>
                  Somewhere along the way I got pulled toward a harder problem: not how do I make this beautiful, but how do I make this make sense. My background in human centered computing gave me the research and systems thinking, the illustration background kept the human part from getting lost in the process. Together they shape how I work now, on AI systems people don't trust yet, VR interfaces with no rulebook, civic platforms nobody wants to open.
                </p>
                <p>
                  Outside of design, I climb, play guitar, and try to spend real time away from a screen, usually with people I like, good food, and better music. I think community and human connection are underrated design problems too, which is part of why I teach.
                </p>
              </div>

              <div className="mt-6 sm:mt-7 flex items-center gap-4">
                <a
                  href="https://drive.google.com/file/d/1ZJWXJ0DoubaRd7qDoCK57abnknj8BDMq/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-[13.5px] font-sans font-medium transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>View Resume</span>
                  <ArrowUpRight size={15} className="shrink-0 stroke-[2.5]" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Peekaboo Pictures: resting submerged at the bottom, lifting completely on hover */}
          <div className="w-full max-w-[1240px] mx-auto mt-6 lg:mt-auto pt-2 pb-0 overflow-visible lg:translate-y-12 xl:translate-y-14">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: 0.15, ease: EASE_EDITORIAL }}
              className="w-full max-w-[1020px]"
            >
              <PeekPhotosRow size="about" hoverLift={-96} />
            </motion.div>
          </div>
        </section>

        {/* 5. CONTACT SECTION */}
        <section 
          id="contact" 
          className="relative z-20 py-12 sm:py-16 md:py-20 lg:py-0 lg:h-screen lg:w-screen lg:min-w-[100vw] lg:flex lg:flex-col lg:items-center lg:justify-center px-6 sm:px-10 lg:px-20 xl:px-24 pb-24 sm:pb-28 md:pb-32 lg:pb-0 shrink-0 w-full max-w-[1340px] lg:max-w-none mx-auto lg:mx-0"
        >
          <div className="w-full max-w-[1240px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 sm:gap-12 lg:gap-16 xl:gap-20">
            {/* Left Column: Headline in display header font */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, ease: EASE_EDITORIAL }}
              className="w-full lg:max-w-[560px] xl:max-w-[620px] text-left shrink-0"
            >
              <h2 className="font-ugly-dave text-[34px] sm:text-[44px] md:text-[50px] lg:text-[52px] xl:text-[60px] font-normal leading-[1.04] text-black tracking-[0.015em]">
                Building something complex?<br />
                I'd love to help make it simpler.
              </h2>
            </motion.div>

            {/* Right Column: Contact Card in current UI style */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: 0.08, ease: EASE_EDITORIAL }}
              className="w-full max-w-[540px] lg:max-w-[480px] xl:max-w-[520px] shrink-0"
            >
              <div className="p-7 sm:p-9 lg:p-9 xl:p-10 bg-white border border-black/[0.09] rounded-[10px] text-black shadow-none">
                <span className="font-caps text-[11px] sm:text-[12px] tracking-[0.14em] text-[#86868B] block mb-3 font-bold">
                  Get in Touch
                </span>

                <p className="text-[14px] sm:text-[15px] leading-[1.7] text-[#515154] font-normal mb-6">
                  Whether you're exploring a new product, improving an existing one, or just want to talk about design, feel free to reach out.
                </p>

                <div className="mb-6 max-w-full">
                  <a
                    href="mailto:itskeerthanaravichandran@gmail.com"
                    className="inline-flex items-center gap-1.5 sm:gap-2 text-[14.5px] sm:text-base lg:text-[16.5px] xl:text-lg font-sans text-[#1D1D1F] hover:text-[#0071E3] transition-colors font-semibold tracking-tight max-w-full break-all py-1 group"
                  >
                    <span className="break-all">itskeerthanaravichandran@gmail.com</span>
                    <ArrowUpRight size={18} className="shrink-0 inline-block align-middle select-none stroke-[2.5]" aria-hidden="true" />
                  </a>
                </div>

                {/* SOCIAL LINKS CONNECTED GRID BAR (matching screenshot design) */}
                <div className="grid grid-cols-4 border border-black/[0.1] rounded-[8px] sm:rounded-[10px] overflow-hidden divide-x divide-black/[0.1] bg-white">
                  {/* Instagram */}
                  <a 
                    href="https://www.instagram.com/summershuttle/?hl=en" 
                    target="_blank" 
                    rel="noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                    className="flex items-center justify-center py-4 sm:py-5 hover:bg-black/[0.04] text-[#1D1D1F] hover:text-black transition-colors group"
                  >
                    <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>

                  {/* Behance */}
                  <a 
                    href="https://www.behance.net/keertharavicha1" 
                    target="_blank" 
                    rel="noreferrer"
                    aria-label="Behance"
                    title="Behance"
                    className="flex items-center justify-center py-4 sm:py-5 hover:bg-black/[0.04] text-[#1D1D1F] hover:text-black transition-colors group"
                  >
                    <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.5 5.5v13" />
                      <path d="M4.5 5.5h4a3 3 0 0 1 0 6h-4" />
                      <path d="M4.5 11.5h4.5a3.5 3.5 0 0 1 0 7h-4.5" />
                      <path d="M13.5 7.5h5" />
                      <path d="M12.5 15h6a3 3 0 1 0-6 0c0 2 1.5 3.5 3.5 3.5 1.3 0 2.4-.6 3-1.6" />
                    </svg>
                  </a>

                  {/* Email */}
                  <a 
                    href="mailto:itskeerthanaravichandran@gmail.com" 
                    aria-label="Email"
                    title="Email"
                    className="flex items-center justify-center py-4 sm:py-5 hover:bg-black/[0.04] text-[#1D1D1F] hover:text-black transition-colors group"
                  >
                    <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a 
                    href="https://www.linkedin.com/in/keerthanaravichandran/" 
                    target="_blank" 
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                    className="flex items-center justify-center py-4 sm:py-5 hover:bg-black/[0.04] text-[#1D1D1F] hover:text-black transition-colors group"
                  >
                    <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </div>

                {/* FOOTER */}
                <footer className="mt-6 pt-3 text-[11px] font-sans tracking-normal text-[#86868B] font-normal border-t border-black/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                  <span>© 2026 Kay Ravichandran</span>
                </footer>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* FLOATING CURSOR-FOLLOWING PILL */}
      <div
        ref={cursorPillRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 z-[100] pointer-events-none hidden lg:inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#1D1D1F]/90 backdrop-blur-xl border border-white/15 text-white shadow-xl transition-opacity duration-150 will-change-transform ${
          cardCursor.visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="font-sans text-[11px] tracking-normal font-medium text-white whitespace-nowrap">
          {cardCursor.label}
        </span>
      </div>
    </div>
  );
}