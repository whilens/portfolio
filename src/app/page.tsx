import { Contact } from "@/components/Contact";
import { Desk } from "@/components/Desk";
import { Footer } from "@/components/Footer";
import { Hall } from "@/components/Hall";
import { Header } from "@/components/Header";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { Team } from "@/components/Team";

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-full overflow-x-clip">
        <Hall />
        <Desk>
          <Services />
          <Process />
          <Team />
          <Contact />
          <Footer />
        </Desk>
      </main>
    </>
  );
}
