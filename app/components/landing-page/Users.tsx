import React from "react";

const Users = () => {
  return (
    <section className="bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 items-center">
          <div className="flex flex-col items-center md:items-start md:pl-10 py-8 md:border-r border-gray-200">
            <h2 className="text-5xl font-bold text-[#1A2B49] mb-2">5000+</h2>
            <p className="text-sm font-medium text-gray-400">Verified users</p>
          </div>

          <div className="flex flex-col items-center md:items-start md:pl-10 py-8 md:border-r border-gray-200">
            <h2 className="text-5xl font-bold text-[#1A2B49] mb-2">2000+</h2>
            <p className="text-sm font-medium text-gray-400">
              Verified landlords
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start md:pl-10 py-8 md:border-r border-gray-200">
            <h2 className="text-5xl font-bold text-[#1A2B49] mb-2">3000+</h2>
            <p className="text-sm font-medium text-gray-400">Properties sold</p>
          </div>

          <div className="flex flex-col items-center md:items-start md:pl-10 py-8">
            <h2 className="text-5xl font-bold text-[#1A2B49] mb-2">4000+</h2>
            <p className="text-sm font-medium text-gray-400">
              Properties rented
            </p>
          </div>
        </div>
        <hr className="mt-20 border-gray-100" />
      </div>
    </section>
  );
};

export default Users;
