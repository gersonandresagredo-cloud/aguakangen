import { motion } from 'framer-motion';
import { wordReveal, wordRevealMobile, stagger, viewportOnce } from '../lib/variants';
import { useIsMobile } from '../lib/hooks';

/**
 * Titular que revela palabra por palabra (cada palabra sube + desenfoque en
 * escritorio; en móvil sin blur y más rápido, para que se sienta ágil).
 * `words`: array de { text, style? } — style opcional para acentos en degradado.
 */
export default function RevealWords({ as: Tag = 'h1', words, className = '', style = {} }) {
  const MotionTag = motion[Tag] || motion.h1;
  const isMobile = useIsMobile();
  const wordVariant = isMobile ? wordRevealMobile : wordReveal;
  return (
    <MotionTag
      className={className}
      style={style}
      variants={stagger(isMobile ? 0.05 : 0.08)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {words.map((w, i) => (
        <span key={i}>
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
            <motion.span
              variants={wordVariant}
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
