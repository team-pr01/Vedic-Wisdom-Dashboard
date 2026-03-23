/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useSuspendUserMutation } from "../../../redux/Features/User/userApi";
import toast from "react-hot-toast";
import Modal from "../../Reusable/Modal/Modal";
import Textarea from "../../Reusable/TextArea/TextArea";
import Button from "../../Reusable/Button/Button";

type TFormData = {
  suspensionReason: string;
  password: string;
};

type TSuspendUserModalProps = {
  selectedUserId: string | null;
  isSuspendUserModalOpen: boolean;
  setIsSuspendUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SuspendUserModal: React.FC<TSuspendUserModalProps> = ({
  selectedUserId,
  isSuspendUserModalOpen,
  setIsSuspendUserModalOpen,
}) => {
  const [suspendUser, { isLoading }] = useSuspendUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormData>();

  const handleSuspend = async (data: TFormData) => {
    try {
      const payload = {
        suspensionReason: data.suspensionReason,
      };
      const response = await suspendUser({
        userId: selectedUserId,
        data: payload,
      }).unwrap();
      if (response.success) {
        toast.success(response.message || "User suspended successfully");
        setIsSuspendUserModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to suspend user");
    }
  };

  return (
    <Modal
      isModalOpen={isSuspendUserModalOpen}
      setIsModalOpen={setIsSuspendUserModalOpen}
      heading={`Suspend User`}
    >
      <form
        onSubmit={handleSubmit(handleSuspend)}
        className="flex flex-col gap-6 font-Nunito mt-5"
      >
        <div className="flex flex-col gap-6">
          <Textarea
            label="Reason for Suspension"
            placeholder="Enter reason for suspension"
            error={errors.suspensionReason}
            {...register("suspensionReason", {
              required: "This field is required",
            })}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            label="Suspend"
            variant="primary"
            className="py-1.75 lg:py-1.75 w-full md:w-fit"
            isLoading={isLoading}
          />
        </div>
      </form>
    </Modal>
  );
};

export default SuspendUserModal;
