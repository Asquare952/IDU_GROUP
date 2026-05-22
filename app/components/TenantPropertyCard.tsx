import Image from "next/image";
import { HiOutlineHeart } from "react-icons/hi";
import { FaBed, FaBath } from "react-icons/fa";
import { useLikeRental } from "../api";
import Link from "next/link";
import type { Property } from "../api/features/property";
import { getPropertyDetailsPath } from "../lib/property-routes";

const TenantPropertyCard = ({ house }: { house: Property }) => {
  const likeRental = useLikeRental();
  const image = house.images[0];

  return (
    <Link
      href={getPropertyDetailsPath(house)}
      className="bg-white rounded-[20px] p-2 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      <div className="relative w-full h-[220px] rounded-[12px] overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={house.title}
            fill
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 rounded-[12px]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-400">
            No image
          </div>
        )}
        <button
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:text-red-500 transition cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            likeRental.mutate(house.id);
          }}
        >
          <HiOutlineHeart size={20} />
        </button>
      </div>
      <div className="mt-4 px-1  px-2 py-1 ">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <p className="text-[18px] font-bold text-gray-900">
              N{house.price.toLocaleString()}
            </p>
            {house.added && (
              <span className="text-[10px] text-gray-400 mt-1">
                {house.added}
              </span>
            )}
          </div>

          <button className="bg-[#E8F5E9] text-[#4CAF50] text-[10px] px-4 py-1.5 rounded-full font-bold uppercase tracking-wider hover:bg-green-100 transition cursor-pointer">
            View
          </button>
        </div>
        <h3 className="text-[15px] font-semibold text-gray-800 mt-1 py-1 ">
          {house.title}
        </h3>
        <p className="text-[13px] text-gray-500 mt-1 leading-relaxed line-clamp-2">
          {house.description}
        </p>
        <div className="flex justify-between items-center mt-4 border-t border-gray-100 pt-3">
          <div className="flex gap-4 text-sm">
            {house.bathrooms && (
              <div className="flex items-center gap-1 text-green-600">
                <FaBath size={14} />
                <span className="text-gray-600 text-xs">
                  {house.bathrooms} bathrooms
                </span>
              </div>
            )}

            {house.bedrooms && (
              <div className="flex items-center gap-1 text-green-600">
                <FaBed size={14} />
                <span className="text-gray-600 text-xs">
                  {house.bedrooms} bedrooms
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TenantPropertyCard;
