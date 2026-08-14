import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Services from "@/components/sections/Services";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Skills />
      <Services />
      <Experience />
      <Projects />
      <Contact />
    </main>
  );
}
