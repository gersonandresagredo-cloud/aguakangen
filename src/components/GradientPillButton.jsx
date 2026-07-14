import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Botón "gota líquida": borde en degradado turquesa->índigo, interior oscuro,
 * con ripple de agua al hacer clic. Base reutilizada por los CTA del funnel.
 */
export default function GradientPillButton({
  onClick,
  cursorLabel = 'Reservar',
  className = '',
  innerClassName = 'bg-[#0B171C]',
  glow = '0 10px 34px -8px rgba(28,169,201,.45)',
  glowHover = '0 16px 44px -6px rgba(28,169,201,.6)',
  children,
}) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const d = Math.max(r.width, r.height) * 1.2;
    const id = Date.now() + Math.random();
    setRipples((rs) => [...rs, { id, x: e.clientX - r.left - d / 2, y: e.clientY - r.top - d / 2, d }]);
    setTimeout(() => setRipples((rs) => rs.filter((r2) => r2.id !== id)), 720);
    onClick && onClick(e);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      data-cursor="hover"
      data-cursor-label={cursorLabel}
      whileHover={{ y: -3, boxShadow: glowHover }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden border-0 p-[1.5px] rounded-full cursor-pointer bg-[linear-gradient(115deg,rgba(28,169,201,.9),rgba(14,122,147,.4)_45%,rgba(99,102,241,.8))] ${className}`}
      style={{ boxShadow: glow }}
    >
      <span className={`relative flex items-center rounded-full ${innerClassName}`}>
        {children}
      </span>
      <AnimatePresence>
        {ripples.map((r) => (
          <span
            key={r.id}
            style={{
              position: 'absolute', left: r.x, top: r.y, width: r.d, height: r.d,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(127,224,240,.5), rgba(127,224,240,0) 70%)',
              pointerEvents: 'none',
              animation: 'rippleFx .7s cubic-bezier(.16,1,.3,1) both',
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}
