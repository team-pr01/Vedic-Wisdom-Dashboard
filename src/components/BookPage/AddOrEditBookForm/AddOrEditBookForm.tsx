/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import TextInput from "../../Reusable/TextInput/TextInput";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import {
  useCreateBookMutation,
  useUpdateBookMutation,
} from "../../../redux/Features/Book/bookApi";
import Loader from "../../Reusable/Loader/Loader";
import Button from "../../Reusable/Button/Button";
import Modal from "../../Reusable/Modal/Modal";

export type TAddOrEditBookFormProps = {
  isAddOrEditBookModalOpen: boolean;
  setIsAddOrEditBookModalOpen: any;
  modalType?: "add" | "edit";
  setModalType: (mode: "add" | "edit") => void;
  defaultValues?: any;
  isSingleDataLoading?: boolean;
};

type TFormValues = {
  name: string;
  type: "veda" | "purana" | "upanishad";
  structure:
    | "Chapter-Verse"
    | "Mandala-Sukta-Rik"
    | "Kanda-Sarga-Shloka"
    | "Custom";
  levels: { name: string }[];
  image?: FileList;
};

const AddOrEditBookForm: React.FC<TAddOrEditBookFormProps> = ({
  isAddOrEditBookModalOpen,
  setIsAddOrEditBookModalOpen,
  modalType = "add",
  defaultValues,
  isSingleDataLoading,
}) => {
  const [createBook, { isLoading }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm<TFormValues>({
    defaultValues: {
      type: "veda",
      structure: "Chapter-Verse",
      levels: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "levels",
  });

  const watchStructure = watch("structure");

  // Store previously used levels for each structure
  const previousLevelsRef = useRef<{
    lastSelected?: string;
    byStructure: Record<string, { name: string }[]>;
  }>({ byStructure: {} });

  const defaultStructures: Record<string, string[]> = {
    "Chapter-Verse": ["Chapter", "Verse"],
    "Mandala-Sukta-Rik": ["Mandala", "Sukta", "Rik"],
    "Kanda-Sarga-Shloka": ["Kanda", "Sarga", "Shloka"],
  };

  // Set default values on edit or add
  useEffect(() => {
    if (modalType === "edit" && defaultValues) {
      // Reset the form with default values
      reset({
        name: defaultValues.name || "",
        type: defaultValues.type || "veda",
        structure: defaultValues.structure || "Chapter-Verse",
        levels: defaultValues.levels || [],
        image: undefined,
      });

      // Store the levels for the current structure
      const currentStructure = defaultValues.structure || "Chapter-Verse";
      const currentLevels = defaultValues.levels || [];

      if (currentLevels.length > 0) {
        previousLevelsRef.current.byStructure[currentStructure] = currentLevels;
        previousLevelsRef.current.lastSelected = currentStructure;
      }
    } else if (modalType === "add") {
      reset({
        name: "",
        type: "veda",
        structure: "Chapter-Verse",
        levels: [],
        image: undefined,
      });
      previousLevelsRef.current = { byStructure: {} };
    }
  }, [defaultValues, modalType, reset]);

  // Handle structure change
  useEffect(() => {
    const structure = watchStructure;
    if (!structure) return;

    const currentLevels = getValues("levels");

    // Save current levels for the previous structure
    const previousStructure = previousLevelsRef.current.lastSelected;
    if (previousStructure && previousStructure !== structure) {
      previousLevelsRef.current.byStructure[previousStructure] = currentLevels;
    }

    // Remember current structure
    previousLevelsRef.current.lastSelected = structure;

    // Check if we have saved levels for this structure
    const savedLevels = previousLevelsRef.current.byStructure[structure];

    if (structure === "Custom") {
      if (savedLevels && savedLevels.length > 0) {
        // Use saved custom levels
        replace(savedLevels);
      } else {
        // Default to 3 empty fields
        replace([{ name: "" }, { name: "" }, { name: "" }]);
      }
    } else {
      if (savedLevels && savedLevels.length > 0) {
        // Use saved levels for this structure
        replace(savedLevels);
      } else if (defaultStructures[structure]) {
        // Use default structure levels
        replace(defaultStructures[structure].map((name) => ({ name })));
      }
    }
  }, [watchStructure, replace, getValues]);

  const onSubmit = async (data: TFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      formData.append("structure", data.structure);
      data.levels.forEach((level, index) => {
        formData.append(`levels[${index}][name]`, level.name);
      });

      if (data.image && data.image.length > 0) {
        formData.append("file", data.image[0]);
      }

      let response;
      if (modalType === "edit" && defaultValues?._id) {
        response = await updateBook({
          id: defaultValues._id,
          data: formData,
        }).unwrap();
        toast.success(response?.message || "Book updated successfully");
      } else {
        response = await createBook(formData).unwrap();
        toast.success(response?.message || "Book added successfully");
      }

      reset();
      setIsAddOrEditBookModalOpen(false);
    } catch (error: any) {
      const err = error?.data?.message || "Something went wrong";
      toast.error(err);
    }
  };

  const typeOptions = [
    { label: "Veda", value: "veda" },
    { label: "Purana", value: "purana" },
    { label: "Upanishad", value: "upanishad" },
  ];

  const structureOptions = [
    { label: "Chapter - Verse", value: "Chapter-Verse" },
    { label: "Mandala - Sukta - Rik", value: "Mandala-Sukta-Rik" },
    { label: "Kanda - Sarga - Shloka", value: "Kanda-Sarga-Shloka" },
    { label: "Custom", value: "Custom" },
  ];

  return (
    <Modal
      isModalOpen={isAddOrEditBookModalOpen}
      setIsModalOpen={setIsAddOrEditBookModalOpen}
      heading={`${modalType === "add" ? "Add" : "Update"} Book`}
    >
      <div className="relative">
        {isSingleDataLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-6">
            <TextInput
              label="Book Name"
              placeholder="Enter book name"
              {...register("name", { required: "Name is required" })}
              error={errors.name}
            />

            <SelectDropdown
              label="Type"
              options={typeOptions}
              {...register("type", { required: "Type is required" })}
              error={errors.type}
            />

            <SelectDropdown
              label="Structure"
              options={structureOptions}
              {...register("structure", { required: "Structure is required" })}
              error={errors.structure}
            />

            {/* Custom Structure Inputs */}
            {watchStructure === "Custom" && (
              <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-xl border border-neutral-50">
                <h3 className="font-semibold text-neutral-10">
                  Custom Structure Levels
                </h3>
                {fields.map((field, index) => (
                  <TextInput
                    key={field.id}
                    label={`Level ${index + 1} Name`}
                    placeholder={`Enter level ${index + 1} name`}
                    {...register(`levels.${index}.name` as const, {
                      required: "Level name is required",
                    })}
                    error={errors.levels?.[index]?.name}
                  />
                ))}
              </div>
            )}

            <TextInput
              label="Cover Image"
              type="file"
              {...register("image")}
              error={errors.image as any}
              isRequired={modalType === "add"}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              label="Cancel"
              onClick={() => setIsAddOrEditBookModalOpen(false)}
            />
            <Button
              type="submit"
              label={modalType === "edit" ? "Update" : "Add"}
              isLoading={isLoading || isUpdating}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddOrEditBookForm;
