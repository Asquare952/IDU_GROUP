import React from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";

const page = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-500">
            Super admin settings will live here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default page;
