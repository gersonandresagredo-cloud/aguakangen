import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import RevealWords from './RevealWords';
import Reveal from './Reveal';
import Halo from './Halo';
import BubbleField from './BubbleField';
import GradientPillButton from './GradientPillButton';
import { useUI } from '../lib/UIContext';

export default function FinalCTA() {
  const { openChat } = useUI();
  return (
    <section className="relative bg-dark text-white px-6 sm:px-10 lg:px-20 py-[clamp(90px,12vw,170px)] overflow-hidden text-center rounded-t-[28px] sm:rounded-t-[60px]">
      <Halo className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(900px,120vw)] h-[min(700px,90vw)]" speed={0.1} />
      <BubbleField />
      <div className="relative max-w-[820px] mx-auto z-2">
        <RevealWords
          as="h2"
          className="font-medium leading-none"
          style={{ fontSize: 'clamp(34px,6vw,72px)' }}
          words={[
            { text: 'Tu' }, { text: 'cuerpo' }, { text: 'lleva' }, { text: 'años' }, { text: 'esperando' },
            { text: 'esta agua.', style: { color: '#7FE0F0' } },
          ]}
        />
        <Reveal as="p" delay={300} className="mx-auto mt-6 max-w-[560px] text-[clamp(16px,2vw,19px)] leading-[1.55] text-white/70">
          Agenda una demostración gratuita, sin compromiso.
        </Reveal>

        <Reveal delay={420} className="mt-9 inline-block">
          <GradientPillButton
            onClick={openChat}
            cursorLabel="Reservar"
            innerClassName="bg-[rgba(7,16,19,.95)]"
            glow="0 0 70px -10px rgba(28,169,201,.75), 0 0 70px -14px rgba(99,102,241,.6)"
            glowHover="0 0 100px -8px rgba(28,169,201,.95), 0 0 100px -10px rgba(99,102,241,.8)"
          >
            <span className="flex items-center gap-3.5 pl-[26px] pr-[18px] py-4">
              <span className="w-2 h-2 rounded-full bg-aqua-glow shadow-[0_0_14px_#7FE0F0]" style={{ animation: 'haloPulse 2.4s ease-in-out infinite' }} />
              <span className="flex flex-col items-start leading-tight text-left">
                <span className="font-semibold text-white tracking-[-0.01em]" style={{ fontSize: 'clamp(16px,2vw,19px)' }}>Reservar mi videollamada</span>
                <span className="text-xs text-white/50">Respuesta al instante · asistente inteligente</span>
              </span>
              <span className="w-10 h-10 rounded-full flex items-center justify-center flex-none bg-gradient-to-br from-aqua to-indigo-500">
                <ArrowUpRight className="w-[18px] h-[18px] text-white" />
              </span>
            </span>
          </GradientPillButton>
        </Reveal>
        <Reveal as="p" delay={520} className="mt-5 text-[13.5px] text-white/50">
          Sin compromiso · 15 minutos · 100% online o presencial
        </Reveal>
      </div>
    </section>
  );
}
