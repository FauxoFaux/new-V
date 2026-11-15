import React, { useEffect, useRef, useState } from 'react';

interface ThreeDCarouselCardProps {
  children: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface RegisteredCard {
  outer: HTMLDivElement;
  inner: HTMLDivElement;
  lastTransform: string;
  lastOpacity: string;
  lastZIndex: string;
}

const registeredCards = new Set<RegisteredCard>();
let rafPending = false;
let attachedScrollEl: HTMLElement | null = null;
let listenersAttached = false;

function runBatchUpdate() {
  rafPending = false;
  const vw = window.innerWidth;

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

  // Phase 1: Batch all layout reads before any style mutations (prevents layout thrashing)
  const screenCenter = vw / 2;
  const maxDist = Math.max(680, vw * 0.52);
  const snapshots: { entry: RegisteredCard; left: number; right: number; width: number }[] = [];

  registeredCards.forEach((entry) => {
    const rect = entry.outer.getBoundingClientRect();
    snapshots.push({ entry, left: rect.left, right: rect.right, width: rect.width });
  });

  // Phase 2: Batch all style writes
  for (let i = 0; i < snapshots.length; i++) {
    const { entry, left, right, width } = snapshots[i];
    const inRange = right >= -320 && left <= vw + 320;

    if (!inRange) {
      if (entry.inner.style.willChange === 'transform, opacity') {
        entry.inner.style.willChange = 'auto';
      }
      continue;
    }

    if (entry.inner.style.willChange !== 'transform, opacity') {
      entry.inner.style.willChange = 'transform, opacity';
    }

    const cardCenter = left + width / 2;
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
  }
}

function scheduleBatchUpdate() {
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(runBatchUpdate);
  }
}

export function flushCarouselCards() {
  if (registeredCards.size === 0) return;
  runBatchUpdate();
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
    window.addEventListener('resize', scheduleBatchUpdate, { passive: true });
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
    window.removeEventListener('resize', scheduleBatchUpdate);
    listenersAttached = false;
  }
}

/**
 * ThreeDCarouselCard - Positions work cards in a true 3D Perspective Horizontal Carousel.
 * Active strictly on desktop screens (>= 1024px) with horizontal scroll.
 * Uses a shared RAF read-then-write coordinator to eliminate scroll layout thrashing.
 */
export const ThreeDCarouselCard: React.FC<ThreeDCarouselCardProps> = React.memo(({
  children,
  scrollContainerRef,
  className = '',
  onClick,
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const entry: RegisteredCard = {
      outer,
      inner,
      lastTransform: '',
      lastOpacity: '',
      lastZIndex: '',
    };

    registeredCards.add(entry);
    const scrollEl = scrollContainerRef?.current || document.getElementById('main-horizontal-container');
    ensureGlobalListeners(scrollEl);
    scheduleBatchUpdate();

    return () => {
      registeredCards.delete(entry);
      teardownGlobalListenersIfEmpty();
    };
  }, [scrollContainerRef, isDesktop]);

  if (!isDesktop) {
    return (
      <div ref={outerRef} onClick={onClick} className={`w-full ${className}`}>
        <div ref={innerRef} className="w-full h-full">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={outerRef}
      onClick={onClick}
      className={`relative shrink-0 overflow-visible cursor-pointer ${className}`}
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
