import { Power, RefreshCw, Bell, ShowerHead, Heart, Wrench, Fingerprint, BadgeCheck, ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import Parallax from './Parallax';
import GradientPillButton from './GradientPillButton';
import { useUI } from '../lib/UIContext';
import { useIsMobile } from '../lib/hooks';

const PRODUCTS = [
  {
    n: '01', tag: 'Top de gama', name: 'Leveluk K8', img: '/assets/k8.png', floatDur: '8s',
    desc: 'La máquina antioxidante más potente de Enagic. Ocho placas de titanio bañadas en platino, panel táctil a todo color y voz en 10 idiomas. De un solo grifo salen 5 tipos de agua para toda la casa.',
    specs: [
      { v: '8 placas', l: 'titanio + platino' },
      { v: '−722 mV', l: 'ORP máximo' },
      { v: 'pH 2.5–11.5', l: '5 tipos de agua' },
      { v: '5 años', l: 'de garantía' },
    ],
    features: [
      { icon: Power, t: 'Encendido automático' },
      { icon: RefreshCw, t: 'Autolimpieza' },
      { icon: Bell, t: 'Filtro inteligente' },
    ],
  },
  {
    n: '02', tag: 'Spa en casa', name: 'ANESPA DX', img: '/assets/anespa.png', floatDur: '8.6s',
    desc: 'Convierte tu baño en un balneario japonés. Elimina casi el 100% del cloro del agua y añade minerales termales que cuidan la piel y el cabello. Para ducha y baño, cada día.',
    specs: [
      { v: '~100%', l: 'del cloro eliminado' },
      { v: 'Toba · MIC', l: 'minerales termales' },
      { v: '2.6 L/min', l: 'flujo continuo' },
      { v: '3 años', l: 'de garantía' },
    ],
    features: [
      { icon: ShowerHead, t: 'Ducha de masaje' },
      { icon: Heart, t: 'Piel y cabello' },
      { icon: Wrench, t: 'Instalación sencilla' },
    ],
  },
  {
    n: '03', tag: 'El modelo de inicio', name: 'Leveluk JrIV', img: '/assets/jr4.png', floatDur: '7.4s',
    desc: 'Compacta y de bajo consumo, con 4 placas de titanio y platino. Pensada para una o dos personas que quieren empezar. Los 5 tipos de agua, con un solo botón.',
    specs: [
      { v: '4 placas', l: 'titanio + platino' },
      { v: '−450 mV', l: 'ORP máximo' },
      { v: '120 W', l: 'bajo consumo' },
      { v: '3 años', l: 'de garantía' },
    ],
    features: [
      { icon: Fingerprint, t: 'Un botón, un agua' },
      { icon: RefreshCw, t: 'Autolimpieza' },
      { icon: Bell, t: 'Aviso de filtro' },
    ],
  },
];

function ProductCard({ p, first }) {
  const { openChat } = useUI();
  const isMobile = useIsMobile();
  return (
    <div
      className={`grid gap-[clamp(28px,5vw,64px)] items-center ${first ? '' : 'mt-[clamp(48px,7vw,84px)] pt-[clamp(36px,5vw,56px)] border-t border-black/10'}`}
      style={{ gridTemplateColumns: isMobile ? '1fr' : '0.85fr 1.15fr' }}
    >
      <Reveal className="flex justify-center">
        <Parallax speed={0.06} className="relative w-[min(400px,78vw)]" style={{ animation: `floatY ${p.floatDur} ease-in-out infinite` }}>
          <div className="absolute" style={{ inset: '6% -10%', background: 'radial-gradient(circle, rgba(28,169,201,.14), transparent 65%)', filter: 'blur(24px)' }} />
          <img src={p.img} alt={p.name} className="relative w-full h-auto" style={{ filter: 'drop-shadow(0 30px 60px rgba(10,20,24,.22))' }} />
        </Parallax>
      </Reveal>
      <div>
        <Reveal className="flex items-center gap-2.5">
          <span className="font-mono text-xs text-aqua">{p.n}</span>
          <span className="inline-flex items-center gap-1.5 px-[13px] py-1.5 rounded-full bg-aqua/10 text-aqua-deep text-xs font-semibold">{p.tag}</span>
        </Reveal>
        <Reveal delay={60} as="h3" className="mt-4 text-[clamp(28px,3.6vw,42px)] tracking-[-0.03em] text-ink">{p.name}</Reveal>
        <Reveal delay={120} as="p" className="mt-3 max-w-[460px] text-[15.5px] leading-[1.6] text-ink-soft">{p.desc}</Reveal>
        <Reveal delay={180} className="mt-5 grid gap-px bg-black/8 border border-black/8 rounded-2xl overflow-hidden" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))' }}>
          {p.specs.map((s) => (
            <div key={s.v} className="px-4 py-3.5 bg-white">
              <div className="font-display font-semibold text-[17px] text-ink">{s.v}</div>
              <div className="text-xs text-ink-soft mt-0.5">{s.l}</div>
            </div>
          ))}
        </Reveal>
        <Reveal delay={220} className="mt-4 flex flex-wrap gap-3.5 text-[13px] text-ink-soft">
          {p.features.map((f) => (
            <span key={f.t} className="inline-flex items-center gap-1.5">
              <f.icon className="w-3.5 h-3.5 text-aqua" />{f.t}
            </span>
          ))}
        </Reveal>
        <Reveal delay={260}>
          <GradientPillButton onClick={openChat} cursorLabel="Reservar" className="mt-[26px]" glow="0 10px 34px -8px rgba(28,169,201,.45)" glowHover="0 16px 44px -6px rgba(28,169,201,.6)">
            <span className="flex items-center gap-[11px] pl-[18px] pr-[14px] py-3">
              <span className="text-sm font-semibold text-white">Verla en mi videollamada</span>
              <span className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-aqua to-indigo-500">
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              </span>
            </span>
          </GradientPillButton>
        </Reveal>
      </div>
    </div>
  );
}

export default function Products() {
  return (
    <section id="productos" className="relative bg-bg-light px-5 sm:px-10 lg:px-20 py-[clamp(80px,10vw,150px)] overflow-hidden">
      <div className="max-w-[1120px] mx-auto">
        <Reveal as="span" className="block text-[11px] font-semibold tracking-[.24em] uppercase text-aqua-deep">Los equipos</Reveal>
        <Reveal delay={80} as="h2" className="mt-[18px] max-w-[760px] text-[clamp(30px,5vw,56px)] leading-[1.02] text-ink">
          Elige el tuyo. <span className="text-aqua">Yo te acompaño.</span>
        </Reveal>

        {PRODUCTS.map((p, i) => (
          <ProductCard key={p.name} p={p} first={i === 0} />
        ))}

        <Reveal className="mt-[clamp(48px,7vw,84px)] p-[clamp(24px,3.5vw,36px)] rounded-[22px] bg-white border border-black/6 flex flex-wrap items-center justify-between gap-[18px]">
          <div className="flex items-center gap-3.5">
            <span className="w-11 h-11 rounded-2xl flex items-center justify-center flex-none bg-[linear-gradient(140deg,rgba(28,169,201,.12),rgba(99,102,241,.08))]">
              <BadgeCheck className="w-[21px] h-[21px] text-aqua-deep" />
            </span>
            <div>
              <div className="text-[15px] font-semibold tracking-[-0.01em] text-ink">Calidad certificada</div>
              <div className="mt-[3px] text-[13px] leading-[1.5] text-ink-soft max-w-[520px]">
                Enagic International está certificada según las normas ISO 9001, ISO 14001 e ISO 13485, y es miembro de la Asociación de Venta Directa.
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {['ISO 9001', 'ISO 14001', 'ISO 13485', 'DSA'].map((c) => (
              <span key={c} className="px-3.5 py-2 rounded-full bg-bg-light border border-black/7 text-[12.5px] font-medium text-ink">{c}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
