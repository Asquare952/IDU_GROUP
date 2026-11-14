"use client";

import { isAxiosError } from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Home,
  Mail,
  MapPin,
  Phone,
  Wallet,
} from "lucide-react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { useGetRentedPropertyById } from "@/app/api/features/rental";

const formatMoney = (value: string | number) =>
  `₦${Number(value).toLocaleString("en-NG")}`;

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 py-3 last:border-0 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="break-words text-sm font-medium text-gray-900 sm:text-right">
        {value}
      </dd>
    </div>
  );
}

export default function RentedPropertyDetailsPage() {
  const params = useParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data, isLoading, isError, error } = useGetRentedPropertyById(id);
  const errorMessage = isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message || error.message
    : error?.message;

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-[#FBFBFC] p-4 md:p-8">
        <Link
          href="/landlord/rented-properties"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#43A047] hover:underline"
        >
          <ArrowLeft size={17} />
          Back to rented properties
        </Link>

        {isLoading && (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
            Loading tenancy details…
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
            {errorMessage || "Unable to load rented property details."}
          </div>
        )}

        {!isLoading && !isError && data && (
          <div className="space-y-6">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#43A047]">
                  Rented property
                </p>
                <h1 className="mt-1 text-2xl font-bold text-[#162B4C] md:text-3xl">
                  {data.property.title}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} />
                  {data.property.location}
                </p>
              </div>
              <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold capitalize text-blue-700">
                Tenancy {data.tenancy.status}
              </span>
            </header>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
              <div className="space-y-6">
                <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  {data.property.images[0] ? (
                    <img
                      src={data.property.images[0]}
                      alt={data.property.title}
                      className="max-h-[420px] w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-gray-100 text-gray-400">
                      <Home size={44} />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-sm leading-6 text-gray-600">
                      {data.property.description || "No description provided."}
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <InfoRow
                        label="Property type"
                        value={data.property.propertyType}
                      />
                      <InfoRow
                        label="Rent"
                        value={`${formatMoney(data.property.price)} / ${data.property.priceType}`}
                      />
                    </div>
                    {data.property.amenities.length > 0 && (
                      <div className="mt-5">
                        <h2 className="font-semibold text-gray-900">
                          Amenities
                        </h2>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {data.property.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <CalendarDays className="text-[#43A047]" size={20} />
                    <h2 className="text-lg font-bold text-gray-900">
                      Tenancy period
                    </h2>
                  </div>
                  {data.tenancy.datesDerived && (
                    <p className="mb-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                      The tenancy dates are estimated from the rent payment date
                      and rent period.
                    </p>
                  )}
                  <dl>
                    <InfoRow label="Status" value={data.tenancy.status} />
                    <InfoRow
                      label="Start date"
                      value={formatDate(data.tenancy.startDate)}
                    />
                    <InfoRow
                      label="End date"
                      value={formatDate(data.tenancy.endDate)}
                    />
                    <InfoRow
                      label="Rent period"
                      value={data.tenancy.priceType}
                    />
                  </dl>
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    {data.tenant?.image ? (
                      <img
                        src={data.tenant.image}
                        alt=""
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <span className="h-14 w-14 rounded-full bg-gray-100" />
                    )}
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-gray-900">
                        {data.tenant?.fullName || "Tenant details unavailable"}
                      </h2>
                      {data.tenant?.verified && (
                        <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-green-700">
                          <BadgeCheck size={14} />
                          Verified account
                        </p>
                      )}
                    </div>
                  </div>
                  {data.tenant ? (
                    <dl>
                      <InfoRow label="Address" value={data.tenant.address} />
                      <InfoRow
                        label="State / country"
                        value={[data.tenant.state, data.tenant.country]
                          .filter(Boolean)
                          .join(", ")}
                      />
                      <div className="flex items-center gap-2 border-b border-gray-100 py-3 text-sm">
                        <Phone size={15} className="text-gray-400" />
                        {data.tenant.phone ? (
                          <a
                            href={`tel:${data.tenant.phone}`}
                            className="font-medium text-[#43A047] hover:underline"
                          >
                            {data.tenant.phone}
                          </a>
                        ) : (
                          <span className="text-gray-500">
                            Phone not provided
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 py-3 text-sm">
                        <Mail size={15} className="text-gray-400" />
                        {data.tenant.email ? (
                          <a
                            href={`mailto:${data.tenant.email}`}
                            className="break-all font-medium text-[#43A047] hover:underline"
                          >
                            {data.tenant.email}
                          </a>
                        ) : (
                          <span className="text-gray-500">
                            Email not provided
                          </span>
                        )}
                      </div>
                    </dl>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Tenant details are unavailable for this property.
                    </p>
                  )}
                </section>

                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Wallet className="text-[#43A047]" size={20} />
                    <h2 className="text-lg font-bold text-gray-900">
                      Rent payment
                    </h2>
                  </div>
                  {data.transaction ? (
                    <dl>
                      <InfoRow
                        label="Amount paid"
                        value={formatMoney(data.transaction.amountPaid)}
                      />
                      <InfoRow
                        label="Payment status"
                        value={data.transaction.paymentStatus}
                      />
                      <InfoRow
                        label="Payment method"
                        value={data.transaction.paymentMethod}
                      />
                      <InfoRow
                        label="Paid on"
                        value={formatDate(data.transaction.paidAt)}
                      />
                      <InfoRow
                        label="Reference"
                        value={data.transaction.reference}
                      />
                    </dl>
                  ) : (
                    <p className="text-sm leading-6 text-gray-500">
                      Payment details are unavailable for this older rental. The
                      tenancy status may be unknown if the original payment
                      could not be matched.
                    </p>
                  )}
                </section>
              </div>
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
