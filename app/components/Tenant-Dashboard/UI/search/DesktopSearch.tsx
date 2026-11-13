import { Search } from 'lucide-react';

interface DesktopSearchProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const DesktopSearch = ({
  searchValue = "",
  onSearchChange,
}: DesktopSearchProps) => {
  return (
    <div
      className={`relative hidden md:block ${
        onSearchChange
          ? "w-full max-w-2xl rounded-full border border-gray-200 bg-white shadow-sm transition focus-within:border-[#43A047] focus-within:shadow-md"
          : "rounded-[100px] bg-[#F8F8F8A8]"
      }`}
    >
      <input
        type={onSearchChange ? "search" : "text"}
        value={onSearchChange ? searchValue : undefined}
        onChange={(event) => onSearchChange?.(event.target.value)}
        placeholder={
          onSearchChange
            ? "Search houses, shortlets, areas..."
            : "Search houses, areas, landlords"
        }
        aria-label={
          onSearchChange
            ? "Search recommended houses and shortlets"
            : undefined
        }
        className={
          onSearchChange
            ? "w-full rounded-full border-none bg-transparent py-3.5 pl-12 pr-12 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
            : "border-none py-3 pl-13 pr-24 lg:pr-80 focus:outline-[#43A047] rounded-full"
        }
      />
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
    </div>
  )
}

export default DesktopSearch
