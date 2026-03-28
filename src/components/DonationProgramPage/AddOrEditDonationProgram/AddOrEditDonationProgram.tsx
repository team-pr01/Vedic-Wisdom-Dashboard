/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import Button from "../../Reusable/Button/Button";
import Loader from "../../Reusable/Loader/Loader";
import Modal from "../../Reusable/Modal/Modal";
import TextInput from "../../Reusable/TextInput/TextInput";
import {
  useAddDonationProgramMutation,
  useGetSingleDonationProgramsQuery,
  useUpdateDonationProgramMutation,
} from "../../../redux/Features/DonationPrograms/donationProgramApi";
import { useEffect } from "react";
import FileUploadInput from "../../Reusable/FileUploadInput/FileUploadInput";
import Textarea from "../../Reusable/TextArea/TextArea";

type TFormData = {
  title: string;
  description: string;
  currency: string;
  amountNeeded: number;
  file?: any;
};

type TAddOrEditDonationProgramProps = {
  isAddOrEditDonationProgramModalOpen: boolean;
  setIsAddOrEditDonationProgramModalOpen: any;
  modalType: string;
  setModalType: (value: string) => void;
  donationProgramId?: string;
};
const AddOrEditDonationProgram: React.FC<TAddOrEditDonationProgramProps> = ({
  isAddOrEditDonationProgramModalOpen,
  setIsAddOrEditDonationProgramModalOpen,
  modalType,
  setModalType,
  donationProgramId,
}) => {
  const { data, isLoading: isSingleCourseDataLoading } =
    useGetSingleDonationProgramsQuery(donationProgramId);

  const [addDonationProgram, { isLoading: isAdding }] =
    useAddDonationProgramMutation();
  const [updateDonationProgram, { isLoading: isUpdating }] =
    useUpdateDonationProgramMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormData>();

  useEffect(() => {
    const singleData = data?.data || {};

    if (modalType === "edit" && singleData) {
      setValue("title", singleData?.title);
      setValue("description", singleData?.description);
      setValue("currency", singleData?.currency);
      setValue("amountNeeded", singleData?.amountNeeded);
    } else {
      reset();
    }
  }, [modalType, data, reset, setValue]);

  const handleSubmitDonation = async (data: TFormData) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("currency", data.currency);
      formData.append("amountNeeded", String(data.amountNeeded));

      if (data.file?.[0]) {
        formData.append("file", data.file[0]);
      }

      if (modalType === "add") {
        await addDonationProgram(formData).unwrap();
      } else {
        await updateDonationProgram({
          id: donationProgramId,
          data: formData,
        }).unwrap();
      }

      setIsAddOrEditDonationProgramModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      isModalOpen={isAddOrEditDonationProgramModalOpen}
      setIsModalOpen={setIsAddOrEditDonationProgramModalOpen}
      heading={`${modalType === "add" ? "Add" : "Update"} Donation Program`}
    >
      <div className="relative">
        {isSingleCourseDataLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleSubmitDonation)}
          className="flex flex-col gap-6 font-Nunito mt-5"
        >
          {/* Title */}
          <TextInput
            label="Program Title"
            placeholder="Enter program title"
            error={errors.title}
            {...register("title", { required: "Title is required" })}
          />

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Enter description"
            error={errors.description}
            {...register("description", {
              required: "Description is required",
            })}
          />

          {/* Currency */}
          <TextInput
            label="Currency"
            placeholder="e.g. USD"
            error={errors.currency}
            {...register("currency", { required: "Currency is required" })}
          />

          {/* Amount Needed */}
          <TextInput
            label="Amount Needed"
            type="number"
            placeholder="Enter target amount"
            error={errors.amountNeeded}
            {...register("amountNeeded", {
              required: "Amount is required",
              valueAsNumber: true,
            })}
          />

          {/* Image Upload */}
          <FileUploadInput
            label="Program Image"
            placeholder="Upload image"
            accept="image/*"
            maxSize={5}
            error={errors.file}
            {...register("file", {
              required: modalType === "add" ? "Image is required" : false,
            })}
          />

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              label="Cancel"
              type="button"
              variant="secondary"
              onClick={() => {
                setIsAddOrEditDonationProgramModalOpen(false);
                setModalType("add");
              }}
            />
            <Button
              type="submit"
              label={modalType === "add" ? "Add Program" : "Update Program"}
              isLoading={isAdding || isUpdating}
              isDisabled={isAdding || isUpdating}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddOrEditDonationProgram;
