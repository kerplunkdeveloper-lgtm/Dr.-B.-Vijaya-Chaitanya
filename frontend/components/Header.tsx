"use client";

import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/site";
import { ArrowRight, CloseIcon, MenuIcon } from "./icons";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");

  // Elevated header after the hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
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

  return (
    <header
      data-hero="header"
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled || open
          ? "bg-white/95 shadow-[0_1px_0_rgba(16,42,67,0.06)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-(--header-h) items-center justify-between gap-6">
        <a
          href="#home"
          className="focus-ring leading-tight"
          aria-label={`${SITE.name} — home`}
          onClick={() => setOpen(false)}
        >
          <span className="block font-serif text-[19px] tracking-[-0.01em] text-ink sm:text-[21px]">
            {SITE.name}
          </span>
          <span className="block text-[11px] text-slate">{SITE.role}</span>
        </a>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-7 text-[13px] text-slate 2xl:gap-9">
            {NAV.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`focus-ring relative inline-block py-2 transition-colors hover:text-ink ${
                      isActive ? "text-ink" : ""
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-secondary transition-transform duration-500 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <a
            href="#contact"
            className="focus-ring group inline-flex h-11 items-center gap-3 rounded-full bg-ink px-6 text-[13px] font-medium text-white shadow-[0_14px_30px_-14px_rgba(13,26,46,0.7)] transition hover:bg-primary"
          >
             Appointment
            <ArrowRight width={14} height={14} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href={`tel:${SITE.phone.tel}`}
            aria-label={`Call ${SITE.phone.display}`}
            className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-white/50 text-ink backdrop-blur transition hover:bg-ink hover:text-white"
          >
            <ArrowRight width={15} height={15} />
          </a>
        </div>

        <button
          type="button"
          className="focus-ring -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink xl:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon width={24} height={24} /> : <MenuIcon width={24} height={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-ink/5 bg-white/95 backdrop-blur-xl xl:hidden"
      >
        <nav aria-label="Mobile" className="container-x py-6">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.id} className="border-b border-line/70 last:border-0">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`focus-ring flex items-center justify-between py-4 font-serif text-[22px] ${
                    active === item.id ? "text-secondary" : "text-ink"
                  }`}
                >
                  {item.label}
                  <ArrowRight width={16} height={16} className="text-slate" />
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="focus-ring mt-6 flex h-12 items-center justify-center gap-3 rounded-full bg-ink text-[13px] font-medium text-white"
          >
            Appointment <ArrowRight width={14} height={14} />
          </a>
        </nav>
      </div>
    </header>
  );
}
