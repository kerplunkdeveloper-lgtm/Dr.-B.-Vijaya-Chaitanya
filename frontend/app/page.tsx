import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { About } from "@/components/sections/About";
import { Awards } from "@/components/sections/Awards";
import { Contact } from "@/components/sections/Contact";
import { Expertise } from "@/components/sections/Expertise";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Leadership } from "@/components/sections/Leadership";

import { Insights } from "@/components/sections/Insights";
import { HeartbeatExperience } from "@/components/sections/HeartbeatExperience";
import { FAQ } from "@/components/sections/FAQ";
import { Motion } from "@/components/Motion";
import { MobileCta } from "@/components/MobileCta";
import { FloatingActions } from "@/components/FloatingActions";
import { Stats } from "@/components/sections/Stats";

export default function Home() {
  return (
    <>
      <JsonLd />
      <Header />
      <main id="main">
        <Hero />
        <Stats />
        <Expertise />
        <About />
        <Journey />
        <Awards />
        <Leadership />
        <Insights />
        <HeartbeatExperience />
     
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <MobileCta />
      <FloatingActions />
      <Motion />
    </>
  );
}
