import React from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import { users, filterTabs } from "@/app/super-admin/user-management/data/user-management";
import { Mail, CheckCircle, Ban, MoreVertical } from "lucide-react";

const page = () => {
  const usersKey = users.map((user) => user.email).join("|");

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage all users on the platform
            </p>
          </div>
          <button className="bg-[#43A047] hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors cursor-pointer">
            Add New User
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search users by name, email, or ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#43A047]"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
              Filters
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-[#43A047] text-white"
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  User
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  Type
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  Joined
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  Properties
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody key={usersKey} className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.email} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#43A047] flex items-center justify-center text-white font-medium text-sm">
                        {user.initials}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.type}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.properties}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* Message */}
                      <button
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Send message"
                      >
                        <Mail size={16} />
                      </button>

                      {/* Verify */}
                      <button
                        className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                        title="Verify user"
                      >
                        <CheckCircle size={16} />
                      </button>

                      {/* Suspend */}
                      <button
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Suspend user"
                      >
                        <Ban size={16} />
                      </button>

                      {/* More options */}
                      <button
                        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                        title="More options"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Showing 1-5 of 24,583 users</p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm bg-[#43A047] text-white rounded-lg">
                1
              </button>
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                2
              </button>
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                3
              </button>
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
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
