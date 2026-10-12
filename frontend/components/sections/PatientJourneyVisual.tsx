"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export function PatientJourneyVisual() {
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      {/* Main Interactive Card */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        aria-label="Open full patient journey roadmap"
        className="group relative mt-8 sm:mt-10 aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-[24px] sm:rounded-[28px] border border-slate-200/90 bg-white shadow-[0_20px_50px_-25px_rgba(16,42,67,0.3)] transition-all duration-300 hover:border-secondary/40 hover:shadow-[0_30px_70px_-25px_rgba(16,42,67,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
      >
        {/* Parallax Container & Image */}
        <div data-g="parallax" data-speed="0.04" className="absolute inset-0">
          <Image
            src="/images/patient-journey.png"
            alt="The Patient Journey - A Journey Towards Better Heart Health"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            priority={false}
          />
        </div>

        {/* Subtle Top-Right Expand Pill */}
        <div className="absolute right-3.5 top-3.5 z-10 flex items-center gap-1.5 rounded-full border border-white/30 bg-navy/75 px-3 py-1.5 text-[11px] font-medium tracking-wide text-white shadow-md backdrop-blur-md transition-all duration-200 group-hover:bg-navy group-hover:scale-105">
          <svg
            className="h-3.5 w-3.5 text-secondary-light"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
          <span>Full View</span>
        </div>

        {/* Bottom Hover Hint Bar */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-linear-to-t from-navy/80 via-navy/40 to-transparent p-4 opacity-90 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
          <p className="text-[12px] font-medium text-white/95">
            Click to expand full interactive pathway
          </p>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
            </svg>
          </span>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Patient Journey Fullscreen View"
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 p-3 sm:p-6 md:p-8 backdrop-blur-md transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-[#0f233a] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-secondary anim-glow" />
                <h3 className="text-sm sm:text-base font-semibold text-white">
                  The Patient Journey — Towards Better Heart Health
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close dialog"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="relative aspect-[16/9] w-full bg-black/40">
              <Image
                src="/images/patient-journey.png"
                alt="The Patient Journey - A Journey Towards Better Heart Health"
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-center"
                priority
              />
            </div>

            {/* Modal Footer with Pathway Milestones */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-navy/80 px-5 py-3 text-xs text-white/80 sm:px-6">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="font-semibold text-white">4 Key Phases:</span>
                <span className="rounded-md bg-white/10 px-2 py-0.5">1. Consultation</span>
                <span>→</span>
                <span className="rounded-md bg-white/10 px-2 py-0.5">2. Diagnosis & Testing</span>
                <span>→</span>
                <span className="rounded-md bg-white/10 px-2 py-0.5">3. Treatment Plan</span>
                <span>→</span>
                <span className="rounded-md bg-white/10 px-2 py-0.5">4. Ongoing Care</span>
              </div>

              <span className="text-[11px] text-white/50">Press ESC or click outside to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
