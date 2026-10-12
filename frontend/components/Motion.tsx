"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

const all = <T extends HTMLElement = HTMLElement>(selector: string) =>
  gsap.utils.toArray<T>(selector);

const isRendered = (el: Element) => el.getClientRects().length > 0;

/**
 * Site-wide choreography (GSAP + ScrollTrigger + SplitText + Lenis).
 *
 * Sections stay server-rendered and only carry data attributes:
 *   data-hero="…"            hero intro timeline targets
 *   data-g="reveal"          fade/slide up on scroll        (+ data-delay in ms)
 *   data-g="split"           heading line-mask reveal
 *   data-g="parallax"        scrubbed drift                 (+ data-speed, data-scale)
 *   data-g="draw"            wipe-in for timeline connectors
 *   data-count               number count-up
 *   data-magnetic            magnetic hover on buttons
 *   data-showcase*           pinned horizontal gallery
 */
export function Motion() {
  useEffect(() => {
    const html = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      html.classList.add("g-ready");
      return;
    }

    gsap.registerPlugin(ScrollTrigger, SplitText);
    ScrollTrigger.config({ ignoreMobileResize: true });

    let cancelled = false;
    let lenis: Lenis | undefined;
    let tick: ((time: number) => void) | undefined;
    let onAnchorClick: ((e: MouseEvent) => void) | undefined;
    let onSiteLoaded: (() => void) | undefined;
    const onLoad = () => ScrollTrigger.refresh();
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {});

    const setup = () => {
      if (cancelled) return;

      ctx.add(() => {
        /* ---------------- smooth scrolling ---------------- */
        lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
        lenis.on("scroll", ScrollTrigger.update);
        tick = (time) => lenis?.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        const headerH = parseFloat(getComputedStyle(html).getPropertyValue("--header-h")) || 76;
        onAnchorClick = (e) => {
          const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
          const hash = link?.getAttribute("href");
          if (!link || !hash || hash === "#") return;
          const target = document.querySelector<HTMLElement>(hash);
          if (!target) return;
          e.preventDefault();
          lenis?.scrollTo(target, { offset: hash === "#home" ? 0 : -(headerH - 8), duration: 1.5 });
          history.replaceState(null, "", hash);
        };
        document.addEventListener("click", onAnchorClick);

        /* ---------------- hero intro ---------------- */
        const hero = (name: string) => all(`[data-hero="${name}"]`);
        if (hero("line").length) gsap.set(hero("line"), { opacity: 1, yPercent: 120 });
        const textElements = [...hero("eyebrow"), ...hero("meta"), ...hero("cta")];
        if (textElements.length) gsap.set(textElements, { opacity: 0, y: 26 });
        if (hero("header").length) gsap.set(hero("header"), { opacity: 0, y: -28 });
        if (hero("portrait").length) gsap.set(hero("portrait"), { opacity: 0, y: 60, scale: 1.06 });
        if (hero("heart").length) gsap.set(hero("heart"), { opacity: 0, scale: 0.8, rotate: -5 });
        if (hero("badge").length) gsap.set(hero("badge"), { opacity: 0, y: 34, scale: 0.9 });

        const heroTl = gsap
          .timeline({ paused: true, defaults: { ease: "power3.out" }, delay: 0.1 });
        if (hero("portrait").length) heroTl.to(hero("portrait"), { opacity: 1, y: 0, scale: 1, duration: 1.8 }, 0);
        if (hero("heart").length) heroTl.to(hero("heart"), { opacity: 1, scale: 1, rotate: 0, duration: 2 }, 0.25);
        if (hero("header").length) heroTl.to(hero("header"), { opacity: 1, y: 0, duration: 1 }, 0.3);
        if (hero("eyebrow").length) heroTl.to(hero("eyebrow"), { opacity: 1, y: 0, duration: 0.9 }, 0.4);
        if (hero("line").length) heroTl.to(hero("line"), { yPercent: 0, duration: 1.3, ease: "power4.out", stagger: 0.12 }, 0.5);
        if (hero("meta").length) heroTl.to(hero("meta"), { opacity: 1, y: 0, duration: 1 }, 1.05);
        if (hero("cta").length) heroTl.to(hero("cta"), { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 1.2);
        if (hero("badge").length) heroTl.to(hero("badge"), { opacity: 1, y: 0, scale: 1, duration: 1.1, stagger: 0.2, ease: "back.out(1.5)" }, 1.55);

        // the intro plays once the preloader shutters have opened
        if (html.classList.contains("is-loaded") || !document.getElementById("preloader")) {
          heroTl.play();
        } else {
          onSiteLoaded = () => heroTl.play();
          window.addEventListener("site:loaded", onSiteLoaded, { once: true });
        }

        // hero drifts apart as you scroll away
        all("[data-parallax-hero]").forEach((el) => {
          gsap.to(el, {
            yPercent: parseFloat(el.dataset.parallaxHero ?? "0"),
            ease: "none",
            scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: true },
          });
        });

        /* ---------------- generic scroll reveals ---------------- */
        all('[data-g="reveal"]').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 46 },
            {
              opacity: 1,
              y: 0,
              duration: 1.15,
              delay: Number(el.dataset.delay ?? 0) / 1000,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            },
          );
        });

        /* ---------------- heading line-mask reveals ---------------- */
        all('[data-g="split"]').forEach((el) => {
          gsap.set(el, { opacity: 1 });
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              // keep descenders (g, y, p) from being clipped by the line masks
              (self.masks as HTMLElement[]).forEach((m) => {
                m.style.paddingBottom = "0.16em";
                m.style.marginBottom = "-0.16em";
              });
              return gsap.from(self.lines, {
                yPercent: 115,
                duration: 1.25,
                ease: "power4.out",
                stagger: 0.12,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              });
            },
          });
        });

        /* ---------------- parallax drift ---------------- */
        all('[data-g="parallax"]').forEach((el) => {
          gsap.set(el, { opacity: 1 });
          const host = el.parentElement ?? el;
          if (!isRendered(host)) return;
          const speed = parseFloat(el.dataset.speed ?? "0.05");
          const scale = parseFloat(el.dataset.scale ?? "1.15");
          gsap.fromTo(
            el,
            { yPercent: -speed * 100, scale },
            {
              yPercent: speed * 100,
              scale,
              ease: "none",
              scrollTrigger: { trigger: host, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        /* ---------------- journey timeline line ---------------- */
        all("[data-timeline-line]").forEach((line) => {
          gsap.set(line, { scaleY: 0, transformOrigin: "50% 0%" });
          gsap.to(line, {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: line.parentElement ?? line,
              start: "top 65%",
              end: "bottom 70%",
              scrub: 0.6,
            },
          });
        });

        /* ---------------- odometer: digits roll up to their value ---------------- */
        all("[data-odometer]").forEach((el, n) => {
          const strips = Array.from(el.querySelectorAll<HTMLElement>("[data-digit]")).map((col) => {
            const strip = col.querySelector<HTMLElement>("[data-strip]");
            if (strip) strip.style.transform = "none";
            return {
              strip,
              to: Number(col.dataset.to ?? 0),
            };
          });
          // rewind to 0 (the server HTML is parked on the final value for crawlers / no-JS)
          gsap.set(
            strips.map((s) => s.strip),
            { yPercent: 0 },
          );
          ScrollTrigger.create({
            trigger: el,
            start: "top 92%",
            once: true,
            onEnter: () => {
              strips.forEach(({ strip, to }, i) => {
                if (!strip) return;
                gsap.to(strip, {
                  yPercent: -((10 + to) / 30) * 100,
                  duration: 2.1 + i * 0.22,
                  delay: n * 0.1 + i * 0.07,
                  ease: "expo.out",
                });
              });
            },
          });
        });

        /* ---------------- scroll progress bar ---------------- */
        const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");
        if (bar) {
          gsap.set(bar, { scaleX: 0, transformOrigin: "0 50%" });
          gsap.to(bar, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
          });
        }
      });

      /* ---------------- pinned horizontal showcase (desktop) ---------------- */
      mm.add("(min-width: 1024px)", () => {
        const section = document.querySelector<HTMLElement>("[data-showcase]");
        const pin = section?.querySelector<HTMLElement>("[data-showcase-pin]");
        const track = section?.querySelector<HTMLElement>("[data-showcase-track]");
        if (!section || !pin || !track) return;

        const panels = Array.from(track.querySelectorAll<HTMLElement>("[data-showcase-panel]"));
        const fill = section.querySelector<HTMLElement>("[data-showcase-progress]");
        const count = section.querySelector<HTMLElement>("[data-showcase-count]");
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        if (fill) gsap.set(fill, { scaleX: 0.04, transformOrigin: "0 50%" });

        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (fill) gsap.set(fill, { scaleX: Math.max(0.04, self.progress) });
              if (count) {
                const n = Math.min(panels.length, Math.floor(self.progress * panels.length) + 1);
                count.textContent = String(n).padStart(2, "0");
              }
            },
          },
        });

        panels.forEach((panel) => {
          const media = panel.querySelector<HTMLElement>("[data-panel-media]");
          if (!media) return;
          gsap.fromTo(
            media,
            { xPercent: -7 },
            {
              xPercent: 7,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: slide,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });

      /* ---------------- magnetic buttons (fine pointers only) ---------------- */
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const cleanups: (() => void)[] = [];
        all("[data-magnetic]").forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
          });
        });
        // layered pointer parallax: every [data-pointer="k"] drifts by k px opposite the cursor
        const layers = all("[data-pointer]").map((el) => ({
          k: parseFloat(el.dataset.pointer ?? "0"),
          x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" }),
        }));
        const onPointer = (e: PointerEvent) => {
          const nx = (e.clientX / window.innerWidth) * 2 - 1;
          const ny = (e.clientY / window.innerHeight) * 2 - 1;
          layers.forEach(({ k, x, y }) => {
            x(-nx * k);
            y(-ny * k * 0.6);
          });
        };
        if (layers.length) window.addEventListener("pointermove", onPointer, { passive: true });
        cleanups.push(() => window.removeEventListener("pointermove", onPointer));

        return () => cleanups.forEach((fn) => fn());
      });

      html.classList.remove("g-failed");
      html.classList.add("g-ready");
      window.addEventListener("load", onLoad);
      ScrollTrigger.refresh();
    };

    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fonts, new Promise((resolve) => setTimeout(resolve, 1500))]).then(setup);

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      if (onAnchorClick) document.removeEventListener("click", onAnchorClick);
      if (onSiteLoaded) window.removeEventListener("site:loaded", onSiteLoaded);
      if (tick) gsap.ticker.remove(tick);
      mm.revert();
      ctx.revert();
      lenis?.destroy();
      html.classList.remove("g-ready");
    };
  }, []);

  return (
    <div
      aria-hidden
      data-scroll-progress
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-secondary"
    />
  );
}
