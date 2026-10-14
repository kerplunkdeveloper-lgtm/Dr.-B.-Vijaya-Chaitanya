import Image from "next/image";
import { Reveal } from "../Reveal";
import { ButtonLink, CircleLink } from "../ui";

const ABOUT_POINTS = [
  "Dr. B. Vijaya Chaitanya represents a perspective on healthcare that extends beyond the practice of medicine. As an Interventional Cardiologist and Managing Director of Medstar Hospitals, his professional identity brings together the precision of clinical decision-making and the larger responsibility of building healthcare capabilities.",
  "For him, cardiovascular medicine is about more than understanding a condition or performing a procedure. It demands the ability to assess complexity, evaluate possibilities and make decisions that are appropriate for the individual patient. In a field where technology continues to expand the boundaries of treatment, the real value lies in knowing how to apply that progress with sound clinical judgement.",
  "Yet, the impact of medicine is never limited to the clinical setting. Every decision affects a person, a family and their understanding of what lies ahead. This human dimension is what makes healthcare both a scientific discipline and a profound responsibility.",
  "It is this perspective that makes his role at Medstar Hospitals particularly significant. As a clinician, his focus is on cardiovascular care. As a healthcare leader, his responsibilities extend to the wider environment in which that care is delivered: the capabilities of clinical teams, the development of specialised services, the role of technology and the systems that support better-informed medical decisions.",
  "In Vijayawada and across Andhra Pradesh, the continued development of specialised healthcare presents an important opportunity to bring advanced medical capabilities closer to the communities that need them. Through his leadership at Medstar Hospitals, Dr. Vijaya Chaitanya is part of this evolving landscape, where the ambition extends beyond individual clinical practice towards building an institution with the potential to serve a broader community.",
  "His journey reflects a larger idea: that expertise becomes even more meaningful when it contributes to something beyond the individual. The future of healthcare will be shaped not only by advances in medicine, but also by the people who bring clinical knowledge, thoughtful leadership and a long-term vision together.",
  "For Dr. B. Vijaya Chaitanya, the opportunity lies in that intersection: advancing cardiovascular care while helping build the capabilities that will define what healthcare can become.",
] as const;

export function About() {
  return (
    <section
      id="about"
      data-nav="about"
      aria-labelledby="about-title"
      className="relative isolate bg-offwhite pb-16 pt-6 lg:py-0"
    >
      <div className="lg:grid lg:grid-cols-[1.08fr_1fr] lg:items-start">
        {/* portrait: stays fixed/sticky on desktop while scrolling right-side points */}
        <div className="relative mx-5 aspect-4/3.5 overflow-hidden rounded-2xl sm:mx-8 sm:aspect-video lg:sticky lg:top-0 lg:mx-0 lg:aspect-auto lg:h-screen lg:max-h-230 lg:min-h-150 lg:self-start lg:rounded-none">
          <Image
            src="/images/dr-chaitanya-cathlab.webp"
            alt="Dr. B. Vijaya Chaitanya in the cardiac catheterisation laboratory at Medstar Hospitals"
            fill
            sizes="(min-width: 1024px) 55vw, 92vw"
            className="object-cover object-[50%_22%]"
            priority={false}
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

        {/* copy with tick points */}
        <Reveal className="about-panel relative z-10 bg-offwhite lg:-ml-28 lg:flex lg:flex-col lg:justify-center lg:py-20 lg:pl-32 lg:pr-12 xl:pr-20">
          <div className="container-x lg:mx-0 lg:max-w-160 lg:p-0">
            <blockquote className="mt-2 flex items-end justify-between gap-5 lg:hidden">
              <p className="text-[17px] sm:text-[19px] leading-[1.45] text-ink">
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

            <div className="mt-6 space-y-4 lg:mt-8 lg:space-y-5">
              {ABOUT_POINTS.map((text, idx) => (
                <div key={idx} className="flex items-start gap-3.5 sm:gap-4">
                  <span
                    className="mt-1 flex h-5 w-5 sm:h-5.5 sm:w-5.5 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary shadow-xs"
                    aria-hidden
                  >
                    <svg
                      className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="2.8 7.2 5.6 10 11.2 4" />
                    </svg>
                  </span>
                  <p className="text-[13.5px] sm:text-[14px] lg:text-[14.5px] font-normal leading-[1.85] text-slate">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-2">
              <ButtonLink href="#journey">More About Dr. Chaitanya</ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
