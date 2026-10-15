import { Heart3D } from "../Heart3D";

/**
 * 3D Cardiac Vasculature & Interventional Simulator
 *
 * Implements the clinical 3D simulation section with blueprint grid styling,
 * interactive Three.js coronary vasculature model, telemetry bar, feature cards,
 * and high-converting consultation CTA.
 */
export function Approach() {
  return (
    <section
      id="approach"
      data-nav="about"
      aria-labelledby="simulator-title"
      className="relative isolate overflow-hidden bg-[#f3f8fa] py-16 sm:py-20 lg:py-24"
    >
      

      {/* Top Heading & Subtitle */}
      <div className="container-x mx-auto max-w-5xl text-center">
        <h2
          id="simulator-title"
          className="font-bold tracking-tight text-3xl sm:text-4xl lg:text-[42px] leading-[1.18] text-[#0f233a] uppercase"
        >
          3D Cardiac Vasculature &amp;{" "}
          <span className="block text-[#dc2626]">Interventional Simulator</span>
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm sm:text-[15px] font-normal leading-relaxed text-slate-600">
          Cardiology requires understanding what lies beneath the surface. Interact with this clinical 3D
          simulation to explore coronary artery branches, test stent deployment, and observe real-time
          hemodynamic perfusion.
        </p>
      </div>

      {/* Main 3D Simulator Card */}
      <div className="container-x mx-auto mt-9 max-w-5xl sm:mt-11">
        <Heart3D />
      </div>

      {/* Four Feature Info Cards (Matching Reference Image) */}
      <div className="container-x mx-auto mt-8 max-w-5xl grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Coronary Vasculature */}
        <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-200 bg-teal-50 text-teal-600">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h4 className="mt-4 text-[14.5px] font-bold text-slate-900">Coronary Vasculature</h4>
          <p className="mt-1.5 text-xs font-normal leading-relaxed text-slate-500">
            Visualize the Left Anterior Descending (LAD) &quot;Widowmaker&quot;, Circumflex (LCx), and Right Coronary Artery (RCA).
          </p>
        </div>

        {/* Card 2: Stent & Angioplasty Simulator */}
        <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h4 className="mt-4 text-[14.5px] font-bold text-slate-900">Stent &amp; Angioplasty Simulator</h4>
          <p className="mt-1.5 text-xs font-normal leading-relaxed text-slate-500">
            Click &quot;Deploy Stent&quot; inside the model to watch catheter balloon expansion, plaque compression, and immediate blood flow restoration.
          </p>
        </div>

        {/* Card 3: Physiological Cardiac Cycle */}
        <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <h4 className="mt-4 text-[14.5px] font-bold text-slate-900">Physiological Cardiac Cycle</h4>
          <p className="mt-1.5 text-xs font-normal leading-relaxed text-slate-500">
            Experience mathematical double-beat systole and diastole rhythm (Lub-Dub) with interactive BPM frequency controls.
          </p>
        </div>

        {/* Card 4: Structural Heart & TAVI */}
        <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
          </div>
          <h4 className="mt-4 text-[14.5px] font-bold text-slate-900">Structural Heart &amp; TAVI</h4>
          <p className="mt-1.5 text-xs font-normal leading-relaxed text-slate-500">
            Inspect the aortic arch and aortic valve where transcatheter aortic valve implantation (TAVI/TAVR) procedures are executed.
          </p>
        </div>
      </div>

      {/* Red Call To Action Button (Matching Reference Image) */}
      <div className="container-x mx-auto mt-8 max-w-5xl text-center">
        <a
          href="#contact"
          className="group inline-flex w-full max-w-xl items-center justify-center gap-2.5 rounded-2xl bg-[#dc2626] px-8 py-4 text-center text-sm sm:text-base font-bold text-white shadow-xl shadow-red-600/25 transition-all hover:bg-[#b91c1c] active:scale-[0.99]"
        >
          <svg className="h-4 w-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span>Consult Dr. Vijaya Chaitanya for Angioplasty / TAVI</span>
          <span className="transition-transform group-hover:translate-x-1">➔</span>
        </a>
      </div>
    </section>
  );
}
