import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useAnimation, useInView, useReducedMotion } from 'motion/react';

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

export const ContactCard3D: React.FC = React.memo(() => {
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(cardRef, { amount: 0.25 });

  const [isPaused, setIsPaused] = useState(false);
  const isSpinningRef = useRef(false);
  const hasSpunOnceRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const triggerTurnWithBounce = useCallback(async () => {
    if (shouldReduceMotion || isSpinningRef.current) return;

    isSpinningRef.current = true;
    try {
      await controls.start({
        rotateY: [0, 384, 349, 366, 357, 360],
        rotateX: [0, 5, -3, 1.5, -0.5, 0],
        y: [0, -20, 4, -7, 1.5, 0],
        scale: [1, 1.035, 0.985, 1.015, 0.998, 1],
        transition: {
          duration: 1.45,
          times: [0, 0.54, 0.72, 0.85, 0.93, 1],
          ease: 'easeInOut',
        },
      });
      if (isMountedRef.current) {
        controls.set({ rotateY: 0, rotateX: 0, y: 0, scale: 1 });
      }
    } finally {
      isSpinningRef.current = false;
    }
  }, [controls, shouldReduceMotion]);

  useEffect(() => {
    if (!isInView || isPaused || shouldReduceMotion) return;

    let cancelled = false;
    let timerId: number | undefined;

    const scheduleLoop = async () => {
      if (cancelled) return;
      if (isSpinningRef.current) {
        timerId = window.setTimeout(scheduleLoop, 1500);
        return;
      }

      await triggerTurnWithBounce();

      if (!cancelled) {
        timerId = window.setTimeout(scheduleLoop, 5800);
      }
    };

    const initialDelay = hasSpunOnceRef.current ? 4200 : 1000;
    hasSpunOnceRef.current = true;
    timerId = window.setTimeout(scheduleLoop, initialDelay);

    return () => {
      cancelled = true;
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }
    };
  }, [isInView, isPaused, shouldReduceMotion, triggerTurnWithBounce]);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('a, button')) return;
    if (window.getSelection()?.toString()) return;
    void triggerTurnWithBounce();
  };

  return (
    <motion.div
      ref={cardRef}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: 0.08, ease: EASE_EDITORIAL }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsPaused(false);
        }
      }}
      className="w-full max-w-[540px] lg:max-w-[480px] xl:max-w-[520px] shrink-0 [perspective:1200px]"
    >
      <motion.div
        animate={controls}
        onClick={handleCardClick}
        className="relative w-full [transform-style:preserve-3d] will-change-transform cursor-pointer"
      >
        {/* FRONT FACE: Contact Card */}
        <div className="relative p-7 sm:p-9 lg:p-9 xl:p-10 bg-white border border-black/[0.09] rounded-[10px] text-black shadow-none [backface-visibility:hidden] [transform:translateZ(1px)]">
          <span className="font-caps text-[11px] sm:text-[12px] tracking-[0.14em] text-[#86868B] block mb-3 font-bold">
            Get in Touch
          </span>

          <p className="text-[14px] sm:text-[15px] leading-[1.7] text-[#515154] font-normal mb-6">
            Whether you're exploring a new product, improving an existing one, or just want to talk about design, feel free to reach out.
          </p>

          <div className="mb-6 max-w-full">
            <a
              href="mailto:itskeerthanaravichandran@gmail.com"
              className="inline-flex items-center gap-1.5 sm:gap-2 text-[14.5px] sm:text-base lg:text-[16.5px] xl:text-lg font-sans text-[#1D1D1F] hover:text-black transition-colors font-semibold tracking-tight max-w-full break-all py-1 group"
            >
              <span className="break-all group-hover:underline underline-offset-4 decoration-black/40">itskeerthanaravichandran@gmail.com</span>
              <ArrowUpRight size={18} className="shrink-0 inline-block align-middle select-none stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
          </div>

          {/* SOCIAL LINKS CONNECTED GRID BAR */}
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

        {/* BACK FACE: Logo only, visible mid-360° spin */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[10px] bg-[#1D1D1F] border border-black/[0.14] text-white flex items-center justify-center p-8 select-none pointer-events-none [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(1px)]"
        >
          <svg
            viewBox="0 0 1562 1627"
            fill="none"
            stroke="currentColor"
            className="h-14 sm:h-16 w-auto text-white shrink-0"
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
        </div>
      </motion.div>
    </motion.div>
  );
});
