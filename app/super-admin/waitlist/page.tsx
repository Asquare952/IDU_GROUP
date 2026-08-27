"use client";

import React from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import { useAdminWaitlist } from "@/app/api/features/waitlist";

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const Page = () => {
  const { data: entries = [], isLoading, isError } = useAdminWaitlist();

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Waitlist
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Manage pre-launch waitlist registrations
          </p>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              Loading waitlist...
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">
              Unable to load waitlist.
            </div>
          ) : entries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No waitlist registrations found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500">
                      Email
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {entries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-900">
                        {entry.email}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-500">
                        {formatDate(entry.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Page;
