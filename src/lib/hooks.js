import { useEffect, useState } from 'react';

export function useIsMobile(breakpoint = 820) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

export function useIsTouch() {
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  );
  return isTouch;
}
