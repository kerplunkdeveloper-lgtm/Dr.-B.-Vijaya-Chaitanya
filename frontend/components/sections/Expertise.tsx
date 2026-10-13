import { EXPERTISE } from "@/lib/site";
import { ArrowRight, HeartPulseIcon, ImagingIcon, ValveIcon, VesselIcon } from "../icons";
import { Reveal } from "../Reveal";

const icons = {
  coronary: HeartPulseIcon,
  structural: ValveIcon,
  imaging: ImagingIcon,
  peripheral: VesselIcon,
} as const;

export function Expertise() {
  return (
    <section
      id="expertise"
      data-nav="expertise"
      aria-labelledby="expertise-title"
      className="relative bg-white py-16 md:py-20 lg:py-24"
    >
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <p data-g="reveal" className="eyebrow">
              Clinical Expertise
            </p>
            <span data-g="reveal" className="rule mt-4" aria-hidden />
            <h2
              id="expertise-title"
              data-g="split"
              className="display mt-6 text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] text-ink"
            >
              Advanced Care
              <br />
              for Complex Conditions.
            </h2>
          </div>
        
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5">
          {EXPERTISE.map((item, i) => {
            const Icon = icons[item.id];
            return (
              <Reveal as="li" key={item.id} delay={i * 90}>
                <article className="card group relative flex h-full flex-col overflow-hidden p-7 transition-[border-color,box-shadow] duration-500 hover:border-secondary/50 hover:shadow-[0_30px_60px_-34px_rgba(23,84,134,0.35)]">
                  {/* teal highlight that draws across on hover */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-0.75 w-12 bg-secondary transition-[width] duration-500 group-hover:w-full"
                  />
                  <div className="flex items-start justify-between">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-secondary-deep transition-colors duration-500 group-hover:bg-secondary group-hover:text-white">
                      <Icon />
                    </span>
                    <span aria-hidden className="text-[12px] font-light tracking-[0.2em] text-slate/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-8 text-[19px] font-normal leading-[1.3] tracking-[-0.01em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[13.5px] font-light leading-[1.8] text-slate">
                    {item.description}
                  </p>

                  <a
                    href="#contact"
                    aria-label={`Consult about ${item.title}`}
                    className="focus-ring mt-8 inline-flex w-fit items-center gap-2 text-[13px] font-medium text-primary transition-colors hover:text-secondary-deep"
                  >
                    Consult
                    <ArrowRight
                      width={15}
                      height={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </a>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
