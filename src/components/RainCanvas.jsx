import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useIsMobile } from '../lib/hooks';

/** Lluvia fina de gotas en canvas, reactiva a la velocidad de scroll, con salpicaduras. */
export default function RainCanvas() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (reduced) return;
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    let W, H;
    const fit = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    fit();
    window.addEventListener('resize', fit);

    const N = isMobile ? 14 : 34;
    const drops = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(), len: 8 + Math.random() * 18,
      spd: 0.25 + Math.random() * 0.5, w: 0.5 + Math.random() * 0.7, drift: (Math.random() - 0.5) * 0.08,
    }));
    const splashes = [];
    let lastY = window.scrollY, vel = 0, raf;

    const loop = () => {
      const sy = window.scrollY;
      vel += (sy - lastY - vel) * 0.12;
      lastY = sy;
      const boost = Math.min(18, Math.abs(vel) * 0.4);
      ctx.clearRect(0, 0, W, H);
      drops.forEach((d) => {
        const px = d.x * W, py = d.y * H;
        const speed = d.spd + boost;
        const len = d.len * (1 + boost * 0.09);
        const g = ctx.createLinearGradient(px, py - len, px, py);
        g.addColorStop(0, 'rgba(127,224,240,0)');
        g.addColorStop(1, 'rgba(127,224,240,' + (0.09 + Math.min(0.2, boost * 0.015)) + ')');
        ctx.strokeStyle = g;
        ctx.lineWidth = d.w;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(px, py - len); ctx.lineTo(px, py); ctx.stroke();
        d.y += speed / H;
        d.x += d.drift / 100;
        if (d.y > 1.05) {
          if (boost > 3 && splashes.length < 14) {
            splashes.push({ x: d.x * W, y: H - 6 - Math.random() * 10, r: 1, max: 9 + Math.random() * 10, a: 0.4 });
          }
          d.y = -0.08; d.x = Math.random();
        }
        if (d.x > 1.02 || d.x < -0.02) d.x = Math.random();
      });
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.r += (s.max - s.r) * 0.14; s.a *= 0.92;
        ctx.strokeStyle = 'rgba(127,224,240,' + s.a.toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(s.x, s.y, s.r, s.r * 0.32, 0, 0, Math.PI * 2); ctx.stroke();
        if (s.a < 0.02) splashes.splice(i, 1);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', fit);
    };
  }, [reduced, isMobile]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-4"
      style={{ zIndex: 4 }}
    />
  );
}
