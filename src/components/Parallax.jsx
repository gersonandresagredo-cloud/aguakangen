import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useIsMobile } from '../lib/hooks';

/** Envuelve un elemento y lo desplaza verticalmente a otra velocidad que el scroll. */
export default function Parallax({ speed = 0.2, range = 260, className = '', style = {}, children }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * range, speed * -range]);

  if (reduced || isMobile) {
    return <div className={className} style={style}>{children}</div>;
  }
  return (
    <motion.div ref={ref} style={{ ...style, y }} className={className}>
      {children}
    </motion.div>
  );
}
