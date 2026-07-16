import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X, Send, CalendarCheck, Check } from 'lucide-react';
import { useUI } from '../lib/UIContext';
import { useIsMobile } from '../lib/hooks';
import RaquelAvatar from './RaquelAvatar';

const GOALS = ['Cuidar mi salud', 'Adelgazar / más energía', 'Salud de mi familia', 'Ahorrar en botellas'];
const GOAL_SELL = {
  'Cuidar mi salud': 'Has dado en el clavo 💧 Justo eso es lo que trabajamos en la presentación: te muestro en directo cómo cambia el agua y qué significa para tu cuerpo. Reservemos ya tu hueco.',
  'Adelgazar / más energía': 'Perfecto ⚡ Es lo primero que nota la gente. En la presentación lo ves funcionando en vivo y te digo exactamente cómo encajarlo en tu día. Vamos a agendarla.',
  'Salud de mi familia': 'La mejor razón que hay 💙 En la presentación te enseño los tipos de agua para beber, cocinar y los peques. Son 15 minutos que cambian la casa. Cerremos tu cita.',
  'Ahorrar en botellas': 'Cuentas claras 🌊 Una familia gasta cientos de euros al año en botellas. En la presentación te enseño cómo eliminarlo. Reservemos tu hueco y te lo cuento.',
};

// === Reglas del horario (deben coincidir con google-apps-script/Codigo.gs) ===
const START_HOUR = 16;
const END_HOUR = 20;
const SLOT_MINUTES = 15;
const WORK_DAYS = [1, 2, 3, 4, 5]; // lunes–viernes
const MIN_LEAD_HOURS = 48;
const LOOKAHEAD_DAYS = 14;

// === Envío / lectura de la reserva ===
// Todo pasa por un Google Apps Script (ver carpeta google-apps-script/) que:
//  - GET  ?action=slots → consulta el calendario real y devuelve huecos libres.
//  - POST                → crea el evento con Meet, avisa a Raquel y guarda la fila.
// La URL se configura en el archivo .env → VITE_BOOKING_ENDPOINT.
const BOOKING_ENDPOINT = import.meta.env.VITE_BOOKING_ENDPOINT || '';

function onBooking(payload) {
  if (!BOOKING_ENDPOINT) {
    // Sin endpoint configurado: solo lo mostramos en consola (modo demo).
    console.log('[onBooking] (sin endpoint configurado) payload:', payload);
    return;
  }
  // "no-cors" + text/plain evita el preflight de CORS; es un envío de ida
  // (no necesitamos leer la respuesta para mostrar la confirmación al usuario).
  fetch(BOOKING_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  }).catch((err) => console.error('[onBooking] no se pudo enviar la reserva:', err));
}

// Genera los mismos huecos que calcularía el backend, para usarlos como
// vista previa en modo demo (sin VITE_BOOKING_ENDPOINT configurado).
function demoSlots() {
  const now = new Date();
  const minStart = new Date(now.getTime() + MIN_LEAD_HOURS * 60 * 60 * 1000);
  const rangeStart = new Date();
  rangeStart.setHours(0, 0, 0, 0);
  const slots = [];
  for (let d = 0; d <= LOOKAHEAD_DAYS; d++) {
    const day = new Date(rangeStart.getTime());
    day.setDate(day.getDate() + d);
    if (!WORK_DAYS.includes(day.getDay())) continue;
    const totalMinutes = (END_HOUR - START_HOUR) * 60;
    for (let m = 0; m < totalMinutes; m += SLOT_MINUTES) {
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), START_HOUR, 0, 0);
      start.setMinutes(start.getMinutes() + m);
      if (start < minStart) continue;
      slots.push({ start: start.toISOString() });
    }
    if (slots.length >= 60) break;
  }
  return slots;
}

async function fetchSlots() {
  if (!BOOKING_ENDPOINT) return demoSlots();
  try {
    const res = await fetch(`${BOOKING_ENDPOINT}?action=slots`);
    const data = await res.json();
    return Array.isArray(data.slots) ? data.slots : [];
  } catch (err) {
    console.error('[fetchSlots] no se pudieron cargar los huecos:', err);
    return demoSlots();
  }
}

function groupSlotsByDay(slots) {
  const map = new Map();
  slots.forEach((s) => {
    const dt = new Date(s.start);
    const key = dt.toDateString();
    if (!map.has(key)) {
      map.set(key, {
        key,
        dayLabel: dt.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }),
        times: [],
      });
    }
    map.get(key).times.push({
      start: s.start,
      timeLabel: dt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    });
  });
  return Array.from(map.values());
}

export default function ChatWidget() {
  const { chatOpen, closeChat, toggleChat } = useUI();
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState(0); // 0 idle, 1 goals, 2 name, 3 whatsapp, 4 email, 5 schedule, 6 done
  const [goal, setGoal] = useState(null);
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [slotGroups, setSlotGroups] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [textVal, setTextVal] = useState('');

  const midRef = useRef(0);
  const startedRef = useRef(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (step !== 5) return;
    let cancelled = false;
    setSlotsLoading(true);
    fetchSlots().then((slots) => {
      if (cancelled) return;
      const groups = groupSlotsByDay(slots);
      setSlotGroups(groups);
      setSelectedDay(groups[0]?.key || null);
      setSlotsLoading(false);
    });
    return () => { cancelled = true; };
  }, [step]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  useEffect(() => {
    if (chatOpen && !startedRef.current) {
      startedRef.current = true;
      const t = setTimeout(startConversation, 60);
      return () => clearTimeout(t);
    }
  }, [chatOpen]);

  const pushBot = (text, thenStep, delay = 850) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: ++midRef.current, from: 'bot', text }]);
      if (thenStep != null) setStep(thenStep);
    }, reduced ? 250 : delay);
  };
  const pushUser = (text) => setMessages((m) => [...m, { id: ++midRef.current, from: 'user', text }]);

  const startConversation = () => {
    pushBot('¡Hola! Soy Raquel 💧 Encantada de conocerte. Reservo esta semana las últimas presentaciones en directo (15 min, gratis y sin compromiso).', null, 500);
    pushBot('Para dejarte el mejor hueco, dime rápido: ¿qué es lo que más te interesa mejorar?', 1, 1700);
  };

  const selectGoal = (g) => {
    setGoal(g);
    pushUser(g);
    pushBot(GOAL_SELL[g] || '¡Genial!', null, 900);
    pushBot('Los huecos de esta semana vuelan y voy cerrando por orden. Para apartarte el tuyo, ¿cómo te llamas?', 2, 2100);
  };

  const submitText = (e) => {
    e.preventDefault();
    const v = textVal.trim();
    if (!v) return;
    if (step === 4 && !v.includes('@')) return; // email básico
    pushUser(v);
    if (step === 2) {
      setName(v); setTextVal('');
      pushBot(`¡Un placer, ${v}! 🙌 Para bloquearte el hueco te escribo por WhatsApp, ¿me pasas tu número?`, 3, 900);
    } else if (step === 3) {
      setWhatsapp(v); setTextVal('');
      pushBot('Perfecto. Y para mandarte la confirmación con el enlace de la videollamada, ¿tu email?', 4, 900);
    } else if (step === 4) {
      setEmail(v); setTextVal('');
      pushBot('Genial, ya casi está. Elige el hueco que mejor te venga de mi agenda real 👇', 5, 900);
    }
  };

  const confirmBooking = () => {
    if (!selectedSlot) return;
    const dt = new Date(selectedSlot);
    const label = dt.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    pushUser(label);
    onBooking({ goal, name, whatsapp, email, slot: selectedSlot, at: new Date().toISOString() });
    pushBot(`¡Hecho, ${name}! ✅ Te reservo la presentación para ${label}. En breve te llega un email a "${email}" con la confirmación y el enlace de Meet. Vas a flipar con lo que verás 💧`, 6, 900);
  };

  const subtitle = step >= 6 ? '✓ Cita solicitada' : step >= 1 ? `Paso ${Math.min(5, step)} de 5 · reservando tu demo` : '● En línea · responde al instante';
  const progress = step >= 6 ? '100%' : step >= 5 ? '85%' : step >= 4 ? '65%' : step >= 3 ? '45%' : step >= 2 ? '25%' : '8%';
  const canConfirm = !!selectedSlot;
  const activeDayTimes = slotGroups.find((g) => g.key === selectedDay)?.times || [];

  return (
    <>
      <motion.button
        onClick={toggleChat}
        data-cursor="hover"
        animate={{ scale: chatOpen ? 0 : 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-[22px] right-[22px] z-[1000] p-[1.5px] border-0 rounded-full cursor-pointer"
        style={{
          background: 'linear-gradient(115deg,rgba(127,224,240,.85),rgba(28,169,201,.3) 45%,rgba(99,102,241,.8))',
          boxShadow: '0 0 44px -8px rgba(28,169,201,.6),0 0 44px -12px rgba(99,102,241,.5),0 12px 40px rgba(0,0,0,.35)',
        }}
      >
        <span className={`flex items-center gap-2.5 rounded-full ${isMobile ? 'p-[7px]' : 'pl-[7px] pr-[18px] py-[7px]'}`} style={{ background: 'rgba(7,16,19,.94)', backdropFilter: 'blur(20px) saturate(1.4)' }}>
          <RaquelAvatar size={44} dot ring />
          {!isMobile && (
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[14px] font-semibold text-white">Hola, soy Raquel</span>
              <span className="text-[11px] text-aqua-glow">● En línea · reserva tu demo</span>
            </span>
          )}
        </span>
      </motion.button>

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: isMobile ? 0 : 24, scale: isMobile ? 1 : 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isMobile ? 0 : 24, scale: isMobile ? 1 : 0.94 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className={isMobile
              ? 'fixed inset-0 z-[1001] flex flex-col'
              : 'fixed bottom-[22px] right-[22px] z-[1001] w-[390px] flex flex-col rounded-3xl overflow-hidden border border-aqua-glow/22'}
            style={{
              height: isMobile ? '100%' : 'min(600px, 80vh)',
              background: isMobile ? 'rgba(7,16,19,0.92)' : 'rgba(7,16,19,0.82)',
              backdropFilter: 'blur(26px) saturate(1.4)',
              boxShadow: isMobile ? undefined : '0 30px 80px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.15)',
            }}
          >
            {/* header */}
            <div className="flex-none flex items-center justify-between gap-3 px-[18px] py-4 border-b border-white/8 bg-white/4">
              <div className="flex items-center gap-[11px]">
                <RaquelAvatar size={40} dot />
                <div className="leading-tight">
                  <div className="text-[14.5px] font-semibold text-white">Raquel Rodríguez</div>
                  <div className="text-[11.5px] text-aqua-glow">{subtitle}</div>
                </div>
              </div>
              <button onClick={closeChat} data-cursor="hover" className="w-[34px] h-[34px] rounded-full border-0 bg-white/8 flex items-center justify-center cursor-pointer text-white">
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>
            <div className="flex-none h-[3px] bg-white/6">
              <motion.div
                animate={{ width: progress }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-r-[3px]"
                style={{ background: 'linear-gradient(90deg,#1CA9C9,#7FE0F0)', boxShadow: '0 0 12px rgba(127,224,240,.6)' }}
              />
            </div>

            {/* messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-[18px] flex flex-col gap-3">
              {messages.map((m) => {
                const bot = m.from === 'bot';
                return (
                  <div key={m.id} className={`flex items-end gap-2 ${bot ? 'justify-start' : 'justify-end'}`} style={{ animation: 'msgIn .35s cubic-bezier(.16,1,.3,1) both' }}>
                    {bot && <span className="self-end"><RaquelAvatar size={30} /></span>}
                    <div
                      className={`max-w-[80%] px-[15px] py-3 text-[14.5px] leading-[1.45] text-white ${bot ? 'rounded-[16px_16px_16px_4px]' : 'rounded-[16px_16px_4px_16px]'}`}
                      style={{ background: bot ? 'rgba(255,255,255,.08)' : 'linear-gradient(150deg,#1CA9C9,#0E7A93)' }}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
              {typing && (
                <div className="flex items-end gap-2" style={{ animation: 'msgIn .3s ease both' }}>
                  <RaquelAvatar size={30} />
                  <div className="flex gap-1 px-4 py-3.5 rounded-[16px_16px_16px_4px] bg-white/8">
                    {[0, 0.15, 0.3].map((d) => (
                      <span key={d} className="w-[7px] h-[7px] rounded-full bg-aqua-glow" style={{ animation: `typingDot 1.2s infinite ${d}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* input zone */}
            <div className="flex-none px-4 pt-3.5 pb-4 border-t border-white/8 bg-white/3">
              {chatOpen && step === 1 && !typing && (
                <div className="flex flex-wrap gap-2">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      onClick={() => selectGoal(g)}
                      data-cursor="hover"
                      className="px-[15px] py-2.5 rounded-full border border-aqua-glow/30 bg-white/6 text-white text-[13.5px] cursor-pointer transition-colors hover:bg-aqua-glow/18"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
              {chatOpen && (step === 2 || step === 3 || step === 4) && !typing && (
                <form onSubmit={submitText} className="flex gap-2">
                  <input
                    value={textVal}
                    onChange={(e) => setTextVal(e.target.value)}
                    type={step === 4 ? 'email' : 'text'}
                    placeholder={step === 2 ? 'Escribe tu nombre…' : step === 3 ? 'Tu número de WhatsApp…' : 'Tu email…'}
                    className="flex-1 px-4 py-[13px] rounded-[13px] border border-white/14 bg-white/6 text-white text-[14.5px] outline-none"
                  />
                  <button type="submit" data-cursor="hover" className="flex-none w-[46px] rounded-[13px] border-0 flex items-center justify-center cursor-pointer text-white" style={{ background: 'linear-gradient(150deg,#1CA9C9,#0E7A93)' }}>
                    <Send className="w-[18px] h-[18px]" />
                  </button>
                </form>
              )}
              {chatOpen && step === 5 && !typing && (
                <div>
                  {slotsLoading ? (
                    <div className="flex items-center gap-2 py-3 text-white/50 text-[13.5px]">
                      <span className="flex gap-1">
                        {[0, 0.15, 0.3].map((d) => (
                          <span key={d} className="w-[6px] h-[6px] rounded-full bg-aqua-glow" style={{ animation: `typingDot 1.2s infinite ${d}s` }} />
                        ))}
                      </span>
                      Consultando la agenda…
                    </div>
                  ) : slotGroups.length === 0 ? (
                    <div className="py-3 text-white/60 text-[13.5px]">
                      Ahora mismo no veo huecos libres. Escríbeme por WhatsApp al {whatsapp || 'número que me diste'} y te busco uno.
                    </div>
                  ) : (
                    <>
                      <div className="text-xs text-white/50 mb-2">Día</div>
                      <div className="flex flex-wrap gap-[7px] mb-3.5 max-h-[74px] overflow-y-auto">
                        {slotGroups.map((g) => (
                          <button
                            key={g.key}
                            onClick={() => { setSelectedDay(g.key); setSelectedSlot(null); }}
                            data-cursor="hover"
                            className="px-3.5 py-2 rounded-[11px] border text-white text-[13px] cursor-pointer capitalize"
                            style={{
                              borderColor: selectedDay === g.key ? 'rgba(127,224,240,.6)' : 'rgba(255,255,255,.14)',
                              background: selectedDay === g.key ? 'rgba(127,224,240,.2)' : 'rgba(255,255,255,.06)',
                            }}
                          >
                            {g.dayLabel}
                          </button>
                        ))}
                      </div>
                      <div className="text-xs text-white/50 mb-2">Hora</div>
                      <div className="flex flex-wrap gap-[7px] max-h-[110px] overflow-y-auto">
                        {activeDayTimes.map((t) => (
                          <button
                            key={t.start}
                            onClick={() => setSelectedSlot(t.start)}
                            data-cursor="hover"
                            className="px-3.5 py-2 rounded-[11px] border text-white text-[13.5px] cursor-pointer"
                            style={{
                              borderColor: selectedSlot === t.start ? 'rgba(127,224,240,.6)' : 'rgba(255,255,255,.14)',
                              background: selectedSlot === t.start ? 'rgba(127,224,240,.2)' : 'rgba(255,255,255,.06)',
                            }}
                          >
                            {t.timeLabel}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  <button
                    onClick={confirmBooking}
                    data-cursor="hover"
                    data-cursor-label="Confirmar"
                    disabled={!canConfirm}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-[13px] border-0 text-[15px] font-semibold text-white"
                    style={{
                      cursor: canConfirm ? 'pointer' : 'not-allowed',
                      background: canConfirm ? 'linear-gradient(150deg,#1CA9C9,#0E7A93)' : 'rgba(255,255,255,.1)',
                      opacity: canConfirm ? 1 : 0.55,
                      boxShadow: canConfirm ? '0 10px 30px rgba(28,169,201,.35)' : 'none',
                    }}
                  >
                    <CalendarCheck className="w-[17px] h-[17px]" />Confirmar mi cita
                  </button>
                </div>
              )}
              {chatOpen && step === 6 && !typing && (
                <div>
                  <div className="p-[18px] rounded-2xl border border-aqua-glow/35" style={{ background: 'linear-gradient(150deg,rgba(28,169,201,.16),rgba(14,122,147,.08))', boxShadow: '0 0 40px rgba(28,169,201,.18)' }}>
                    <div className="flex items-center gap-2.5 mb-3.5">
                      <span className="w-[34px] h-[34px] rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(150deg,#39d98a,#1CA9C9)', animation: 'checkPop .6s cubic-bezier(.16,1,.3,1) both' }}>
                        <Check className="w-[18px] h-[18px] text-white" />
                      </span>
                      <span className="text-[15px] font-semibold text-white">Demo solicitada</span>
                    </div>
                    <div className="flex flex-col gap-[7px] text-[13px] text-white/75">
                      <div className="flex justify-between gap-3"><span className="text-white/45">Objetivo</span><span>{goal || '—'}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-white/45">Nombre</span><span>{name || '—'}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-white/45">WhatsApp</span><span>{whatsapp || '—'}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-white/45">Email</span><span>{email || '—'}</span></div>
                      <div className="flex justify-between gap-3">
                        <span className="text-white/45">Cuándo</span>
                        <span className="text-aqua-glow font-semibold capitalize">
                          {selectedSlot ? new Date(selectedSlot).toLocaleString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={closeChat} data-cursor="hover" className="mt-2.5 w-full py-[13px] rounded-[13px] border border-white/14 bg-white/6 text-white text-sm font-medium cursor-pointer">
                    Cerrar
                  </button>
                </div>
              )}
              <p className="mt-3 text-center text-[11px] text-white/40">Sin compromiso · 15 minutos · 100% online o presencial</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
