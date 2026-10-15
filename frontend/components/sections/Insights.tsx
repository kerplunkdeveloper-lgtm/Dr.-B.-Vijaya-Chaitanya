"use client";

import { useState, useRef } from "react";
import { EcgLine } from "../art/EcgLine";
import { Reveal } from "../Reveal";

const VIDEO_SRC =
  "https://res.cloudinary.com/drnmkhg5o/video/upload/v1791657181/vision_1_w6e2gu.mp4";

export function Insights() {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoFailed || !videoRef.current) return;
    const v = videoRef.current;
    if (v.paused) {
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoError = () => {
    setVideoFailed(true);
    setIsPlaying(false);
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-r from-[#eef4fa] to-[#cbe0f5] py-16 md:py-24 lg:py-32">
      {/* Background radial glow behind the video */}
      <div
        aria-hidden
        className="absolute -right-20 top-1/2 -z-10 h-150 w-150 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.8),transparent)] blur-3xl"
      />
      
      {/* Background ECG */}
      <EcgLine
        uid="insights-ecg"
        className="pointer-events-none absolute inset-x-0 bottom-1/4 -z-10 h-21 w-full opacity-50 mix-blend-overlay md:h-35"
      />

      <div className="container-x relative z-10 grid gap-10 md:grid-cols-2 md:items-center lg:gap-14">
        {/* Left Content */}
        <div className="flex max-w-xl flex-col justify-center">
          <Reveal>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[12px] font-semibold tracking-[0.2em] text-[#0066cc] uppercase">
                Insights
              </span>
              <span className="h-0.5 w-10 bg-[#0066cc]" aria-hidden />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="mb-4 text-[clamp(2.2rem,3.8vw,2.9rem)] font-semibold leading-[1.18] text-[#051126]">
              The <span className="text-[#0066cc]">Cardiologist&apos;s</span> View
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p className="mb-5 text-[clamp(1.05rem,1.6vw,1.3rem)] font-semibold text-[#1a2b49]">
              Straight answers to questions about the heart.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="space-y-3.5 text-[15px] font-medium leading-relaxed text-[#4b5c76] md:text-[16px]">
              <p>
                Medical information can be complicated.
                <br />
                Understanding it shouldn&apos;t be.
              </p>
              <p>
                The Insights section brings together practical perspectives on cardiovascular disease, procedures, prevention and advances in interventional cardiology.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Right side — Video panel */}
        <Reveal delay={200} className="relative w-full">
          <div
            onClick={!videoFailed ? togglePlay : undefined}
            className={`group relative mx-auto flex h-[380px] sm:h-[430px] md:h-[470px] w-full items-center justify-center overflow-hidden rounded-3xl border border-white/15 bg-[#051126] shadow-[0_20px_50px_-15px_rgba(0,102,204,0.25)] transition-all duration-500 hover:shadow-[0_25px_60px_-12px_rgba(0,102,204,0.35)] ${!videoFailed ? "cursor-pointer" : "cursor-default"}`}
          >
            {/* ---------- VIDEO (shown when loaded OK) ---------- */}
            {!videoFailed && (
              <>
                {/* Ambient blurred backdrop */}
                <video
                  ref={bgVideoRef}
                  src={VIDEO_SRC}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-hidden="true"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover blur-2xl opacity-40 scale-110"
                />
                {/* Dark overlay */}
                <div className="pointer-events-none absolute inset-0 bg-[#051126]/35" aria-hidden="true" />
                {/* Main video */}
                <video
                  ref={videoRef}
                  src={VIDEO_SRC}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  onError={handleVideoError}
                  className="relative z-10 h-full w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
                  aria-label="Insights video presentation"
                />
                {/* Paused overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0066cc] text-white shadow-xl transition-transform hover:scale-110">
                      <svg className="h-8 w-8 translate-x-0.5 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ---------- PLACEHOLDER (shown when video fails) ---------- */}
            {videoFailed && (
              <>
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(0,102,204,0.22)_0%,transparent_65%)] animate-[pulse_6s_ease-in-out_infinite]" />
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(56,189,248,0.12)_0%,transparent_60%)]" />
                <svg aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 w-full opacity-20" viewBox="0 0 800 60" preserveAspectRatio="none">
                  <polyline fill="none" stroke="#38bdf8" strokeWidth="2" points="0,30 100,30 120,5 140,55 160,30 220,30 240,10 260,50 280,30 400,30 420,8 440,52 460,30 560,30 580,12 600,48 620,30 720,30 740,6 760,54 780,30 800,30">
                    <animate attributeName="stroke-dasharray" values="0 800;800 0" dur="4s" repeatCount="indefinite" />
                  </polyline>
                </svg>
                <div className="relative z-10 flex flex-col items-center gap-4 select-none">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#0066cc]/50 bg-[#0066cc]/20 shadow-[0_0_40px_rgba(0,102,204,0.35)] backdrop-blur-sm">
                    <svg className="h-9 w-9 translate-x-0.5 fill-[#38bdf8] drop-shadow-lg" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-[13px] font-medium tracking-wide text-white/50">Video Unavailable</p>
                </div>
                <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
              </>
            )}

            {/* Top Pill Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-[#051126]/75 px-3 py-1.5 text-[11px] font-semibold text-white/95 backdrop-blur-md border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0066cc] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38bdf8]" />
              </span>
              Clinical Insights
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="flex items-center gap-1.5 rounded-full bg-[#051126]/70 px-3 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-md border border-white/20 transition-all hover:bg-[#0066cc] hover:text-white"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <>
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                className="flex items-center gap-2 rounded-full bg-[#051126]/80 px-3.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-md border border-white/20 shadow-md transition-all duration-300 hover:bg-[#0066cc] hover:scale-105"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                    <span>Unmute</span>
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5 text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span>Sound On</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
