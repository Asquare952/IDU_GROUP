import { Shield, CheckCircle, Home } from "lucide-react";
import { missionData } from "@/app/about-us/infoData/data";

const icons = {
  Shield,
  CheckCircle,
  Home,
};

const Mission = () => {
  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-4">
            {missionData.title}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {missionData.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {missionData.cards.map((card, i) => {
            const Icon = icons[card.icon as keyof typeof icons];
            return (
              <div
                key={i}
                className="bg-white rounded-[24px] p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold text-emerald-800 mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Mission;
