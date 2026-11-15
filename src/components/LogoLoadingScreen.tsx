import React, { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface LogoLoadingScreenProps {
  mode?: 'intro' | 'indeterminate';
  fontsReady?: boolean;
  targetLogoRef?: React.RefObject<SVGSVGElement | null>;
  onLandingStart?: () => void;
  onComplete?: () => void;
}

const EASE_FILL = [0.42, 0, 0.2, 1] as const;
const EASE_SPATIAL = [0.16, 1, 0.3, 1] as const;

const WAVE_PRIMARY =
  'M 0 0 Q 390.5 -120, 781 0 T 1562 0 Q 1952.5 -120, 2343 0 T 3124 0 L 3124 2050 L 0 2050 Z';
const WAVE_SECONDARY =
  'M 0 0 Q 390.5 130, 781 0 T 1562 0 Q 1952.5 130, 2343 0 T 3124 0 L 3124 2050 L 0 2050 Z';

const LogoPaths: React.FC = () => (
  <>
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
  </>
);

const LogoSvg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 1562 1627"
    fill="none"
    stroke="currentColor"
    className={className}
    aria-hidden="true"
  >
    <LogoPaths />
  </svg>
);

const LiquidFillLogoSvg: React.FC<{
  mode: 'intro' | 'indeterminate';
  isLanding?: boolean;
  onFillComplete?: () => void;
}> = ({ mode, isLanding = false, onFillComplete }) => {
  const rawId = useId().replace(/:/g, '');
  const maskId = `liquid-logo-mask-${rawId}`;
  const isLoop = mode === 'indeterminate';

  return (
    <svg
      viewBox="0 0 1562 1627"
      fill="none"
      stroke="currentColor"
      className="w-full h-full text-[#1D1D1F]"
      aria-hidden="true"
    >
      {!isLanding && (
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1562" height="1627">
            <motion.g
              initial={{ y: 1710 }}
              animate={isLoop ? { y: [1710, -115, -115, 1710] } : { y: -115 }}
              transition={
                isLoop
                  ? {
                      duration: 1.7,
                      times: [0, 0.55, 0.78, 1],
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : {
                      duration: 1.05,
                      delay: 0.12,
                      ease: EASE_FILL,
                    }
              }
              onAnimationComplete={() => {
                if (!isLoop) onFillComplete?.();
              }}
            >
              <motion.path
                d={WAVE_SECONDARY}
                fill="rgba(255,255,255,0.45)"
                stroke="none"
                initial={{ x: -1562 }}
                animate={{ x: 0 }}
                transition={{ duration: 1.3, repeat: Infinity, ease: 'linear' }}
              />
              <motion.path
                d={WAVE_PRIMARY}
                fill="#ffffff"
                stroke="none"
                initial={{ x: 0 }}
                animate={{ x: -1562 }}
                transition={{ duration: 0.95, repeat: Infinity, ease: 'linear' }}
              />
            </motion.g>
          </mask>
        </defs>
      )}
      <g mask={isLanding ? undefined : `url(#${maskId})`}>
        <LogoPaths />
      </g>
    </svg>
  );
};

export const LogoLoadingScreen: React.FC<LogoLoadingScreenProps> = ({
  mode = 'intro',
  fontsReady = true,
  targetLogoRef,
  onLandingStart,
  onComplete,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const loaderLogoRef = useRef<HTMLDivElement>(null);

  const [fillDone, setFillDone] = useState(false);
  const [phase, setPhase] = useState<'filling' | 'landing'>('filling');
  const [flightTarget, setFlightTarget] = useState<{
    x: number;
    y: number;
    scale: number;
    hasTarget: boolean;
  }>({ x: 0, y: 0, scale: 1, hasTarget: false });

  // Reduced-motion fast exit
  useEffect(() => {
    if (mode !== 'intro' || !shouldReduceMotion) return;
    const id = window.setTimeout(() => {
      onLandingStart?.();
      onComplete?.();
    }, 90);
    return () => window.clearTimeout(id);
  }, [mode, shouldReduceMotion, onLandingStart, onComplete]);

  // Pre-measure flight target during fill phase so landing starts with zero layout reflow
  useEffect(() => {
    if (mode !== 'intro' || shouldReduceMotion) return;
    let rafId = 0;

    const measure = () => {
      const targetEl = targetLogoRef?.current;
      const sourceEl = loaderLogoRef.current;
      if (targetEl && sourceEl) {
        const targetRect = targetEl.getBoundingClientRect();
        const sourceRect = sourceEl.getBoundingClientRect();
        if (targetRect.width > 0 && sourceRect.height > 0) {
          const targetCenterX = targetRect.left + targetRect.width / 2;
          const targetCenterY = targetRect.top + targetRect.height / 2;
          const sourceCenterX = sourceRect.left + sourceRect.width / 2;
          const sourceCenterY = sourceRect.top + sourceRect.height / 2;

          setFlightTarget({
            x: targetCenterX - sourceCenterX,
            y: targetCenterY - sourceCenterY,
            scale: targetRect.height / sourceRect.height,
            hasTarget: true,
          });
        }
      }
    };

    rafId = requestAnimationFrame(measure);
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measure);
    };
  }, [mode, shouldReduceMotion, targetLogoRef]);

  // Transition from filling -> brief settle -> spatial zoom-out into the top navbar logo
  useEffect(() => {
    if (mode !== 'intro' || shouldReduceMotion || !fillDone || !fontsReady || phase === 'landing') {
      return;
    }

    const timer = window.setTimeout(() => {
      setPhase('landing');
      onLandingStart?.();
    }, 140);

    return () => window.clearTimeout(timer);
  }, [mode, shouldReduceMotion, fillDone, fontsReady, phase, onLandingStart]);

  if (mode === 'indeterminate') {
    return (
      <div
        role="status"
        aria-label="Loading"
        className="fixed inset-0 z-[200] flex items-center justify-center bg-[#F6F6F7] select-none"
      >
        <div className="relative h-24 sm:h-28 aspect-[1562/1627]">
          <LogoSvg className="w-full h-full text-black/[0.12]" />
          <div className="absolute inset-0">
            {shouldReduceMotion ? (
              <LogoSvg className="w-full h-full text-[#1D1D1F]" />
            ) : (
              <LiquidFillLogoSvg mode="indeterminate" />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label="Loading portfolio"
      className={`fixed inset-0 z-[200] flex items-center justify-center select-none ${
        phase === 'landing' ? 'pointer-events-none' : ''
      }`}
    >
      {/* Solid canvas backdrop that fades out smoothly during spatial zoom-out */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'landing' ? 0 : 1 }}
        transition={{ duration: 0.52, ease: EASE_SPATIAL }}
        className="absolute inset-0 bg-[#F6F6F7] will-change-opacity"
      />

      {/* Centered logo that fills with liquid black wave, then spatially zooms out to the top navbar logo */}
      <motion.div
        ref={loaderLogoRef}
        initial={shouldReduceMotion ? false : { scale: 1.03, opacity: 0.94, x: 0, y: 0 }}
        animate={
          phase === 'landing'
            ? flightTarget.hasTarget
              ? {
                  x: flightTarget.x,
                  y: flightTarget.y,
                  scale: flightTarget.scale,
                  opacity: 1,
                }
              : {
                  scale: 0.35,
                  opacity: 0,
                }
            : {
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
              }
        }
        transition={
          phase === 'landing'
            ? { duration: 0.65, ease: EASE_SPATIAL }
            : { duration: 0.32, ease: EASE_SPATIAL }
        }
        onAnimationComplete={() => {
          if (phase === 'landing') {
            onComplete?.();
          }
        }}
        className="relative z-10 h-24 sm:h-28 aspect-[1562/1627] will-change-transform origin-center"
      >
        {/* Base unfilled logo outline (fades away once filled so flight is pure black logo) */}
        <motion.div
          animate={{ opacity: phase === 'landing' ? 0 : 1 }}
          transition={{ duration: 0.14 }}
          className="w-full h-full"
        >
          <LogoSvg className="w-full h-full text-black/[0.12]" />
        </motion.div>

        {/* Logo filling from bottom to top with rolling liquid wave */}
        <div className="absolute inset-0">
          {shouldReduceMotion ? (
            <LogoSvg className="w-full h-full text-[#1D1D1F]" />
          ) : (
            <LiquidFillLogoSvg
              mode="intro"
              isLanding={phase === 'landing'}
              onFillComplete={() => setFillDone(true)}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};
