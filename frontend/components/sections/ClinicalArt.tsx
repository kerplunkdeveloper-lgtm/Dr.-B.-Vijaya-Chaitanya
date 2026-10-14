import React from "react";

/* ------------------------------------------------------------------------- */
/* 1. PROCEDURE ICONS (Used inside the circular mint badges)                */
/* ------------------------------------------------------------------------- */

export function ProcedureIcon({ id, className = "w-6 h-6" }: { id: string; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (id) {
    case "structural-heart":
      return (
        <svg {...common}>
          {/* Heart outline with internal valve lines */}
          <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
          <path d="M12 6v6" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );

    case "tavi-tavr":
      return (
        <svg {...common}>
          {/* Tri-leaflet aortic valve representation */}
          <circle cx="12" cy="12" r="9" />
          <path d="M12 12L12 3" />
          <path d="M12 12L4.2 16.5" />
          <path d="M12 12L19.8 16.5" />
          <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );

    case "tmvr":
      return (
        <svg {...common}>
          {/* Bi-leaflet mitral valve representation */}
          <circle cx="12" cy="12" r="9" />
          <path d="M6 8c3 2.5 9 2.5 12 0" />
          <path d="M6 16c3-2.5 9-2.5 12 0" />
          <line x1="12" y1="3" x2="12" y2="21" strokeDasharray="2 2" />
        </svg>
      );

    case "primary-angioplasty":
      return (
        <svg {...common}>
          {/* Artery tube with balloon catheter & stent cross-mesh */}
          <path d="M3 8c6 0 12 0 18 0M3 16c6 0 12 0 18 0" />
          <rect x="7" y="6.5" width="10" height="11" rx="2" fill="currentColor" fillOpacity="0.15" />
          <line x1="7" y1="7" x2="17" y2="17" />
          <line x1="17" y1="7" x2="7" y2="17" />
          <line x1="2" y1="12" x2="22" y2="12" strokeDasharray="1 2" />
        </svg>
      );

    case "peripheral-vascular":
      return (
        <svg {...common}>
          {/* Lower limb silhouette with arterial vascular branch */}
          <path d="M8 3v8c0 4-2 7-2 10" />
          <path d="M16 3v8c0 4 2 7 2 10" />
          <path d="M12 3v7" />
          <path d="M12 10l-3 4m3-4l3 4" />
          <circle cx="12" cy="10" r="1.5" fill="currentColor" />
        </svg>
      );

    case "renal-angioplasty":
      return (
        <svg {...common}>
          {/* Pair of kidneys with renal arteries */}
          <path d="M8 8c-2.5 0-4.5 2-4.5 4.5s1.5 5.5 4.5 6.5c1.5.5 2-.5 2-2v-7c0-1.5-.5-2-2-2z" />
          <path d="M16 8c2.5 0 4.5 2 4.5 4.5s-1.5 5.5-4.5 6.5c-1.5.5-2-.5-2-2v-7c0-1.5.5-2 2-2z" />
          <path d="M10 13h4" />
          <line x1="12" y1="4" x2="12" y2="20" strokeDasharray="2 2" />
        </svg>
      );

    case "femoral-angioplasty":
      return (
        <svg {...common}>
          {/* Femoral arterial tree down the leg */}
          <path d="M10 3c0 6-2 10-2 18" />
          <path d="M14 3c0 6 2 10 2 18" />
          <path d="M12 5v14" strokeWidth="2" />
          <path d="M12 10l-3 3m3 2l3 3" />
        </svg>
      );

    case "aortic-interventions":
      return (
        <svg {...common}>
          {/* Aorta arch curvature with supra-aortic vessel branches */}
          <path d="M7 21v-8a5 5 0 0 1 10 0v8" />
          <path d="M10 8V3m4 5V3m-7 6L5 5" />
          <path d="M7 16h10" strokeDasharray="2 2" />
        </svg>
      );

    case "asd-vsd-closure":
      return (
        <svg {...common}>
          {/* Septal defect double-disc closure device in heart */}
          <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
          <ellipse cx="12" cy="12" rx="4" ry="1.5" fill="currentColor" fillOpacity="0.25" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );

    case "pacemaker-implantation":
      return (
        <svg {...common}>
          {/* Pacemaker generator capsule and pacing lead wire */}
          <rect x="4" y="6" width="11" height="13" rx="4" />
          <circle cx="9.5" cy="12.5" r="2.5" />
          <path d="M15 9h3a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2" />
        </svg>
      );

    case "icd-implantation":
      return (
        <svg {...common}>
          {/* ICD defibrillator pulse / lightning discharge symbol */}
          <rect x="4" y="5" width="10" height="14" rx="3.5" />
          <path d="M16 8l5 4l-4 1l4 4" />
          <path d="M9 8l-2 4h4l-2 5" fill="currentColor" />
        </svg>
      );

    case "rotablation-atherectomy":
      return (
        <svg {...common}>
          {/* Rotational diamond burr tip & guidewire */}
          <line x1="2" y1="12" x2="22" y2="12" />
          <ellipse cx="12" cy="12" rx="5" ry="3.5" fill="currentColor" fillOpacity="0.2" />
          <path d="M10 9.5l4 5m0-5l-4 5" />
        </svg>
      );

    case "ivus-oct-guided":
      return (
        <svg {...common}>
          {/* Intravascular ultrasound circular sonar ring / beam */}
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" strokeDasharray="2 2" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <line x1="12" y1="3" x2="12" y2="7" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <line x1="3" y1="12" x2="7" y2="12" />
          <line x1="17" y1="12" x2="21" y2="12" />
        </svg>
      );

    case "cardiac-transplant":
      return (
        <svg {...common}>
          {/* Heart cradled in gentle healing hands */}
          <path d="M12 14.5l-3.5-3.5a2.5 2.5 0 0 1 3.5-3.5a2.5 2.5 0 0 1 3.5 3.5l-3.5 3.5z" fill="currentColor" fillOpacity="0.2" />
          <path d="M4 18c1.5-2 3.5-3 5-3h6c1.5 0 3.5 1 5 3" />
          <path d="M6 15l-3 3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2l-3-3" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8m-4-4h8" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------------- */
/* 2. ANATOMICAL WATERMARK SKETCHES (Top-Right corner of each card)          */
/* Soft pencil-graphite / warm sepia lines that feel hand-drawn & medical   */
/* ------------------------------------------------------------------------- */

export function WatermarkSketch({ id, className = "w-28 h-28" }: { id: string; className?: string }) {
  const common = {
    viewBox: "0 0 120 120",
    fill: "none",
    stroke: "#79aed2",
    strokeWidth: "1.1",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: `${className} pointer-events-none select-none transition-all duration-500`,
  };

  switch (id) {
    case "structural-heart":
      return (
        <svg {...common}>
          {/* Classical anatomical heart drawing with aorta & pulmonary artery */}
          <path d="M60 25 C50 15 35 15 25 28 C15 42 20 65 42 85 C52 94 58 100 60 102 C62 100 68 94 78 85 C100 65 105 42 95 28 C85 15 70 15 60 25 Z" strokeDasharray="1.5 1.5" />
          <path d="M48 24 C48 12 55 8 60 8 C65 8 72 12 72 24" />
          <path d="M54 8 V3 M60 8 V3 M66 8 V3" />
          <path d="M72 18 C78 18 84 22 86 28" />
          <ellipse cx="60" cy="52" rx="14" ry="18" strokeDasharray="2 2" />
          <path d="M50 48 Q60 42 70 48" />
          <path d="M52 56 Q60 62 68 56" />
          <path d="M60 38 V66" strokeWidth="0.8" />
        </svg>
      );

    case "tavi-tavr":
      return (
        <svg {...common}>
          {/* TAVI diamond mesh catheter stent frame */}
          <rect x="36" y="22" width="48" height="76" rx="10" strokeDasharray="3 3" />
          {/* Stent diamond cell pattern */}
          <path d="M36 35 L60 22 L84 35 L60 48 Z" />
          <path d="M36 60 L60 48 L84 60 L60 72 Z" />
          <path d="M36 85 L60 72 L84 85 L60 98 Z" />
          <ellipse cx="60" cy="22" rx="24" ry="7" />
          <ellipse cx="60" cy="98" rx="24" ry="7" />
          {/* Inner tri-leaflet valve cusps */}
          <path d="M44 48 Q60 68 76 48" strokeWidth="1.5" />
          <path d="M60 48 V80" strokeWidth="1.2" />
        </svg>
      );

    case "tmvr":
      return (
        <svg {...common}>
          {/* Transcatheter mitral valve apparatus & D-shaped frame */}
          <path d="M32 40 C32 25 88 25 88 40 C88 65 78 88 60 96 C42 88 32 65 32 40 Z" />
          <path d="M38 42 C45 32 75 32 82 42" strokeDasharray="2 2" />
          {/* Anterior & posterior leaflets */}
          <path d="M42 46 C52 64 68 64 78 46" strokeWidth="1.4" />
          <path d="M46 62 C55 76 65 76 74 62" />
          {/* Subvalvular chordae tendineae */}
          <line x1="50" y1="64" x2="44" y2="86" strokeDasharray="1.5 2" />
          <line x1="60" y1="68" x2="60" y2="88" strokeDasharray="1.5 2" />
          <line x1="70" y1="64" x2="76" y2="86" strokeDasharray="1.5 2" />
        </svg>
      );

    case "primary-angioplasty":
      return (
        <svg {...common}>
          {/* Coronary artery with expanding balloon catheter and stent struts */}
          <path d="M15 35 C35 38 42 45 60 45 C78 45 85 38 105 35" strokeWidth="1.3" />
          <path d="M15 85 C35 82 42 75 60 75 C78 75 85 82 105 85" strokeWidth="1.3" />
          {/* Angioplasty balloon */}
          <rect x="36" y="44" width="48" height="32" rx="8" strokeDasharray="2 2" />
          {/* Diamond stent mesh */}
          <path d="M36 60 L48 45 L60 60 L72 45 L84 60" />
          <path d="M36 60 L48 75 L60 60 L72 75 L84 60" />
          {/* Central catheter guidewire */}
          <line x1="10" y1="60" x2="110" y2="60" strokeWidth="1.8" />
        </svg>
      );

    case "peripheral-vascular":
      return (
        <svg {...common}>
          {/* Pelvis and lower limb vascular bifurcation */}
          <path d="M60 15 V38" strokeWidth="2.5" />
          <path d="M60 38 Q50 50 42 70 T36 105" strokeWidth="2" />
          <path d="M60 38 Q70 50 78 70 T84 105" strokeWidth="2" />
          {/* Arterial side branches */}
          <path d="M44 65 Q35 75 32 90" strokeDasharray="2 2" />
          <path d="M76 65 Q85 75 88 90" strokeDasharray="2 2" />
          <circle cx="60" cy="38" r="4" strokeDasharray="2 1" />
        </svg>
      );

    case "renal-angioplasty":
      return (
        <svg {...common}>
          {/* Aorta with left & right renal arteries entering kidneys */}
          <line x1="60" y1="12" x2="60" y2="108" strokeWidth="2.8" />
          {/* Left renal artery */}
          <path d="M60 55 C48 55 38 52 28 58" strokeWidth="1.8" />
          <path d="M28 35 C18 35 12 45 12 58 C12 72 18 82 28 82 C34 82 36 72 36 62 C36 50 34 35 28 35 Z" />
          {/* Right renal artery */}
          <path d="M60 58 C72 58 82 55 92 62" strokeWidth="1.8" />
          <path d="M92 38 C102 38 108 48 108 62 C108 76 102 86 92 86 C86 86 84 76 84 66 C84 54 86 38 92 38 Z" />
          {/* Stent in renal artery */}
          <rect x="42" y="52" width="12" height="6" rx="2" strokeDasharray="1.5 1.5" />
        </svg>
      );

    case "femoral-angioplasty":
      return (
        <svg {...common}>
          {/* Femoral artery branching down the leg */}
          <path d="M38 18 C46 35 54 55 56 75 T62 108" strokeWidth="2.2" />
          <path d="M48 38 Q65 48 76 72 T82 105" strokeWidth="1.6" />
          {/* Profunda femoris branches */}
          <path d="M52 50 C44 65 38 80 34 98" strokeDasharray="2 2" />
          <ellipse cx="56" cy="74" rx="4" ry="12" strokeDasharray="1.5 1.5" />
        </svg>
      );

    case "aortic-interventions":
      return (
        <svg {...common}>
          {/* Thoracic aorta arch and abdominal descending aorta */}
          <path d="M42 98 V55 C42 32 78 32 78 55 V98" strokeWidth="3" />
          {/* Brachiocephalic, Carotid, Subclavian arteries */}
          <path d="M52 34 V14 M60 32 V12 M68 34 V16" strokeWidth="1.6" />
          {/* Endovascular stent graft lines */}
          <line x1="42" y1="62" x2="78" y2="62" strokeDasharray="2 2" />
          <line x1="42" y1="72" x2="78" y2="72" strokeDasharray="2 2" />
          <line x1="42" y1="82" x2="78" y2="82" strokeDasharray="2 2" />
        </svg>
      );

    case "asd-vsd-closure":
      return (
        <svg {...common}>
          {/* Four chambers sketch with septal occluder disc in septum */}
          <path d="M60 25 C45 15 25 22 25 45 C25 75 55 95 60 98 C65 95 95 75 95 45 C95 22 75 15 60 25 Z" strokeDasharray="2 2" />
          {/* Interatrial & interventricular septum */}
          <line x1="60" y1="32" x2="60" y2="88" strokeWidth="2.2" />
          {/* Septal occluder device (waist & 2 discs) */}
          <ellipse cx="60" cy="54" rx="14" ry="6" fill="#788a94" fillOpacity="0.1" />
          <ellipse cx="60" cy="54" rx="4" ry="8" />
          <ellipse cx="54" cy="54" rx="3" ry="10" />
          <ellipse cx="66" cy="54" rx="3" ry="10" />
        </svg>
      );

    case "pacemaker-implantation":
      return (
        <svg {...common}>
          {/* Pacemaker generator can + lead wire entering right ventricle */}
          <rect x="25" y="24" width="42" height="48" rx="16" strokeWidth="1.6" />
          <circle cx="46" cy="48" r="8" strokeDasharray="2 2" />
          {/* Header block and pacing lead */}
          <path d="M46 24 V16 C46 12 60 12 64 16 L88 42 C96 52 96 72 82 85 L74 92" strokeWidth="1.8" />
          {/* Tined lead tip */}
          <circle cx="74" cy="92" r="3" />
          <line x1="72" y1="90" x2="68" y2="86" />
          <line x1="76" y1="94" x2="80" y2="98" />
        </svg>
      );

    case "icd-implantation":
      return (
        <svg {...common}>
          {/* ICD device with shock vector coil */}
          <rect x="26" y="22" width="46" height="52" rx="18" strokeWidth="1.8" />
          <path d="M49 38 L43 50 H53 L47 62" strokeWidth="1.6" fill="#788a94" fillOpacity="0.2" />
          {/* Defibrillation lead coil */}
          <path d="M60 22 C64 15 76 15 82 22 Q94 38 92 62 T78 94" strokeWidth="1.8" />
          {/* High voltage shock coil lines */}
          <path d="M86 52 L94 56 M85 58 L93 62 M84 64 L92 68 M82 70 L90 74" strokeWidth="2.2" />
        </svg>
      );

    case "rotablation-atherectomy":
      return (
        <svg {...common}>
          {/* High-speed rotational atherectomy olive-shaped diamond burr */}
          <line x1="10" y1="60" x2="110" y2="60" strokeWidth="1.5" />
          <ellipse cx="60" cy="60" rx="22" ry="15" strokeWidth="1.8" fill="#788a94" fillOpacity="0.08" />
          {/* Diamond micro-chips on front hemisphere */}
          <path d="M48 52 L54 56 M44 60 L52 60 M48 68 L54 64" strokeWidth="1.5" />
          <path d="M56 48 L62 52 M56 72 L62 68" strokeWidth="1.5" />
          {/* Rotational motion arrows */}
          <path d="M75 42 C82 46 86 54 84 64" strokeDasharray="2 2" />
          <path d="M85 64 L82 59 L88 60" />
        </svg>
      );

    case "ivus-oct-guided":
      return (
        <svg {...common}>
          {/* Concentric cross-sectional tomographic imaging scan rings */}
          <circle cx="60" cy="60" r="46" strokeDasharray="3 3" />
          <circle cx="60" cy="60" r="34" strokeWidth="1.4" />
          <circle cx="60" cy="60" r="22" strokeDasharray="2 2" />
          <circle cx="60" cy="60" r="8" strokeWidth="1.8" fill="#788a94" fillOpacity="0.2" />
          {/* Arterial plaque deposit crescent */}
          <path d="M26 60 A34 34 0 0 1 76 28 C64 36 48 46 44 64 Z" fill="#788a94" fillOpacity="0.25" stroke="none" />
          {/* Radial calibration crosshairs */}
          <line x1="60" y1="10" x2="60" y2="110" strokeDasharray="1 3" />
          <line x1="10" y1="60" x2="110" y2="60" strokeDasharray="1 3" />
        </svg>
      );

    case "cardiac-transplant":
      return (
        <svg {...common}>
          {/* Heart cradled gently between protective medical hands */}
          <path d="M60 30 C52 20 40 20 32 30 C22 42 28 62 48 80 L60 90 L72 80 C92 62 98 42 88 30 C80 20 68 20 60 30 Z" strokeWidth="1.4" />
          {/* Left supporting hand */}
          <path d="M18 78 C24 72 35 68 46 72 L54 78 C42 88 30 92 18 88 Z" strokeDasharray="2 2" />
          {/* Right supporting hand */}
          <path d="M102 78 C96 72 85 68 74 72 L66 78 C78 88 90 92 102 88 Z" strokeDasharray="2 2" />
          {/* Spark of renewed vitality */}
          <path d="M60 44 V58 M53 51 H67" strokeWidth="1.2" />
        </svg>
      );

    default:
      return null;
  }
}

/* ------------------------------------------------------------------------- */
/* 3. HEADER ECG WAVE & GOLDEN HEART SKETCH                                  */
/* ------------------------------------------------------------------------- */

export function HeaderEcgHeartArt({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center overflow-visible select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 420 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Blue / Light Cyan vibrant gradient replacing the orange/gold */}
          <linearGradient id="header-blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#175486" stopOpacity="0.6" />
            <stop offset="30%" stopColor="#0284c7" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="1" />
          </linearGradient>

          <filter id="header-blue-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ------------------------------------------------------------- */}
        {/* 1. SOFT BACKGROUND AURA WAVE LINES (Silky flow lines)         */}
        {/* ------------------------------------------------------------- */}
        <g stroke="#bae6fd" strokeOpacity="0.35" strokeWidth="1" fill="none">
          <path d="M 80 20 C 160 10, 240 45, 330 25 C 380 15, 410 30, 420 25" />
          <path d="M 100 45 C 180 30, 260 70, 350 48 C 390 38, 415 55, 420 45" />
          <path d="M 120 75 C 200 65, 270 100, 360 85 C 395 78, 415 90, 420 85" strokeOpacity="0.2" />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* 2. REALISTIC ANATOMICAL HUMAN HEART ETCHING (Fine Hatching)  */}
        {/* Positioned behind the looping heart on the right side         */}
        {/* ------------------------------------------------------------- */}
        <g transform="translate(290, 58) scale(0.68) translate(-100, -100)" stroke="#749ebc" strokeWidth="1.1" opacity="0.35" fill="none">
          {/* Aortic Arch & Superior Vessels at the top */}
          <path d="M 85 45 C 85 20, 105 10, 120 10 C 135 10, 146 22, 142 45" strokeWidth="1.6" />
          <path d="M 100 10 V 2 M 115 10 V 2 M 130 12 V 4" strokeWidth="1.5" />
          <path d="M 64 42 V 22 C 64 16, 72 16, 72 22 V 40" strokeWidth="1.4" />
          {/* Pulmonary artery trunk */}
          <path d="M 115 48 C 122 36, 145 36, 162 44" strokeWidth="1.5" />
          {/* Atria and Ventricles Main Silhouette */}
          <path
            d="M 105 50 
               C 88 30, 62 28, 48 48 
               C 30 70, 38 112, 76 148 
               C 94 164, 104 172, 107 175 
               C 110 172, 120 164, 138 148 
               C 176 112, 184 70, 166 48 
               C 152 28, 126 30, 109 50 Z"
            strokeDasharray="2 2"
          />
          {/* Left ventricle muscle curve */}
          <path d="M 107 175 C 135 145, 160 115, 155 80" strokeWidth="1.3" />
          {/* Anterior interventricular coronary artery & branches */}
          <path d="M 108 65 Q 102 105, 118 152" stroke="#0284c7" strokeWidth="1.6" strokeOpacity="0.75" />
          <path d="M 108 92 Q 92 110, 80 125" strokeDasharray="1.5 2" stroke="#0284c7" strokeOpacity="0.6" />
          <path d="M 112 115 Q 128 126, 138 138" strokeDasharray="1.5 2" stroke="#0284c7" strokeOpacity="0.6" />
          <path d="M 105 78 Q 88 90, 75 100" strokeDasharray="1.5 2" stroke="#0284c7" strokeOpacity="0.6" />
          {/* Fine anatomical muscle striation hatching */}
          <path d="M 60 70 L 68 76 M 55 85 L 65 92 M 52 102 L 64 110" strokeWidth="0.8" />
          <path d="M 148 70 L 140 76 M 153 85 L 143 92 M 156 102 L 144 110" strokeWidth="0.8" />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* 3. DYNAMIC ECG WAVEFORM (Baseline exactly at y=60)             */}
        {/* Tall R spike, deep S dip matching the reference image          */}
        {/* ------------------------------------------------------------- */}
        <path
          d="M 0 60 
             L 50 60 
             L 56 65 
             L 66 12 
             L 76 98 
             L 84 60 
             Q 96 48, 108 60 
             L 155 60"
          stroke="url(#header-blue-gradient)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#header-blue-glow)"
        />

        {/* ------------------------------------------------------------- */}
        {/* 4. LOOPING RIBBON HEART (With crossover loop at the bottom)    */}
        {/* Center: x=215, y=60. Seamlessly connected to ECG line.        */}
        {/* ------------------------------------------------------------- */}
        <g filter="url(#header-blue-glow)">
          {/* Main outer ribbon heart outline with bottom crossover loop */}
          <path
            d="M 155 60 
               C 152 42, 164 22, 186 22 
               C 200 22, 210 32, 215 40 
               C 220 32, 230 22, 244 22 
               C 266 22, 278 42, 275 62 
               C 270 85, 245 104, 222 114 
               C 214 118, 206 112, 210 102 
               C 214 92, 228 82, 240 72 
               L 205 108 
               C 195 116, 185 108, 190 98 
               C 195 86, 206 72, 215 60"
            stroke="url(#header-blue-gradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Inner metallic accent heart stroke */}
          <path
            d="M 166 58 
               C 164 45, 172 30, 188 30 
               C 198 30, 208 38, 215 46 
               C 222 38, 232 30, 242 30 
               C 258 30, 268 45, 264 60 
               C 258 78, 238 94, 218 104"
            stroke="#7dd3fc"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.7"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}
