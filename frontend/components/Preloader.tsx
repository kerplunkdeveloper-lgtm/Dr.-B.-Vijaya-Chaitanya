"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SITE } from "@/lib/site";

declare global {
  interface Window {
    __heartReady?: boolean;
  }
}

/**
 * Full-screen intro: a spinning ring around a pulsing heart plus a live loading counter.
 * It is part of the server HTML (so it is the very first thing painted) and is dismissed
 * once fonts, the hero portrait, the 3D heart and the window are ready (6s hard cap).
 * Dismissal = the ring collapses, then two navy shutters part to reveal the page.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const html = document.documentElement;
    html.classList.add("is-loading");

    const flags = { fonts: false, image: false, load: false };
    const weight = { fonts: 40, image: 35, load: 25 };
    const counter = root.querySelector<HTMLElement>("[data-pl-count]");
    const bar = root.querySelector<HTMLElement>("[data-pl-bar]");
    const started = performance.now();
    let shown = 0;
    let finished = false;
    let raf = 0;

    const onLoad = () => {
      flags.load = true;
    };

    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      flags.fonts = true;
    });
    const hero = document.querySelector<HTMLImageElement>('[data-hero="portrait"] img');
    if (hero) {
      (hero.complete ? Promise.resolve() : hero.decode())
        .catch(() => undefined)
        .then(() => {
          flags.image = true;
        });
    } else {
      flags.image = true;
    }
    if (document.readyState === "complete") flags.load = true;
    else window.addEventListener("load", onLoad, { once: true });

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      if (counter) counter.textContent = "100";
      if (bar) bar.style.transform = "scaleX(1)";

      const top = root.querySelector("[data-pl-top]");
      const bottom = root.querySelector("[data-pl-bottom]");
      const center = root.querySelector("[data-pl-center]");
      const ring = root.querySelector("[data-pl-ring]");
      gsap
        .timeline({
          onComplete: () => {
            html.classList.remove("is-loading");
            html.classList.add("is-loaded");
            window.dispatchEvent(new Event("site:loaded"));
            setDone(true);
          },
        })
        .to(ring, { scale: 1.25, opacity: 0, duration: 0.45, ease: "power2.in" }, 0.05)
        .to(center, { opacity: 0, y: -14, duration: 0.35, ease: "power2.in" }, 0.05)
        .to(top, { yPercent: -101, duration: 0.75, ease: "power3.inOut" }, 0.25)
        .to(bottom, { yPercent: 101, duration: 0.75, ease: "power3.inOut" }, 0.25);
    };

    const loop = () => {
      const elapsed = performance.now() - started;
      let target = 0;
      (Object.keys(flags) as (keyof typeof flags)[]).forEach((k) => {
        if (flags[k]) target += weight[k];
      });
      target = Math.min(target, 99);
      const creep = Math.min(94, 25 + elapsed / 8);
      target = Math.max(target, creep);
      shown += (target - shown) * 0.16;
      const allReady = Object.values(flags).every(Boolean);
      if (allReady && elapsed > 500) shown += (100 - shown) * 0.32;
      if (elapsed > 1500) shown = 100;
      if (counter) counter.textContent = String(Math.round(shown)).padStart(2, "0");
      if (bar) bar.style.transform = `scaleX(${Math.min(1, shown / 100)})`;
      if (shown >= 99.2 || elapsed > 1800) {
        finish();
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (done) return null;

  return (
    <div
      id="preloader"
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading Dr. B. Vijaya Chaitanya"
      className="fixed inset-0 z-100 overflow-hidden"
    >
      <div data-pl-top className="absolute inset-x-0 top-0 h-1/2 bg-navy" />
      <div data-pl-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-navy" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(55%_55%_at_50%_45%,rgba(64,159,157,0.22),transparent_70%)]"
      />

      <div
        data-pl-center
        className="relative z-10 flex h-full flex-col items-center justify-center gap-9 px-6 text-center text-white"
      >
        <div data-pl-ring className="relative h-37 w-37">
          {/* spinning gradient arc */}
          <svg viewBox="0 0 100 100" className="pl-spin absolute inset-0" aria-hidden>
            <defs>
              <linearGradient id="pl-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#8dd3ce" />
                <stop offset="1" stopColor="#409f9d" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1.2" />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="url(#pl-grad)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="92 200"
            />
          </svg>
          {/* counter-rotating dashed ring */}
          <svg viewBox="0 0 100 100" className="pl-spin-rev absolute inset-3.25" aria-hidden>
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#8dd3ce"
              strokeOpacity="0.5"
              strokeWidth="1"
              strokeDasharray="2 7"
              strokeLinecap="round"
            />
          </svg>
          {/* pulsing heart + ECG */}
          <svg viewBox="0 0 48 48" className="pl-beat absolute inset-10" aria-hidden>
            <path
              d="M24 41S6 30 6 17.5A9.5 9.5 0 0 1 24 13a9.5 9.5 0 0 1 18 4.5C42 30 24 41 24 41Z"
              fill="rgba(141,211,206,0.1)"
              stroke="#8dd3ce"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M9 24h8l3-6 5 12 3-6h10"
              fill="none"
              stroke="#fff"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <p className="text-[22px] font-medium tracking-tight sm:text-[26px]">{SITE.name}</p>
          <p className="mt-2 text-[10.5px] font-medium uppercase tracking-[0.34em] text-accent">{SITE.role}</p>
        </div>

     
      </div>
    </div>
  );
}
