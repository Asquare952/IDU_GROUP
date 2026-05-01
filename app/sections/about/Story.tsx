import { storyData } from "@/app/about-us/infoData/data";

const Story = () => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-8">
          {storyData.title}
        </h2>

        <div className="space-y-6 text-gray-600 leading-relaxed text-base sm:text-lg">
          {storyData.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-10 relative bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-8 text-left">
          <span className="absolute top-4 left-4 text-6xl text-amber-300 font-serif leading-none">
            &quot;
          </span>
          <p className="relative z-10 text-emerald-900 font-semibold text-lg italic pl-4">
            {storyData.quote.text}
          </p>
          <p className="relative z-10 text-sm text-gray-500 mt-3 pl-4 font-medium">
            — {storyData.quote.source}
          </p>
        </div>

        <p className="mt-10 text-gray-600 leading-relaxed text-base sm:text-lg">
          {storyData.closing}
        </p>
      </div>
    </section>
  );
};

export default Story;
