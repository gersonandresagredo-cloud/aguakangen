import { motion, useScroll } from 'framer-motion';

/** Línea fina turquesa arriba de todo que marca el progreso de lectura. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
      className="fixed top-0 left-0 h-[2px] w-full z-[2000] bg-gradient-to-r from-aqua to-aqua-glow shadow-[0_0_10px_rgba(127,224,240,0.5)]"
    />
  );
}
