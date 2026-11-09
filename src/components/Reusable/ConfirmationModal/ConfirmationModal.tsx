/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { AlertTriangle } from "lucide-react";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
  title?: string;
  description: React.ReactNode;
  submitLabel?: string; // Text on the submit button
  submitVariant?: "primary" | "secondary" | "danger"; // Allow passing variant
  isLoading?: boolean;
  icon?: React.ReactNode; // Allow custom icon (default is Warning)
};

const ConfirmationModal: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  onConfirm,
  title = "Confirm Action",
  description,
  submitLabel = "Confirm",
  submitVariant = "primary",
  isLoading = false,
  icon = <AlertTriangle className="size-20 text-red-500" />,
}) => {
  const handleClose = () => {
    if (!isLoading) {
      setIsModalOpen(false);
    }
  };

  return (
    <Modal
      isModalOpen={isModalOpen}
      setIsModalOpen={handleClose}
      width="w-[95%] sm:w-[400px]"
    >
      <div className="flex flex-col items-center text-center font-Inter">
        {/* Icon */}
        <div className="mb-4">{icon}</div>

        {/* Title */}
        <h2 className="text-xl font-bold text-neutral-90 mb-2">{title}</h2>

        {/* Description */}
        <div className="text-sm text-neutral-5/70 mb-8 leading-relaxed">
          {description}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full">
          <Button
            label="Cancel"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 py-2.5"
          />
          <Button
            label={isLoading ? "Processing..." : submitLabel}
            variant={submitVariant as any}
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            className="flex-1 py-2.5"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
