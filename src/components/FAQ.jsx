import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Reveal from './Reveal';
import { useUI } from '../lib/UIContext';

const ITEMS = [
  {
    q: '¿Es muy caro?',
    a: 'No es un gasto, es una inversión única. Frente al goteo eterno de garrafas y botellas cada mes, aquí decides una vez y la usa toda la familia durante años. Cuando echas cuentas, sale a favor.',
  },
  {
    q: '¿Realmente funciona?',
    a: 'Con transparencia: es agua alcalina ionizada, rica en hidrógeno molecular, producida por electrólisis. La mejor manera de convencerte no es leer, es probarla en directo y verla funcionar con tus propios ojos.',
  },
  {
    q: '¿Y si no sé usarla?',
    a: 'No estás sola. Te acompaño personalmente en la puesta en marcha y tienes acceso a una comunidad que resuelve cualquier duda del día a día. Es más fácil de lo que imaginas.',
  },
];

function LastFaqAnswer() {
  const { openChat } = useUI();
  return (
    <p className="px-0 pb-[22px] text-[15.5px] leading-[1.6] text-ink-soft">
      Justo para eso es la demostración gratuita. Agendas 15 minutos, la pruebas —online o presencial— y decides sin ningún compromiso.{' '}
      <a href="#" onClick={(e) => { e.preventDefault(); openChat(); }} className="text-aqua-deep font-medium">
        Habla con mi agente y reserva tu hueco.
      </a>
    </p>
  );
}

function FaqItem({ q, a, open, onToggle }) {
  return (
    <Reveal className="rounded-[18px] bg-white border border-black/6 overflow-hidden">
      <button
        onClick={onToggle}
        data-cursor="hover"
        className="w-full flex items-center justify-between gap-4 px-6 py-[22px] bg-transparent border-0 cursor-pointer text-left"
      >
        <span className="text-[clamp(16px,2vw,19px)] font-semibold tracking-[-0.02em] text-ink">{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="flex-none">
          <Plus className="w-5 h-5 text-aqua-deep" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="px-6">{a ? <p className="pb-[22px] text-[15.5px] leading-[1.6] text-ink-soft">{a}</p> : <LastFaqAnswer />}</div>
      </motion.div>
    </Reveal>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(-1);
  const all = [...ITEMS, { q: '¿Cómo la pruebo?', a: null }];

  return (
    <section className="relative bg-bg-light px-5 sm:px-10 lg:px-20 py-[clamp(80px,10vw,150px)]">
      <div className="max-w-[820px] mx-auto">
        <Reveal as="span" className="block text-[11px] font-semibold tracking-[.24em] uppercase text-aqua-deep">Tus dudas</Reveal>
        <Reveal delay={80} as="h2" className="mt-4 text-[clamp(30px,5vw,54px)] leading-[1.02] text-ink">
          Lo que todo el mundo <span className="text-aqua">se pregunta.</span>
        </Reveal>
        <div className="mt-[clamp(36px,5vw,56px)] flex flex-col gap-3">
          {all.map((it, i) => (
            <FaqItem key={it.q} q={it.q} a={it.a} open={open === i} onToggle={() => setOpen((o) => (o === i ? -1 : i))} />
          ))}
        </div>
      </div>
    </section>
  );
}
