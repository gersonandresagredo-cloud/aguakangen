import Reveal from './Reveal';
import RevealWords from './RevealWords';
import Halo from './Halo';
import BubbleField from './BubbleField';
import Parallax from './Parallax';
import { useIsMobile } from '../lib/hooks';

const STEPS = [
  { n: '01', title: 'Se conecta a tu cocina', text: 'Sin obras y en minutos. Ocupa lo que una cafetera.' },
  { n: '02', title: 'Transforma el agua al instante', text: 'Tecnología japonesa que la filtra y la ioniza al momento, recién hecha en cada vaso.' },
  { n: '03', title: 'Un agua para cada momento', text: 'Para beber, cocinar, limpiar o cuidar la piel. Toda la casa, con un solo equipo.' },
];

export default function Solution() {
  const isMobile = useIsMobile();
  return (
    <section id="solucion" className="relative bg-dark text-white px-6 sm:px-10 lg:px-20 py-[clamp(80px,10vw,150px)] overflow-hidden rounded-[28px] sm:rounded-[60px]">
      <Halo
        speed={0.2}
        pulse={false}
        className="top-[20%] left-1/2 w-[min(900px,120vw)] h-[min(600px,70vw)] -translate-x-1/2"
      />
      <BubbleField />
      <div className="relative max-w-[1120px] mx-auto text-center z-2">
        <Reveal as="span" className="block text-[11px] font-semibold tracking-[.24em] uppercase text-aqua-glow">
          Así de fácil
        </Reveal>
        <RevealWords
          as="h2"
          className="mt-[18px] font-medium leading-none"
          style={{ fontSize: 'clamp(32px,5.5vw,66px)' }}
          words={[
            { text: 'De' }, { text: 'tu' }, { text: 'grifo,' },
            { text: 'agua', style: { color: '#7FE0F0' } },
            { text: 'extraordinaria.', style: { color: '#7FE0F0' } },
          ]}
        />

        <div
          className="mt-[clamp(48px,7vw,80px)] grid gap-[clamp(30px,4vw,56px)] items-center text-left"
          style={{ gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}
        >
          <div className="flex flex-col gap-4">
            {STEPS.map((s, i) => (
              <Reveal
                key={s.n}
                delay={i * 120}
                className="relative flex gap-[18px] px-[26px] py-6 rounded-[22px] bg-white/5 border border-white/12 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,.15)]"
              >
                <span className="font-mono text-[13px] text-aqua-glow pt-[3px]">{s.n}</span>
                <div>
                  <div className="font-display font-semibold text-white" style={{ fontSize: 'clamp(18px,2.2vw,22px)', letterSpacing: '-0.02em' }}>{s.title}</div>
                  <p className="mt-[7px] text-[14.5px] leading-[1.55] text-white/66">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Parallax speed={0.15} className="flex justify-center">
            <Reveal className="relative w-[min(480px,86vw)]" style={{ animation: 'floatY 8s ease-in-out infinite' }}>
              <div className="absolute" style={{ inset: '-10% -16%', background: 'radial-gradient(circle, rgba(127,224,240,.3), transparent 64%)', filter: 'blur(28px)' }} />
              <img
                src="/assets/k8.png"
                alt="Ionizador Enagic Leveluk K8"
                data-cursor="hover"
                data-cursor-label="K8"
                className="relative w-full h-auto"
                style={{ filter: 'drop-shadow(0 30px 70px rgba(0,0,0,.5)) drop-shadow(0 0 50px rgba(28,169,201,.22))' }}
              />
            </Reveal>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
