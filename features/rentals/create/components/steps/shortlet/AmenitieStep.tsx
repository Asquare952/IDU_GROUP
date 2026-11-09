import { Sparkles } from "lucide-react";

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

interface AmenitiesProp {
  toggle: (item: string) => void;
  selected: (item: string) => boolean;
  methods: UseFormReturn<FormData>;
  errors: FieldErrors<FormData>;
}

type AmenityCategory = {
  title: string;
  description: string;
  items: { value: string; label: string }[];
};

const amenityCategories: AmenityCategory[] = [
  {
    title: "Popular",
    description: "The essentials guests often look for first.",
    items: [
      { value: "WiFi", label: "Wi-Fi" },
      { value: "24/7 Power", label: "24/7 power" },
      { value: "Security", label: "Security" },
      { value: "Parking", label: "Free parking" },
    ],
  },
  {
    title: "Kitchen & dining",
    description: "Things guests can use to prepare and enjoy meals.",
    items: [
      { value: "kitchen", label: "Kitchen" },
      { value: "Refrigerator", label: "Refrigerator" },
      { value: "Microwave", label: "Microwave" },
      { value: "Cooking basics", label: "Cooking basics" },
      { value: "Dining area", label: "Dining area" },
    ],
  },
  {
    title: "Bathroom",
    description: "Bathroom essentials and everyday comforts.",
    items: [
      { value: "Hot water", label: "Hot water" },
      { value: "Towels", label: "Towels" },
      { value: "Hair dryer", label: "Hair dryer" },
    ],
  },
  {
    title: "Bedroom & laundry",
    description: "Comforts for a good night's sleep and longer stays.",
    items: [
      { value: "Bed linens", label: "Bed linens" },
      { value: "Wardrobe", label: "Wardrobe" },
      { value: "Iron", label: "Iron" },
      { value: "Washing machine", label: "Washing machine" },
    ],
  },
  {
    title: "Entertainment",
    description: "Ways for guests to relax and stay entertained.",
    items: [
      { value: "TV", label: "TV" },
      { value: "Streaming services", label: "Streaming services" },
      { value: "Gym", label: "Gym" },
    ],
  },
  {
    title: "Heating & cooling",
    description: "Keep the space comfortable in every season.",
    items: [
      { value: "Air conditioning", label: "Air conditioning" },
      { value: "Ceiling fan", label: "Ceiling fan" },
    ],
  },
  {
    title: "Outdoor & facilities",
    description: "Shared or private spaces available to guests.",
    items: [
      { value: "Swimming Pool", label: "Swimming pool" },
      { value: "Garden", label: "Garden" },
      { value: "Balcony", label: "Balcony" },
      { value: "Elevator", label: "Elevator" },
    ],
  },
];

const AmenitieStep = ({ toggle, selected, methods, errors }: AmenitiesProp) => {
  return (
    <section className="space-y-8 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#4CAF50]/10 p-2 text-[#4CAF50]">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Amenities</h3>
            <p className="mt-1 text-sm text-slate-500">
              Choose the amenities available at your property.
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
          {
            amenityCategories
              .flatMap((category) => category.items)
              .filter((item) => selected(item.value)).length
          }{" "}
          selected
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {amenityCategories.map((category) => (
          <section key={category.title} className="py-6 first:pt-0 last:pb-0">
            <div className="mb-4">
              <h4 className="font-semibold text-slate-900">{category.title}</h4>
              <p className="mt-1 text-sm text-slate-500">
                {category.description}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {category.items.map((item) => {
                const isSelected = selected(item.value);

                return (
                  <label
                    key={item.value}
                    className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors hover:border-slate-400 ${
                      isSelected
                        ? "border-[#4CAF50] bg-green-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggle(item.value)}
                      className="size-4 shrink-0 accent-[#4CAF50]"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};

export default AmenitieStep;
