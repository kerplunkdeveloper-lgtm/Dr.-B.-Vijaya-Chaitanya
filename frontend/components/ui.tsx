import type { ReactNode } from "react";
import { ArrowRight } from "./icons";

type ButtonVariant = "dark" | "light" | "outline-light" | "outline-secondary";

const variants: Record<ButtonVariant, string> = {
  dark: "bg-primary text-white shadow-[0_14px_30px_-14px_rgba(23,84,134,0.7)] hover:bg-primary-dark",
  light:
    "bg-white text-ink shadow-[0_14px_30px_-14px_rgba(0,0,0,0.5)] hover:bg-offwhite",
  "outline-light":
    "border border-white/25 bg-white/[0.04] text-white backdrop-blur hover:bg-white/10",
  "outline-secondary":
    "border border-accent/70 text-white hover:border-accent hover:bg-white/10",
};

export function ButtonLink({
  href,
  children,
  variant = "dark",
  arrow = true,
  className = "",
  ariaLabel,
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  arrow?: boolean;
  className?: string;
  ariaLabel?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      data-magnetic
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`focus-ring group relative inline-flex h-12 items-center justify-center gap-3 overflow-hidden rounded-full px-7 text-[13px] font-medium tracking-wide transition-[background-color,color,border-color,box-shadow] duration-300 before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:w-1/3 before:skew-x-[-20deg] before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:opacity-0 before:transition-[left,opacity] before:duration-700 hover:before:left-[120%] hover:before:opacity-100 ${variants[variant]} ${className}`}
    >
      {children}
      {arrow && (
        <ArrowRight
          width={15}
          height={15}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </a>
  );
}

/** Round outlined arrow button used on cards and CTAs. */
export function CircleLink({
  href,
  label,
  tone = "gold",
  size = 44,
  className = "",
}: {
  href: string;
  label: string;
  tone?: "gold" | "light" | "solid-light";
  size?: number;
  className?: string;
}) {
  const tones = {
    gold: "border-accent/80 text-accent hover:bg-accent hover:text-ink",
    light: "border-white/70 text-white hover:bg-white hover:text-ink",
    "solid-light": "border-white bg-white text-ink hover:bg-offwhite",
  } as const;
  return (
    <a
      href={href}
      aria-label={label}
      style={{ width: size, height: size }}
      className={`focus-ring group inline-flex shrink-0 items-center justify-center rounded-full border transition-[background-color,color,border-color] duration-300 ${tones[tone]} ${className}`}
    >
      <ArrowRight
        width={Math.round(size * 0.36)}
        height={Math.round(size * 0.36)}
        className="transition-transform duration-300 group-hover:translate-x-0.5"
      />
    </a>
  );
}

export function SectionEyebrow({
  children,
  rule = false,
  className = "",
}: {
  children: ReactNode;
  rule?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="eyebrow">{children}</p>
      {rule && <span className="rule mt-3" aria-hidden />}
    </div>
  );
}
