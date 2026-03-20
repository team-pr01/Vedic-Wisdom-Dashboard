/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import Button from "../../Reusable/Button/Button";
import Loader from "../../Reusable/Loader/Loader";
import Modal from "../../Reusable/Modal/Modal";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import TextInput from "../../Reusable/TextInput/TextInput";
import FileUploadInput from "../../Reusable/FileUploadInput/FileUploadInput";
import { useEffect } from "react";
import {
  useAddCourseMutation,
  useGetSingleCourseByIdQuery,
  useUpdateCourseMutation,
} from "../../../redux/Features/Course/courseApi";
import type { TCategories } from "../../Shared/Category/Category";

type TFormData = {
  title: string;
  category: string;
  duration: string;
  courseUrl: string;
  file?: any;
};

type TAddOrEditCourseProps = {
  isAddOrEditCourseModalOpen: boolean;
  setIsAddOrEditCourseModalOpen: any;
  modalType: string;
  setModalType: (value: string) => void;
  courseId?: string;
  categories?: TCategories[];
};
const AddOrEditCourse: React.FC<TAddOrEditCourseProps> = ({
  isAddOrEditCourseModalOpen,
  setIsAddOrEditCourseModalOpen,
  modalType,
  setModalType,
  courseId,
  categories,
}) => {
  const { data, isLoading: isSingleCourseDataLoading } =
    useGetSingleCourseByIdQuery(courseId);

  const [addCourse, { isLoading: isAdding }] = useAddCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormData>();

  useEffect(() => {
    const singleCourseData = data?.data || {};
    if (modalType === "edit" && singleCourseData) {
      setValue("title", singleCourseData?.title);
      setValue("category", singleCourseData?.category);
      setValue("duration", singleCourseData?.duration);
      setValue("courseUrl", singleCourseData?.courseUrl);
    } else {
      reset();
    }
  }, [modalType, data, reset, setValue]);

  const handleSubmitCourse = async (data: TFormData) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("duration", data.duration);
      formData.append("courseUrl", data.courseUrl);

      if (data.file?.[0]) {
        formData.append("file", data.file[0]);
      }

      if (modalType === "add") {
        await addCourse(formData).unwrap();

        setIsAddOrEditCourseModalOpen(false);
      } else {
        await updateCourse({ id: courseId, data: formData }).unwrap();
        setIsAddOrEditCourseModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const courseCategories = categories?.map((category) => ({
    label: category.category,
    value: category.category,
  }));
  return (
    <Modal
      isModalOpen={isAddOrEditCourseModalOpen}
      setIsModalOpen={setIsAddOrEditCourseModalOpen}
      heading={`${modalType === "add" ? "Add" : "Update"} Audio Book`}
    >
      <div className="relative">
        {isSingleCourseDataLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
              <Loader size="lg" text="Please wait..." />
            </div>
          )}

        <form
          onSubmit={handleSubmit(handleSubmitCourse)}
          className="flex flex-col gap-6 font-Nunito mt-5"
        >
          <div className="flex flex-col gap-6">
            {/* Category */}
            <SelectDropdown
              label="Category"
              options={courseCategories || []}
              error={errors.category}
              {...register("category", {
                required: "Category is required",
              })}
            />

            {/* Title */}
            <TextInput
              label="Course Name"
              placeholder="Enter course name"
              error={errors.title}
              {...register("title", { required: "Course name is required" })}
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

            {/* Duration */}
            <TextInput
              label="Course URL"
              placeholder="Enter course URL"
              error={errors.courseUrl}
              {...register("courseUrl", {
                required: "Course URL is required",
              })}
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
                required:
                  modalType === "add" ? "Cover image is required" : false,
                validate: {
                  fileType: (files) => {
                    if (files?.[0] && !files[0].type.startsWith("image/")) {
                      return "Please upload an image file";
                    }
                    return true;
                  },
                  fileSize: (files) => {
                    if (files?.[0] && files[0].size > 5 * 1024 * 1024) {
                      return "File size must be less than 5MB";
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
                setIsAddOrEditCourseModalOpen(false);
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

export default AddOrEditCourse;
