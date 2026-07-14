import { Camera, MessageCircle, HeartHandshake } from 'lucide-react';
import Reveal from './Reveal';
import Parallax from './Parallax';
import { useIsMobile } from '../lib/hooks';

export default function About() {
  const isMobile = useIsMobile();
  return (
    <section id="sobre-mi" className="relative bg-white px-5 sm:px-10 lg:px-20 py-[clamp(80px,10vw,150px)] overflow-hidden">
      <div
        className="max-w-[1120px] mx-auto grid gap-[clamp(36px,5vw,72px)] items-center"
        style={{ gridTemplateColumns: isMobile ? '1fr' : '0.9fr 1.1fr' }}
      >
        <Parallax speed={0.14} className="flex justify-center">
          <Reveal
            data-cursor="hover"
            data-cursor-label="Raquel"
            className="relative w-[min(420px,86vw)] rounded-[28px] overflow-hidden border border-black/7 shadow-[0_24px_70px_rgba(10,20,24,0.12)]"
            style={{ aspectRatio: '4/5' }}
          >
            <img src="/assets/raquel2.png" alt="Raquel Rodríguez" className="w-full h-full object-cover" style={{ objectPosition: '62% 20%' }} />
          </Reveal>
        </Parallax>
        <div>
          <Reveal as="span" className="block text-[11px] font-semibold tracking-[.24em] uppercase text-aqua-deep">Sobre mí</Reveal>
          <Reveal delay={80} as="h2" className="mt-4 text-[clamp(32px,5vw,58px)] leading-none text-ink">
            Hola, soy <span className="text-aqua">Raquel.</span>
          </Reveal>
          <Reveal delay={160} as="p" className="mt-[22px] text-[clamp(16px,1.9vw,18px)] leading-[1.65] text-ink-soft">
            Hace unos años cambié el agua que bebía en casa casi por curiosidad. Lo que no esperaba es cómo cambiaría mi rutina: más ligera por las mañanas, sin arrastrar el bidón de botellas, con la sensación de estar cuidándome de verdad.
          </Reveal>
          <Reveal delay={220} as="p" className="mt-4 text-[clamp(16px,1.9vw,18px)] leading-[1.65] text-ink-soft">
            Desde entonces acompaño a otras personas a dar el mismo paso, sin prisas y sin presión. <span className="text-ink font-medium">No vendo máquinas: comparto un cambio que viví.</span>
          </Reveal>
          <Reveal delay={300} className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#" data-cursor="hover" className="inline-flex items-center gap-2 px-[18px] py-3 rounded-[13px] bg-bg-light text-ink text-[14.5px] font-medium">
              <Camera className="w-[17px] h-[17px] text-aqua-deep" />Instagram
            </a>
            <a href="#" data-cursor="hover" className="inline-flex items-center gap-2 px-[18px] py-3 rounded-[13px] bg-bg-light text-ink text-[14.5px] font-medium">
              <MessageCircle className="w-[17px] h-[17px] text-aqua-deep" />WhatsApp
            </a>
            <span className="inline-flex items-center gap-2 text-[14.5px] text-ink-soft">
              <HeartHandshake className="w-[17px] h-[17px] text-aqua" />+320 familias acompañadas
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
