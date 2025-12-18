import React from 'react'
import Image from 'next/image'

const CallToAction = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="relative bg-[#34A853] rounded-[12px] p-8 md:p-16 overflow-hidden min-h-[400px] flex items-center">
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
          <Image
            src="/Line 26.png"
            alt="Decorative Line"
            fill
            className="object-contain object-right-top opacity-90"
            priority
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="mb-6">
            <Image
              src="/3people.png"
              alt="Users Icon"
              width={40}
              height={40}
              className="brightness-0 invert"
            />
          </div>

        <h2 className="text-white font-bold text-2xl sm:text-2xl leading-tight mb-6">
            Ready to start Listing your <br />
            properties or seeking houses for <br />
            rent?
          </h2>

          <p className="text-white/90 text-lg sm:text-xl font-medium mb-10 max-w-lg leading-relaxed">
            Join thousands of users, house seekers, and landlords who have
            started listing their properties and renting houses/properties with
            ease.
          </p>

          <button className="bg-white text-[#34A853] font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-md cursor-pointer">
            Get started now
          </button>
        </div>
      </div>
    </div>
  );
}

export default CallToAction
