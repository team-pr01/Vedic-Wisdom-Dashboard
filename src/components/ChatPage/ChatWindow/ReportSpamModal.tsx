/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../Reusable/Modal/Modal";
import Button from "../../Reusable/Button/Button";
import toast from "react-hot-toast";
import { useReportSpamMutation } from "../../../redux/Features/Chat/reportApi";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import Textarea from "../../Reusable/TextArea/TextArea";

interface ReportSpamModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  targetId: string;
  reportType: "user" | "group";
}

type TReportForm = {
  reasonType: string;
  otherReason?: string;
};

const reportOptions = [
  { label: "Spam or unwanted messages", value: "spam" },
  { label: "Harassment or bullying", value: "harassment" },
  { label: "Hate speech", value: "hate_speech" },
  { label: "Inappropriate content", value: "inappropriate" },
  { label: "Fake account", value: "fake_account" },
  { label: "Other", value: "other" },
];

const ReportSpamModal = ({
  isModalOpen,
  setIsModalOpen,
  targetId,
  reportType,
}: ReportSpamModalProps) => {
  const [reportSpam, { isLoading }] = useReportSpamMutation();
  const [selectedReasonType, setSelectedReasonType] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TReportForm>();

  const isOtherSelected = selectedReasonType === "other";

  const handleReportSpam = async (data: TReportForm) => {
    try {
      const finalReason =
        data.reasonType === "other"
          ? data.otherReason
          : reportOptions.find((opt) => opt.value === data.reasonType)?.label;

      if (!finalReason?.trim()) {
        toast.error("Please provide a reason.");
        return;
      }

      await reportSpam({
        targetId,
        reportType,
        reason: finalReason,
      }).unwrap();

      toast.success(
        "Report submitted successfully. Our team will review it shortly.",
      );
      setIsModalOpen(false);
      reset();
      setSelectedReasonType("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit report.");
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
    setSelectedReasonType("");
  };

  return (
    <Modal
      isModalOpen={isModalOpen}
      setIsModalOpen={handleClose}
      heading="Report Spam / Abuse"
    >
      <form onSubmit={handleSubmit(handleReportSpam)} className="p-2 space-y-5">
        <p className="text-sm text-neutral-45">
          Please select a reason for reporting this {reportType}. Our moderation
          team will review your report.
        </p>

        {/* Dropdown for Reason Type */}
        <SelectDropdown
          label="Reason"
          options={reportOptions}
          error={errors.reasonType}
          {...register("reasonType", {
            required: "Please select a reason",
            onChange: (e: any) => {
              const val = e.target ? e.target.value : e;
              setSelectedReasonType(val);
              if (val !== "other") setValue("otherReason", "");
            },
          })}
        />

        {/* Conditional Textarea for "Other" */}
        {isOtherSelected && (
          <Textarea
            label="Please specify"
            placeholder="Please describe the issue in detail..."
            error={errors.otherReason}
            {...register("otherReason", {
              required: isOtherSelected ? "Please specify the reason" : false,
            })}
            isRequired={true}
          />
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            label="Cancel"
            variant="secondary"
            onClick={handleClose}
            className="px-6"
          />
          <Button
            type="submit"
            label="Submit Report"
            variant="primary"
            isLoading={isLoading}
            className="px-6 bg-red-500 hover:bg-red-600 text-white"
          />
        </div>
      </form>
    </Modal>
  );
};

export default ReportSpamModal;
