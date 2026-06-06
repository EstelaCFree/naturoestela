type LogoWatermarkProps = {
  side?: "left" | "right";
  top?: string;
  rotation?: number;
  size?: number;
  opacity?: number;
};

export function LogoWatermark({
  side = "right",
  top = "20%",
  rotation = 0,
  size = 800,
  opacity = 0.04,
}: LogoWatermarkProps) {
  return (
    <div
      className="absolute pointer-events-none select-none overflow-hidden"
      style={{
        [side]: `-${size * 0.25}px`,
        top,
        width: size,
        height: size,
        opacity,
        transform: `rotate(${rotation}deg)`,
        zIndex: 0,
      }}
    >
      <img
        src="/assets/logo circular.png"
        alt=""
        aria-hidden="true"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
