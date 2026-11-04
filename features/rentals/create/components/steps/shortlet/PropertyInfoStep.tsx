import { Info, Bed, Bath, Users } from "lucide-react";

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

const PropertyInfoStep = ({ methods, errors }: Props) => {
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
                  Property Type *
                </label>
                <select
                  {...methods.register("propertyType", {
                    required: "Location is required",
                  })}
                  className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="land">villa</option>
                  <option value="lodge">studio</option>
                  <option value="lodge">condo</option>
                  <option value="lodge">townhouse</option>
                  <option value="lodge">bungalow</option>
                  <option value="lodge">loft</option>
                </select>
                {errors.propertyType && (
                  <p className="text-red-500 text-xs ml-1">
                    {errors.propertyType.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Furnished Status
                </label>
                <select
                  {...methods.register("furnishedStatus")}
                  className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none "
                >
                  <option value="apartment">Fully furnished</option>
                  <option value="house">Unfurnished</option>
                  <option value="land">Semi furnished</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Rental Type
              </label>
              <select
                {...methods.register("rentalModel", {
                  required: "Rental Type is required",
                })}
                className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none"
              >
                <option value="available">Entire Place</option>
                <option value="pending">Private Room</option>
                <option value="locked">Shared Room</option>
                <option value="rented">hotel</option>
              </select>
              {errors.rentalModel && (
                <p className="text-red-500 text-xs ml-1">
                  {errors.rentalModel.message}
                </p>
              )}
            </div>

            <div className=" flex flex-col gap-1.5">
              <h4 className="text-[10px] font-bold text-slate-400">
                Poperty Capacity
              </h4>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <div className=" flex flex-col gap-1.5 border border-amber-50 p-1.5">
                  <div className=" flex flex-col justify-center items-center">
                    <Bed />
                    <h4>Bedrooms</h4>
                  </div>
                  <select
                    {...methods.register("bedrooms")}
                    className="w-full p-1 bg-[#F8FAFC] rounded-2xl border-none"
                  >
                    <option value="">1</option>
                    <option value="">2</option>
                    <option value="">3</option>
                    <option value="">4</option>
                    <option value="">5</option>
                  </select>
                </div>
                <div className=" flex flex-col gap-1.5 border border-amber-50 p-1.5">
                  <div className=" flex flex-col justify-center items-center">
                    <Bath />
                    <h4>Bathroom</h4>
                  </div>
                  <select
                    {...methods.register("bathrooms")}
                    className="w-full p-1 bg-[#F8FAFC] rounded-2xl border-none"
                  >
                    <option value="">1</option>
                    <option value="">2</option>
                    <option value="">3</option>
                    <option value="">4</option>
                    <option value="">5</option>
                  </select>
                </div>
                <div className=" flex flex-col gap-1.5 border border-amber-50 p-1.5">
                  <div className=" flex flex-col justify-center items-center">
                    <Bath />
                    <h4>Livivng Room</h4>
                  </div>
                  <select
                    {...methods.register("livivngRooms")}
                    className="w-full p-1 bg-[#F8FAFC] rounded-2xl border-none"
                  >
                    <option value="">1</option>
                    <option value="">2</option>
                    <option value="">3</option>
                    <option value="">4</option>
                    <option value="">5</option>
                  </select>
                </div>
                <div className=" flex flex-col gap-1.5 border border-amber-50 p-1.5">
                  <div className=" flex flex-col justify-center items-center">
                    <Users />
                    <h4>Guest Capacity</h4>
                  </div>
                  <select
                    {...methods.register("guestCapacity")}
                    className="w-full p-1 bg-[#F8FAFC] rounded-2xl border-none"
                  >
                    <option value="">1</option>
                    <option value="">2</option>
                    <option value="">3</option>
                    <option value="">4</option>
                    <option value="">5</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PropertyInfoStep;
