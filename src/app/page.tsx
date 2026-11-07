import { Cases } from "@/components/cases/Cases";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { Team } from "@/components/Team";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative z-[2]">
        <Hero />
        <Marquee />
        <Cases />
        <Services />
        <Process />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
