import type { UseFormReturn, FieldErrors } from "react-hook-form";

interface FormData {
  title: string;
  description: string;
  location: string;
  propertyType: string;
  furnishedStatus: string;
  status: string;
  rentalModel: string;
  bedrooms: Number;
  bathrooms: Number;
  livivngRooms: Number;
  guestCapacity: Number;
  address: string;
  city: string;
  area: string;
  landmark: string;
  pricePerNight: number;
  cleaningFee: number;
  securityDeposit: number;
  minimumStay: string;
  maximumStay: string;
  availableFrom: string;
  availableTo: string;
  checkInTime: string;
  checkOutTime: string;
  smokingAllowed: string;
  petsAllowed: string;
  partiesAllowed: string;
  houseRules: string;
}

interface Props {
  methods: UseFormReturn<FormData>;
  errors: FieldErrors<FormData>;
}

import { DollarSign } from "lucide-react";

const HouseRuleStep = ({ methods, errors }: Props) => {
  return (
    <section className="flex flex-col gap-3 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
      <div className=" flex flex-col gap-1.5">
        <div className="flex items-center gap-2 mb-6 text-[#4CAF50]">
          <div className="bg-[#4CAF50]/10 p-2 rounded-full">
            <DollarSign size={20} />
          </div>
          <h3 className="font-bold text-slate-800">House Rules</h3>
        </div>

        {/*  */}
        <div className="space-y-4">
          {/*  */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/*  */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Smoking
              </label>
              <select
                {...methods.register("smokingAllowed")}
                className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none"
              >
                <option value="">Select an option</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Pet
              </label>
              <select
                {...methods.register("petsAllowed")}
                className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none"
              >
                <option value="">Select an option</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Parties
              </label>
              <select
                {...methods.register("partiesAllowed")}
                className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none"
              >
                <option value="">Select an option</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              House Rules (one per line)
            </label>
            <textarea
              {...methods.register("houseRules", {
                required: "Description is required",
              })}
              rows={5}
              className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none focus:ring-2 focus:ring-[#4CAF50]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HouseRuleStep;
