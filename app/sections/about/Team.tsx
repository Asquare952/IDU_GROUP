import Image from "next/image";
import { Handshake, Ban } from "lucide-react";
import { teamData } from "@/app/about-us/infoData/data";

const Team = () => {
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-6">
          {teamData.title}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          &quot;{teamData.quote}&quot;
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {teamData.members.map((member, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-200 mb-4 border-4 border-white shadow-md">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">No Image</div>
                )}
              </div>
              <h4 className="font-bold text-gray-900 text-sm">{member.name}</h4>
              <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mt-1">
                {member.role}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="bg-emerald-50 text-emerald-800 rounded-2xl p-6 font-semibold border border-emerald-100 flex items-center justify-center gap-3">
            <Handshake className="w-5 h-5" />
            {teamData.message.good}
          </div>
          <div className="bg-red-50 text-red-700 rounded-2xl p-6 font-semibold border border-red-100 flex items-center justify-center gap-3">
            <Ban className="w-5 h-5" />
            {teamData.message.bad}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
