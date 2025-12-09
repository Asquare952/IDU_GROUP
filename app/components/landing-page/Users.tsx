import React from "react";

const Users = () => {
  return (
    <div className="pt-32 pb-16 bg-white mt-25 mb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 justify-around text-center gap-8">
          <div>
            <h2 className="text-5xl font-extrabold text-black">5000+</h2>
            <p className="text-sm text-gray-500">Verified users</p>
          </div>
          <div>
            <h2 className="text-5xl font-extrabold text-black">2000+</h2>
            <p className="text-sm text-gray-500">Rentals settled</p>
          </div>
          <div>
            <h2 className="text-5xl font-extrabold text-black">3000+</h2>
            <p className="text-sm text-gray-500">Trusted landlords</p>
          </div>
          <div>
            <h2 className="text-5xl font-extrabold text-black">4000+</h2>
            <p className="text-sm text-gray-500">Properties rented</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
