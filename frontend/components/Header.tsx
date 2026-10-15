"use client";

import { useEffect, useRef, useState } from "react";
import { NAV, SITE } from "@/lib/site";
import { ArrowRight, CloseIcon, MenuIcon } from "./icons";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [active, setActive] = useState<string>("home");

  const lastScrollYRef = useRef(0);

  // Smart Hide on Scroll Down, Reveal Smoothly on Scroll Up
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Elevation state: glass shadow when scrolled past top area
      setScrolled(currentScrollY > 24);

      // Always keep header visible near the top of the page (within first 80px)
      if (currentScrollY <= 80) {
        setVisible(true);
        lastScrollYRef.current = currentScrollY;
        ticking = false;
        return;
      }

      const delta = currentScrollY - lastScrollYRef.current;

      // 6px threshold to eliminate trackpad/touch micro-jitter
      if (Math.abs(delta) > 6) {
        if (delta > 0 && currentScrollY > 120) {
          // Scrolling DOWN -> smoothly hide header
          setVisible(false);
        } else if (delta < 0) {
          // Scrolling UP -> smoothly reveal header
          setVisible(true);
        }
        lastScrollYRef.current = currentScrollY;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: every <section data-nav="..."> maps to a nav item
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[data-nav]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.getAttribute("data-nav") ?? "home");
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Lock scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Always keep header visible if mobile drawer is currently open
  const isHeaderVisible = visible || open;

  return (
    <header
      data-hero="header"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        isHeaderVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      } ${
        scrolled || open
          ? "bg-white/95 border-b border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(16,42,67,0.08)] backdrop-blur-2xl"
          : "bg-transparent border-b border-transparent shadow-none"
      }`}
    >
      <div className="container-x flex h-(--header-h) items-center justify-between gap-4">
        {/* Brand / Medical Insignia */}
        <a
          href="#home"
          className="focus-ring group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.01]"
          aria-label={`${SITE.name} — home`}
          onClick={() => setOpen(false)}
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#0284c7]/30 bg-[#f0f7fe] text-[#0284c7] shadow-[0_2px_8px_-2px_rgba(2,132,199,0.25)] transition-colors duration-300 group-hover:border-[#0284c7] group-hover:bg-[#e0f2fe]">
            {/* Elegant blue intertwined heart line */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38bdf8] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0284c7]" />
            </span>
          </div>

          <div className="flex flex-col text-left leading-tight">
            <span className="text-[17px] font-semibold tracking-wide uppercase text-[#0f2942] sm:text-[19px]">
              {SITE.name}
            </span>
            <div className="flex items-center gap-2 text-[10.5px]">
              <span className="font-medium tracking-wider text-[#476882]">
                {SITE.role}
              </span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation: Elegant Links with Light Blue Underline for Active Section */}
        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1 rounded-full border border-[#d2e4f3] bg-white/85 p-1.5 shadow-[inset_0_1px_2px_rgba(15,41,66,0.02)] backdrop-blur-md">
            {NAV.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`focus-ring relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] transition-all duration-300 ${
                      isActive
                        ? "bg-white text-[#175486] font-semibold shadow-[0_2px_8px_-2px_rgba(2,132,199,0.15)] border-b-2 border-[#0284c7]"
                        : "text-[#476882] font-medium hover:bg-white/70 hover:text-[#0f2942]"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden items-center gap-3 xl:flex">
         

          

          <a
            href="#contact"
            className="focus-ring group relative inline-flex h-10.5 items-center gap-2.5 rounded-full border border-[#0284c7] bg-[#f0f7fe] px-5 text-[12.5px] font-medium tracking-wide text-[#175486] shadow-[0_2px_10px_rgba(2,132,199,0.15)] transition-all duration-300 hover:bg-[#175486] hover:text-white hover:border-[#175486] hover:shadow-[0_8px_20px_-4px_rgba(23,84,134,0.35)] active:scale-[0.98]"
          >
            {/* Calendar / appointment icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4 transition-colors">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Book a Consultation</span>
            <ArrowRight
              width={13}
              height={13}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          className="focus-ring -mr-2 inline-flex h-10.5 w-10.5 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-ink shadow-xs backdrop-blur-md transition-colors hover:bg-slate-50 xl:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon width={22} height={22} /> : <MenuIcon width={22} height={22} />}
        </button>
      </div>

      {/* ========================================================= */}
      {/* FULL-VIEW CLEAN WHITE & BLUE MOBILE OFFCANVAS             */}
      {/* ========================================================= */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className={`fixed inset-0 z-[100] h-dvh w-screen flex flex-col bg-white text-[#0f2942] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] xl:hidden overflow-hidden ${
          open
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Soft White & Blue Medical Overlay Accents */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#f0f7fe] via-white to-[#f4f9fd]">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#0284c7]/8 blur-3xl" />
          <div className="absolute top-1/2 -left-24 h-80 w-80 -translate-y-1/2 rounded-full bg-[#38bdf8]/10 blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-[#e0f2fe] blur-3xl" />
        </div>

        {/* Offcanvas Top Header */}
        <div className="flex h-(--header-h) shrink-0 items-center justify-between border-b border-[#e2edf6] px-5 sm:px-8 bg-white/90 backdrop-blur-md">
          <a
            href="#home"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 transition-transform active:scale-95"
            aria-label={`${SITE.name} — home`}
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#0284c7]/30 bg-[#f0f7fe] text-[#0284c7] shadow-xs">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5.5 h-5.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38bdf8] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0284c7]" />
              </span>
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[16px] font-semibold tracking-wide uppercase text-[#0f2942]">
                {SITE.name}
              </span>
              <span className="text-[10.5px] font-medium tracking-wider text-[#0284c7]">
                {SITE.role}
              </span>
            </div>
          </a>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-10.5 w-10.5 items-center justify-center rounded-full border border-[#d2e4f3] bg-[#f8fafc] text-[#0f2942] shadow-xs transition-all duration-300 hover:bg-[#e0f2fe] hover:text-[#0284c7] active:scale-90"
          >
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        {/* Offcanvas Scrollable Content — Pure Menu List */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 flex flex-col justify-between">
          <nav aria-label="Mobile Navigation" className="my-auto py-4">
            <ul className="flex flex-col gap-1.5 sm:gap-2">
              {NAV.map((item, index) => {
                const isActive = active === item.id;
                return (
                  <li
                    key={item.id}
                    className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                    }`}
                    style={{ transitionDelay: `${open ? 40 + index * 30 : 0}ms` }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`group flex items-center justify-between py-3.5 px-4 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "text-[#0284c7] font-semibold bg-[#f0f7fe]"
                          : "text-[#0f2942] font-medium hover:text-[#0284c7] hover:bg-[#f0f7fe]/70"
                      }`}
                    >
                      <span className="text-[20px] sm:text-[23px] tracking-tight transition-transform duration-300 group-hover:translate-x-2">
                        {item.label}
                      </span>

                      {isActive && (
                        <span className="h-2 w-2 rounded-full bg-[#0284c7] shadow-[0_0_8px_#0284c7]" />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Action — Clean Book Consultation Button */}
          <div
            className={`pt-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: `${open ? 320 : 0}ms` }}
          >
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#175486] to-[#0284c7] px-6 text-[13.5px] font-semibold text-white shadow-[0_6px_20px_-4px_rgba(23,84,134,0.35)] transition-all hover:scale-[1.01] active:scale-[0.98]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Book an Appointment</span>
              <ArrowRight width={14} height={14} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
