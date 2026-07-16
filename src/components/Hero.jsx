import { useEffect } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Halo from './Halo';
import BubbleField from './BubbleField';
import Parallax from './Parallax';
import RevealWords from './RevealWords';
import Reveal from './Reveal';
import GradientPillButton from './GradientPillButton';
import { useUI } from '../lib/UIContext';
import { useIsMobile } from '../lib/hooks';

const TITLE_WORDS = [
  { text: 'El' }, { text: 'agua' }, { text: 'que' }, { text: 'bebes' },
  { text: 'te' }, { text: 'está' },
  {
    text: 'envejeciendo.',
    style: {
      background: 'linear-gradient(110deg,#7FE0F0,#1CA9C9 75%)',
      WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
    },
  },
];

/** Máquina con su halo, anillos expansivos y flotación. */
function MachineVisual({ width }) {
  return (
    <div style={{ position: 'relative', width, animation: 'floatY 8s ease-in-out infinite' }}>
      <div
        className="absolute"
        style={{ inset: '-8% -14%', background: 'radial-gradient(circle, rgba(127,224,240,.32), transparent 62%)', filter: 'blur(34px)' }}
      />
      {[0, 1.5, 3].map((delay, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: '50%', left: '50%', width: '105%', aspectRatio: '1', margin: '-52.5% 0 0 -52.5%',
            border: `1px solid rgba(127,224,240,${0.35 - i * 0.1})`,
            animation: `ringExpand 4.5s cubic-bezier(.16,1,.3,1) ${delay}s infinite`,
          }}
        />
      ))}
      <img
        src="/assets/k8.png"
        alt="Leveluk K8 — máquina de agua Kangen"
        className="relative w-full h-auto"
        style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,.55)) drop-shadow(0 0 60px rgba(28,169,201,.25))' }}
      />
    </div>
  );
}

export default function Hero() {
  const { openChat, openVideo } = useUI();
  const stacked = useIsMobile(1024); // móvil + tablet
  const { scrollY } = useScroll();

  const wordY = useTransform(scrollY, [0, 900], [0, 90]);
  const wordOpacity = useTransform(scrollY, [0, 900], [1, 0]);
  const machineY = useTransform(scrollY, [0, 2000], [0, 760]);
  const machineScale = useTransform(scrollY, [0, 1000], [1, 0.82]);

  // La máquina sigue suavemente el ratón (leve inclinación 3D) en escritorio.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 45, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 45, damping: 18 });
  const tiltTranslateX = useTransform(smoothX, [-1, 1], [24, -24]);
  const tiltRotateY = useTransform(smoothX, [-1, 1], [-6, 6]);
  const tiltRotateX = useTransform(smoothY, [-1, 1], [4.5, -4.5]);

  useEffect(() => {
    if (stacked) return;
    const onMove = (e) => {
      pointerX.set((e.clientX / window.innerWidth - 0.5) * 2);
      pointerY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [stacked, pointerX, pointerY]);

  // El badge está por encima del pliegue: se anima al cargar (no con whileInView,
  // que con el margen negativo no llega a dispararse tan arriba).
  const badge = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-2 px-[14px] py-[7px] rounded-full bg-white/6 border border-white/14 backdrop-blur-md text-xs text-aqua-glow mb-5"
    >
      <span className="w-[7px] h-[7px] rounded-full bg-aqua-glow shadow-[0_0_10px_#7FE0F0]" />
      Demos disponibles esta semana
    </motion.div>
  );

  const ctaCard = (alignCenter) => (
    <Reveal
      delay={400}
      className={`max-w-[350px] flex flex-col gap-4 p-[18px] rounded-[22px] border border-white/10 ${alignCenter ? 'items-center text-center' : 'items-start'}`}
      style={{ background: 'rgba(7,16,19,.55)', backdropFilter: 'blur(18px) saturate(1.3)' }}
    >
      <p className="text-sm leading-[1.55] text-white/66">
        Miles de familias ya la beben. Agenda tu presentación en directo y decide.
      </p>
      <div className={`flex flex-wrap items-center gap-3 ${alignCenter ? 'justify-center' : ''}`}>
        <GradientPillButton
          onClick={openChat}
          cursorLabel="Reservar"
          innerClassName="bg-[rgba(7,16,19,.94)]"
          glow="0 0 42px -8px rgba(28,169,201,.6), 0 0 42px -12px rgba(99,102,241,.5)"
          glowHover="0 0 60px -6px rgba(28,169,201,.8), 0 0 60px -8px rgba(99,102,241,.65)"
        >
          <span className="flex items-center gap-[11px] py-[13px] pl-[18px] pr-[15px]">
            <span className="w-[7px] h-[7px] rounded-full bg-aqua-glow shadow-[0_0_12px_#7FE0F0]" style={{ animation: 'haloPulse 2.4s ease-in-out infinite' }} />
            <span className="text-[14.5px] font-semibold text-white tracking-[-0.01em]">Reservar videollamada</span>
            <span className="w-[30px] h-[30px] rounded-full flex items-center justify-center bg-gradient-to-br from-aqua to-indigo-500">
              <ArrowUpRight className="w-[15px] h-[15px] text-white" />
            </span>
          </span>
        </GradientPillButton>

        <button
          type="button"
          onClick={openVideo}
          data-cursor="hover"
          data-cursor-label="Ver"
          className="inline-flex items-center gap-[10px] pl-[12px] pr-[18px] py-[12px] rounded-full border border-white/16 bg-white/5 backdrop-blur-md cursor-pointer text-white text-[13.5px] font-medium transition-colors hover:bg-white/10"
        >
          <span className="w-[30px] h-[30px] rounded-full flex items-center justify-center bg-aqua-glow/14 border border-aqua-glow/35">
            <Play className="w-[13px] h-[13px] text-aqua-glow" />
          </span>
          Ver demostración
        </button>
      </div>
    </Reveal>
  );

  const kangenWord = (styleMotion) => (
    <motion.div
      style={styleMotion}
      className="font-display font-semibold leading-[0.86] tracking-[-0.05em] text-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <span style={{ fontSize: 'clamp(88px,19.5vw,330px)', textShadow: '0 20px 80px rgba(7,16,19,.8)' }}>Kangen</span>
    </motion.div>
  );

  // ---------- TABLET / MÓVIL: apilado, la máquina es protagonista ----------
  if (stacked) {
    return (
      <section
        id="hero"
        className="relative min-h-screen bg-dark text-white flex flex-col items-center overflow-hidden px-6 pt-[72px] pb-0 rounded-b-[28px] sm:rounded-b-[60px]"
      >
        <Halo speed={0.18} className="-top-[6%] -right-[10%] w-[min(620px,90vw)] h-[min(620px,90vw)]" />
        <Halo
          speed={0.4}
          pulse={false}
          className="top-[38%] -left-[20%] w-[min(520px,90vw)] h-[min(520px,90vw)]"
          gradient="radial-gradient(circle, rgba(14,122,147,.4), transparent 62%)"
        />
        <BubbleField />

        <div className="relative z-2 w-full max-w-[520px] flex flex-col items-center text-center">
          {badge}
          <RevealWords
            trigger="mount"
            className="font-display font-medium leading-[1.1] tracking-[-0.025em]"
            style={{ fontSize: 'clamp(30px,7.5vw,44px)' }}
            words={TITLE_WORDS}
          />
          <div className="mt-7 flex justify-center">{ctaCard(true)}</div>
        </div>

        {/* máquina protagonista, en su propio espacio (no la tapa nada) */}
        <div className="relative z-1 mt-2 mb-[-6%] flex justify-center pointer-events-none">
          <MachineVisual width="min(360px, 74vw)" />
        </div>

        {/* palabra gigante como cierre */}
        <div className="relative z-3 w-full text-center pointer-events-none -mb-[0.14em]">
          {kangenWord({})}
        </div>
      </section>
    );
  }

  // ---------- ESCRITORIO: máquina centrada, texto y tarjeta a los lados ----------
  return (
    <section
      id="hero"
      className="relative min-h-screen bg-dark text-white flex items-center overflow-hidden px-6 sm:px-10 lg:px-20 pt-[90px] pb-[90px] rounded-b-[28px] sm:rounded-b-[60px]"
    >
      <Halo speed={0.18} className="-top-[10%] -right-[8%] w-[min(760px,90vw)] h-[min(760px,90vw)]" />
      <Halo
        speed={0.4}
        pulse={false}
        className="-bottom-[20%] -left-[12%] w-[min(560px,80vw)] h-[min(560px,80vw)]"
        gradient="radial-gradient(circle, rgba(14,122,147,.4), transparent 62%)"
      />
      <BubbleField />

      {/* máquina centrada */}
      <div
        className="absolute z-1 pointer-events-none"
        style={{ top: '52%', left: '50%', width: 'min(740px, 94vw)', transform: 'translate(-50%, -50%)', perspective: '1400px' }}
      >
        <motion.div style={{ y: machineY, scale: machineScale, x: tiltTranslateX, rotateX: tiltRotateX, rotateY: tiltRotateY, transformStyle: 'preserve-3d' }}>
          <MachineVisual width="100%" />
        </motion.div>
      </div>

      {/* fila superior: claim corto + CTA */}
      <div className="relative z-2 w-full max-w-[1280px] mx-auto flex flex-wrap justify-between items-start gap-6 self-start">
        <Parallax speed={-0.1} className="max-w-[400px]">
          {badge}
          <RevealWords
            trigger="mount"
            className="font-display font-medium leading-[1.12] tracking-[-0.025em]"
            style={{ fontSize: 'clamp(26px,3vw,40px)' }}
            words={TITLE_WORDS}
          />
        </Parallax>
        <Parallax speed={-0.06}>{ctaCard(false)}</Parallax>
      </div>

      {/* palabra gigante */}
      <div className="absolute -bottom-[0.16em] left-0 right-0 z-3 text-center pointer-events-none">
        {kangenWord({ y: wordY, opacity: wordOpacity })}
      </div>
    </section>
  );
}
