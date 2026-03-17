/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import Button from "../../Reusable/Button/Button";
import Loader from "../../Reusable/Loader/Loader";
import Modal from "../../Reusable/Modal/Modal";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import Textarea from "../../Reusable/TextArea/TextArea";
import TextInput from "../../Reusable/TextInput/TextInput";
import FileUploadInput from "./../../Reusable/FileUploadInput/FileUploadInput";
import { useAddAudioBookMutation } from "../../../redux/Features/AudioBooks/audioBooksApi";

type TFormData = {
  name: string;
  description: string;
  isPremium: string;
  file?: any;
};

type TAddAudioBookProps = {
  isAddAudioBookModalOpen: boolean;
  setIsAddAudioBookModalOpen: any;
  isLoading: boolean;
  modalType: string;
  setModalType: (value: string) => void;
};
const AddAudioBook: React.FC<TAddAudioBookProps> = ({
  isAddAudioBookModalOpen,
  setIsAddAudioBookModalOpen,
  isLoading,
  modalType,
  setModalType,
}) => {
  const [addAudioBook, {isLoading:isAdding}] = useAddAudioBookMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormData>();

  const handleAddAudioBook = async (data: TFormData) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("isPremium", data.isPremium);

      if (data.file?.[0]) {
        formData.append("file", data.file[0]);
      }

      await addAudioBook(formData).unwrap();

      setIsAddAudioBookModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const accessTypes = [
    {
      label: "Premium",
      value: "true",
    },
    {
      label: "Free",
      value: "false",
    },
  ];
  return (
    <Modal
      isModalOpen={isAddAudioBookModalOpen}
      setIsModalOpen={setIsAddAudioBookModalOpen}
      heading={`${modalType === "add" ? "Add" : "Update"} Audio Book`}
    >
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleAddAudioBook)}
          className="flex flex-col gap-6 font-Nunito mt-5"
        >
          <div className="flex flex-col gap-6">
            {/* Title */}
            <TextInput
              label="Book Name"
              placeholder="Enter book name"
              error={errors.name}
              {...register("name", { required: "Book name is required" })}
            />

            {/* Notice */}
            <Textarea
              label="Description"
              placeholder="Enter description"
              error={errors.description}
              {...register("description", {
                required: "Description is required",
              })}
            />

            {/* Targeted Audience */}
            <SelectDropdown
              label="Access Type"
              options={accessTypes}
              error={errors.isPremium}
              {...register("isPremium")}
            />

            {/* Single Cover Image Upload */}
            <FileUploadInput
              label="Cover Image"
              placeholder="Upload book cover image"
              helpText="Recommended size: 300x300px"
              accept="image/*"
              maxSize={5}
              error={errors.file}
              {...register("file", {
                required: "Cover image is required",
                validate: {
                  fileType: (files) => {
                    if (
                      files &&
                      files[0] &&
                      !files[0].type.startsWith("image/")
                    ) {
                      return "Please upload an image file";
                    }
                    return true;
                  },
                  fileSize: (files) => {
                    if (files && files[0] && files[0].size > 5 * 1024 * 1024) {
                      return "File size must be less than 2MB";
                    }
                    return true;
                  },
                },
              })}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              label={"Cancel"}
              type="button"
              variant="secondary"
              className="py-1.75 w-full md:w-fit"
              onClick={() => {
                setIsAddAudioBookModalOpen(false);
                setModalType("add");
              }}
            />
            <Button
              type="submit"
              label={modalType === "add" ? "Add Notice" : "Update Notice"}
              variant="primary"
              className="py-1.75 w-full md:w-fit"
                isLoading={isAdding}
                isDisabled={isAdding}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddAudioBook;
