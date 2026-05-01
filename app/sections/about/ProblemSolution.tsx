import { X, Check } from "lucide-react";
import { problemSolutionData } from "@/app/about-us/infoData/data";

const ProblemSolution = () => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[32px] overflow-hidden shadow-xl">
          <div className="bg-slate-900 text-white p-10 lg:p-12">
            <h3 className="text-2xl font-bold mb-8">
              {problemSolutionData.problem.title}
            </h3>
            <ul className="space-y-5">
              {problemSolutionData.problem.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-emerald-800 text-white p-10 lg:p-12">
            <h3 className="text-2xl font-bold mb-8">
              {problemSolutionData.solution.title}
            </h3>
            <ul className="space-y-5">
              {problemSolutionData.solution.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-emerald-50">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
