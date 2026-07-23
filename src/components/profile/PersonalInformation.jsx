import React from "react";

const PersonalInformation = ({ user, onEdit }) => {
  return (
    <div className="bg-[#0f1524]/90 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
          <span>👤</span> Personal Information
        </h3>
        <button className="px-3 py-1.5 text-xs font-bold text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer" onClick={onEdit}>
          ✏️ Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#161f33]/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400 block">Age</span>
          <span className="text-sm font-bold text-white block">{user?.age ? `${user.age} yrs` : "Not specified"}</span>
        </div>

        <div className="bg-[#161f33]/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400 block">Gender</span>
          <span className="text-sm font-bold text-white block">{user?.gender || "Not specified"}</span>
        </div>

        <div className="bg-[#161f33]/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400 block">Height</span>
          <span className="text-sm font-bold text-white block">{user?.height ? `${user.height} cm` : "Not specified"}</span>
        </div>

        <div className="bg-[#161f33]/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400 block">Weight</span>
          <span className="text-sm font-bold text-white block">{user?.weight ? `${user.weight} kg` : "Not specified"}</span>
        </div>

        <div className="col-span-2 bg-[#161f33]/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400 block">Bio / Notes</span>
          <span className="text-sm font-medium text-gray-300 block italic">{user?.bio || "No bio added yet."}</span>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
