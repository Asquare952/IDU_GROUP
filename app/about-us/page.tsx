import Navbar from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Hero from "@/app/sections/about/Hero";
import Story from "@/app/sections/about/Story";
import Mission from "@/app/sections/about/Mission";
import ProblemSolution from "@/app/sections/about/ProblemSolution";
import Features from "@/app/sections/about/Features";
import Team from "@/app/sections/about/Team";
import Timeline from "@/app/sections/about/Timeline";
import Testimonials from "@/app/sections/about/Testimonies";
import CTA from "@/app/sections/about/CTA";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <main className="bg-white text-gray-900 font-sans antialiased">
        <Hero />
        <Story />
        <Mission />
        <ProblemSolution />
        <Features />
        <Team />
        <Timeline />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;
