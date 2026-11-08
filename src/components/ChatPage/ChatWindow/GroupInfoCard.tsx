import { Camera, UserPlus, Users } from "lucide-react";

interface GroupInfoCardProps {
  groupName: string;
  groupAvatar?: string;
  membersCount: number;
  setIsViewMembersModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddGroupMemberModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const GroupInfoCard = ({
  groupName,
  groupAvatar,
  membersCount,
  setIsViewMembersModalOpen,
  setIsAddGroupMemberModalOpen
}: GroupInfoCardProps) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-50 flex flex-col items-center max-w-sm w-full mx-auto">
      {/* Avatar Section with Camera Icon */}
      <div className="relative mb-4 cursor-pointer group">
        <div className="w-24 h-24 rounded-full bg-[#F4E6DB] flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
          {groupAvatar ? (
            <img
              src={groupAvatar}
              alt={groupName}
              className="w-full h-full object-cover"
            />
          ) : (
            <Users size={40} className="text-[#8A6349]" />
          )}
        </div>

        {/* Camera Badge */}
        <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-sm">
          <div className="bg-primary-10 p-1 rounded-full flex items-center justify-center">
            <Camera size={14} className="text-white" />
          </div>
        </div>
      </div>

      {/* Text Details */}
      <h2 className="text-xl font-bold text-neutral-90 mb-1 font-Manrope text-center">
        {groupName}
      </h2>

      <p className="text-sm text-neutral-45 mb-3">
        Group ·{" "}
        <button
          onClick={() => setIsViewMembersModalOpen(true)}
          className="text-primary-10 font-bold hover:underline"
        >
          {membersCount || 0} members
        </button>
      </p>

      {/* <button className="text-sm font-semibold text-primary-10 hover:underline mb-8">
        {description}
      </button> */}

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        <button onClick={() => setIsAddGroupMemberModalOpen(true)} className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-neutral-200 rounded-full text-primary-10 font-semibold hover:bg-primary-10 hover:text-white transition-colors">
          <UserPlus size={18} />
          Add members
        </button>
      </div>
    </div>
  );
};

export default GroupInfoCard;
