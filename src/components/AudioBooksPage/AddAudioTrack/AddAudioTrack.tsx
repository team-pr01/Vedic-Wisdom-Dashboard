/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import Button from "../../Reusable/Button/Button";
import FileUploadInput from "../../Reusable/FileUploadInput/FileUploadInput";
import TextInput from "../../Reusable/TextInput/TextInput";

type TFormData = {
  audioBookId: string;
  title: string;
  file?: any;
};

const AddAudioTrack = ({ setIsAddAudioTrackModalOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormData>();
  return (
    <form
      //   onSubmit={handleSubmit(handleSubmitNotice)}
      className="flex flex-col gap-6 font-Nunito mt-5"
    >
      <div className="flex flex-col gap-6">
        {/* Title */}
        <TextInput
          label="Title"
          placeholder="Enter book title"
          error={errors.title}
          {...register("title", { required: "Title is required" })}
        />

        {/* Single Cover Image Upload */}
        <FileUploadInput
          label="Cover Image"
          placeholder="Upload book cover image"
          helpText="Recommended size: 300x300px"
          accept="image/*"
          maxSize={2}
          error={errors.file}
          {...register("file", {
            required: "Cover image is required",
            validate: {
              fileType: (files) => {
                if (files && files[0] && !files[0].type.startsWith("image/")) {
                  return "Please upload an image file";
                }
                return true;
              },
              fileSize: (files) => {
                if (files && files[0] && files[0].size > 2 * 1024 * 1024) {
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
          className="py-[7px] w-full md:w-fit"
          onClick={() => {
            setIsAddAudioTrackModalOpen(false);
          }}
        />
        <Button
          type="submit"
          label="Add Audio Track"
          variant="primary"
          className="py-[7px] w-full md:w-fit"
          //   isLoading={isUpdating || isLoading}
          //   isDisabled={isUpdating || isLoading}
        />
      </div>
    </form>
  );
};

export default AddAudioTrack;
