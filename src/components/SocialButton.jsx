/**
 * Chip de red social: insignia circular con degradado de marca + etiqueta.
 * Reutilizado en "Sobre mí" (claro) y en el footer (oscuro/glass).
 */
export default function SocialButton({ href, icon: Icon, label, gradient, dark = false }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="hover"
      className={`group inline-flex items-center gap-2.5 pl-[5px] pr-[18px] py-[5px] rounded-full text-[14px] font-medium transition-transform duration-300 hover:-translate-y-0.5 ${
        dark
          ? 'bg-white/6 border border-white/12 text-white/85 backdrop-blur-md'
          : 'bg-bg-light border border-black/6 text-ink shadow-[0_2px_10px_rgba(10,20,24,0.04)]'
      }`}
    >
      <span
        className="w-9 h-9 rounded-full flex items-center justify-center flex-none transition-transform duration-300 group-hover:scale-105"
        style={{ background: gradient }}
      >
        <Icon className="w-[15px] h-[15px] text-white" strokeWidth={2} />
      </span>
      {label}
    </a>
  );
}
