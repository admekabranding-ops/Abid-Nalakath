import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { MotionValue } from 'framer-motion';

interface ScrollVideoHeroCanvasProps {
  scrollYProgress: MotionValue<number>;
  className?: string;
  isMobileEditor?: boolean;
}

const TOTAL_ANIM_FRAMES = 66; // Frames 0 to 65 inclusive
const SCRUB_START_PROGRESS = 0.18; // 0% - 20%: Frame 0 looking upward; head begins lowering at ~18%
const SCRUB_END_PROGRESS = 0.75; // 75% - 100%: Reaches Frame 65 and locks permanently in lowered pose

const getFramePath = (index: number): string => {
  const clamped = Math.max(0, Math.min(65, index));
  const padded = String(clamped).padStart(3, '0');
  return `/Videos/ABID-frames/frame-${padded}.webp`;
};

export const ScrollVideoHeroCanvas: React.FC<ScrollVideoHeroCanvasProps> = ({
  scrollYProgress,
  className = '',
  isMobileEditor = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_ANIM_FRAMES).fill(null));
  const loadedIndicesRef = useRef<Set<number>>(new Set());
  
  const targetFrameRef = useRef<number>(0);
  const currentRenderedFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);
  const isComponentMountedRef = useRef<boolean>(true);

  const [initialFrameReady, setInitialFrameReady] = useState<boolean>(false);

  // Responsive Cover Drawing Function
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find requested frame or fallback to closest loaded frame
    let imgToDraw = imagesRef.current[frameIndex];
    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
      // Find closest loaded frame
      const loaded = Array.from(loadedIndicesRef.current).sort((a, b) => Math.abs(a - frameIndex) - Math.abs(b - frameIndex));
      if (loaded.length > 0 && loaded[0] !== undefined) {
        imgToDraw = imagesRef.current[loaded[0]];
      }
    }

    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
      return;
    }

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    if (canvasWidth === 0 || canvasHeight === 0) return;

    const imgWidth = imgToDraw.naturalWidth;
    const imgHeight = imgToDraw.naturalHeight;
    const canvasAspect = canvasWidth / canvasHeight;
    const imgAspect = imgWidth / imgHeight;

    // Responsive focal positioning
    // Desktop >= 1024px: 53% X, 35% Y (balanced with 3-column composition)
    // Mobile < 1024px: 46% X, 22% Y (centers face horizontally, unobstructed)
    const isMobile = isMobileEditor || window.innerWidth < 1024;
    const focusX = isMobile ? 0.46 : 0.53;
    const focusY = isMobile ? 0.22 : 0.35;

    let renderWidth = canvasWidth;
    let renderHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasAspect > imgAspect) {
      renderHeight = canvasWidth / imgAspect;
      offsetY = (canvasHeight - renderHeight) * focusY;
    } else {
      renderWidth = canvasHeight * imgAspect;
      offsetX = (canvasWidth - renderWidth) * focusX;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(imgToDraw, offsetX, offsetY, renderWidth, renderHeight);
    currentRenderedFrameRef.current = frameIndex;
  }, [isMobileEditor]);

  // Canvas Resize Handler (Retina / High-DPI support)
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const newWidth = Math.max(1, Math.floor(rect.width * dpr));
    const newHeight = Math.max(1, Math.floor(rect.height * dpr));

    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      canvas.width = newWidth;
      canvas.height = newHeight;
      currentRenderedFrameRef.current = -1; // Force redraw on resize
    }
  }, []);

  // Frame animation trigger
  const requestFrameRender = useCallback(() => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      if (!isComponentMountedRef.current) return;
      if (targetFrameRef.current !== currentRenderedFrameRef.current) {
        renderFrame(targetFrameRef.current);
      }
    });
  }, [renderFrame]);

  // 1. Preload Frame 0 immediately for instant paint
  useEffect(() => {
    isComponentMountedRef.current = true;
    resizeCanvas();

    const img0 = new Image();
    img0.src = getFramePath(0);
    img0.onload = () => {
      if (!isComponentMountedRef.current) return;
      imagesRef.current[0] = img0;
      loadedIndicesRef.current.add(0);
      setInitialFrameReady(true);
      resizeCanvas();
      renderFrame(0);
    };

    // 2. Progressive background preload of remaining frames (1 to 65)
    // Loads in priority chunks for optimal mobile battery & network throughput
    let idleId: number | null = null;
    const preloadRemaining = () => {
      for (let i = 1; i < TOTAL_ANIM_FRAMES; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        const idx = i;
        img.onload = () => {
          if (!isComponentMountedRef.current) return;
          imagesRef.current[idx] = img;
          loadedIndicesRef.current.add(idx);
          if (targetFrameRef.current === idx) {
            requestFrameRender();
          }
        };
      }
    };

    if ('requestIdleCallback' in window) {
      idleId = (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(preloadRemaining);
    } else {
      setTimeout(preloadRemaining, 100);
    }

    return () => {
      isComponentMountedRef.current = false;
      if (idleId !== null && 'cancelIdleCallback' in window) {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [renderFrame, resizeCanvas, requestFrameRender]);

  // Window Resize Listener
  useEffect(() => {
    const handleResize = () => {
      resizeCanvas();
      renderFrame(targetFrameRef.current);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvas, renderFrame]);

  // 3. Scroll Progress Binding
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Respect accessibility preferences: hold static starting frame
      targetFrameRef.current = 0;
      renderFrame(0);
      return;
    }

    const unsubscribe = scrollYProgress.on('change', (latest: number) => {
      // Calculate active frame strictly between 0 and 65:
      // 0.0 to SCRUB_START_PROGRESS (0% - 20%) -> Frame 0 (head upward pose)
      // SCRUB_START_PROGRESS to SCRUB_END_PROGRESS (20% - 75%) -> Progressive head lowering (Frames 0 to 65)
      // >= SCRUB_END_PROGRESS (75% - 100%) -> Strictly locked at Frame 65 (lowered pose)
      let calculatedFrame = 0;
      if (latest <= SCRUB_START_PROGRESS) {
        calculatedFrame = 0;
      } else if (latest >= SCRUB_END_PROGRESS) {
        calculatedFrame = 65;
      } else {
        const animProgress = (latest - SCRUB_START_PROGRESS) / (SCRUB_END_PROGRESS - SCRUB_START_PROGRESS);
        calculatedFrame = Math.min(65, Math.floor(animProgress * 65.999));
      }

      if (calculatedFrame !== targetFrameRef.current) {
        targetFrameRef.current = calculatedFrame;
        requestFrameRender();
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, renderFrame, requestFrameRender]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Hardware-Accelerated 2D Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full block transition-opacity duration-300 ${
          initialFrameReady ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Abid Nalakath — Cinematic Scroll-Controlled Portrait Animation"
        role="img"
      />

      {/* Immediate Fallback Poster for SSR / slow connections */}
      {!initialFrameReady && (
        <img
          src="/Videos/ABID-frames/frame-000.webp"
          alt="Abid Nalakath — Creative Designer"
          className="absolute inset-0 w-full h-full object-cover object-[53%_35%] pointer-events-none"
          loading="eager"
          fetchPriority="high"
        />
      )}
    </div>
  );
};
