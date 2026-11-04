import { Sparkles } from "lucide-react";

import type { UseFormReturn, FieldErrors } from "react-hook-form";

interface FormData {
  title: string;
  description: string;
  location: string;
  propertyType: string;
  status: string;
  basicRent: number;
  legalFee: number;
  cautionFee: number;
  brokeFee: number;
  mgtServiceCharge: number;
}

interface AmenitiesProp {
  toggle: (item: string) => void;
  selected: (item: string) => boolean;
  methods: UseFormReturn<FormData>;
  errors: FieldErrors<FormData>;
}

const AmenitiesStep = ({
  toggle,
  selected,
  methods,
  errors,
}: AmenitiesProp) => {
  return (
    <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-6 text-[#4CAF50]">
        <div className="bg-[#4CAF50]/10 p-2 rounded-full">
          <Sparkles size={20} />
        </div>
        <h3 className="font-bold text-slate-800">Amenities & Features</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          "24/7 Power",
          "Swimming Pool",
          "Security",
          "Gym",
          "Parking",
          "WiFi",
          "Elevator",
          "Garden",
          "kitchen",
        ].map((item) => (
          <label
            key={item}
            className="flex flex-col items-center justify-center p-4 bg-[#F8FAFC] rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <input
              type="checkbox"
              checked={selected(item)}
              onChange={() => toggle(item)}
              className="mb-2 accent-[#4CAF50]"
            />
            <span className="text-[10px] font-bold text-slate-500 text-center uppercase">
              {item}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
};

export default AmenitiesStep;
