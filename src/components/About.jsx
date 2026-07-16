import { Camera, MessageCircle, HeartHandshake } from 'lucide-react';
import Reveal from './Reveal';
import Parallax from './Parallax';
import IconBadge from './IconBadge';
import { useIsMobile } from '../lib/hooks';

export default function About() {
  const isMobile = useIsMobile();
  return (
    <section id="sobre-mi" className="relative bg-white px-6 sm:px-10 lg:px-20 py-[clamp(80px,10vw,150px)] overflow-hidden">
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
            Hace unos años decidí cambiar el agua que bebía en casa: quería algo de verdadera calidad y dejar atrás el plástico de las botellas.
          </Reveal>
          <Reveal delay={220} as="p" className="mt-4 text-[clamp(16px,1.9vw,18px)] leading-[1.65] text-ink-soft">
            Lo que no imaginé fue todo lo que ese cambio traería con el paso del tiempo: más energía, mejor digestión, la sensación real de estar cuidando mi cuerpo cada día.
          </Reveal>
          <Reveal delay={280} as="p" className="mt-4 text-[clamp(16px,1.9vw,18px)] leading-[1.65] text-ink-soft">
            Desde entonces acompaño a otras personas a dar ese mismo paso. Porque a veces el mayor cambio en tu bienestar no viene de algo complicado, sino de algo tan cotidiano como el agua que bebes.
          </Reveal>
          <Reveal delay={340} className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#" data-cursor="hover" className="inline-flex items-center gap-2.5 pl-3 pr-[18px] py-2.5 rounded-full bg-bg-light text-ink text-[14px] font-medium">
              <IconBadge icon={Camera} size={26} iconSize={13} />Instagram
            </a>
            <a href="#" data-cursor="hover" className="inline-flex items-center gap-2.5 pl-3 pr-[18px] py-2.5 rounded-full bg-bg-light text-ink text-[14px] font-medium">
              <IconBadge icon={MessageCircle} size={26} iconSize={13} />WhatsApp
            </a>
            <span className="inline-flex items-center gap-2.5 text-[14px] text-ink-soft">
              <IconBadge icon={HeartHandshake} size={26} iconSize={13} />+320 familias acompañadas
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
