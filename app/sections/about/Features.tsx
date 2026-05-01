import { BadgeCheck, UserX, Video, Banknote } from "lucide-react";
import { featuresData } from "@/app/about-us/infoData/data";

const icons = {
  BadgeCheck,
  UserX,
  Video,
  Banknote,
};

const Features = () => {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-4">
            {featuresData.title}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {featuresData.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuresData.features.map((feature, i) => {
            const Icon = icons[feature.icon as keyof typeof icons];
            return (
              <div key={i} className="text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-xl mb-4">
                  <Icon className="w-6 h-6 text-emerald-700" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm uppercase tracking-wide">
                  {feature.title}
                </h4>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
