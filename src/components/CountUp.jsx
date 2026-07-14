import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/** Número que cuenta hacia arriba cuando entra en pantalla (una sola vez). */
export default function CountUp({ to, decimals = 0, prefix = '', suffix = '', className = '', style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(() => format(0, decimals, prefix, suffix));

  useEffect(() => {
    if (!inView) return;
    const dur = reduced ? 300 : 1600;
    const t0 = performance.now();
    let raf;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(format(to * eased, decimals, prefix, suffix));
      if (p < 1) raf = requestAnimationFrame(step);
      else setDisplay(format(to, decimals, prefix, suffix));
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, decimals, prefix, suffix, reduced]);

  return (
    <motion.div ref={ref} className={className} style={style}>
      {display}
    </motion.div>
  );
}

function format(v, decimals, prefix, suffix) {
  let s = decimals ? v.toFixed(decimals) : Math.round(v).toString();
  if (!decimals && Math.abs(v) >= 1000) s = Math.round(v).toLocaleString('es-ES');
  return prefix + s + suffix;
}
