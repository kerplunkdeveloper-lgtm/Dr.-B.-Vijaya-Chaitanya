import Image from "next/image";
import { SHOWCASE } from "@/lib/site";

type PanelId = (typeof SHOWCASE)[number]["id"];

const SHOWCASE_MEDIA: Record<
  PanelId,
  { src: string; alt: string; objectClass: string }
> = {
  cathlab: {
    src: "/images/dr-chaitanya-cathlab.webp",
    alt: "Interventional cardiology suite (cath lab) at Medstar Hospitals with Dr. B. Vijaya Chaitanya",
    objectClass: "object-cover object-[50%_18%]",
  },
  heart: {
    src: "/images/showcase-heart.jpg",
    alt: "3D anatomical rendering of human heart and illuminated coronary artery network",
    objectClass: "object-cover object-center",
  },
  coronary: {
    src: "/images/showcase-coronary.jpg",
    alt: "Complex coronary angioplasty with expanding micro-lattice drug-eluting stent",
    objectClass: "object-cover object-center",
  },
  structural: {
    src: "/images/showcase-structural.jpg",
    alt: "TAVI transcatheter aortic valve replacement deployed within aortic root",
    objectClass: "object-cover object-center",
  },
  imaging: {
    src: "/images/showcase-imaging.jpg",
    alt: "Advanced high-definition IVUS and OCT coronary lumen plaque analysis",
    objectClass: "object-cover object-center",
  },
  peripheral: {
    src: "/images/showcase-peripheral.jpg",
    alt: "Digital subtraction angiography (DSA) of peripheral lower limb vascular intervention",
    objectClass: "object-cover object-center",
  },
  hospital: {
    src: "/images/medstar-hospitals.webp",
    alt: "Medstar Hospitals cardiovascular centre building, Vijayawada",
    objectClass: "object-contain object-bottom",
  },
};

function PanelMedia({
  id,
  priority = false,
  loading,
}: {
  id: PanelId;
  priority?: boolean;
  loading?: "eager" | "lazy";
}) {
  if (id === "hospital") {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#1e3a5f_0%,#0b1626_70%)]">
        <Image
          src="/images/medstar-hospitals.webp"
          alt="Medstar Hospitals building, Vijayawada"
          fill
          priority={priority}
          loading={priority ? undefined : loading}
          sizes="(min-width: 1024px) 40vw, 80vw"
          className="object-contain object-bottom px-6 pb-2 pt-8 transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
    );
  }

  const media = SHOWCASE_MEDIA[id];
  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      priority={priority}
      loading={priority ? undefined : loading}
      sizes="(min-width: 1024px) 40vw, 80vw"
      className={`${media.objectClass} transition-transform duration-700 ease-out group-hover:scale-105`}
    />
  );
}

/** per-panel widths give the track an editorial rhythm on desktop */
const widths = [
  "lg:w-[min(38vw,620px)]",
  "lg:w-[min(26vw,430px)]",
  "lg:w-[min(30vw,480px)]",
  "lg:w-[min(26vw,430px)]",
  "lg:w-[min(30vw,480px)]",
  "lg:w-[min(26vw,430px)]",
  "lg:w-[min(38vw,620px)]",
];

export function Showcase() {
  const total = String(SHOWCASE.length).padStart(2, "0");
  return (
    <section
      id="showcase"
      data-nav="about"
      aria-labelledby="showcase-title"
      data-showcase
      className="relative isolate overflow-x-clip bg-navy text-white"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_15%_0%,#17476e_0%,transparent_70%),radial-gradient(60%_50%_at_90%_100%,#134a52_0%,transparent_70%)]" />

      <div
        data-showcase-pin
        className="py-16 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0 lg:pt-[var(--header-h)]"
      >
        <div className="container-x">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div data-g="reveal">
              <p className="eyebrow !text-accent">Clinical Showcase</p>
              <span className="rule mt-3 !bg-accent" aria-hidden />
              <h2
                id="showcase-title"
                data-g="split"
                className="display mt-5 text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.15]"
              >
                Precision, seen up close.
              </h2>
            </div>
            <p data-g="reveal" data-delay="120" className="max-w-[360px] text-[13.5px] font-light leading-[1.85] text-white/70">
              A closer look at the procedures, imaging and care environment behind every
              decision.
              <span className="mt-2 block text-[11px] text-white/45">
                Procedure visuals are illustrative.
              </span>
            </p>
          </div>
        </div>

        <ul
          data-showcase-track
          className="no-scrollbar mt-9 flex snap-x snap-mandatory items-center gap-4 overflow-x-auto px-5 pb-4 sm:px-8 lg:mt-12 lg:w-max lg:snap-none lg:gap-6 lg:overflow-visible lg:px-[max(3rem,calc((100vw-1320px)/2+3rem))] lg:pb-0"
        >
          {SHOWCASE.map((p, i) => (
            <li
              key={p.id}
              data-showcase-panel
              className={`group relative isolate h-[430px] w-[76vw] max-w-[420px] shrink-0 snap-center overflow-hidden rounded-[26px] bg-[#0b0f17] shadow-[0_40px_70px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/10 lg:h-[min(48vh,520px)] lg:max-w-none ${widths[i]} ${
                i % 2 ? "lg:translate-y-7" : "lg:-translate-y-5"
              }`}
            >
              <div data-panel-media className="absolute -inset-x-[12%] inset-y-0">
                <PanelMedia id={p.id} loading={i < 3 ? "eager" : "lazy"} />
              </div>
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-[#03060a]/95 via-[#03060a]/30 to-transparent pointer-events-none"
              />
              <span
                aria-hidden
                className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10.5px] font-medium tracking-[0.2em] text-white/90 backdrop-blur-md shadow-sm"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <h3 className="font-serif text-[20px] font-normal leading-snug text-white lg:text-[22px]">
                  {p.title}
                </h3>
                <p className="mt-2 max-w-[320px] text-[13px] font-light leading-relaxed text-white/80">
                  {p.caption}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="container-x mt-10 hidden items-center gap-6 lg:flex" aria-hidden>
          <span className="w-[72px] text-[12px] tracking-[0.2em] text-white/80">
            <span data-showcase-count>01</span> / {total}
          </span>
          <span className="relative h-px flex-1 bg-white/15">
            <span
              data-showcase-progress
              className="absolute inset-0 origin-left bg-accent"
            />
          </span>
          <span className="text-[11px] tracking-[0.25em] text-white/50">SCROLL</span>
        </div>
        <p className="container-x mt-2 text-[11px] tracking-[0.2em] text-white/45 lg:hidden">
          SWIPE →
        </p>
      </div>
    </section>
  );
}
