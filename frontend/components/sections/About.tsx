import Image from "next/image";
import { FEATURES } from "@/lib/site";
import { BuildingHeartIcon, HeartHandIcon, HeartPulseIcon } from "../icons";
import { Reveal } from "../Reveal";
import { ButtonLink, CircleLink } from "../ui";

const featureIcons = {
  excellence: HeartPulseIcon,
  patient: HeartHandIcon,
  leadership: BuildingHeartIcon,
} as const;

export function About() {
  return (
    <section
      id="about"
      data-nav="about"
      aria-labelledby="about-title"
      className="relative isolate overflow-hidden bg-offwhite pb-12 pt-6 lg:py-0"
    >
      <div className="lg:grid lg:min-h-155 lg:grid-cols-[1.08fr_1fr]">
        {/* portrait */}
        <div className="relative mx-5 aspect-4/3.5 overflow-hidden rounded-2xl sm:mx-8 sm:aspect-video lg:mx-0 lg:aspect-auto lg:rounded-none">
          <Image
            src="/images/dr-chaitanya-cathlab.webp"
            alt="Dr. B. Vijaya Chaitanya in the cardiac catheterisation laboratory at Medstar Hospitals"
            fill
            sizes="(min-width: 1024px) 55vw, 92vw"
            data-g="parallax" data-speed="0.06" className="object-cover object-[50%_22%]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-offwhite/70 to-transparent lg:hidden"
          />
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 hidden w-1/4 bg-linear-to-l from-offwhite/40 to-transparent lg:block"
          />
        </div>

        {/* copy */}
        <Reveal className="about-panel relative z-10 bg-offwhite lg:-ml-28 lg:flex lg:flex-col lg:justify-center lg:py-20 lg:pl-32 lg:pr-12 xl:pr-20">
          <div className="container-x lg:mx-0 lg:max-w-140 lg:p-0">
            <blockquote className="mt-2 flex items-end justify-between gap-5 lg:hidden">
              <p className="font-serif text-[19px] leading-[1.45] text-ink">
                “Combining experience with contemporary techniques to make every decision more
                deliberate.”
              </p>
              <CircleLink href="#expertise" label="See areas of expertise" size={40} />
            </blockquote>

            <p className="eyebrow mt-10 lg:mt-0">About</p>
            <h2
              id="about-title"
              data-g="split"
              className="display mt-4 text-[clamp(1.7rem,2.7vw,2.5rem)] leading-[1.18]"
            >
              A Cardiologist.
              <br />A Healthcare Leader.
            </h2>
            <p className="mt-5 text-[14px] font-light leading-[1.9] text-slate lg:mt-6">
              With over 13 years of experience in cardiovascular medicine, Dr. B. Vijaya Chaitanya
              specialises in interventional cardiology, with expertise spanning complex coronary
              interventions, primary PCI, structural heart interventions, advanced cardiac imaging
              and peripheral vascular procedures.
            </p>
            <div className="mt-8">
              <ButtonLink href="#journey">More About Dr. Chaitanya</ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>

    
    </section>
  );
}
