import Image from "next/image";
import Header from "./components/Header";
import HeroSection from "./components/landing-page/HeroSection";
import Users from "./components/landing-page/Users";

export default function Home() {
  return (
    <div>
      <main>
        <section>
          <Header />
          <HeroSection />
          <Users />
        </section>
      </main>
    </div>
  );
}
