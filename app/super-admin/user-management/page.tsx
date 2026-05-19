// app/super-admin/user-management/page.tsx
import React from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import {
  users,
  filterTabs,
} from "@/app/super-admin/user-management/data/user-management";
import {
  Mail,
  CheckCircle,
  Ban,
  MoreVertical,
  Search,
  Filter,
} from "lucide-react";

const page = () => {
  const usersKey = users.map((user) => user.email).join("|");

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Manage all users on the platform
            </p>
          </div>
          <button className="bg-[#43A047] hover:bg-green-600 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-medium transition-colors cursor-pointer text-sm md:text-base w-full sm:w-auto">
            Add New User
          </button>
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-3 md:p-4 space-y-3 md:space-y-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-9 pr-3 py-2 rounded-lg md:rounded-xl border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#43A047]"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg md:rounded-xl text-xs md:text-sm text-gray-600 hover:bg-gray-50">
              <Filter size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Filter Tabs - Horizontal scroll on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filterTabs.map((tab, i) => (
              <button
                key={tab}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                  i === 0
                    ? "bg-[#43A047] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table - Responsiveness */}
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                    User
                  </th>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                    Type
                  </th>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                    Joined
                  </th>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                    Properties
                  </th>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody key={usersKey} className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-50/50">
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-[#43A047] flex items-center justify-center text-white font-medium text-xs md:text-sm flex-shrink-0">
                          {user.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-[10px] md:text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                      {user.type}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${
                          user.status === "Verified"
                            ? "bg-green-100 text-green-700"
                            : user.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                      {user.joined}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                      {user.properties}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center gap-1 md:gap-2">
                        <button
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                          title="Send message"
                        >
                          <Mail size={14} />
                        </button>
                        <button
                          className="p-1 text-green-500 hover:bg-green-50 rounded transition-colors"
                          title="Verify user"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Suspend user"
                        >
                          <Ban size={14} />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                          title="More options"
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-3 md:py-4 border-t border-gray-100 gap-3">
            <p className="text-xs md:text-sm text-gray-500">
              Showing 1-5 of 24,583 users
            </p>
            <div className="flex items-center gap-1 md:gap-2">
              <button className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                Previous
              </button>
              <button className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm bg-[#43A047] text-white rounded-lg">
                1
              </button>
              <button className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                2
              </button>
              <button className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                3
              </button>
              <button className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default page;
