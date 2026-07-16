import { motion } from 'framer-motion';
import { wordReveal, wordRevealMobile, stagger, viewportOnce } from '../lib/variants';
import { useIsMobile } from '../lib/hooks';

/**
 * Titular que revela palabra por palabra (cada palabra sube + desenfoque en
 * escritorio; en móvil sin blur y más rápido, para que se sienta ágil).
 * `words`: array de { text, style? } — style opcional para acentos en degradado.
 * `trigger`: 'inView' (por defecto) o 'mount' — usa 'mount' para titulares que
 *   están por encima del pliegue (si no, el margen de whileInView no llega a
 *   dispararse y el texto se queda congelado y borroso).
 */
export default function RevealWords({ as: Tag = 'h1', words, className = '', style = {}, trigger = 'inView' }) {
  const MotionTag = motion[Tag] || motion.h1;
  const isMobile = useIsMobile();
  const wordVariant = isMobile ? wordRevealMobile : wordReveal;
  const activate = trigger === 'mount'
    ? { initial: 'hidden', animate: 'show' }
    : { initial: 'hidden', whileInView: 'show', viewport: viewportOnce };
  return (
    <MotionTag
      className={className}
      style={style}
      variants={stagger(isMobile ? 0.05 : 0.08)}
      {...activate}
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
