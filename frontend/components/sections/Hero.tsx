import Image from "next/image";
import { SITE } from "@/lib/site";
import { BuildingHeartIcon, HeartPulseIcon } from "../icons";
import { IntroVideo } from "../IntroVideo";
import { ButtonLink } from "../ui";

const LINES = ["Complex", "Hearts.", "Clearer", "Decisions."];



/**
 * Layout notes
 * - Desktop is a real two-column grid inside the shared container, so the copy and the
 *   portrait can never overlap and always line up with the header + every other section.
 * - The headline is sized by BOTH width and height so it fits short laptop screens
 *   (1366×768, 1280×720) as well as 1440p / 4K monitors.
 * - Depth: arch, portrait, heart and glass badges all drift at different speeds with the pointer
 *   (data-pointer) and with scroll (data-parallax-hero) — see Motion.tsx.
 */
export function Hero() {
  return (
    <section
        id="home"
        data-nav="home"
        aria-labelledby="hero-title"
        className="relative isolate overflow-hidden bg-white pt-(--header-h) lg:flex lg:h-[clamp(680px,100svh,950px)] lg:items-stretch lg:pt-0"
      >
        {/* soft clinical backdrop */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(75%_85%_at_74%_42%,#eaf6f5_0%,#ffffff_68%)]" />
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#175486_0.9px,transparent_0.9px)] bg-size-[26px_26px] mask-[radial-gradient(48%_62%_at_76%_42%,#000,transparent)]" />
          <div className="absolute -left-32 top-[8%] h-105 w-105 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-white to-transparent" />
        </div>

        <div className="container-x flex flex-col lg:grid lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:items-center lg:gap-8 xl:gap-12">
          {/* ---------- Visual: portrait + heart (first on mobile, right column on desktop) ---------- */}
          <div className="relative order-first -mx-5 h-96 sm:mx-0 sm:h-[480px] lg:order-last lg:h-[clamp(620px,86vh,840px)] lg:min-h-0">
            <div
              aria-hidden
              data-pointer="-8"
              className="absolute inset-x-[10%] bottom-0 top-[4%] rounded-t-[999px] bg-linear-to-b from-[#d3ece9] via-mist to-white sm:inset-x-[16%] lg:inset-x-[6%] lg:top-[calc(var(--header-h)+0.5rem)] xl:inset-x-[10%]"
            />


            <div
              data-hero="portrait"
              data-parallax-hero="6"
              className="absolute inset-x-0 bottom-0 top-0 sm:inset-x-[6%] lg:inset-x-0 lg:top-[calc(var(--header-h)-0.25rem)]"
            >
              <div data-pointer="10" className="absolute inset-0">
                <Image
                  src="/images/dr-chaitanya-hero.webp"
                  alt="Dr. B. Vijaya Chaitanya, interventional cardiologist and Managing Director of Medstar Hospitals, Vijayawada"
                  fill
                  priority
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-contain object-bottom drop-shadow-[0_30px_40px_rgba(16,42,67,0.18)] mask-[linear-gradient(to_right,transparent_0%,#000_6%,#000_94%,transparent_100%)]"
                />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-white via-white/70 to-transparent lg:hidden" />

           
          </div>

          {/* ---------- Copy ---------- */}
          <div className="relative z-10 flex flex-col justify-center pb-8 pt-4 lg:py-[calc(var(--header-h)+1.5rem)]">
            <div>
              <div data-hero="meta" className="mt-2 lg:mt-0">
                <h1
                  id="hero-title"
                  className="text-[clamp(2rem,3vw,3.15rem)] font-bold tracking-tight text-primary leading-[1.18]"
                >
                  Dr. Borra Vijaya Chaitanya
                </h1>
                <p className="mt-2.5 text-[16.5px] sm:text-[18px] lg:text-[19px] font-medium tracking-wide text-secondary-deep">
                  MD., DM (Cardio) FACC, FIC
                </p>

                <ul className="mt-5 space-y-2 text-[16px] sm:text-[17.5px] font-normal leading-relaxed text-slate">
                  {SITE.titles.map((t) => (
                    <li key={t} className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" aria-hidden />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
                <div data-hero="cta" className="w-full sm:w-auto">
                  <ButtonLink href="#contact" className="w-full sm:w-auto px-7 py-3.5">
                    Book Appointment
                  </ButtonLink>
                </div>
                <div data-hero="cta">
                  <IntroVideo embedUrl={SITE.introVideoEmbedUrl} />
                </div>
              </div>

              <a
                href="#approach"
                data-hero="cta"
                className="focus-ring mt-8 hidden w-fit items-center gap-3 text-[12px] font-light text-slate lg:inline-flex [@media(max-height:820px)]:lg:hidden"
              >
                <span className="relative flex h-9 w-3.75 justify-center rounded-full border border-secondary/60">
                  <span className="anim-scroll-dot mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary" />
                </span>
                Scroll
              </a>
            </div>
          </div>
        </div>
      </section>
  );
}
