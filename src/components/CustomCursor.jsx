import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useIsTouch } from '../lib/hooks';

/**
 * Cursor magnético de dos capas: un punto rápido y un anillo lento que
 * se agranda y se tiñe de turquesa sobre elementos [data-cursor="hover"],
 * mostrando una micro-etiqueta si hay data-cursor-label. Se desactiva en táctil.
 */
export default function CustomCursor() {
  const isTouch = useIsTouch();
  const mx = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const my = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  const dotX = useSpring(mx, { stiffness: 900, damping: 50, mass: 0.4 });
  const dotY = useSpring(my, { stiffness: 900, damping: 50, mass: 0.4 });
  const ringX = useSpring(mx, { stiffness: 220, damping: 30, mass: 0.6 });
  const ringY = useSpring(my, { stiffness: 220, damping: 30, mass: 0.6 });

  const [hoverLabel, setHoverLabel] = useState(null);
  const [hovering, setHovering] = useState(false);
  const bindTimer = useRef(null);

  useEffect(() => {
    if (isTouch) return;
    document.documentElement.classList.add('kangen-no-native-cursor');

    const onMove = (e) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener('mousemove', onMove);

    const onOver = (e) => {
      const t = e.target.closest && e.target.closest('[data-cursor]');
      if (!t) return;
      setHovering(true);
      setHoverLabel(t.getAttribute('data-cursor-label') || null);
    };
    const onOut = (e) => {
      const t = e.target.closest && e.target.closest('[data-cursor]');
      if (!t) return;
      const related = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-cursor]');
      if (related === t) return;
      setHovering(false);
      setHoverLabel(null);
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      document.documentElement.classList.remove('kangen-no-native-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      clearTimeout(bindTimer.current);
    };
  }, [isTouch, mx, my]);

  if (isTouch) return null;

  const ringSize = hoverLabel ? 68 : hovering ? 58 : 40;

  return (
    <>
      <motion.div
        style={{ translateX: dotX, translateY: dotY, x: '-50%', y: '-50%' }}
        className="fixed top-0 left-0 z-[99999] pointer-events-none rounded-full"
      >
        <div className="w-[7px] h-[7px] rounded-full bg-aqua-glow" />
      </motion.div>
      <motion.div
        style={{ translateX: ringX, translateY: ringY, x: '-50%', y: '-50%' }}
        className="fixed top-0 left-0 z-[99999] pointer-events-none rounded-full flex items-center justify-center"
      >
        <motion.div
          animate={{
            width: ringSize,
            height: ringSize,
            backgroundColor: hovering ? 'rgba(127,224,240,0.9)' : 'rgba(127,224,240,0)',
            borderColor: hovering ? 'rgba(127,224,240,0.9)' : 'rgba(28,169,201,0.6)',
          }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-full border-[1.5px] flex items-center justify-center"
          style={{ mixBlendMode: hovering ? 'normal' : 'difference' }}
        >
          {hoverLabel && (
            <span className="text-[10px] font-medium tracking-wide text-dark whitespace-nowrap">
              {hoverLabel}
            </span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
