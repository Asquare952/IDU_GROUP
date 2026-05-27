"use client";

import React, { useMemo, useState } from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import {
  Mail,
  Ban,
  MoreVertical,
  Search,
  Filter,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import {
  useAdminUsers,
  useDeleteAdminUser,
  useToggleAdminUserStatus,
} from "@/app/api/features/admin";
import { toast } from "react-toastify";

const filterTabs = [
  "All Users",
  "Tenants",
  "Landlords",
  "Active",
  "Blocked",
  "Super Admins",
] as const;

const formatDate = (value: string) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
};

const getInitials = (firstName: string, lastName: string, email: string) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim();

  if (initials) {
    return initials.toUpperCase();
  }

  return email.slice(0, 2).toUpperCase() || "U";
};

const getUserStatus = (isActive: boolean, isSuperAdmin: boolean) => {
  if (isSuperAdmin) {
    return "Super Admin";
  }

  return isActive ? "Active" : "Blocked";
};

const Page = () => {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filterTabs)[number]>("All Users");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: users = [], isLoading, isError, error } = useAdminUsers();
  const { mutate: toggleStatus, isPending: isTogglingStatus } =
    useToggleAdminUserStatus();
  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteAdminUser();

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.trim().toLowerCase();
      const role = user.role.toLowerCase();
      const status = getUserStatus(user.is_active, user.is_superadmin);

      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        user.email.toLowerCase().includes(query) ||
        role.includes(query);

      if (!matchesSearch) {
        return false;
      }

      switch (activeFilter) {
        case "Tenants":
          return role === "tenant";
        case "Landlords":
          return role === "landlord";
        case "Active":
          return user.is_active && !user.is_superadmin;
        case "Blocked":
          return !user.is_active;
        case "Super Admins":
          return user.is_superadmin;
        default:
          return true;
      }
    });
  }, [activeFilter, searchQuery, users]);

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
            Total Users: {users.length.toLocaleString()}
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
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search users..."
                className="w-full pl-9 pr-3 py-2 rounded-lg md:rounded-xl border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#43A047]"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg md:rounded-xl text-xs md:text-sm text-gray-600 hover:bg-gray-50">
              <Filter size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeFilter === tab
                    ? "bg-[#43A047] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading users...</div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">
              {error.message || "Unable to load users."}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                        User
                      </th>
                      <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                        Role
                      </th>
                      <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                        Status
                      </th>
                      <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                        Joined
                      </th>
                      <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                        Listings
                      </th>
                      <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => {
                      const fullName =
                        `${user.first_name} ${user.last_name}`.trim() || "Unknown User";
                      const status = getUserStatus(
                        user.is_active,
                        user.is_superadmin,
                      );

                      return (
                        <tr key={user.id} className="hover:bg-gray-50/50">
                          <td className="px-3 md:px-6 py-3 md:py-4">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-[#43A047] flex items-center justify-center text-white font-medium text-xs md:text-sm flex-shrink-0">
                                {getInitials(
                                  user.first_name,
                                  user.last_name,
                                  user.email,
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                                  {fullName}
                                </p>
                                <p className="text-[10px] md:text-xs text-gray-500 truncate">
                                  {user.email || "No email"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600 capitalize">
                            {user.role}
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${
                                status === "Super Admin"
                                  ? "bg-blue-100 text-blue-700"
                                  : status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                            {user.rentalsCount}
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4">
                            <div className="flex items-center gap-1 md:gap-2">
                              <button
                                className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                                title="Email user"
                                onClick={() => {
                                  if (!user.email) {
                                    toast.error("This user does not have an email address.");
                                    return;
                                  }

                                  window.location.href = `mailto:${user.email}`;
                                }}
                              >
                                <Mail size={14} />
                              </button>
                              {!user.is_superadmin ? (
                                <button
                                  className="p-1 text-green-500 hover:bg-green-50 rounded transition-colors"
                                  title={user.is_active ? "Block user" : "Unblock user"}
                                  disabled={isTogglingStatus}
                                  onClick={() =>
                                    toggleStatus(user.id, {
                                      onSuccess: () => {
                                        toast.success(
                                          user.is_active
                                            ? "User status updated to blocked."
                                            : "User status updated to active.",
                                        );
                                      },
                                      onError: (mutationError) => {
                                        toast.error(
                                          mutationError.message ||
                                            "Unable to update this user right now.",
                                        );
                                      },
                                    })
                                  }
                                >
                                  <ShieldCheck size={14} />
                                </button>
                              ) : null}
                              <button
                                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                title="Delete user"
                                disabled={isDeletingUser || user.is_superadmin}
                                onClick={() => {
                                  if (user.is_superadmin) {
                                    toast.error(
                                      "Super admin accounts cannot be deleted here.",
                                    );
                                    return;
                                  }

                                  if (
                                    !window.confirm(
                                      `Delete ${fullName || user.email}?`,
                                    )
                                  ) {
                                    return;
                                  }

                                  deleteUser(user.id, {
                                    onSuccess: () => {
                                      toast.success("User deleted successfully.");
                                    },
                                    onError: (mutationError) => {
                                      toast.error(
                                        mutationError.message ||
                                          "Unable to delete this user.",
                                      );
                                    },
                                  });
                                }}
                              >
                                <Trash2 size={14} />
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
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-3 md:py-4 border-t border-gray-100 gap-3">
                <p className="text-xs md:text-sm text-gray-500">
                  Showing {filteredUsers.length.toLocaleString()} of{" "}
                  {users.length.toLocaleString()} users
                </p>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                  Live data from `/admin/users`
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Page;
