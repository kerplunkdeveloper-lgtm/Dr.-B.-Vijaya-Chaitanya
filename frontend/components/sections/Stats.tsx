import { STATS } from "@/lib/site";
import { EcgLine } from "../art/EcgLine";
import { WaveLines } from "../art/WaveLines";
import { Odometer } from "../Odometer";
import { Reveal } from "../Reveal";

export function Stats() {
  return (
    <section
      id="experience"
      data-nav="experience"
      aria-labelledby="experience-title"
      className="relative isolate overflow-hidden bg-navy py-16 md:py-20 lg:py-24 text-white"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_90%_at_50%_0%,rgba(64,159,157,0.24),transparent_70%),radial-gradient(50%_70%_at_100%_100%,rgba(23,84,134,0.45),transparent_70%)]"
      />
      <WaveLines
        uid="st-l"
        className="pointer-events-none absolute -bottom-2 -left-4 -z-10 hidden h-[55%] w-[34%] opacity-40 md:block"
        stroke="#8dd3ce"
        flipY
      />
      <WaveLines
        uid="st-r"
        className="pointer-events-none absolute -right-4 -top-2 -z-10 hidden h-[45%] w-[30%] opacity-30 md:block"
        stroke="#8dd3ce"
        flipX
      />
    
     

      <div className="container-x">
        <Reveal className="text-center">
          <h2
            id="experience-title"
            className="text-[11px] font-medium uppercase tracking-[0.32em] text-accent"
          >
            A career measured in experience
          </h2>
          <span aria-hidden className="mx-auto mt-5 block h-0.5 w-9 rounded-full bg-secondary" />
        </Reveal>

        <dl className="mt-12 grid gap-y-2 lg:mt-16 lg:grid-cols-5 lg:gap-y-0 lg:divide-x lg:divide-white/10">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 70}
              className="flex items-baseline justify-between gap-6 border-b border-white/10 py-5 last:border-b-0 lg:flex-col lg:items-center lg:justify-start lg:gap-0 lg:border-b-0 lg:px-4 lg:py-3"
            >
              <dd className="text-[clamp(2.1rem,3.6vw,3.6rem)] font-semibold leading-none tracking-tight text-white filter-[drop-shadow(0_0_22px_rgba(141,211,206,0.32))]">
                <Odometer value={s.value} />
              </dd>
              <span aria-hidden className="mt-5 hidden h-0.5 w-7 rounded-full bg-secondary lg:block" />
              <dt className="text-right text-[13px] font-light text-white/70 lg:mt-4 lg:text-center lg:text-[12.5px]">
                {s.label}
              </dt>
            </Reveal>
          ))}
        </dl>

      </div>
    </section>
  );
}
