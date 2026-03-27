import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export const useLenis = (wrapperRef?: React.RefObject<HTMLDivElement>) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wrapper: wrapperRef?.current || undefined,
      content: wrapperRef?.current || undefined,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"], button[data-scroll-to]');
      
      if (anchor) {
        const href = anchor.getAttribute('href') || anchor.getAttribute('data-scroll-to');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            lenis.scrollTo(element as HTMLElement, { offset: -80 });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
};
