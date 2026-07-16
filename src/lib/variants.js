export const EASE = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE },
  },
};

// Versión móvil: sin blur (evita jank de filtros en GPUs modestas) y más
// rápida/corta — se siente ágil y moderna en vez de "pesada" en pantallas pequeñas.
export const fadeUpMobile = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: EASE },
  },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

export const wordReveal = {
  hidden: { y: '112%', opacity: 0, filter: 'blur(6px)' },
  show: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE },
  },
};

export const wordRevealMobile = {
  hidden: { y: '70%', opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: EASE },
  },
};

export const viewportOnce = { once: true, margin: '-15%' };
