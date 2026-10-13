import { JOURNEY } from "@/lib/site";
import { BuildingHeartIcon, CapIcon, MedalIcon, ShieldStarIcon } from "../icons";
import { Reveal } from "../Reveal";
import { PatientJourneyVisual } from "./PatientJourneyVisual";

const icons: Record<string, React.ComponentType<any>> = {
  role: BuildingHeartIcon,
  career: BuildingHeartIcon,
  Career: BuildingHeartIcon,
  fellowship: MedalIcon,
  Fellowship: MedalIcon,
  advanced: ShieldStarIcon,
  Advanced: ShieldStarIcon,
  degree: CapIcon,
  Degree: CapIcon,
};

export function Journey() {
  return (
    <section
      id="journey"
      data-nav="journey"
      aria-labelledby="journey-title"
      className="relative bg-offwhite py-16 md:py-20 lg:py-28"
    >
      <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
        {/* ---- intro + visual (stays in view while the timeline scrolls) ---- */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p data-g="reveal" className="eyebrow">
            The Journey
          </p>
          <span data-g="reveal" className="rule mt-4" aria-hidden />
          <h2
            id="journey-title"
            data-g="split"
            className="display mt-6 max-w-130 text-[clamp(1.8rem,2.8vw,3.4rem)] leading-[1.2] text-ink"
          >
            A path shaped by learning, experience and a commitment to better care.
          </h2>

         
        </div>

        {/* ---- timeline ---- */}
        <ol className="relative">
          <span aria-hidden className="absolute bottom-3 left-2.75 top-3 w-px bg-line" />
          <span
            aria-hidden
            data-timeline-line
            className="absolute bottom-3 left-2.75 top-3 w-0.5 -translate-x-px rounded-full bg-secondary"
          />

          {JOURNEY.map((j, i) => {
            const Icon = icons[j.kind] || MedalIcon;
            const current = i === 0;
            return (
              <Reveal as="li" key={j.label} delay={i * 60} className="relative pb-10 pl-14 last:pb-0">
                <span
                  aria-hidden
                  className={`absolute left-0 top-4.5 flex h-5.75 w-5.75 items-center justify-center rounded-full border bg-white shadow-[0_0_0_6px_#f5f8fa] ${
                    current ? "border-secondary" : "border-secondary/40"
                  }`}
                >
                  <span
                    className={`rounded-full bg-secondary ${current ? "anim-glow h-2.75 w-2.75" : "h-2.25 w-2.25"}`}
                  />
                </span>

                <p className="text-[clamp(2.2rem,4vw,3.4rem)] font-light leading-none tracking-[-0.035em] text-ink">
                  {j.label}
                </p>

                <div className="card mt-4 flex items-start gap-4 p-5 sm:p-6">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist text-secondary-deep">
                    <Icon />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-medium leading-snug text-ink">{j.title}</h3>
                    {j.details.map((d) => (
                      <p key={d} className="mt-1.5 text-[13.5px] font-light leading-relaxed text-slate">
                        {d}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
