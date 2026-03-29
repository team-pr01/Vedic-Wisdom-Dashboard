/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  useGetSingleConsultationQuery,
  useUpdateConsultationStatusMutation,
} from "../../../redux/Features/Consultation/consultationApi";
import Loader from "../../Reusable/Loader/Loader";
import Modal from "../../Reusable/Modal/Modal";
import Button from "../../Reusable/Button/Button";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";

type TFormValues = {
  status: string;
};

type TUpdateStatusProps = {
  isUpdateStatusStatusModalOpen: boolean;
  setIsUpdateStatusStatusModalOpen: any;
  consultationId: string;
};

const UpdateConsultationStatus: React.FC<TUpdateStatusProps> = ({
  isUpdateStatusStatusModalOpen,
  setIsUpdateStatusStatusModalOpen,
  consultationId,
}) => {
  const { data, isLoading: isSingleDataLoading } =
    useGetSingleConsultationQuery(consultationId, {
      skip: !consultationId || !isUpdateStatusStatusModalOpen,
    });

  const [updateConsultationStatus, { isLoading: isUpdating }] =
    useUpdateConsultationStatusMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormValues>();

  const consultation = data?.data || {};

  // Set default value when consultation loads
  useEffect(() => {
    if (consultation && consultation.status) {
      setValue("status", consultation.status);
    }
  }, [consultation, setValue]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isUpdateStatusStatusModalOpen) {
      reset();
    }
  }, [isUpdateStatusStatusModalOpen, reset]);

  const handleUpdateStatus = async (data: TFormValues) => {
    try {
      const response = await updateConsultationStatus({
        id: consultationId,
        data: { status: data.status },
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Consultation status updated successfully");
        setIsUpdateStatusStatusModalOpen(false);
        reset();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Closed", value: "closed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <Modal
      isModalOpen={isUpdateStatusStatusModalOpen}
      setIsModalOpen={setIsUpdateStatusStatusModalOpen}
      heading="Update Consultation Status"
    >
      <div className="relative font-Inter pt-3">
        {isSingleDataLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50 rounded-lg">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleUpdateStatus)}
          className="space-y-6"
        >
          <SelectDropdown
            label="Status"
            options={statusOptions}
            error={errors.status}
            {...register("status", { required: "Status is required" })}
          />

          <div className="flex gap-3 justify-end pt-4 border-t border-neutral-50">
            <Button
              label="Cancel"
              type="button"
              variant="secondary"
              onClick={() => {
                setIsUpdateStatusStatusModalOpen(false);
                reset();
              }}
            />
            <Button
              type="submit"
              label="Update"
              variant="primary"
              isLoading={isUpdating}
              isDisabled={isUpdating}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateConsultationStatus;