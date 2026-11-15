import React, { useRef, useEffect } from 'react';

interface TrailBlob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  age: number;
  maxAge: number;
}

interface HoverMaskCutoutProps {
  triggerLandingPeek?: boolean;
}

export const HoverMaskCutout = React.memo(function HoverMaskCutout({ triggerLandingPeek = false }: HoverMaskCutoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const idleCoverRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const headCircleRef = useRef<SVGCircleElement>(null);
  const trailGroupRef = useRef<SVGGElement>(null);
  const startPeekRef = useRef<(() => void) | null>(null);
  const hasPeekedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const headCircle = headCircleRef.current;
    const trailGroup = trailGroupRef.current;
    if (!container || !headCircle || !trailGroup) return;

    const MAX_TRAIL = 12;
    const circleEls: SVGCircleElement[] = [];
    for (let i = 0; i < MAX_TRAIL; i++) {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('fill', 'black');
      c.setAttribute('r', '0');
      c.setAttribute('cx', '-999');
      c.setAttribute('cy', '-999');
      trailGroup.appendChild(c);
      circleEls.push(c);
    }

    const state = {
      isHovered: false,
      isPeeking: false,
      mouseX: 0,
      mouseY: 0,
      currX: 0,
      currY: 0,
      lastSpawnX: 0,
      lastSpawnY: 0,
      headRadius: 0,
      targetHeadRadius: 0,
      blobs: [] as TrailBlob[],
      rafId: 0,
      peekRafId: 0,
      running: false,
    };

    const setFilterActive = (active: boolean) => {
      if (svgRef.current) {
        svgRef.current.style.display = active ? 'block' : 'none';
      }
      if (idleCoverRef.current) {
        idleCoverRef.current.style.display = active ? 'none' : 'block';
      }
    };

    const startLoop = () => {
      if (!state.running) {
        state.running = true;
        setFilterActive(true);
        state.rafId = requestAnimationFrame(tick);
      }
    };

    const spawnBlob = (x: number, y: number, speed: number) => {
      const dynamicRadius = Math.min(105, Math.max(62, 66 + speed * 0.75));
      state.blobs.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: dynamicRadius * 0.5,
        targetRadius: dynamicRadius,
        age: 0,
        maxAge: 42,
      });
      if (state.blobs.length > MAX_TRAIL) {
        state.blobs.shift();
      }
    };

    const stopPeek = () => {
      if (state.isPeeking) {
        state.isPeeking = false;
        cancelAnimationFrame(state.peekRafId);
      }
    };

    startPeekRef.current = () => {
      if (state.isHovered || state.isPeeking) return;
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const startX = rect.width * 0.42;
      const startY = rect.height * 0.28;
      const endX = rect.width * 0.62;
      const endY = rect.height * 0.56;

      state.isPeeking = true;
      state.currX = startX;
      state.currY = startY;
      state.mouseX = startX;
      state.mouseY = startY;
      state.lastSpawnX = startX;
      state.lastSpawnY = startY;
      state.targetHeadRadius = 74;
      startLoop();

      const startTime = performance.now();
      const duration = 820;

      const stepPeek = (now: number) => {
        if (!state.isPeeking || state.isHovered) return;
        const t = Math.min(1, (now - startTime) / duration);
        // Smooth ease-in-out
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

        const px = startX + (endX - startX) * eased + Math.sin(eased * Math.PI) * 18;
        const py = startY + (endY - startY) * eased;

        state.mouseX = px;
        state.mouseY = py;
        state.targetHeadRadius = t > 0.78 ? Math.max(0, 74 * (1 - (t - 0.78) / 0.22)) : 74;

        const dist = Math.hypot(px - state.lastSpawnX, py - state.lastSpawnY);
        if (dist > 14 && t < 0.8) {
          spawnBlob(px, py, dist);
          state.lastSpawnX = px;
          state.lastSpawnY = py;
        }

        if (t < 1) {
          state.peekRafId = requestAnimationFrame(stepPeek);
        } else {
          state.isPeeking = false;
          state.targetHeadRadius = 0;
        }
      };

      state.peekRafId = requestAnimationFrame(stepPeek);
    };

    const updatePointer = (clientX: number, clientY: number) => {
      stopPeek();
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (!state.isHovered) {
        state.isHovered = true;
        state.currX = x;
        state.currY = y;
        state.lastSpawnX = x;
        state.lastSpawnY = y;
      }

      state.mouseX = x;
      state.mouseY = y;
      state.targetHeadRadius = 84;

      const dx = x - state.lastSpawnX;
      const dy = y - state.lastSpawnY;
      const dist = Math.hypot(dx, dy);

      if (dist > 14) {
        spawnBlob(x, y, dist);
        state.lastSpawnX = x;
        state.lastSpawnY = y;
      }

      startLoop();
    };

    const handleMouseEnter = (e: MouseEvent) => {
      updatePointer(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePointer(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      state.isHovered = false;
      state.targetHeadRadius = 0;
      startLoop();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      state.isHovered = false;
      state.targetHeadRadius = 0;
      startLoop();
    };

    const tick = () => {
      // Smooth spring-like interpolation for the main cursor blob
      state.currX += (state.mouseX - state.currX) * 0.28;
      state.currY += (state.mouseY - state.currY) * 0.28;
      state.headRadius += (state.targetHeadRadius - state.headRadius) * 0.18;

      if (state.headRadius > 0.5) {
        headCircle.setAttribute('cx', state.currX.toFixed(1));
        headCircle.setAttribute('cy', state.currY.toFixed(1));
        headCircle.setAttribute('r', state.headRadius.toFixed(1));
      } else {
        state.headRadius = 0;
        headCircle.setAttribute('r', '0');
      }

      // Update trailing liquid blobs
      for (let i = state.blobs.length - 1; i >= 0; i--) {
        const b = state.blobs[i];
        b.age += 1;
        b.x += b.vx;
        b.y += b.vy;

        const lifeRatio = b.age / b.maxAge;
        if (lifeRatio < 0.22) {
          b.radius += (b.targetRadius - b.radius) * 0.35;
        } else {
          const decay = 1 - (lifeRatio - 0.22) / 0.78;
          b.radius = Math.max(0, b.targetRadius * Math.pow(decay, 1.35));
        }

        if (b.age >= b.maxAge || b.radius <= 0.5) {
          state.blobs.splice(i, 1);
        }
      }

      for (let i = 0; i < MAX_TRAIL; i++) {
        const el = circleEls[i];
        const b = state.blobs[i];
        if (b) {
          el.setAttribute('cx', b.x.toFixed(1));
          el.setAttribute('cy', b.y.toFixed(1));
          el.setAttribute('r', b.radius.toFixed(1));
        } else {
          el.setAttribute('r', '0');
        }
      }

      if (state.isHovered || state.isPeeking || state.headRadius > 0 || state.blobs.length > 0) {
        state.rafId = requestAnimationFrame(tick);
      } else {
        state.running = false;
        setFilterActive(false);
      }
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchMove, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(state.rafId);
      cancelAnimationFrame(state.peekRafId);
      startPeekRef.current = null;
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchMove);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      trailGroup.innerHTML = '';
    };
  }, []);

  useEffect(() => {
    if (!triggerLandingPeek || hasPeekedRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    hasPeekedRef.current = true;
    const timer = window.setTimeout(() => {
      startPeekRef.current?.();
    }, 520);

    return () => window.clearTimeout(timer);
  }, [triggerLandingPeek]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden w-[240px] sm:w-[290px] md:w-[350px] lg:w-[400px] xl:w-[430px] max-w-full select-none shrink-0 leading-none flex items-end"
    >
      {/* Base Cutout Portrait */}
      <picture className="w-full h-auto max-h-[50svh] sm:max-h-[54svh] md:max-h-[72svh] lg:max-h-[78svh] block pointer-events-none select-none translate-y-[3px]">
        <source srcSet="/Home/cutout.webp" type="image/webp" />
        <img
          src="/Home/cutout.webp"
          alt="Kay portrait cutout"
          className="w-full h-auto max-h-[50svh] sm:max-h-[54svh] md:max-h-[72svh] lg:max-h-[78svh] object-contain object-bottom block pointer-events-none select-none"
          width={900}
          height={1100}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      {/* Lightweight solid idle cover (avoids SVG blur filter cost until hover/peek) */}
      <div
        ref={idleCoverRef}
        className="absolute -inset-2 bg-[#F6F6F7] pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Hover Mask Reveal effect on top in off-white (#F6F6F7) that reveals the image on hover */}
      <svg
        ref={svgRef}
        style={{ display: 'none' }}
        className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] pointer-events-none z-10"
        aria-hidden="true"
      >
        <defs>
          <filter
            id="framer-liquid-mask-goo"
            filterUnits="userSpaceOnUse"
            x="-20"
            y="-20"
            width="calc(100% + 40px)"
            height="calc(100% + 40px)"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
              result="goo"
            />
          </filter>
          <mask
            id="framer-blue-overlay-mask"
            maskUnits="userSpaceOnUse"
            x="-20"
            y="-20"
            width="calc(100% + 40px)"
            height="calc(100% + 40px)"
          >
            <rect x="-20" y="-20" width="calc(100% + 40px)" height="calc(100% + 40px)" fill="white" />
            <g filter="url(#framer-liquid-mask-goo)">
              <g ref={trailGroupRef} />
              <circle
                ref={headCircleRef}
                cx="-999"
                cy="-999"
                r="0"
                fill="black"
              />
            </g>
          </mask>
        </defs>
        <rect
          x="-20"
          y="-20"
          width="calc(100% + 40px)"
          height="calc(100% + 40px)"
          fill="#F6F6F7"
          mask="url(#framer-blue-overlay-mask)"
        />
      </svg>
      {/* 2px bottom safety cover to ensure zero exposed edge in vertical layout */}
      <div className="absolute -bottom-1 -left-2 -right-2 h-3 bg-[#F6F6F7] pointer-events-none z-20" aria-hidden="true" />
    </div>
  );
});
