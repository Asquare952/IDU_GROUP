import Image from "next/image";
import Header from "./components/Header";
import HeroSection from "./components/landing-page/HeroSection";
import Users from "./components/landing-page/Users";
import About from "./components/landing-page/About";
import Listing from "./components/landing-page/Listing";
import Why from "./components/landing-page/Why";

export default function Home() {
  return (
    <div>
      <main>
        <section>
          <Header />
          <HeroSection />
          <Users />
          <About />
          <Listing />
          <Why />
        </section>
      </main>
    </div>
  );
}
