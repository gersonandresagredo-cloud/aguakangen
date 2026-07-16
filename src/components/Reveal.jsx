import { motion } from 'framer-motion';
import { fadeUp, fadeUpMobile, viewportOnce } from '../lib/variants';
import { useIsMobile } from '../lib/hooks';

/** Envuelve cualquier bloque y lo hace aparecer suave al entrar en pantalla. */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const MotionTag = motion[Tag] || motion.div;
  const isMobile = useIsMobile();
  const base = isMobile ? fadeUpMobile : fadeUp;
  return (
    <MotionTag
      className={className}
      variants={base}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ ...base.show.transition, delay: (delay * (isMobile ? 0.6 : 1)) / 1000 }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
