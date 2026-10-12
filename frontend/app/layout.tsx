import type { Metadata, Viewport } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { DESCRIPTION, SITE } from "@/lib/site";
import "./globals.css";
import { Preloader } from "@/components/Preloader";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const TITLE = `${SITE.name} | Interventional Cardiologist in ${SITE.city}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITLE,
    template: `%s | ${SITE.name}`,
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.hospital,
  category: "health",
  keywords: [
    "interventional cardiologist in Vijayawada",
    "Dr. B. Vijaya Chaitanya",
    "cardiologist Vijayawada",
    "Medstar Hospitals Vijayawada",
    "complex coronary angioplasty",
    "primary PCI",
    "TAVI",
    "structural heart interventions",
    "peripheral vascular interventions",
    "pacemaker implantation",
    "ICD and CRT implantation",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: SITE.name,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: true, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf9f5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${poppins.variable} ${poppins.className}`} suppressHydrationWarning>
      <head>
        <noscript>
          <style>{"#preloader{display:none!important}html{overflow:auto!important}"}</style>
        </noscript>
      </head>
      <body className={`${poppins.className} min-h-dvh`} suppressHydrationWarning>
        {/* Flags that JS-driven motion is available; Motion.tsx sets g-ready once it takes over. */}
        <Script
          id="boot-flags"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;d.classList.add('is-loading');if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('js');setTimeout(function(){if(!d.classList.contains('g-ready'))d.classList.add('g-failed')},10000)})()",
          }}
        />
        <Preloader />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
