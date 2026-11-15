import React, { useEffect, useRef, useState } from 'react';

interface ThreeDCarouselCardProps {
  children: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

interface RegisteredCard {
  outer: HTMLDivElement;
  inner: HTMLDivElement;
  centerInContent: number;
  width: number;
  lastTransform: string;
  lastOpacity: string;
  lastZIndex: string;
}

const registeredCards = new Set<RegisteredCard>();
let rafPending = false;
let attachedScrollEl: HTMLElement | null = null;
let listenersAttached = false;
let cachedVw = typeof window !== 'undefined' ? window.innerWidth : 1200;
let resizeObserver: ResizeObserver | null = null;

function measureAllCards() {
  cachedVw = window.innerWidth;
  if (cachedVw < 1024 || registeredCards.size === 0) return;

  const scrollLeft = attachedScrollEl ? attachedScrollEl.scrollLeft : 0;
  registeredCards.forEach((entry) => {
    const rect = entry.outer.getBoundingClientRect();
    entry.width = rect.width;
    entry.centerInContent = rect.left + scrollLeft + rect.width / 2;
  });
}

function runBatchUpdate() {
  rafPending = false;
  const vw = cachedVw;

  if (vw < 1024) {
    registeredCards.forEach((entry) => {
      if (entry.lastTransform !== 'none') {
        entry.inner.style.transform = 'none';
        entry.lastTransform = 'none';
      }
      if (entry.lastOpacity !== '1') {
        entry.inner.style.opacity = '1';
        entry.lastOpacity = '1';
      }
      if (entry.inner.style.willChange) {
        entry.inner.style.willChange = 'auto';
      }
    });
    return;
  }

  let needsMeasure = false;
  registeredCards.forEach((entry) => {
    if (entry.width <= 0) needsMeasure = true;
  });
  if (needsMeasure) {
    measureAllCards();
  }

  // Single read of scrollLeft — zero per-card DOM layout reads during scroll
  const scrollLeft = attachedScrollEl ? attachedScrollEl.scrollLeft : 0;
  const screenCenter = vw / 2;
  const maxDist = Math.max(680, vw * 0.52);

  registeredCards.forEach((entry) => {
    const halfWidth = entry.width / 2;
    const cardCenter = entry.centerInContent - scrollLeft;
    const left = cardCenter - halfWidth;
    const right = cardCenter + halfWidth;
    const inRange = right >= -320 && left <= vw + 320;

    if (!inRange) {
      if (entry.inner.style.willChange === 'transform, opacity') {
        entry.inner.style.willChange = 'auto';
      }
      return;
    }

    if (entry.inner.style.willChange !== 'transform, opacity') {
      entry.inner.style.willChange = 'transform, opacity';
    }

    const dist = cardCenter - screenCenter;
    const factor = Math.max(-1, Math.min(1, dist / maxDist));
    const rotateY = -factor * 14;
    const absFactor = Math.abs(factor);
    const translateZ = -absFactor * 80;
    const scale = Math.max(0.95, 1 - absFactor * 0.06);
    const opacity = Math.max(0.92, 1 - absFactor * 0.12);

    const nextTransform = `translate3d(0, 0, ${translateZ.toFixed(1)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    const nextOpacity = opacity.toFixed(3);
    const nextZIndex = String(Math.round((1 - absFactor) * 50) + 10);

    if (entry.lastTransform !== nextTransform) {
      entry.inner.style.transform = nextTransform;
      entry.lastTransform = nextTransform;
    }
    if (entry.lastOpacity !== nextOpacity) {
      entry.inner.style.opacity = nextOpacity;
      entry.lastOpacity = nextOpacity;
    }
    if (entry.lastZIndex !== nextZIndex) {
      entry.outer.style.zIndex = nextZIndex;
      entry.lastZIndex = nextZIndex;
    }
  });
}

function scheduleBatchUpdate() {
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(runBatchUpdate);
  }
}

function handleResize() {
  measureAllCards();
  scheduleBatchUpdate();
}

export function flushCarouselCards() {
  if (registeredCards.size === 0) return;
  scheduleBatchUpdate();
}

function ensureGlobalListeners(scrollEl: HTMLElement | null) {
  if (scrollEl && attachedScrollEl !== scrollEl) {
    if (attachedScrollEl) {
      attachedScrollEl.removeEventListener('scroll', scheduleBatchUpdate);
    }
    attachedScrollEl = scrollEl;
    attachedScrollEl.addEventListener('scroll', scheduleBatchUpdate, { passive: true });
  }
  if (!listenersAttached && typeof window !== 'undefined') {
    listenersAttached = true;
    window.addEventListener('scroll', scheduleBatchUpdate, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
  }
  if (!resizeObserver && typeof ResizeObserver !== 'undefined' && scrollEl) {
    resizeObserver = new ResizeObserver(() => {
      measureAllCards();
      scheduleBatchUpdate();
    });
    resizeObserver.observe(scrollEl);
  }
}

function teardownGlobalListenersIfEmpty() {
  if (registeredCards.size > 0) return;
  if (attachedScrollEl) {
    attachedScrollEl.removeEventListener('scroll', scheduleBatchUpdate);
    attachedScrollEl = null;
  }
  if (listenersAttached && typeof window !== 'undefined') {
    window.removeEventListener('scroll', scheduleBatchUpdate);
    window.removeEventListener('resize', handleResize);
    listenersAttached = false;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
}

/**
 * ThreeDCarouselCard - Positions work cards in a true 3D Perspective Horizontal Carousel.
 * Active strictly on desktop screens (>= 1024px) with horizontal scroll.
 * Uses cached card positions and a single RAF coordinator for zero scroll layout thrashing.
 */
export const ThreeDCarouselCard: React.FC<ThreeDCarouselCardProps> = React.memo(({
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
    const onResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const entry: RegisteredCard = {
      outer,
      inner,
      centerInContent: 0,
      width: 0,
      lastTransform: '',
      lastOpacity: '',
      lastZIndex: '',
    };

    registeredCards.add(entry);
    const scrollEl = scrollContainerRef?.current || document.getElementById('main-horizontal-container');
    ensureGlobalListeners(scrollEl);
    measureAllCards();
    scheduleBatchUpdate();

    return () => {
      registeredCards.delete(entry);
      teardownGlobalListenersIfEmpty();
    };
  }, [scrollContainerRef, isDesktop]);

  if (!isDesktop) {
    return (
      <div ref={outerRef} className={`w-full ${className}`}>
        <div ref={innerRef} className="w-full h-full">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={outerRef}
      className={`relative shrink-0 overflow-visible ${className}`}
      style={{
        perspective: '1200px',
      }}
    >
      <div
        ref={innerRef}
        className="w-full h-full overflow-visible"
        style={{
          transformOrigin: '50% 50%',
          backfaceVisibility: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
});
