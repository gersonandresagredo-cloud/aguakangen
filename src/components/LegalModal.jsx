import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useUI } from '../lib/UIContext';

const PRIVACIDAD = [
  { head: 'Responsable del tratamiento.', body: 'Raquel Rodríguez, distribuidora independiente de Enagic Co., Ltd., es la responsable de los datos personales facilitados a través de esta web.' },
  { head: 'Datos que recogemos.', body: 'A través del asistente de reservas se recogen únicamente los datos necesarios para gestionar tu demostración: nombre, teléfono o email, y preferencia de día y franja horaria.' },
  { head: 'Finalidad.', body: 'Agendar, confirmar y realizar el seguimiento de la videollamada de demostración solicitada. No se utilizan los datos con otros fines ni se ceden a terceros, salvo obligación legal.' },
  { head: 'Conservación.', body: 'Los datos se conservan mientras dure la gestión de la cita y la relación comercial, o hasta que solicites su supresión.' },
  { head: 'Tus derechos.', body: 'Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad contactando con Raquel Rodríguez por cualquiera de los canales indicados en esta web.' },
  { head: 'Cookies.', body: 'Esta web no utiliza cookies de seguimiento publicitario. Solo se emplea almacenamiento local técnico (por ejemplo, para recordar el punto de reproducción del vídeo).' },
];

const AVISO = [
  { head: 'Titularidad.', body: 'Esta web es titularidad de Raquel Rodríguez, distribuidora independiente de Enagic Co., Ltd. Su finalidad es informativa y de contacto comercial para la solicitud de demostraciones.' },
  { head: 'Marcas y propiedad intelectual.', body: 'Enagic®, Kangen Water® y los nombres de producto (Leveluk K8, Leveluk JrIV, ANESPA DX) son marcas registradas de Enagic Co., Ltd. Queda prohibida la reproducción total o parcial de los contenidos de esta web sin autorización expresa.' },
  { head: 'Web no oficial.', body: 'Esta web pertenece a una distribuidora independiente y no es una web oficial de Enagic Co., Ltd.' },
  { head: 'Carácter informativo.', body: 'La información publicada tiene fines exclusivamente informativos y no constituye consejo médico. Los productos no están destinados a diagnosticar, tratar, curar o prevenir ninguna enfermedad. Los resultados varían según la persona.' },
  { head: 'Legislación aplicable.', body: 'Esta web se rige por la legislación española y la normativa europea aplicable en materia de servicios de la sociedad de la información y protección de datos.' },
];

export default function LegalModal() {
  const { legalOpen, closeLegal } = useUI();
  const title = legalOpen === 'privacidad' ? 'Política de privacidad' : 'Aviso legal';
  const paragraphs = legalOpen === 'privacidad' ? PRIVACIDAD : AVISO;

  return (
    <AnimatePresence>
      {legalOpen && (
        <motion.div
          onClick={closeLegal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[1500] flex items-center justify-center p-[clamp(14px,4vw,48px)]"
          style={{ background: 'rgba(4,10,12,.75)', backdropFilter: 'blur(14px)' }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 24, scale: 0.94, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[min(680px,100%)] max-h-[82vh] overflow-y-auto rounded-3xl border border-white/10 p-[clamp(26px,4vw,44px)]"
            style={{ background: '#0B171C', boxShadow: '0 40px 100px rgba(0,0,0,.6)' }}
          >
            <button
              onClick={closeLegal}
              data-cursor="hover"
              className="absolute top-4 right-4 w-9 h-9 rounded-full border-0 flex items-center justify-center cursor-pointer text-white bg-white/7"
            >
              <X className="w-[17px] h-[17px]" />
            </button>
            <h3 className="text-[clamp(22px,3vw,30px)] tracking-[-0.025em] text-white">{title}</h3>
            <div className="mt-[18px] flex flex-col gap-3.5 text-sm leading-[1.7] text-white/62">
              {paragraphs.map((p) => (
                <p key={p.head}><strong className="text-white/85 font-semibold">{p.head}</strong> {p.body}</p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
