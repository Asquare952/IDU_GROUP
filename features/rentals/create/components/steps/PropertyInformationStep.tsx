import {
  Upload,
  Info,
  DollarSign,
  Sparkles,
  Image as ImageIcon,
  X,
  Loader2,
} from "lucide-react";

import type {
  UseFormReturn,
  FieldErrors,
} from "react-hook-form";

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

interface Props{
  methods: UseFormReturn<FormData>;
  errors: FieldErrors<FormData>
}

const PropertyInformationStep = ({methods, errors}: Props) => {
  return (
    <div>
      <div className="lg:col-span-8 space-y-8">
        {/* General Information */}
        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6 text-[#4CAF50]">
            <div className="bg-[#4CAF50]/10 p-2 rounded-full">
              <Info size={20} />
            </div>
            <h3 className="font-bold text-slate-800">General Information</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Property Title *
              </label>
              <input
                {...methods.register("title", {
                  required: "Title is required",
                })}
                placeholder="e.g. Luxury 3-Bedroom apartment with Ocean View"
                className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none focus:ring-2 focus:ring-[#4CAF50]"
              />
              {errors.title && (
                <p className="text-red-500 text-xs ml-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Description *
              </label>
              <textarea
                {...methods.register("description", {
                  required: "Description is required",
                })}
                rows={5}
                placeholder="Describe the key features, neighborhood, and unique selling points..."
                className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none focus:ring-2 focus:ring-[#4CAF50]"
              />
              {errors.description && (
                <p className="text-red-500 text-xs ml-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Location / City *
                </label>
                <select
                  {...methods.register("location", {
                    required: "Location is required",
                  })}
                  className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none"
                >
                  <option value="">Select a location</option>
                  <option value="lagos">Lagos</option>
                  <option value="abuja">Abuja</option>
                  <option value="port-harcourt">Jos</option>
                  <option value="imo">Imo</option>
                  <option value="enugu">Enugu</option>
                  <option value="enugu">Abia</option>
                </select>
                {errors.location && (
                  <p className="text-red-500 text-xs ml-1">
                    {errors.location.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Property Type
                </label>
                <select
                  {...methods.register("propertyType")}
                  className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none "
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="land">Land</option>
                  <option value="lodge">Lodge</option>
                  <option value="lodge">Self-contain</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                House Status
              </label>
              <select
                {...methods.register("status")}
                className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none"
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="locked">Locked</option>
                <option value="rented">Rented</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PropertyInformationStep;
