import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useAnimationFrame, useReducedMotion } from 'framer-motion';
import { Waves, ShieldCheck, Leaf, Layers, Home } from 'lucide-react';

const ITEMS = [
  { icon: Waves, title: 'Hidrata de verdad', sub: 'tu cuerpo la absorbe mejor' },
  { icon: ShieldCheck, title: 'Antioxidante', sub: 'frena la oxidación diaria' },
  { icon: Leaf, title: 'Cero botellas', sub: 'ahorro todos los meses' },
  { icon: Layers, title: '5 tipos de agua', sub: 'beber, cocinar, limpiar, piel' },
  { icon: Home, title: 'En tu cocina', sub: 'instalada y lista en minutos' },
];
const LOOP = [...ITEMS, ...ITEMS]; // duplicado para el bucle infinito

function Card({ icon: Icon, title, sub }) {
  return (
    <div className="inline-flex items-center gap-3.5 pl-4 pr-[22px] py-4 rounded-[18px] bg-white/66 backdrop-blur-md border border-black/6 shadow-[0_8px_30px_rgba(10,20,24,0.05)]">
      <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-[linear-gradient(140deg,rgba(28,169,201,.14),rgba(99,102,241,.1))]">
        <Icon className="w-[19px] h-[19px] text-aqua-deep" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[14.5px] font-semibold text-ink tracking-[-0.01em]">{title}</span>
        <span className="text-[12.5px] text-ink-soft">{sub}</span>
      </span>
    </div>
  );
}

export default function Marquee() {
  const trackRef = useRef(null);
  const halfW = useRef(0);
  const x = useMotionValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const measure = () => { if (trackRef.current) halfW.current = trackRef.current.scrollWidth / 2; };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useAnimationFrame((time) => {
    if (reduced || !halfW.current) return;
    const drift = (time / 1000) * 26;
    const sy = window.scrollY;
    let pos = (sy * 0.55 + drift) % halfW.current;
    x.set(-pos);
  });

  return (
    <div className="relative bg-bg-light py-9 sm:py-14 overflow-hidden whitespace-nowrap">
      <motion.div ref={trackRef} style={{ x }} className="inline-flex items-stretch gap-3.5 will-change-transform pl-3.5">
        {LOOP.map((item, i) => (
          <Card key={i} {...item} />
        ))}
      </motion.div>
      <div className="absolute inset-y-0 left-0 w-[clamp(60px,10vw,160px)] bg-gradient-to-r from-bg-light to-transparent pointer-events-none z-2" />
      <div className="absolute inset-y-0 right-0 w-[clamp(60px,10vw,160px)] bg-gradient-to-l from-bg-light to-transparent pointer-events-none z-2" />
    </div>
  );
}
