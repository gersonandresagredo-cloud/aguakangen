import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import Reveal from './Reveal';
import CountUp from './CountUp';
import BubbleField from './BubbleField';

const STATS = [
  { to: 14000, prefix: '+', decimals: 0, label: 'personas ya cambiaron su agua' },
  { to: 97, suffix: '%', decimals: 0, label: 'repetiría la experiencia' },
  { to: 4.9, suffix: '★', decimals: 1, label: 'valoración media' },
];

const TESTIMONIALS = [
  { name: 'Marta G.', city: 'Valencia', text: '«En dos semanas dejamos de comprar botellas. Ahora cocino, hidrato a los peques y me sobra energía por las mañanas. Ya no volvemos atrás.»' },
  { name: 'Javier R.', city: 'Madrid', text: '«Soy deportista y noto la diferencia al hidratarme. El agua entra distinta, más ligera. Raquel me acompañó en todo el proceso sin agobios.»' },
  { name: 'Lucía M.', city: 'Sevilla', text: '«Lo dudé por el precio, pero eché cuentas: llevábamos años gastando en garrafas. Ahora es una sola vez y la usa toda la familia. Decisión redonda.»' },
  { name: 'Nadia B.', city: 'Bilbao', text: '«La demostración fue clave. Ver el agua funcionando en directo me quitó todas las dudas. En 15 minutos lo entendí todo.»' },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="testimonios" className="relative bg-dark text-white px-6 sm:px-10 lg:px-20 py-[clamp(80px,10vw,150px)] overflow-hidden rounded-[28px] sm:rounded-[60px]">
      <BubbleField />
      <div className="relative max-w-[1120px] mx-auto z-2">
        <div className="grid gap-6 text-center" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,220px), 1fr))' }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 120}>
              <CountUp
                to={s.to} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix}
                className="font-display font-semibold text-aqua-glow leading-none"
                style={{ fontSize: 'clamp(38px,5vw,60px)', letterSpacing: '-0.04em' }}
              />
              <p className="mt-2 text-[14.5px] text-white/60">{s.label}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-[clamp(48px,7vw,80px)] overflow-hidden rounded-[26px]">
          <motion.div
            className="flex"
            animate={{ x: `-${index * 100}%` }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="flex-[0_0_100%] p-1">
                <div className="p-[clamp(30px,4vw,52px)] rounded-[24px] bg-white/5 border border-white/12 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,.15)]">
                  <div className="flex gap-[3px] mb-[18px] text-aqua-glow">★★★★★</div>
                  <p className="font-display font-normal text-white" style={{ fontSize: 'clamp(19px,2.6vw,26px)', lineHeight: 1.45, letterSpacing: '-0.02em' }}>
                    {t.text}
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center bg-[linear-gradient(150deg,rgba(28,169,201,.4),rgba(127,224,240,.15))]">
                      <User className="w-5 h-5 text-aqua-glow" />
                    </div>
                    <div>
                      <div className="font-semibold text-[15px]">{t.name}</div>
                      <div className="text-[13px] text-white/50">{t.city}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-[22px] flex justify-center gap-2">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setIndex(i)}
              aria-label={`Ver testimonio de ${t.name}`}
              className="h-[9px] rounded-full border-0 cursor-pointer transition-all duration-400"
              style={{ width: index === i ? 26 : 9, background: index === i ? '#7FE0F0' : 'rgba(255,255,255,.2)' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
