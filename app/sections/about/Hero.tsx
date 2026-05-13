import Image from "next/image";
import { heroData } from "@/app/about-us/infoData/data";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Mobile Background Image */}
      <div className="absolute inset-0 lg:hidden">
        <Image
          src={heroData.image}
          alt={heroData.imageAlt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 relative z-10">
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-emerald-400 lg:text-emerald-700 uppercase mb-4">
              {heroData.label}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] text-white lg:text-gray-900 mb-6">
              {heroData.headline}
            </h1>
            <p className="text-lg text-gray-200 lg:text-gray-500 leading-relaxed mb-8 max-w-lg">
              {heroData.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="cursor-pointer bg-green-400 hover:bg-green-500 lg:bg-green-700 lg:hover:bg-green-600 text-white font-semibold py-3.5 px-8 rounded-full transition-all active:scale-95">
                {heroData.primaryCta}
              </button>
              <button className="cursor-pointer border border-white/30 hover:border-white/50 lg:border-gray-300 lg:hover:border-gray-400 text-white lg:text-gray-700 font-semibold py-3.5 px-8 rounded-full transition-all active:scale-95 bg-white/10 lg:bg-white backdrop-blur-sm lg:backdrop-blur-none">
                {heroData.secondaryCta}
              </button>
            </div>
          </div>

          {/* Desktop Image Only */}
          <div className="order-1 lg:order-2 relative hidden lg:block">
            <div className="relative aspect-[4/5] w-full rounded-[32px] overflow-hidden bg-gray-100">
              <Image
                src={heroData.image}
                alt={heroData.imageAlt}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
