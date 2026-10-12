import { DESCRIPTION, SITE } from "@/lib/site";

/**
 * Structured data (schema.org) so search engines understand the entity:
 * a Physician affiliated with a Hospital, plus the WebSite itself.
 */
export function JsonLd() {
  const id = (hash: string) => `${SITE.url}/#${hash}`;

  const graph = [
    {
      "@type": "WebSite",
      "@id": id("website"),
      url: SITE.url,
      name: SITE.name,
      description: DESCRIPTION,
      inLanguage: "en-IN",
      publisher: { "@id": id("physician") },
    },
    {
      "@type": "Hospital",
      "@id": id("hospital"),
      name: SITE.hospital,
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE.city,
        addressRegion: SITE.region,
        addressCountry: SITE.country,
      },
    },
    {
      "@type": "Physician",
      "@id": id("physician"),
      name: SITE.name,
      url: SITE.url,
      image: `${SITE.url}/og-image.jpg`,
      description: DESCRIPTION,
      medicalSpecialty: "Cardiovascular",
      telephone: SITE.phone.tel,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.hospital,
        addressLocality: SITE.city,
        addressRegion: SITE.region,
        addressCountry: SITE.country,
      },
      areaServed: { "@type": "City", name: SITE.city },
      hospitalAffiliation: { "@id": id("hospital") },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
      availableService: [
        "Complex Coronary Interventions",
        "Structural Heart Interventions",
        "Advanced Cardiac Imaging",
        "Peripheral Vascular Interventions",
        "Pacemaker, ICD and CRT Implantation",
      ].map((name) => ({ "@type": "MedicalProcedure", name })),
    },
    {
      "@type": "FAQPage",
      "@id": id("faq"),
      mainEntity: [
        {
          "@type": "Question",
          name: "Who is Dr. B. Vijaya Chaitanya?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Dr. B. Vijaya Chaitanya is an Interventional Cardiologist, Managing Director of Medstar Hospitals and Chief of Cardiovascular Sciences.",
          },
        },
        {
          "@type": "Question",
          name: "Where does Dr. Vijaya Chaitanya practise?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "He is associated with Medstar Hospitals in Tadepalli, Vijayawada, Andhra Pradesh.",
          },
        },
        {
          "@type": "Question",
          name: "What is Dr. Vijaya Chaitanya's speciality?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "His primary speciality is Interventional Cardiology, with expertise in coronary interventions, complex coronary disease, structural heart interventions, peripheral vascular interventions and cardiac device implantation.",
          },
        },
        {
          "@type": "Question",
          name: "How experienced is Dr. Vijaya Chaitanya?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "He has over 13 years of experience in cardiovascular medicine. His documented procedural experience includes more than 26,000 coronary angiograms, 12,000 coronary angioplasties and 11,000 peripheral interventions.",
          },
        },
        {
          "@type": "Question",
          name: "What procedures does Dr. Vijaya Chaitanya perform?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "His listed expertise includes coronary angiography, coronary angioplasty, primary PCI, complex coronary interventions, left main and bifurcation stenting, IVUS/OCT-guided procedures, FFR assessment, pacemaker implantation, ICD and CRT implantation, peripheral vascular interventions and structural heart interventions.",
          },
        },
        {
          "@type": "Question",
          name: "Does Dr. Vijaya Chaitanya have TAVI training?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. His professional profile lists a Fellowship in TAVI from Medanta, Delhi.",
          },
        },
        {
          "@type": "Question",
          name: "What are Dr. Vijaya Chaitanya's qualifications?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "He holds an MBBS, MD in General Medicine and DM in Cardiology. He also holds FACC and FIC credentials and has undertaken specialised training in TAVI.",
          },
        },
      ],
    },
  ];

  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(
    /</g,
    "\\u003c",
  );

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
