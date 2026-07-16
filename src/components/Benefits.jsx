import { Droplets, Sparkles, Zap, ChefHat, Recycle, Users } from 'lucide-react';
import Reveal from './Reveal';
import IconBadge from './IconBadge';

const ITEMS = [
  { icon: Droplets, title: 'Hidratación real', text: 'Agua más ligera, más fácil de absorber.' },
  { icon: Sparkles, title: 'Antioxidante diario', text: 'Frente a los radicales libres del día a día.' },
  { icon: Zap, title: 'Energía y ligereza', text: 'Empieza el día con otra sensación.' },
  { icon: ChefHat, title: 'Cocina y hogar', text: 'Beber, limpiar, cocinar, piel.' },
  { icon: Recycle, title: 'Ahorro y sostenibilidad', text: 'Adiós a las botellas para siempre.' },
  { icon: Users, title: 'Para toda la familia', text: 'Una decisión que cuida a los que quieres.' },
];

export default function Benefits() {
  return (
    <section id="beneficios" className="relative bg-bg-light px-6 sm:px-10 lg:px-20 py-[clamp(72px,10vw,150px)]">
      <div className="max-w-[1120px] mx-auto">
        <Reveal as="span" className="block text-[11px] font-semibold tracking-[.24em] uppercase text-aqua-deep">
          Beneficios
        </Reveal>
        <Reveal delay={80} as="h2" className="mt-[18px] max-w-[860px] text-[clamp(28px,5vw,58px)] leading-[1.1] sm:leading-[1.02] text-ink">
          Lo que cambia, cuando <span className="text-aqua">cambias tu agua.</span>
        </Reveal>
        <div className="mt-10 sm:mt-[clamp(44px,6vw,80px)] grid gap-x-[clamp(24px,4vw,56px)] gap-y-8 sm:gap-y-[clamp(28px,4vw,44px)]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,280px), 1fr))' }}>
          {ITEMS.map((it, i) => (
            <Reveal key={it.title} delay={(i % 3) * 80} data-cursor="hover" className="pt-6 border-t border-black/10">
              <IconBadge icon={it.icon} />
              <h3 className="mt-4 text-[17.5px] tracking-[-0.02em] text-ink">{it.title}</h3>
              <p className="mt-[6px] text-sm leading-[1.55] text-ink-soft">{it.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
