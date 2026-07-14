import { motion } from 'framer-motion';
import { wordReveal, stagger, viewportOnce } from '../lib/variants';

/**
 * Titular que revela palabra por palabra (cada palabra sube + desenfoque).
 * `words`: array de { text, style? } — style opcional para acentos en degradado.
 */
export default function RevealWords({ as: Tag = 'h1', words, className = '', style = {} }) {
  const MotionTag = motion[Tag] || motion.h1;
  return (
    <MotionTag
      className={className}
      style={style}
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {words.map((w, i) => (
        <span key={i}>
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
            <motion.span
              variants={wordReveal}
              style={{ display: 'inline-block', ...(w.style || {}) }}
            >
              {w.text}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </MotionTag>
  );
}
