import { NAV, SITE, SOCIALS } from "@/lib/site";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "../icons";

const socialIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
} as const;

const YEAR = process.env.BUILD_YEAR ?? String(SITE.copyrightFrom);

export function Footer() {
  return (
    <footer className="bg-navy pb-28 text-white lg:pb-0">
      <div className="container-x py-12 lg:py-14">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
          <div className="text-center leading-tight lg:text-left">
            <p className="text-[22px] font-semibold tracking-wide text-white">{SITE.name}</p>
            <p className="mt-1.5 text-[12px] font-light text-white/60">{SITE.role}</p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] font-light text-white/70">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a href={n.href} className="focus-ring inline-block py-1.5 transition-colors hover:text-accent">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex items-center gap-3" aria-label="Social media">
            {SOCIALS.map((s) => {
              const Icon = socialIcons[s.icon];
              return (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${SITE.name} on ${s.name}`}
                    className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-[background-color,color,border-color] hover:border-accent hover:bg-accent hover:text-navy"
                  >
                    <Icon width={16} height={16} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-[12px] font-light text-white/50 lg:flex-row lg:justify-between">
          <p>
            © {YEAR} {SITE.name}. All rights reserved.
          </p>
          <p>{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
