/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  useGetSingleConsultationQuery,
  useScheduleConsultationMutation,
} from "../../../redux/Features/Consultation/consultationApi";
import Loader from "../../Reusable/Loader/Loader";
import Modal from "../../Reusable/Modal/Modal";
import Button from "../../Reusable/Button/Button";
import TextInput from "../../Reusable/TextInput/TextInput";

type TFormValues = {
  scheduledAt: string;
  meetingLink: string;
};

type TScheduleConsultationProps = {
  isScheduleModalOpen: boolean;
  setIsScheduleModalOpen: any;
  consultationId: string;
};

const ScheduleConsultation: React.FC<TScheduleConsultationProps> = ({
  isScheduleModalOpen,
  setIsScheduleModalOpen,
  consultationId,
}) => {
  const { data, isLoading: isSingleDataLoading } =
    useGetSingleConsultationQuery(consultationId, {
      skip: !consultationId || !isScheduleModalOpen,
    });

  const [scheduleConsultation, { isLoading: isScheduling }] =
    useScheduleConsultationMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormValues>();

  const consultation = data?.data || {};

  // Set default values when consultation loads
  useEffect(() => {
    if (consultation) {
      if (consultation.scheduledAt) {
        setValue("scheduledAt", consultation.scheduledAt.split("T")[0]);
      }
      if (consultation.meetingLink) {
        setValue("meetingLink", consultation.meetingLink);
      }
    }
  }, [consultation, setValue]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isScheduleModalOpen) {
      reset();
    }
  }, [isScheduleModalOpen, reset]);

  const handleScheduleConsultation = async (data: TFormValues) => {
    try {
      const payload = {
        scheduledAt: data.scheduledAt,
        meetingLink: data.meetingLink,
      };

      const response = await scheduleConsultation({
        id: consultationId,
        data: payload,
      }).unwrap();

      if (response?.success) {
        toast.success(
          response?.message || "Consultation scheduled successfully",
        );
        setIsScheduleModalOpen(false);
        reset();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Modal
      isModalOpen={isScheduleModalOpen}
      setIsModalOpen={setIsScheduleModalOpen}
      heading="Schedule Consultation"
    >
      <div className="relative font-Inter pt-3">
        {isSingleDataLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50 rounded-lg">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleScheduleConsultation)}
          className="space-y-6"
        >
          <TextInput
            label="Schedule Date"
            type="date"
            placeholder="Select date"
            error={errors.scheduledAt}
            {...register("scheduledAt", { required: "Date is required" })}
          />

          <TextInput
            label="Meeting Link"
            type="url"
            placeholder="Enter meeting link (Zoom, Google Meet, etc.)"
            error={errors.meetingLink}
            {...register("meetingLink", {
              required: "Meeting link is required",
            })}
          />

          <div className="flex gap-3 justify-end pt-4 border-t border-neutral-50">
            <Button
              label="Cancel"
              type="button"
              variant="secondary"
              onClick={() => {
                setIsScheduleModalOpen(false);
                reset();
              }}
            />
            <Button
              type="submit"
              label="Schedule"
              variant="primary"
              isLoading={isScheduling}
              isDisabled={isScheduling}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ScheduleConsultation;
