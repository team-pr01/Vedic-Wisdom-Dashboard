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
import Textarea from "../../Reusable/TextArea/TextArea";
import {
  useAddVideoMutation,
  useGetSingleVideoByIdQuery,
  useUpdateVideoMutation,
} from "../../../redux/Features/Video/videoApi";

type TFormData = {
  title: string;
  description: string;
  videoSource: VideoSource;
  videoUrl: string;
  category: string;
};

type TAddOrEditVideoProps = {
  isAddOrEditVideoModalOpen: boolean;
  setIsAddOrEditVideoModalOpen: any;
  modalType: string;
  setModalType: (value: string) => void;
  videoId?: string;
  categories?: TCategories[];
};
const AddOrEditVideo: React.FC<TAddOrEditVideoProps> = ({
  isAddOrEditVideoModalOpen,
  setIsAddOrEditVideoModalOpen,
  modalType,
  setModalType,
  videoId,
  categories,
}) => {
  const { data, isLoading: isSingleVideoDataLoading } =
    useGetSingleVideoByIdQuery(videoId);

  const [addVideo, { isLoading: isAdding }] = useAddVideoMutation();
  const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormData>();

  //   Setting default values
  useEffect(() => {
    const singleVideoData = data?.data || {};
    if (modalType === "edit" && singleVideoData) {
      setValue("title", singleVideoData?.title);
      setValue("description", singleVideoData?.description);
      setValue("category", singleVideoData?.category);
      setValue("videoSource", singleVideoData?.videoSource);
      setValue("videoUrl", singleVideoData?.videoUrl);
    } else {
      reset();
    }
  }, [modalType, data, reset, setValue]);

  const handleAddAudioBook = async (data: TFormData) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        videoSource: data.videoSource,
        videoUrl: data.videoUrl,
      };

      if (modalType === "add") {
        await addVideo(payload).unwrap();

        setIsAddOrEditVideoModalOpen(false);
      } else {
        await updateVideo({ id: videoId, data: payload }).unwrap();
        setIsAddOrEditVideoModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const videoSources = [
    { label: "YouTube", value: "youtube" },
    { label: "Facebook", value: "facebook" },
  ];

  const videoCategories = categories?.map((category) => ({
    label: category.category,
    value: category.category,
  }));

  return (
    <Modal
      isModalOpen={isAddOrEditVideoModalOpen}
      setIsModalOpen={setIsAddOrEditVideoModalOpen}
      heading={`${modalType === "add" ? "Add" : "Update"} Recipe`}
    >
      <div className="relative">
        {isSingleVideoDataLoading && (
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

            {/* Notice */}
            <Textarea
              label="Description"
              placeholder="Enter description"
              error={errors.description}
              {...register("description", {
                required: "Description is required",
              })}
            />

            {/* Category */}
            <SelectDropdown
              label="Category"
              options={videoCategories || []}
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
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              label={"Cancel"}
              type="button"
              variant="secondary"
              className="py-1.75 w-full md:w-fit"
              onClick={() => {
                setIsAddOrEditVideoModalOpen(false);
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

export default AddOrEditVideo;
