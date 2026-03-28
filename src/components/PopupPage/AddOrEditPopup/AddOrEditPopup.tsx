/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import Button from "../../Reusable/Button/Button";
import Loader from "../../Reusable/Loader/Loader";
import Modal from "../../Reusable/Modal/Modal";
import TextInput from "../../Reusable/TextInput/TextInput";
import FileUploadInput from "../../Reusable/FileUploadInput/FileUploadInput";
import { useEffect, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import {
  useAddPopupMutation,
  useGetSinglePopupQuery,
  useUpdatePopupMutation,
} from "../../../redux/Features/Popup/popupApi";
import Textarea from "../../Reusable/TextArea/TextArea";
import { navItems } from "../../Sidebar/Sidebar";

type TFormData = {
  title: string;
  content: string;
  btnText: string;
  btnLink: string;
  file?: any;
};

type TAddOrEditPopupProps = {
  isAddOrEditPopupModalOpen: boolean;
  setIsAddOrEditPopupModalOpen: any;
  modalType: string;
  setModalType: (value: string) => void;
  popupId?: string;
};

const AddOrEditPopup: React.FC<TAddOrEditPopupProps> = ({
  isAddOrEditPopupModalOpen,
  setIsAddOrEditPopupModalOpen,
  modalType,
  setModalType,
  popupId,
}) => {
  console.log(popupId);
  const { data, isLoading: isSingleNewsDataLoading } = useGetSinglePopupQuery(
    popupId,
    { skip: modalType === "add" || !isAddOrEditPopupModalOpen },
  );

  const singlePopupData = data?.data || {};
  console.log(singlePopupData);
  const hasSetInitialData = useRef(false);

  const [addPopup, { isLoading: isAdding }] = useAddPopupMutation();
  const [updatePopup, { isLoading: isUpdating }] = useUpdatePopupMutation();

  const [targetPages, setTargetPages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormData>({
    defaultValues: {
      title: "",
      content: "",
      btnText: "",
      btnLink: "",
    },
  });

    // Set initial data only once when editing
  useEffect(() => {
    if (modalType === "edit" && singlePopupData) {
      setValue("title", singlePopupData.title || "");
      setValue("content", singlePopupData.content || "");
      setValue("btnText", singlePopupData.btnText || "");
      setValue("btnLink", singlePopupData.btnLink || "");
      setTargetPages(singlePopupData.targetPages || []);
      hasSetInitialData.current = true;
    }
  }, [modalType, singlePopupData, setValue]);

  // Reset when modal closes or when switching to add mode
  useEffect(() => {
    if (!isAddOrEditPopupModalOpen || modalType === "add") {
      reset({
        title: "",
        content: "",
        btnText: "",
        btnLink: "",
      });
      setTargetPages([]);
      hasSetInitialData.current = false;
    }
  }, [isAddOrEditPopupModalOpen, modalType, reset]);

  // Handle page toggle - preserves other form values
  const handleTogglePage = useCallback((pagePath: string) => {
    setTargetPages((prev) => {
      if (prev.includes(pagePath)) {
        return prev.filter((path) => path !== pagePath);
      }
      return [...prev, pagePath];
    });
  }, []);

  const handleSubmitPopup = async (data: TFormData) => {
    try {
      const formData = new FormData();

      // Append all form data
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("btnText", data.btnText || "");
      formData.append("btnLink", data.btnLink || "");
      formData.append("targetPages", JSON.stringify(targetPages));

      if (data.file instanceof FileList && data.file.length > 0) {
        formData.append("file", data.file[0]);
      }

      let response;
      if (modalType === "edit" && singlePopupData?._id) {
        response = await updatePopup({
          id: singlePopupData._id,
          data: formData,
        }).unwrap();
        toast.success(response?.message || "Popup updated successfully");
      } else {
        response = await addPopup(formData).unwrap();
        toast.success(response?.message || "Popup added successfully");
      }

      setIsAddOrEditPopupModalOpen(false);
      setModalType("add");
      reset();
      setTargetPages([]);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleClose = () => {
    setIsAddOrEditPopupModalOpen(false);
    setModalType("add");
    reset();
    setTargetPages([]);
  };

  return (
    <Modal
      isModalOpen={isAddOrEditPopupModalOpen}
      setIsModalOpen={handleClose}
      heading={`${modalType === "add" ? "Add" : "Update"} Popup`}
    >
      <div className="relative">
        {isSingleNewsDataLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleSubmitPopup)}
          className="flex flex-col gap-6 font-Nunito mt-5 max-h-[70vh] overflow-y-auto px-1"
        >
          <TextInput
            label="Title"
            placeholder="Enter Title"
            {...register("title", {
              required: "Title is required",
            })}
            error={errors.title}
          />

          <Textarea
            label="Content"
            placeholder="Enter content"
            error={errors.content}
            {...register("content", {
              required: "Content is required",
            })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Button Text"
              placeholder="Enter button text (e.g., Learn More, Join Now)"
              {...register("btnText")}
              error={errors.btnText}
              isRequired={false}
            />

            <TextInput
              label="Button Link"
              type="url"
              placeholder="Enter button link (e.g., https://example.com)"
              {...register("btnLink")}
              error={errors.btnLink}
              isRequired={false}
            />
          </div>

          {/* Target Pages */}
          <div>
            <label className="block text-sm font-medium text-neutral-20 mb-3">
              Target Pages
            </label>
            <div className="flex flex-wrap items-center gap-3 w-full">
              {navItems?.map((page) => (
                <button
                  key={page?.label}
                  type="button"
                  onClick={() => handleTogglePage(page.path)}
                  className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 ${
                    targetPages.includes(page.path)
                      ? "bg-primary-10 text-white shadow-md hover:bg-primary-10/90"
                      : "bg-white border border-primary-10 text-primary-10 hover:bg-primary-10 hover:text-white"
                  }`}
                >
                  {page?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <FileUploadInput
            label="Popup Image"
            placeholder="Upload popup image"
            helpText="Recommended size: 600x400px (Max 5MB)"
            accept="image/*"
            maxSize={5}
            error={errors.file}
            {...register("file", {
              required: modalType === "add" ? "Popup image is required" : false,
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

          <div className="flex gap-3 justify-end pt-4 border-t border-neutral-50">
            <Button
              label="Cancel"
              type="button"
              variant="secondary"
              className="py-1.75 w-full md:w-fit"
              onClick={handleClose}
            />
            <Button
              type="submit"
              label={modalType === "add" ? "Add Popup" : "Update Popup"}
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

export default AddOrEditPopup;