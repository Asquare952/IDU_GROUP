import { MapPin } from "lucide-react";

import type { UseFormReturn, FieldErrors } from "react-hook-form";

interface Props {
  methods: UseFormReturn<FormData>;
  errors: FieldErrors<FormData>;
}

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

const LocationStep = ({ methods, errors }: Props) => {
  return (
    <div>
      <div className="lg:col-span-8 space-y-8">
        {/* Location */}
        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6 text-[#4CAF50]">
            <div className="bg-[#4CAF50]/10 p-2 rounded-full">
              <MapPin size={20} />
            </div>
            <div className=" flex flex-col gap-1">
              <h3 className="font-bold text-slate-800">Location</h3>
              <p className=" text-[14px] text-gray-300">
                Helps renters find your property easily
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Property Address *
              </label>
              <input
                {...methods.register("address", {
                  required: "Address is required",
                })}
                placeholder="e.g. 12 Allen Avenue, Ikeja"
                className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none focus:ring-2 focus:ring-[#4CAF50]"
              />
              {errors.address && (
                <p className="text-red-500 text-xs ml-1">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  City *
                </label>
                <select
                  {...methods.register("city", {
                    required: "City is required",
                  })}
                  className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none"
                >
                  <option value="">Select a city</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Imo">Imo</option>
                  <option value="Ogun">Ogun</option>
                </select>
                {errors.city && (
                  <p className="text-red-500 text-xs ml-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Area *
                </label>
                <select
                  {...methods.register("area", {
                    required: "City is required",
                  })}
                  className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none"
                >
                  <option value="">Select an area</option>
                  <option value="Ikeja">Ikeja</option>
                  <option value="Oshodi">Oshodi</option>
                  <option value="Iyana Ipaja">Iyana Ipaja</option>
                  <option value="Lekki">Lekki</option>
                </select>
                {errors.area && (
                  <p className="text-red-500 text-xs ml-1">
                    {errors.area.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Landmark
              </label>
              <input
                {...methods.register("landmark")}
                placeholder="e.g. Luxury 3-Bedroom apartment with Ocean View"
                className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none focus:ring-2 focus:ring-[#4CAF50]"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LocationStep;
