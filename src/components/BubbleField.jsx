import { useMemo } from 'react';
import { useIsMobile } from '../lib/hooks';

/** Burbujas ascendentes fluidas y sutiles, con profundidad (tamaño/velocidad/blur). */
export default function BubbleField({ className = '' }) {
  const isMobile = useIsMobile();
  const n = isMobile ? 9 : 18;

  const bubbles = useMemo(() => {
    return Array.from({ length: n }, (_, i) => {
      const depth = Math.random();
      const size = 2.5 + depth * depth * 11;
      const dur = 22 - depth * 8 + Math.random() * 8;
      const op = 0.08 + depth * 0.22;
      const blur = depth < 0.4 ? 1.2 - depth * 2.4 : 0;
      const sway = (10 + depth * 44) * (Math.random() < 0.5 ? -1 : 1);
      return {
        key: i,
        left: (Math.random() * 100).toFixed(2) + '%',
        size: size.toFixed(1),
        dur: dur.toFixed(1),
        delay: (-Math.random() * dur).toFixed(1),
        glow: (0.15 + depth * 0.2).toFixed(2),
        glowSize: (4 + depth * 9).toFixed(0),
        blur,
        sway: sway.toFixed(0),
        op: op.toFixed(2),
      };
    });
  }, [n]);

  return (
    <div className={`bubble-field absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {bubbles.map((b) => (
        <span
          key={b.key}
          style={{
            position: 'absolute',
            bottom: '-6vh',
            left: b.left,
            width: `${b.size}px`,
            height: `${b.size}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 34% 30%, rgba(255,255,255,.7), rgba(127,224,240,.28) 45%, transparent 76%)',
            boxShadow: `0 0 ${b.glowSize}px rgba(127,224,240,${b.glow})`,
            filter: b.blur ? `blur(${b.blur}px)` : undefined,
            '--bx': `${b.sway}px`,
            '--bo': b.op,
            opacity: 0,
            animation: `bubbleRise ${b.dur}s cubic-bezier(.37,0,.63,1) ${b.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}
