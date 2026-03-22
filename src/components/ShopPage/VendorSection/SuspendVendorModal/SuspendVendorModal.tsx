import { useForm } from "react-hook-form";
import {
  useSuspendVendorMutation,
} from "../../../../redux/Features/Shop/vendorApi";
import Modal from "../../../Reusable/Modal/Modal";
import Textarea from "../../../Reusable/TextArea/TextArea";
import Button from "../../../Reusable/Button/Button";

type TFormData = {
  suspensionReason: string;
};

type TSuspendVendorModalProps = {
  isSuspendVendorModalOpen: boolean;
  setIsSuspendVendorModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  vendorId: string;
};
const SuspendVendorModal: React.FC<TSuspendVendorModalProps> = ({
  isSuspendVendorModalOpen,
  setIsSuspendVendorModalOpen,
  vendorId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormData>();
  const [suspendVendor, { isLoading }] = useSuspendVendorMutation();

  const handleSuspendVendor = async (data: TFormData) => {
    const payload = {
      suspensionReason: data.suspensionReason,
    };
    try {
      await suspendVendor({ id:vendorId, data: payload }).unwrap();
      setIsSuspendVendorModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      isModalOpen={isSuspendVendorModalOpen}
      setIsModalOpen={setIsSuspendVendorModalOpen}
      heading={`Vendor Details`}
    >
      <div>
        <form
          onSubmit={handleSubmit(handleSuspendVendor)}
          className="flex flex-col gap-6 font-Nunito mt-5"
        >
          {/* Suspension Reason */}
          <Textarea
            label="Suspension Reason"
            placeholder="Describe the reason for suspension"
            error={errors.suspensionReason}
            {...register("suspensionReason", {
              required: "Suspension reason is required",
            })}
          />

          <div className="flex gap-3 justify-end">
            <Button
              label={"Cancel"}
              type="button"
              variant="secondary"
              className="py-1.75 w-full md:w-fit"
              onClick={() => {
                setIsSuspendVendorModalOpen(false);
              }}
            />
            <Button
              type="submit"
              label={"Suspend"}
              variant="primary"
              className="py-1.75 w-full md:w-fit"
              isLoading={isLoading}
              isDisabled={isLoading}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default SuspendVendorModal;
