"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";
import { Reveal } from "../Reveal";
import { ArrowRight } from "../icons";

export interface FAQItem {
  id: string;
  number: string;
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    number: "01",
    question: "Who is Dr. B. Vijaya Chaitanya?",
    answer:
      "Dr. B. Vijaya Chaitanya is an Interventional Cardiologist, Managing Director of Medstar Hospitals and Chief of Cardiovascular Sciences.",
  },
  {
    id: "faq-2",
    number: "02",
    question: "Where does Dr. Vijaya Chaitanya practise?",
    answer:
      "He is associated with Medstar Hospitals in Tadepalli, Vijayawada, Andhra Pradesh.",
  },
  {
    id: "faq-3",
    number: "03",
    question: "What is Dr. Vijaya Chaitanya's speciality?",
    answer:
      "His primary speciality is Interventional Cardiology, with expertise in coronary interventions, complex coronary disease, structural heart interventions, peripheral vascular interventions and cardiac device implantation.",
  },
  {
    id: "faq-4",
    number: "04",
    question: "How experienced is Dr. Vijaya Chaitanya?",
    answer:
      "He has over 13 years of experience in cardiovascular medicine. His documented procedural experience includes more than 26,000 coronary angiograms, 12,000 coronary angioplasties and 11,000 peripheral interventions.",
  },
  {
    id: "faq-5",
    number: "05",
    question: "What procedures does Dr. Vijaya Chaitanya perform?",
    answer:
      "His listed expertise includes coronary angiography, coronary angioplasty, primary PCI, complex coronary interventions, left main and bifurcation stenting, IVUS/OCT-guided procedures, FFR assessment, pacemaker implantation, ICD and CRT implantation, peripheral vascular interventions and structural heart interventions.",
  },
  {
    id: "faq-6",
    number: "06",
    question: "Does Dr. Vijaya Chaitanya have TAVI training?",
    answer:
      "Yes. His professional profile lists a Fellowship in TAVI from Medanta, Delhi.",
  },
  {
    id: "faq-7",
    number: "07",
    question: "What are Dr. Vijaya Chaitanya's qualifications?",
    answer:
      "He holds an MBBS, MD in General Medicine and DM in Cardiology. He also holds FACC and FIC credentials and has undertaken specialised training in TAVI.",
  },
];

export function FAQ() {
  // First item open by default for immediate context
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      data-nav="faq"
      aria-labelledby="faq-title"
      className="relative bg-offwhite py-16 sm:py-20 md:py-24 lg:py-28"
    >
      <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 xl:gap-20">
        {/* Left Side: Sticky Intro & Clinic Information */}
        <div className="lg:sticky lg:top-[108px] lg:self-start">
          <p data-g="reveal" className="eyebrow">
            Frequently Asked Questions
          </p>
          <span data-g="reveal" className="rule mt-4" aria-hidden />

          <h2
            id="faq-title"
            data-g="split"
            className="display mt-6 text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.18] text-ink"
          >
            Clear answers.
            <br />
            Thoughtful care.
          </h2>

          <p data-g="reveal" className="mt-5 max-w-[460px] text-[14.5px] font-light leading-[1.9] text-slate">
            Direct information regarding Dr. B. Vijaya Chaitanya’s background, hospital affiliation, clinical expertise, and specialized cardiovascular qualifications.
          </p>

          {/* Elegant assistance prompt */}
          <div data-g="reveal" className="mt-8 pt-8 border-t border-line/80 max-w-[440px]">
            <p className="text-[12px] font-medium tracking-[0.05em] uppercase text-secondary-deep">
              Have another question?
            </p>
            <p className="mt-2 text-[13.5px] font-light leading-relaxed text-slate">
              For appointments, clinical consultations, or second opinions, you can connect directly with the cardiology desk at {SITE.hospital}.
            </p>
            <a
              href="#contact"
              className="focus-ring group mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-primary transition-colors hover:text-secondary-deep"
            >
              Contact Clinic
              <ArrowRight width={14} height={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Right Side: Clean, Elegant Accordion */}
        <div className="flex flex-col gap-3.5 sm:gap-4">
          {FAQS.map((faq, index) => {
            const isOpen = openId === faq.id;
            const itemId = `faq-item-${faq.id}`;

            return (
              <Reveal
                key={faq.id}
                delay={index * 40}
                className={`group relative overflow-hidden rounded-[20px] border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isOpen
                    ? "border-secondary/40 bg-white shadow-[0_16px_36px_-18px_rgba(16,42,67,0.12)] ring-1 ring-secondary/20"
                    : "border-line/75 bg-white/90 hover:border-slate/30 hover:bg-white hover:shadow-[0_8px_20px_-12px_rgba(16,42,67,0.06)]"
                }`}
              >
                {/* Header / Clickable Trigger */}
                <button
                  type="button"
                  id={`${itemId}-btn`}
                  aria-expanded={isOpen}
                  aria-controls={`${itemId}-panel`}
                  onClick={() => toggleItem(faq.id)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 sm:p-6 text-left select-none focus-ring"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4.5 pr-2">
                    {/* Minimal Index Number */}
                    <span
                      className={`text-[12px] font-medium tracking-wider transition-colors duration-300 ${
                        isOpen ? "text-secondary-deep font-semibold" : "text-slate/60 group-hover:text-slate"
                      }`}
                      aria-hidden="true"
                    >
                      {faq.number}
                    </span>

                    {/* Question text */}
                    <h3
                      className={`text-[16px] sm:text-[17.5px] font-medium leading-[1.4] transition-colors duration-300 ${
                        isOpen ? "text-primary font-semibold" : "text-ink group-hover:text-primary"
                      }`}
                    >
                      {faq.question}
                    </h3>
                  </div>

                  {/* Elegant morphing plus/minus icon */}
                  <span
                    className={`relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen
                        ? "rotate-45 border-secondary bg-secondary text-white shadow-xs"
                        : "border-line bg-offwhite text-slate group-hover:border-secondary/40 group-hover:text-ink"
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>

                {/* Smooth Animated Collapsible Content */}
                <div
                  id={`${itemId}-panel`}
                  role="region"
                  aria-labelledby={`${itemId}-btn`}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen
                          ? "opacity-100 translate-y-0 pb-6 pt-1 sm:pb-7"
                          : "opacity-0 -translate-y-2 pb-0 pt-0"
                      }`}
                    >
                      <div className="mx-5 sm:mx-6 border-t border-line/50 pt-4 pl-7 sm:pl-8">
                        <p className="text-[14.5px] sm:text-[15px] font-light leading-[1.85] text-slate">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
