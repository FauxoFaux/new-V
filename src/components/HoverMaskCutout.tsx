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

export function HoverMaskCutout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headCircleRef = useRef<SVGCircleElement>(null);
  const trailGroupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const headCircle = headCircleRef.current;
    const trailGroup = trailGroupRef.current;
    if (!container || !headCircle || !trailGroup) return;

    const MAX_TRAIL = 24;
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
      running: false,
    };

    const startLoop = () => {
      if (!state.running) {
        state.running = true;
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

    const updatePointer = (clientX: number, clientY: number) => {
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

      if (dist > 10) {
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

      if (state.isHovered || state.headRadius > 0 || state.blobs.length > 0) {
        state.rafId = requestAnimationFrame(tick);
      } else {
        state.running = false;
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
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchMove);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      trailGroup.innerHTML = '';
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden w-[240px] sm:w-[290px] md:w-[350px] lg:w-[400px] xl:w-[430px] max-w-full select-none shrink-0 leading-none flex items-end"
    >
      {/* Base Cutout Portrait */}
      <picture className="w-full h-auto max-h-[50svh] sm:max-h-[54svh] md:max-h-[72svh] lg:max-h-[78svh] block pointer-events-none select-none">
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

      {/* Crazy Hover Mask Reveal in Framer effect on top in blue bg color (#3275b4) that reveals the image on hover */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        aria-hidden="true"
      >
        <defs>
          <filter
            id="framer-liquid-mask-goo"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="100%"
            height="100%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
              result="goo"
            />
          </filter>
          <mask
            id="framer-blue-overlay-mask"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="100%"
            height="100%"
          >
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
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
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="#FFFFFF"
          mask="url(#framer-blue-overlay-mask)"
        />
      </svg>
    </div>
  );
}
