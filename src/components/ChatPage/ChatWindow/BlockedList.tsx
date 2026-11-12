/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, ShieldBan } from "lucide-react";
import toast from "react-hot-toast";
import Drawer from "../../Reusable/Drawer/Drawer";
import Button from "../../Reusable/Button/Button";
import {
  useGetMyBlockedUsersQuery,
  useToggleBlockUserMutation,
} from "../../../redux/Features/Chat/chatApi";
import { useChat } from "../../../providers/ChatProvider";
import { useSelector } from "react-redux";
import {
  useCurrentUser,
  type TLoggedInUser,
} from "../../../redux/Features/Auth/authSlice";
// import { useGetBlockedUsersQuery, useUnblockUserMutation } from "../../../redux/Features/Chat/chatApi";

type TBlockedListProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type TBlockedUser = {
  _id: string;
  name: string;
  userId: string;
  conversationId: string;
  profilePicture?: string;
};

const BlockedList = ({ isOpen, setIsOpen }: TBlockedListProps) => {
  const currentUser = useSelector(useCurrentUser) as TLoggedInUser;
  const { setSelectedChat } = useChat();
  const { data } = useGetMyBlockedUsersQuery({});
  const blockedUsers = data?.data?.data || [];
  const [toggleBlockUser, { isLoading: isToggleBlocking }] =
    useToggleBlockUserMutation();

  // Static data for now (Replace when API is ready)
  const isLoading = false;

  const handleToggleBlock = async (conversationId: string) => {
    try {
      const payload = { action: "unblock" };

      await toggleBlockUser({
        conversationId,
        data: payload,
      }).unwrap();

      setSelectedChat((prev: any) => {
        if (!prev) return prev;

        const currentBlockedBy = prev.blockedBy || [];

        const newBlockedBy = currentBlockedBy.filter((id: any) => {
          const uid = typeof id === "object" ? id._id : id;
          return String(uid) !== String(currentUser._id);
        });

        return { ...prev, blockedBy: newBlockedBy };
      });

      toast.success("User unblocked successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
      console.error(error);
    }
  };

  return (
    <Drawer
      title="Blocked Users"
      isDrawerOpen={isOpen}
      setIsDrawerOpen={setIsOpen}
      direction="left"
    >
      <div className="flex flex-col h-full bg-neutral-50/30">
        <div className="flex-1 bg-white p-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-10"></div>
            </div>
          ) : blockedUsers.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full text-center mt-20">
              <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                <ShieldBan size={28} className="text-neutral-40" />
              </div>
              <h3 className="text-neutral-90 font-semibold">
                No blocked users
              </h3>
              <p className="text-sm text-neutral-45 mt-1 max-w-62.5">
                You haven't blocked anyone yet. When you do, they will appear
                here.
              </p>
            </div>
          ) : (
            /* User List */
            <div className="space-y-2">
              {blockedUsers.map((user:TBlockedUser) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="size-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-9 rounded-full bg-primary-10/10 flex items-center justify-center text-primary-10 font-semibold">
                        <User size={20} />
                      </div>
                    )}
                    <p className="text-sm font-semibold text-neutral-90">
                      {user.name}
                    </p>
                  </div>

                  {/* Unblock Button */}
                  <Button
                    label="Unblock"
                    variant="secondary"
                    className="px-4 py-1.5 text-xs"
                    onClick={() => handleToggleBlock(user.conversationId)}
                    isLoading={isToggleBlocking}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default BlockedList;
