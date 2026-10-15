"use client";

import { useState, useEffect } from "react";
import { CLINICAL_PROCEDURES, ClinicalProcedure } from "@/lib/clinical-expertise-data";
import { HeaderEcgHeartArt, ProcedureIcon, WatermarkSketch } from "./ClinicalArt";
import { ArrowRight, CloseIcon } from "../icons";

export function Expertise() {
  const [selected, setSelected] = useState<ClinicalProcedure | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    if (selected) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected]);

  // First 12 items (rows 1-4, 3 items each)
  const firstTwelve = CLINICAL_PROCEDURES.slice(0, 12);
  // Last 2 items (row 5, centered)
  const lastTwo = CLINICAL_PROCEDURES.slice(12, 14);

  return (
    <section
      id="expertise"
      data-nav="expertise"
      aria-labelledby="expertise-heading"
      className="relative bg-[#f4f9fd] py-16 md:py-24 border-t border-[#dce8f3] overflow-hidden"
    >
      {/* Subtle light blue radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_12%,rgba(2,132,199,0.08)_0%,transparent_55%)]"
      />

      <div className="container-x relative z-10">
        {/* ========================================================= */}
        {/* SECTION HEADER                                            */}
        {/* ========================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-10 md:pb-14 border-b border-[#dce8f3]">
          <div className="max-w-3xl">
            {/* Small tracking uppercase eyebrow */}
            <p className="text-[11px] sm:text-[12px] font-semibold tracking-[0.28em] uppercase text-[#0284c7] mb-3">
              SPECIALISED CARDIAC CARE
            </p>

            {/* Main Headline + Blue ECG Heartbeat Wave — Locked on single center line */}
            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4">
              <h2
                id="expertise-heading"
                className="text-[38px] sm:text-[50px] lg:text-[60px] leading-none tracking-tight font-bold inline-flex items-center gap-x-3"
              >
                <span className="text-[#0f2942] font-bold">
                  Clinical
                </span>
                <span className="font-normal text-[#0284c7]">
                  Expertise
                </span>
              </h2>

              {/* Seamless Blue ECG Wave connected to Heart */}
              <HeaderEcgHeartArt className="h-12 sm:h-15 lg:h-18 self-center -my-2" />
            </div>

            {/* Subtitle */}
            <p className="mt-3.5 sm:mt-4 text-[14px] sm:text-[15px] text-[#476882] font-light leading-relaxed max-w-2xl">
              Advanced cardiovascular care, guided by precision and individual assessment.
            </p>
          </div>

          {/* Far Right Stacked Mottos */}
          <div
            aria-hidden="true"
            className="hidden lg:flex flex-col text-right text-[10px] sm:text-[10.5px] tracking-[0.25em] text-[#7095b2] font-medium leading-[2.1] uppercase shrink-0 pb-1"
          >
            <span>PRECISION</span>
            <span>EXPERIENCE</span>
            <span>BETTER OUTCOMES</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PROCEDURES GRID (Rows 1 to 4: 3 columns each)              */}
        {/* ========================================================= */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {firstTwelve.map((proc) => (
            <ProcedureCard
              key={proc.id}
              procedure={proc}
              onSelect={() => setSelected(proc)}
            />
          ))}
        </div>

        {/* ========================================================= */}
        {/* ROW 5: 2 CARDS CENTERED HORIZONTALLY (13 & 14)             */}
        {/* Perfectly matches the width of the 3-column cards above    */}
        {/* ========================================================= */}
        <div className="mt-5 lg:mt-6 flex flex-wrap justify-center gap-5 lg:gap-6">
          {lastTwo.map((proc) => (
            <div key={proc.id} className="w-full md:w-[calc(50%-10px)] lg:w-[calc((100%-48px)/3)]">
              <ProcedureCard
                procedure={proc}
                onSelect={() => setSelected(proc)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* PROCEDURE DETAIL MODAL (Displays user-provided articles)   */}
      {/* ========================================================= */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 bg-[#091e32]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-white border border-[#d2e4f3] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden text-ink animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-6 sm:p-8 bg-gradient-to-b from-[#eef6fc] to-white border-b border-[#d2e4f3]">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/90 border border-slate-200 text-[#476882] hover:text-[#0284c7] hover:bg-white flex items-center justify-center transition-colors shadow-xs"
                aria-label="Close dialog"
              >
                <CloseIcon width={18} height={18} />
              </button>

              {/* Watermark in modal header */}
              <div className="absolute top-2 right-14 w-28 h-28 opacity-25 pointer-events-none">
                <WatermarkSketch id={selected.id} className="w-full h-full" />
              </div>

              {/* Badge + Number */}
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#e0f2fe] border border-[#bae6fd] text-[#0284c7] flex items-center justify-center shrink-0">
                  <ProcedureIcon id={selected.id} className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[12px] tracking-wider uppercase text-[#0284c7] font-semibold">
                    Procedure {selected.number}
                  </span>
                  <p className="text-[11px] text-[#7095b2] uppercase tracking-wider font-medium">
                    Clinical Expertise
                  </p>
                </div>
              </div>

              {/* Title */}
              <h3
                id="modal-title"
                className="text-2xl sm:text-3xl font-semibold text-[#0f2942] mt-3 leading-snug"
              >
                {selected.title}
              </h3>
            </div>

            {/* Modal Body: Full In-depth Clinical Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-[14.5px] leading-relaxed text-[#33536d]">
              <h4 className="text-lg sm:text-xl font-semibold text-[#0f2942]">
                {selected.articleTitle}
              </h4>

              {selected.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-5 sm:p-6 bg-[#f3f8fd] border-t border-[#d2e4f3] flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-[13px] font-medium text-[#7095b2] hover:text-[#0f2942] transition-colors"
              >
                Back to Expertise
              </button>

              <a
                href="#contact"
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-2 rounded-full bg-[#175486] hover:bg-[#0284c7] px-5 py-2.5 text-[13px] font-medium text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
              >
                <span>Book Consultation for this Treatment</span>
                <ArrowRight width={14} height={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ========================================================================= */
/* INDIVIDUAL CARD COMPONENT                                                 */
/* Matches 100% exact design of the reference image                          */
/* ========================================================================= */
function ProcedureCard({
  procedure,
  onSelect,
}: {
  procedure: ClinicalProcedure;
  onSelect: () => void;
}) {
  return (
    <article className="group relative bg-white/95 hover:bg-white rounded-[22px] border border-[#d2e4f3] hover:border-[#38bdf8]/60 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_2px_12px_rgba(23,84,134,0.04)] hover:shadow-[0_18px_38px_-10px_rgba(2,132,199,0.18)] hover:-translate-y-1 overflow-hidden backdrop-blur-md">
      {/* Anatomical sketch watermark in top-right corner */}
      <div className="absolute top-2 right-2 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity duration-300">
        <WatermarkSketch id={procedure.id} className="w-full h-full" />
      </div>

      <div>
        {/* Top Row: Circular Light Blue Badge + Number & Title */}
        <div className="flex items-start gap-3.5 pr-14">
          {/* Circular Badge */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#e8f4fc] border border-[#bae6fd] text-[#0284c7] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300">
            <ProcedureIcon id={procedure.id} className="w-5.5 h-5.5" />
          </div>

          {/* Number & Procedure Title */}
          <div className="flex flex-col">
            <span className="text-[12px] sm:text-[13px] text-[#0284c7] font-semibold tracking-wider mb-1 leading-none">
              {procedure.number}
            </span>
            <h3 className="text-[17px] sm:text-[18px] font-semibold text-[#0f2942] leading-[1.3] group-hover:text-[#0284c7] transition-colors">
              {procedure.title}
            </h3>
          </div>
        </div>

        {/* Procedure Summary */}
        <p className="mt-4 text-[13px] sm:text-[13.5px] leading-[1.65] text-[#476882] font-light">
          {procedure.summary}
        </p>
      </div>

      {/* Action link */}
      <div className="mt-5 pt-2">
        <button
          type="button"
          onClick={onSelect}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0284c7] group-hover:text-[#175486] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0284c7] rounded"
        >
          <span>Explore treatment</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
}
