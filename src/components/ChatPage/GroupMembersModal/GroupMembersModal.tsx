import { User } from "lucide-react";
import Loader from "../../Reusable/Loader/Loader";
import Modal from "../../Reusable/Modal/Modal";

const GroupMembersModal = ({
  isModalOpen,
  setIsModalOpen,
  isLoading,
  members,
  admins,
}) => {
  return (
    <Modal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      heading={`Members (${members?.length})`}
    >
      <div className="relative font-Inter">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}

        {/* Admins */}
        <div className="flex flex-col">
          <p className="text-neutral-5 text-sm font-semibold">Group Admin(s)</p>
          {admins?.map((admin) => (
            <div
              key={admin?._id}
              className={`flex items-center justify-between border-b border-primary-10/20 py-3`}
            >
              <div className="flex items-center gap-2">
                {admin?.profilePicture ? (
                  <img
                    src={admin?.profilePicture}
                    alt=""
                    className="size-8 rounded-full"
                  />
                ) : (
                  <User size={18} className="text-primary-10" />
                )}
                <p className="text-neutral-5/90 text-sm font-medium">
                  {admin?.name}
                </p>
              </div>

              <div className="bg-primary-10/20 rounded-lg px-3 py-2">
                <p className="text-primary-10 font-semibold text-xs">Admin</p>
              </div>
            </div>
          ))}
        </div>

        {/* Other members */}
        <div className="flex flex-col mt-8">
          <p className="text-neutral-5 text-sm font-semibold">Other Members</p>
          {members?.map((member) => (
            <div
              key={member?._id}
              className={`flex items-center justify-between border-b border-primary-10/20 py-3`}
            >
              <div className="flex items-center gap-2">
                {member?.profilePicture ? (
                  <img
                    src={member?.profilePicture}
                    alt=""
                    className="size-8 rounded-full"
                  />
                ) : (
                  <div className="size-8 rounded-full bg-primary-10/10 flex items-center justify-center">
                    <User size={20} className="text-primary-10" />
                  </div>
                )}
                <p className="text-neutral-5/90 text-sm font-medium">
                  {member?.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default GroupMembersModal;
