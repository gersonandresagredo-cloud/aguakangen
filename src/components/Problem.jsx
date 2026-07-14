import { motion } from 'framer-motion';
import Reveal from './Reveal';
import Halo from './Halo';
import { useIsMobile } from '../lib/hooks';

const ROWS = [
  { n: '01', title: 'Grifo y embotellada', text: 'Oxidante (ORP positivo). Cada sorbo suma estrés a tus células.' },
  { n: '02', title: 'Deshidratación silenciosa', text: 'Bebes… pero no hidratas. Tu cuerpo absorbe a medias.' },
  { n: '03', title: 'Plástico y coste invisible', text: 'Cientos de botellas al año. Dinero tirado y microplásticos de regalo.' },
];

function Row({ n, title, text, delay, last }) {
  const isMobile = useIsMobile();
  return (
    <Reveal
      delay={delay}
      data-cursor="hover"
      className={`grid gap-4 sm:gap-8 lg:gap-12 items-baseline py-6 sm:py-9 lg:py-10 border-t border-black/10 ${last ? 'border-b' : ''}`}
      style={{ gridTemplateColumns: isMobile ? '34px 1fr' : '64px 0.95fr 1.05fr' }}
      whileHover={{ paddingLeft: 14 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="font-mono text-[13px] text-aqua">{n}</span>
      <h3 className="text-[clamp(20px,2.6vw,30px)] tracking-[-0.025em] text-ink">{title}</h3>
      <p className="text-[15px] leading-[1.55] text-ink-soft max-w-[380px]">{text}</p>
    </Reveal>
  );
}

export default function Problem() {
  return (
    <section id="problema" className="relative bg-bg-light px-5 sm:px-10 lg:px-20 py-[clamp(80px,10vw,150px)] overflow-hidden">
      <Halo
        speed={0.16}
        pulse={false}
        className="top-[8%] right-[4%] w-[min(420px,50vw)] h-[min(560px,66vw)]"
        gradient="radial-gradient(ellipse 50% 60% at 50% 40%, rgba(28,169,201,.1), transparent 70%)"
        blur="6px"
        borderRadius="50%"
      />
      <div className="relative max-w-[1120px] mx-auto">
        <Reveal as="span" className="block text-[11px] font-semibold tracking-[.24em] uppercase text-aqua-deep">
          Lo que no ves en tu vaso
        </Reveal>
        <Reveal delay={80} as="h2" className="mt-[18px] max-w-[900px] text-[clamp(30px,5vw,60px)] leading-[1.02] text-ink">
          El <span className="text-aqua">90%</span> de lo que bebes trabaja en tu contra.
        </Reveal>

        <div className="mt-[clamp(44px,6vw,80px)] flex flex-col">
          {ROWS.map((r, i) => (
            <Row key={r.n} {...r} delay={i * 100} last={i === ROWS.length - 1} />
          ))}
        </div>

        <Reveal
          as="p"
          className="mt-[clamp(44px,6vw,70px)] max-w-[820px] font-display font-medium text-ink"
          style={{ fontSize: 'clamp(22px,3vw,34px)', lineHeight: 1.2, letterSpacing: '-0.03em' }}
        >
          No es una cuestión de sed. Es una cuestión de <span className="text-aqua">cómo quieres envejecer.</span>
        </Reveal>
      </div>
    </section>
  );
}
