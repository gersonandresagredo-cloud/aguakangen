import Parallax from './Parallax';

/**
 * Halo radial borroso, con pulso suave, usado en las secciones oscuras.
 * La posición/tamaño va en el div exterior (estático, vía className);
 * el parallax solo mueve el interior, así no chocan las clases de
 * transform de Tailwind con el `y` que aplica framer-motion.
 */
export default function Halo({
  speed = 0.2,
  className = '',
  pulse = true,
  gradient = 'radial-gradient(circle, rgba(28,169,201,.4), rgba(127,224,240,.1) 40%, transparent 66%)',
  blur = '20px',
  borderRadius,
}) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <Parallax speed={speed} className="w-full h-full">
        <div
          className="w-full h-full"
          style={{
            background: gradient,
            filter: `blur(${blur})`,
            borderRadius,
            animation: pulse ? 'haloPulse 9s ease-in-out infinite' : undefined,
          }}
        />
      </Parallax>
    </div>
  );
}
