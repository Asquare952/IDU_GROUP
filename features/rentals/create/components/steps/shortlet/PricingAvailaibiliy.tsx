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

const PricingAvailaibiliy = ({ methods, errors }: Props) => {
  return (
    <section className="flex flex-col gap-3 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
      <div className=" flex flex-col gap-1.5">
        <div className="flex items-center gap-2 mb-6 text-[#4CAF50]">
          <div className="bg-[#4CAF50]/10 p-2 rounded-full">
            <DollarSign size={20} />
          </div>
          <h3 className="font-bold text-slate-800">Financial Breakdown</h3>
        </div>
        <div className="space-y-4">
          {/*  */}
          <div>
            <label className="text-[10px] font-bold text-[#4CAF50] uppercase ml-1">
              Basic Rent (Per night) *
            </label>
            <input
              type="number"
              {...methods.register("pricePerNight", {
                valueAsNumber: true,
                required: "Rent is required",
                min: { value: 1, message: "Must be greater than 0" },
              })}
              className="w-full p-3 bg-[#F8FAFC] rounded-xl"
            />
            {errors.pricePerNight && (
              <p className="text-red-500 text-xs ml-1">
                {errors.pricePerNight.message}
              </p>
            )}
          </div>

          {/*  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Cleaning Fee
              </label>
              <input
                type="number"
                step="0.01"
                {...methods.register("cleaningFee", {
                  valueAsNumber: true,
                })}
                className="w-full p-3 bg-[#F8FAFC] rounded-xl"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Security Deposit
              </label>
              <input
                type="number"
                step="0.01"
                {...methods.register("securityDeposit", {
                  valueAsNumber: true,
                })}
                className="w-full p-3 bg-[#F8FAFC] rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <h3 className="font-bold text-slate-800">Stay Duration</h3>

        <div className="space-y-4">
          {/*  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Minimum Stay
              </label>
              <input
                type="number"
                step="0.01"
                {...methods.register("minimumStay", {
                  valueAsNumber: true,
                })}
                className="w-full p-3 bg-[#F8FAFC] rounded-xl"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Maximum Stay
              </label>
              <input
                type="number"
                step="0.01"
                {...methods.register("maximumStay", {
                  valueAsNumber: true,
                })}
                className="w-full p-3 bg-[#F8FAFC] rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <h3 className="font-bold text-slate-800">Availability</h3>

        <div className="space-y-4">
          {/*  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Available From
              </label>
              <input
                id="date"
                type="date"
                {...methods.register("availableFrom", {
                  required: "Date is required",
                })}
                placeholder="State of residence"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white placeholder:text-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#43A047]"
                required
              />
              {errors.availableFrom && (
                <p className="text-red-500 text-xs ml-1">
                  {errors.availableFrom.message}
                </p>
              )}
            </div>

            {/*  */}
            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Available To
              </label>
              <input
                id="date"
                type="date"
                {...methods.register("availableTo", {
                  required: "Date is required",
                })}
                placeholder="State of residence"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white placeholder:text-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#43A047]"
                required
              />
              {errors.availableTo && (
                <p className="text-red-500 text-xs ml-1">
                  {errors.availableTo.message}
                </p>
              )}
            </div>

            {/*  */}
            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Checkin-Time
              </label>
              <input
                id="time"
                type="time"
                {...methods.register("checkInTime", {
                  required: "Date is required",
                })}
                placeholder="State of residence"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white placeholder:text-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#43A047]"
                required
              />
              {errors.checkInTime && (
                <p className="text-red-500 text-xs ml-1">
                  {errors.checkInTime.message}
                </p>
              )}
            </div>

            {/*  */}
            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Checkout-Time
              </label>
              <input
                id="time"
                type="time"
                {...methods.register("checkOutTime", {
                  required: "Date is required",
                })}
                placeholder="State of residence"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white placeholder:text-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#43A047]"
                required
              />
              {errors.checkOutTime && (
                <p className="text-red-500 text-xs ml-1">
                  {errors.checkOutTime.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingAvailaibiliy;
