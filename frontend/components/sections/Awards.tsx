import Image from "next/image";
import { AWARDS } from "@/lib/site";
import { ShieldCrossIcon, ShieldHeartIcon, ShieldIcon, ShieldStarIcon } from "../icons";
import { Reveal } from "../Reveal";

const icons = {
  shield: ShieldIcon,
  cross: ShieldCrossIcon,
  heart: ShieldHeartIcon,
  star: ShieldStarIcon,
} as const;

export function Awards() {
  return (
    <section
      id="awards"
      data-nav="journey"
      aria-labelledby="awards-title"
      className="relative bg-white py-16 md:py-20 lg:py-24"
    >
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <p data-g="reveal" className="eyebrow">
              Awards &amp; Recognitions
            </p>
            <span data-g="reveal" className="rule mt-4" aria-hidden />
            <h2
              id="awards-title"
              data-g="split"
              className="display mt-6 max-w-[520px] text-[clamp(1.8rem,2.8vw,2.6rem)] leading-[1.2] text-ink"
            >
              Recognising a Commitment to Better Cardiac Care.
            </h2>
          </div>

          <Reveal className="group relative aspect-[4/3] overflow-hidden rounded-[28px] border border-slate-200/90 bg-mist shadow-[0_40px_70px_-44px_rgba(16,42,67,0.5)]">
            <div data-g="parallax" data-speed="0.05" className="absolute inset-0">
              <Image
                src="/images/awards-trophy.jpg"
                alt="Excellence in Interventional Cardiology - Dr. B. Vijaya Chaitanya"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                priority={false}
              />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-navy/40 to-transparent"
            />
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {AWARDS.map((a, i) => {
            const Icon = icons[a.icon];
            return (
              <Reveal as="li" key={a.title} delay={i * 80}>
                <div className="card group flex h-full items-center gap-4 p-5 transition-[border-color,box-shadow] duration-300 hover:border-secondary/50">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mist text-secondary-deep">
                    <Icon />
                  </span>
                  <p className="text-[13.5px] leading-snug text-ink">
                    <span className="block font-medium">{a.title}</span>
                    {"place" in a && (
                      <span className="mt-1 block text-[12.5px] font-light text-slate">{a.place}</span>
                    )}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
