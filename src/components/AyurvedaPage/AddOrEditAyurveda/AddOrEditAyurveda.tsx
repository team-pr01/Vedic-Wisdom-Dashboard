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
import { useAddAyurvedaMutation, useGetSingleAyurvedaByIdQuery, useUpdateAyurvedaMutation } from "../../../redux/Features/Ayurveda/ayurvedaApi";

type TFormData = {
  title: string;
  category: string;
  videoSource: VideoSource;
  videoUrl: string;
  duration: string;
};

type TAddOrEditAyurvedaProps = {
  isAddOrEditAyurvedaModalOpen: boolean;
  setIsAddOrEditAyurvedaModalOpen: any;
  modalType: string;
  setModalType: (value: string) => void;
  ayurvedaId?: string;
  categories?: TCategories[];
};
const AddOrEditAyurveda: React.FC<TAddOrEditAyurvedaProps> = ({
  isAddOrEditAyurvedaModalOpen,
  setIsAddOrEditAyurvedaModalOpen,
  modalType,
  setModalType,
  ayurvedaId,
  categories,
}) => {
  const { data, isLoading: isSingleAyurvedaDataLoading } =
    useGetSingleAyurvedaByIdQuery(ayurvedaId);
  const [addAyurveda, { isLoading: isAdding }] = useAddAyurvedaMutation();
  const [updateAyurveda, { isLoading: isUpdating }] = useUpdateAyurvedaMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormData>();

  //   Setting default values
  useEffect(() => {
    const singleAyurvedaData= data?.data || {};
    if (modalType === "edit" && singleAyurvedaData) {
      setValue("title", singleAyurvedaData?.title);
      setValue("category", singleAyurvedaData?.category);
      setValue("videoSource", singleAyurvedaData?.videoSource);
      setValue("videoUrl", singleAyurvedaData?.videoUrl);
      setValue("duration", singleAyurvedaData?.duration);
    } else {
      reset();
    }
  }, [modalType, data, reset, setValue]);

  const handleAddAudioBook = async (data: TFormData) => {
    try {
      const payload = {
        title: data.title,
        category: data.category,
        videoSource: data.videoSource,
        videoUrl: data.videoUrl,
        duration: data.duration,
      };

      if (modalType === "add") {
        await addAyurveda(payload).unwrap();

        setIsAddOrEditAyurvedaModalOpen(false);
      } else {
        await updateAyurveda({ id: ayurvedaId, data: payload }).unwrap();
        setIsAddOrEditAyurvedaModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const videoSources = [
    { label: "YouTube", value: "youtube" },
    { label: "Facebook", value: "facebook" },
  ];

  const foodCategories = categories?.map((category) => ({
    label: category.category,
    value: category.category,
  }));

  return (
    <Modal
      isModalOpen={isAddOrEditAyurvedaModalOpen}
      setIsModalOpen={setIsAddOrEditAyurvedaModalOpen}
      heading={`${modalType === "add" ? "Add" : "Update"} Ayurveda`}
    >
      <div className="relative">
        {isSingleAyurvedaDataLoading && (
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
              label="Title"
              placeholder="Enter title"
              error={errors.title}
              {...register("title", { required: "Title is required" })}
            />

            {/* Category */}
            <SelectDropdown
              label="Category"
              options={foodCategories || []}
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
                setIsAddOrEditAyurvedaModalOpen(false);
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

export default AddOrEditAyurveda;
