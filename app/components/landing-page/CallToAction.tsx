import React from 'react'
import Image from 'next/image'

const CallToAction = () => {
  return (
  <div className="w-full bg-[#43A047] relative overflow-hidden py-16 md:py-20 mb-7">
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        
        <h2 className="text-4xl font-semibold leading-tight mb-6">
          Ready to start Listing your properties or <br />
          seeking houses for rent?
        </h2>
        
        <p className="text-lg md:text-xl opacity-90 mb-10 max-w-3xl mx-auto leading-relaxed">
          Join thousands of users, house seekers, and landlords who have <br />
          started listing their properties and renting houses/properties with ease.
        </p>

        <button className="bg-white text-[#43A047] font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-all active:scale-95 cursor-pointer">
          Get started now
        </button>
      </div>
    </div>
  );
}

export default CallToAction
