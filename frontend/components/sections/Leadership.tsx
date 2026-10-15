import Image from "next/image";
import { SITE } from "@/lib/site";
import { Reveal } from "../Reveal";
import { ButtonLink } from "../ui";

export function Leadership() {
  return (
    <section
      id="leadership"
      data-nav="about"
      aria-labelledby="leadership-title"
      className="relative isolate overflow-hidden bg-navy text-white"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,#081a2c_0%,#0b2239_38%,#17476e_72%,#3b86b3_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_85%_15%,rgba(141,211,206,0.28),transparent_70%)]"
      />

      <div className="container-x grid items-center gap-10 pt-16 pb-12 sm:pb-16 lg:min-h-[560px] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-8 lg:py-0">
        <Reveal className="lg:max-w-[470px] lg:py-20">
          <p className="eyebrow !text-accent">Leadership</p>
          <span className="rule mt-4" aria-hidden />
          <h2
            id="leadership-title"
            data-g="split"
            className="display mt-6 text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15]"
          >
            Building Better
            <br />
            Cardiac Care
          </h2>
          <p className="mt-6 text-[14.5px] font-light leading-[1.9] text-white/75">
            As Managing Director of {SITE.hospital} and Chief of Cardiovascular Sciences, he is
            committed to strengthening cardiovascular services and building a healthcare
            institution for the region.
          </p>
          <div className="mt-8">
            <ButtonLink href="#contact" variant="outline-light">
              Learn More
            </ButtonLink>
          </div>
        </Reveal>

        <div className="relative flex justify-end self-end">
          <Image
            src="/images/medstar-hospitals.webp"
            alt="Medstar Hospitals building in Vijayawada, where Dr. B. Vijaya Chaitanya is Managing Director"
            width={1800}
            height={1521}
            sizes="(min-width: 1024px) 56vw, 100vw"
            data-g="parallax"
            data-speed="0.03"
            data-scale="1"
            className="h-auto w-full max-w-[760px] drop-shadow-[0_30px_50px_rgba(0,0,0,0.4)] [mask-image:linear-gradient(to_right,transparent_0%,#000_8%,#000_92%,transparent_100%)]"
          />
        </div>
      </div>
    </section>
  );
}
