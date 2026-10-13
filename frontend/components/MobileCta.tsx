"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { PhoneIcon } from "./icons";

/** Thumb-reach call + booking bar for phones. Appears once the hero CTA has scrolled away. */
export function MobileCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-40 flex items-center gap-2 rounded-full border border-line bg-white/90 p-1.5 shadow-[0_20px_40px_-18px_rgba(16,42,67,0.45)] backdrop-blur-xl transition-[opacity,translate] duration-500 lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <a
        href={`tel:${SITE.phone.tel}`}
        aria-label={`Call ${SITE.phone.display}`}
        className="focus-ring inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mist text-secondary-deep"
      >
        <PhoneIcon width={20} height={20} />
      </a>
      <a
        href="#contact"
        className="focus-ring inline-flex h-12 flex-1 items-center justify-center rounded-full bg-primary text-[13px] font-medium tracking-wide text-white transition hover:bg-primary-dark"
      >
        Book Appointment
      </a>
    </div>
  );
}
