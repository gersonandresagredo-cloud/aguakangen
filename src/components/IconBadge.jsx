/**
 * Insignia circular con degradado suave detrás del icono — evita el look
 * "icono lucide suelto" y da un acabado más cuidado y coherente en toda la web.
 */
export default function IconBadge({ icon: Icon, size = 40, iconSize = 17, dark = false, className = '' }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full flex-none ${className}`}
      style={{
        width: size,
        height: size,
        background: dark
          ? 'linear-gradient(140deg, rgba(127,224,240,.16), rgba(99,102,241,.1))'
          : 'linear-gradient(140deg, rgba(28,169,201,.12), rgba(99,102,241,.08))',
        border: dark ? '1px solid rgba(127,224,240,.16)' : '1px solid rgba(28,169,201,.1)',
      }}
    >
      <Icon style={{ width: iconSize, height: iconSize }} className={dark ? 'text-aqua-glow' : 'text-aqua-deep'} />
    </span>
  );
}
