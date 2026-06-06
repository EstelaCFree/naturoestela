import { LogoWatermark } from "@/features/home/components/LogoWatermark";

type StatCard = {
  value: string;
  label: string;
  color: string;
  dotColor: string;
  borderColor: string;
  gradient: string;
  radius: string;
};

const stats: StatCard[] = [
  {
    value: "+700",
    label: "Alumnos y alumnas formados",
    color: "text-lavender-elegant",
    dotColor: "bg-lavender-elegant",
    borderColor: "border-[rgba(160,154,194,0.13)]",
    gradient:
      "linear-gradient(138.81deg, rgba(160,154,194,0.18) 0%, rgba(160,154,194,0.06) 100%)",
    radius:
      "rounded-tl-[40px] rounded-tr-[12px] rounded-br-[32px] rounded-bl-[8px]",
  },
  {
    value: "+500",
    label: "Asesoramientos personalizados",
    color: "text-forest-green",
    dotColor: "bg-forest-green",
    borderColor: "border-[rgba(26,94,92,0.13)]",
    gradient:
      "linear-gradient(138.81deg, rgba(26,94,92,0.12) 0%, rgba(71,199,204,0.08) 100%)",
    radius:
      "rounded-tl-[8px] rounded-tr-[40px] rounded-br-[12px] rounded-bl-[32px]",
  },
  {
    value: "+18",
    label: "Años de experiencia",
    color: "text-gold",
    dotColor: "bg-gold",
    borderColor: "border-[rgba(210,150,73,0.13)]",
    gradient:
      "linear-gradient(141.93deg, rgba(210,150,73,0.14) 0%, rgba(217,203,184,0.1) 100%)",
    radius:
      "rounded-tl-[32px] rounded-tr-[8px] rounded-br-[40px] rounded-bl-[12px]",
  },
  {
    value: "+10",
    label: "Años en mi herbolario",
    color: "text-[#a58776]",
    dotColor: "bg-[#a58776]",
    borderColor: "border-[rgba(165,135,118,0.13)]",
    gradient:
      "linear-gradient(141.93deg, rgba(165,135,118,0.14) 0%, rgba(196,188,176,0.08) 100%)",
    radius:
      "rounded-tl-[12px] rounded-tr-[32px] rounded-br-[8px] rounded-bl-[40px]",
  },
];

export function AboutStats() {
  return (
    <section className="bg-warm-ivory py-20 lg:py-28 relative overflow-hidden">
      <LogoWatermark side="left" top="0%" size={700} opacity={0.04} />
      <div className="mx-auto max-w-6xl px-6 lg:px-12 relative z-10">
        <p className="text-xs font-medium tracking-[0.1em] uppercase text-lavender-elegant text-center mb-16">
          En cifras
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className={`border ${stat.borderColor} ${stat.radius} p-8 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0px_12px_32px_0px_rgba(0,0,0,0.12)]`}
              style={{ background: stat.gradient }}
            >
              <div className={`size-2 rounded-full ${stat.dotColor} mb-6`} />
              <p
                className={`font-serif font-light text-5xl lg:text-6xl leading-none mb-3 ${stat.color}`}
              >
                {stat.value}
              </p>
              <p className="text-taupe text-sm leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
