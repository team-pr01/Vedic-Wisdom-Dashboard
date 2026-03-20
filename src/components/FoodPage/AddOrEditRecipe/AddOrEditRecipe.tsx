/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import Button from "../../Reusable/Button/Button";
import Loader from "../../Reusable/Loader/Loader";
import Modal from "../../Reusable/Modal/Modal";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import TextInput from "../../Reusable/TextInput/TextInput";
import { useEffect } from "react";
import {
  useAddRecipeMutation,
  useGetSingleRecipeByIdQuery,
  useUpdateRecipeMutation,
} from "../../../redux/Features/Food/foodApi";
import type { VideoSource } from "../../../types/food.interface";
import type { TCategories } from "../../Shared/Category/Category";

type TFormData = {
  title: string;
  category: string;
  videoSource: VideoSource;
  videoUrl: string;
  duration: string;
};

type TAddOrEditRecipeProps = {
  isAddOrEditRecipeModalOpen: boolean;
  setIsAddOrEditRecipeModalOpen: any;
  isLoading: boolean;
  modalType: string;
  setModalType: (value: string) => void;
  recipeId?: string;
  categories?: TCategories[];
};
const AddOrEditRecipe: React.FC<TAddOrEditRecipeProps> = ({
  isAddOrEditRecipeModalOpen,
  setIsAddOrEditRecipeModalOpen,
  isLoading,
  modalType,
  setModalType,
  recipeId,
  categories,
}) => {
  const { data: singleRecipeData, isLoading: isSingleRecipeDataLoading } =
    useGetSingleRecipeByIdQuery(recipeId);
  const [addRecipe, { isLoading: isAdding }] = useAddRecipeMutation();
  const [updateRecipe, { isLoading: isUpdating }] = useUpdateRecipeMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormData>();

  //   Setting default values
  useEffect(() => {
    if (modalType === "edit" && singleRecipeData) {
      setValue("title", singleRecipeData?.data?.title);
      setValue("category", singleRecipeData?.data?.category);
      setValue("videoSource", singleRecipeData?.data?.videoSource);
      setValue("videoUrl", singleRecipeData?.data?.videoUrl);
      setValue("duration", singleRecipeData?.data?.duration);
    } else {
      reset();
    }
  }, [modalType, singleRecipeData, reset, setValue]);

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
        await addRecipe(payload).unwrap();

        setIsAddOrEditRecipeModalOpen(false);
      } else {
        await updateRecipe({ id: recipeId, data: payload }).unwrap();
        setIsAddOrEditRecipeModalOpen(false);
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
      isModalOpen={isAddOrEditRecipeModalOpen}
      setIsModalOpen={setIsAddOrEditRecipeModalOpen}
      heading={`${modalType === "add" ? "Add" : "Update"} Recipe`}
    >
      <div className="relative">
        {isLoading ||
          (isSingleRecipeDataLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
              <Loader size="lg" text="Please wait..." />
            </div>
          ))}

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
                setIsAddOrEditRecipeModalOpen(false);
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

export default AddOrEditRecipe;
