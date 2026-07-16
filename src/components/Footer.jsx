import { Camera, Music2 } from 'lucide-react';
import { useUI } from '../lib/UIContext';
import { useIsMobile } from '../lib/hooks';
import SocialButton from './SocialButton';

const INSTAGRAM_URL = 'https://www.instagram.com/soy.aguakangen/';
const TIKTOK_URL = 'https://www.tiktok.com/@soy.aguakangen';

export default function Footer() {
  const { openLegal } = useUI();
  const isMobile = useIsMobile();

  return (
    <footer className="bg-dark-deep text-white/60 px-6 sm:px-10 lg:px-20 pt-[clamp(56px,8vw,96px)] pb-9">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid gap-[clamp(32px,5vw,64px)] items-start" style={{ gridTemplateColumns: isMobile ? '1fr' : '1.4fr 0.6fr 0.8fr' }}>
          <div>
            <img src="/assets/logo-enagic-white.svg" alt="Enagic" className="h-[30px] w-auto opacity-[0.92]" />
            <p className="mt-[18px] text-[13.5px] leading-[1.6] text-white/50 max-w-[340px]">
              Raquel Rodríguez · Distribuidora independiente Enagic® Kangen®
            </p>
            <p className="mt-2.5 font-display text-sm tracking-[-0.02em] text-aqua-glow">Change your water. Change your life.</p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-semibold tracking-[.22em] uppercase text-white/35">Social</span>
            <div className="flex flex-col gap-2.5 items-start">
              <SocialButton
                href={INSTAGRAM_URL}
                icon={Camera}
                label="Instagram"
                gradient="linear-gradient(135deg,#f6a13c,#e0457b 45%,#7b4ec9)"
                dark
              />
              <SocialButton
                href={TIKTOK_URL}
                icon={Music2}
                label="TikTok"
                gradient="linear-gradient(135deg,#0A1418,#1CA9C9 55%,#7FE0F0)"
                dark
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-semibold tracking-[.22em] uppercase text-white/35">Legal</span>
            <a href="#" onClick={(e) => { e.preventDefault(); openLegal('aviso'); }} data-cursor="hover" className="text-white/70 text-sm w-fit">Aviso legal</a>
            <a href="#" onClick={(e) => { e.preventDefault(); openLegal('privacidad'); }} data-cursor="hover" className="text-white/70 text-sm w-fit">Política de privacidad</a>
          </div>
        </div>
        <div className="mt-[clamp(36px,5vw,56px)] pt-[22px] border-t border-white/7 flex flex-wrap justify-between gap-3.5">
          <p className="text-[11.5px] leading-[1.6] text-white/35 max-w-[720px]">
            Enagic® y Kangen® son marcas registradas de Enagic Co., Ltd. Raquel Rodríguez es distribuidora independiente. La información de esta web tiene fines informativos y no sustituye consejo médico. Nuestros productos no están destinados a diagnosticar, tratar, curar o prevenir ninguna enfermedad. Los resultados varían según la persona.
          </p>
          <p className="text-[11.5px] text-white/35">© 2026</p>
        </div>
      </div>
    </footer>
  );
}
