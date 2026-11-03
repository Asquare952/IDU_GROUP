import {
  CalendarDays,
  Clock,
  DoorOpen,
  FileText,
  ShieldCheck,
} from "lucide-react";

interface ShortletInfoProps {
  checkInTime?: string;
  checkOutTime?: string;
  houseRules?: string[];
  safetyDetails?: string[];
  cancellationPolicy?: string;
  cancellationDetails?: string;
}

export default function ShortletInfo({
  checkInTime,
  checkOutTime,
  houseRules = [],
  safetyDetails = [],
  cancellationPolicy,
  cancellationDetails,
}: ShortletInfoProps) {
  const sections = [
    {
      icon: FileText,
      title: "House rules and requests",
      description: "Review these details for a smooth stay.",
      items: houseRules,
    },
    {
      icon: ShieldCheck,
      title: "Safety & property",
      description: "Check the property's safety information.",
      items: safetyDetails,
    },
    {
      icon: CalendarDays,
      title: cancellationPolicy || "Cancellation policy",
      description: cancellationDetails,
      items: [],
    },
  ];

  const hasCheckInOut = Boolean(checkInTime || checkOutTime);
  const visibleSections = sections.filter(
    ({ title }) =>
      (title === "House rules and requests" && houseRules.length > 0) ||
      (title === "Safety & property" && safetyDetails.length > 0) ||
      (title === (cancellationPolicy || "Cancellation policy") &&
        Boolean(cancellationPolicy || cancellationDetails)),
  );

  if (!hasCheckInOut && visibleSections.length === 0) {
    return null;
  }

  return (
    <section className="w-full border-t border-gray-200 py-10 sm:py-12">
      <h2 className="mb-8 text-2xl font-semibold tracking-tight text-gray-900">
        Things to know
      </h2>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {hasCheckInOut && (
          <div className="flex flex-col items-start">
            <DoorOpen size={25} className="mb-4 text-[#43A047]" />

            <h3 className="mb-3 font-semibold text-gray-900">
              Check-in and check-out
            </h3>

            <div className="space-y-3 text-sm text-gray-600">
              {checkInTime && (
                <p className="flex items-center gap-2">
                  <Clock size={16} />
                  Check in after {checkInTime}
                </p>
              )}
              {checkOutTime && (
                <p className="flex items-center gap-2">
                  <Clock size={16} />
                  Check out before {checkOutTime}
                </p>
              )}
            </div>
          </div>
        )}

        {visibleSections.map(({ icon: Icon, title, description, items }) => (
          <div key={title} className="flex flex-col items-start">
            <Icon size={25} className="mb-4 text-[#43A047]" />

            <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>

            {description && (
              <p className="text-sm leading-6 text-gray-600">{description}</p>
            )}

            {items.length > 0 && (
              <ul className="mt-3 space-y-2">
                {items.map((item) => (
                  <li key={item} className="text-sm leading-6 text-gray-600">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
