/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import Button from "../../Reusable/Button/Button";
import Loader from "../../Reusable/Loader/Loader";
import Modal from "../../Reusable/Modal/Modal";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import TextInput from "../../Reusable/TextInput/TextInput";
import { useEffect } from "react";
import type { VideoSource } from "../../../types/food.interface";
import type { TCategories } from "../../Shared/Category/Category";
import { useAddVastuMutation, useGetSingleVastuByIdQuery, useUpdateVastuMutation } from "../../../redux/Features/Vastu/vastuApi";

type TFormData = {
  title: string;
  category: string;
  videoSource: VideoSource;
  videoUrl: string;
  duration: string;
};

type TAddOrEditVastuProps = {
  isAddOrEditVastuModalOpen: boolean;
  setIsAddOrEditVastuModalOpen: any;
  modalType: string;
  setModalType: (value: string) => void;
  vastuId?: string;
  categories?: TCategories[];
};
const AddOrEditVastu: React.FC<TAddOrEditVastuProps> = ({
  isAddOrEditVastuModalOpen,
  setIsAddOrEditVastuModalOpen,
  modalType,
  setModalType,
  vastuId,
  categories,
}) => {
  const { data, isLoading: isSingleVastuDataLoading } =
    useGetSingleVastuByIdQuery(vastuId);
  const [addVastu, { isLoading: isAdding }] = useAddVastuMutation();
  const [updateVastu, { isLoading: isUpdating }] = useUpdateVastuMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormData>();

  //   Setting default values
  useEffect(() => {
    const singleVastuData = data?.data || {};
    if (modalType === "edit" && singleVastuData) {
      setValue("title", singleVastuData?.title);
      setValue("category", singleVastuData?.category);
      setValue("videoSource", singleVastuData?.videoSource);
      setValue("videoUrl", singleVastuData?.videoUrl);
      setValue("duration", singleVastuData?.duration);
    } else {
      reset();
    }
  }, [modalType, data, reset, setValue]);


  const handleSubmitVastu = async (data: TFormData) => {
    try {
      const payload = {
        title: data.title,
        category: data.category,
        videoSource: data.videoSource,
        videoUrl: data.videoUrl,
        duration: data.duration,
      };

      if (modalType === "add") {
        await addVastu(payload).unwrap();

        setIsAddOrEditVastuModalOpen(false);
      } else {
        await updateVastu({ id: vastuId, data: payload }).unwrap();
        setIsAddOrEditVastuModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const videoSources = [
    { label: "YouTube", value: "youtube" },
    { label: "Facebook", value: "facebook" },
  ];

  const vastuCategories = categories?.map((category) => ({
    label: category.category,
    value: category.category,
  }));

  return (
    <Modal
      isModalOpen={isAddOrEditVastuModalOpen}
      setIsModalOpen={setIsAddOrEditVastuModalOpen}
      heading={`${modalType === "add" ? "Add" : "Update"} Vastu`}
    >
      <div className="relative">
        {isSingleVastuDataLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleSubmitVastu)}
          className="flex flex-col gap-6 font-Nunito mt-5"
        >
          <div className="flex flex-col gap-6">
            {/* Title */}
            <TextInput
              label="Title"
              placeholder="Enter title"
              error={errors.title}
              {...register("title", { required: "Title is required" })}
            />

            {/* Category */}
            <SelectDropdown
              label="Category"
              options={vastuCategories || []}
              error={errors.category}
              {...register("category", {
                required: "Category is required",
              })}
            />

            {/* Video Source */}
            <SelectDropdown
              label="Video Source"
              options={videoSources}
              error={errors.videoSource}
              {...register("videoSource", {
                required: "Video source is required",
              })}
            />

            {/* Video URL */}
            <TextInput
              label="Video URL"
              placeholder="Enter video URL"
              error={errors.videoUrl}
              {...register("videoUrl", {
                required: "Video URL is required",
              })}
            />

            {/* Duration */}
            <TextInput
              label="Duration"
              placeholder="e.g. 10:30 mins"
              error={errors.duration}
              {...register("duration", {
                required: "Duration is required",
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
                setIsAddOrEditVastuModalOpen(false);
                setModalType("add");
              }}
            />
            <Button
              type="submit"
              label={modalType === "add" ? "Add Notice" : "Update Notice"}
              variant="primary"
              className="py-1.75 w-full md:w-fit"
              isLoading={isAdding || isUpdating}
              isDisabled={isAdding || isUpdating}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddOrEditVastu;