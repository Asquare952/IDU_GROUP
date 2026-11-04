"use client";

import { Check } from "lucide-react";

type Step = {
  id: string;
  title: string;
  shortTitle: string;
};

type StepIndicatorProps = {
  steps: readonly Step[];
  currentStep: number;
};

export default function StepIndicator({
  steps,
  currentStep,
}: StepIndicatorProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="w-full">
      {/* Mobile Indicator */}
      <div className="space-y-3 md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">
              STEP {currentStep + 1} OF {steps.length}
            </p>

            <h3 className="mt-1 text-base font-semibold text-gray-900">
              {steps[currentStep]?.title}
            </h3>
          </div>

          <span className="text-sm font-semibold text-green-600">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-green-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Desktop Indicator */}
      <div className="hidden items-start md:flex">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-1 items-start last:flex-none"
            >
              <div className="flex w-full items-start">
                {/* Circle and Label */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                      isCompleted || isActive
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
                  </div>

                  <span
                    className={`mt-2 whitespace-nowrap text-xs font-medium ${
                      isActive || isCompleted
                        ? "text-green-700"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 mt-5 h-0.5 flex-1 transition-colors ${
                      index < currentStep ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
