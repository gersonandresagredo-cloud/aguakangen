import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../lib/variants';

/** Envuelve cualquier bloque y lo hace aparecer suave al entrar en pantalla. */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const MotionTag = motion[Tag] || motion.div;
  return (
    <MotionTag
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ ...fadeUp.show.transition, delay: delay / 1000 }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
