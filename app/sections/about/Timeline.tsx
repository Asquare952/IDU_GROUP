import { timelineData } from "@/app/about-us/infoData/data";

const Timeline = () => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-4">
            {timelineData.title}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {timelineData.subtitle}
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 lg:-translate-x-px" />

          {timelineData.events.map((event, i) => (
            <div
              key={i}
              className={`relative flex items-start mb-12 last:mb-0 ${
                event.align === "right" ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div
                className="absolute left-4 lg:left-1/2 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 -translate-x-1.5 mt-1.5"
                style={{
                  backgroundColor: event.highlight ? "#fbbf24" : "#065f46",
                }}
              />

              <div
                className={`ml-12 lg:ml-0 lg:w-1/2 ${
                  event.align === "left" ? "lg:pr-16 lg:text-right" : "lg:pl-16"
                }`}
              >
                <span
                  className={`inline-block text-xs font-bold tracking-wider uppercase mb-2 ${
                    event.highlight ? "text-amber-600" : "text-emerald-600"
                  }`}
                >
                  {event.date}
                </span>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {event.title}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="hidden lg:block lg:w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
