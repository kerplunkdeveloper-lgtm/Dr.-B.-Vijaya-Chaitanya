import { MAPS_URL, SITE } from "@/lib/site";
import { ClockIcon, PhoneIcon, PinIcon } from "../icons";
import { Reveal } from "../Reveal";
import { ButtonLink } from "../ui";

const details = [
  {
    icon: PhoneIcon,
    label: "Call",
    value: <a href={`tel:${SITE.phone.tel}`}>{SITE.phone.display}</a>,
  },
  {
    icon: PinIcon,
    label: "Location",
    value: (
      <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
        {SITE.hospital}, {SITE.city}
      </a>
    ),
  },
  {
    icon: ClockIcon,
    label: "Timings",
    value: (
      <>
        {SITE.hours.days}
        <br />
        {SITE.hours.time}
      </>
    ),
  },
] as const;

export function Contact() {
  return (
    <section
      id="contact"
      data-nav="contact"
      aria-labelledby="contact-title"
      className="relative bg-white py-16"
    >
      <div className="container-x space-y-6">
        {/* ── Contact Card ── */}
        <Reveal className="relative isolate overflow-hidden rounded-4xl border border-line bg-linear-to-br from-mist via-white to-white px-6 py-12 sm:px-10 lg:rounded-[40px] lg:px-16 lg:py-16">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-accent/30 blur-3xl"
          />
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
            <div className="max-w-130">
              <p className="eyebrow">Contact</p>
              <span className="rule mt-4" aria-hidden />
              <h2
                id="contact-title"
                data-g="split"
                className="mt-6 text-[clamp(1.35rem,2.2vw,1.75rem)] font-semibold leading-[1.35] text-ink"
              >
                If you are dealing with a cardiovascular condition, considering an intervention or looking for a specialist opinion, understanding the problem clearly is the first step.
              </h2>
              <p className="mt-5 text-[14.5px] font-light leading-[1.9] text-slate">
                Consult with {SITE.name} for expert cardiac care.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="https://medstarhospitals.com/" external className="w-full sm:w-auto">
                  Contact MedStar Hospital
                </ButtonLink>
               
              </div>
            </div>

            <address className="not-italic lg:w-100">
              <dl className="divide-y divide-line rounded-2xl border border-line bg-white/80 backdrop-blur">
                {details.map((d) => (
                  <div key={d.label} className="flex items-center gap-4 px-5 py-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist text-secondary-deep">
                      <d.icon width={20} height={20} />
                    </span>
                    <div>
                      <dt className="text-[11px] font-medium uppercase tracking-[0.2em] text-secondary-deep">
                        {d.label}
                      </dt>
                      <dd className="mt-1 text-[13.5px] font-light leading-snug text-ink [&_a:hover]:text-primary [&_a]:transition-colors">
                        {d.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </address>
          </div>
        </Reveal>

        {/* ── Map Section ── */}
        <Reveal className="relative overflow-hidden rounded-3xl border border-line shadow-[0_20px_60px_-30px_rgba(16,42,67,0.18)] lg:rounded-[36px]">
          {/* Embedded Google Map */}
          <div className="relative h-[320px] w-full sm:h-[380px] lg:h-[440px]">
            <iframe
              title="Medstar Hospitals location map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30706.44!2d80.6480153!3d16.5061743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f0a2506fe067%3A0x8a8a8a8a8a8a8a8a!2sMedstar%20Hospitals%2C%20Vijayawada!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full"
            />
          </div>

          {/* Info strip overlaid at bottom */}
          <div className="flex flex-col gap-4 border-t border-line bg-white/90 px-6 py-5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-8">
            {/* Address + hours */}
            <div className="flex flex-col gap-1">
              <p className="text-[13px] font-semibold text-ink">
                {SITE.hospital} — {SITE.city}, {SITE.region}
              </p>
              <p className="text-[12.5px] font-light text-slate">
                {SITE.hours.days} &nbsp;·&nbsp; {SITE.hours.time}
              </p>
            </div>

            {/* CTA links */}
            <div className="flex shrink-0 items-center gap-3">
              <a
                href={`tel:${SITE.phone.tel}`}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-white px-4 text-[12.5px] font-medium text-ink shadow-sm transition hover:border-secondary/50 hover:text-primary"
              >
                <PhoneIcon width={13} height={13} />
                {SITE.phone.display}
              </a>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12.5px] font-medium text-white shadow-sm transition hover:bg-primary-dark"
              >
                <PinIcon width={13} height={13} />
                Get Directions
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
