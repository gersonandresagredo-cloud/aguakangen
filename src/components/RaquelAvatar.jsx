/** Avatar circular con la foto real de Raquel, con punto de "en línea" opcional. */
export default function RaquelAvatar({ size = 40, dot = false, ring = false }) {
  return (
    <span
      className="relative rounded-full overflow-hidden flex-none inline-block"
      style={{ width: size, height: size, boxShadow: ring ? '0 0 0 1.5px rgba(127,224,240,.45)' : undefined }}
    >
      <img
        src="/assets/raquel2.png"
        alt="Raquel Rodríguez"
        className="w-full h-full object-cover"
        style={{ objectPosition: '52% 18%' }}
      />
      {dot && (
        <span
          className="absolute bottom-0 right-0 rounded-full bg-[#39d98a] border-2 border-dark"
          style={{ width: Math.max(9, size * 0.28), height: Math.max(9, size * 0.28) }}
        />
      )}
    </span>
  );
}
