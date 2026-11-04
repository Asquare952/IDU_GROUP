import { BadgeCheck, MessageCircle, UserRound } from "lucide-react";

interface ShortletHostDetailsProps {
  hostName?: string;
  hostImage?: string;
  verified?: boolean;
  onMessageHost?: () => void;
}

export default function ShortletHostDetails({
  hostName,
  hostImage,
  verified = false,
  onMessageHost,
}: ShortletHostDetailsProps) {
  if (!hostName && !hostImage) {
    return null;
  }

  const displayName = hostName || "Host";

  return (
    <section className="w-full border-b border-gray-200 py-10 sm:py-12">
      <h2 className="mb-7 text-2xl font-semibold tracking-tight text-gray-900">
        Meet your host
      </h2>

      <div className="flex flex-wrap items-center gap-5">
        <div className="relative shrink-0">
          {hostImage ? (
            <img
              src={hostImage}
              alt={displayName}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <UserRound size={36} />
            </div>
          )}
          {verified && (
            <span
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#43A047] text-white ring-4 ring-white"
              aria-label="Verified host"
            >
              <BadgeCheck size={17} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-gray-900">
            {displayName}
          </h3>
          {verified && (
            <p className="mt-1 text-sm text-gray-500">Verified host</p>
          )}
          {onMessageHost && (
            <button
              type="button"
              onClick={onMessageHost}
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-gray-100 px-5 py-2 font-semibold text-gray-900 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#43A047]"
            >
              <MessageCircle size={18} />
              Message host
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 flex items-start gap-3 text-sm leading-6 text-gray-500">
        <BadgeCheck size={20} className="shrink-0 text-[#43A047]" />
        Keep communication and payments within RentULO for your safety.
      </p>
    </section>
  );
}
