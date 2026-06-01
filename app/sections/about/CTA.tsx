import { ctaData } from "@/app/about-us/infoData/data";
import WaitlistButton from "@/app/components/waitlist/WaitlistButton";

const CTA = () => {
  return (
    <section className="py-24 lg:py-32 bg-green-700 text-white text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
          {ctaData.headline}
        </h2>
        <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          {ctaData.description}
        </p>

        <WaitlistButton className="cursor-pointer bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold py-4 px-10 rounded-full transition-all active:scale-95 text-lg shadow-lg shadow-amber-400/20">
          {ctaData.buttonText}
        </WaitlistButton>

        <p className="mt-4 text-xs text-white/60 font-semibold uppercase tracking-widest">
          {ctaData.badgeText}
        </p>
      </div>
    </section>
  );
};

export default CTA;
