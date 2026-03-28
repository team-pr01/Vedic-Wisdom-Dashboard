/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react";
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

export type TAddBookFormProps = {
  setShowForm: (show: boolean) => void;
  mode?: "add" | "edit";
  setMode: (mode: "add" | "edit") => void;
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

const AddBookForm: React.FC<TAddBookFormProps> = ({
  setShowForm,
  mode = "add",
  setMode,
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
    defaultValues: defaultValues || {
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

  // Set default values on edit or add
  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      reset({
        name: defaultValues.name || "",
        type: defaultValues.type || "veda",
        structure: defaultValues.structure || "Chapter-Verse",
        levels: defaultValues.levels || [],
        image: undefined,
      });
    } else if (mode === "add") {
      reset({
        name: "",
        type: "veda",
        structure: "Chapter-Verse",
        levels: [],
        image: undefined,
      });
    }
  }, [defaultValues, mode, reset]);

  // 🧠 Store previously used levels for each structure
  const previousLevelsRef = useRef<{
    lastSelected?: string;
    byStructure: Record<string, { name: string }[]>;
  }>({ byStructure: {} });

  useEffect(() => {
    const structure = watchStructure;
    const currentLevels = getValues("levels");

    // Save current levels for the previous structure
    const previousStructure = previousLevelsRef.current.lastSelected;
    if (previousStructure) {
      previousLevelsRef.current.byStructure[previousStructure] = currentLevels;
    }

    // Remember current structure
    previousLevelsRef.current.lastSelected = structure;

    const defaultStructures: Record<string, string[]> = {
      "Chapter-Verse": ["Chapter", "Verse"],
      "Mandala-Sukta-Rik": ["Mandala", "Sukta", "Rik"],
      "Kanda-Sarga-Shloka": ["Kanda", "Sarga", "Shloka"],
    };

    // ✅ Clear existing levels before replacing
    replace([]);

    // ✅ Use setTimeout to ensure rerender (React Hook Form quirk)
    setTimeout(() => {
      if (structure === "Custom") {
        const savedCustomLevels =
          previousLevelsRef.current.byStructure["Custom"];
        if (savedCustomLevels && savedCustomLevels.length > 0) {
          replace(savedCustomLevels);
        } else {
          // Always show 3 empty fields
          replace([{ name: "" }, { name: "" }, { name: "" }]);
        }
      } else {
        const savedLevels = previousLevelsRef.current.byStructure[structure];
        if (savedLevels && savedLevels.length > 0) {
          replace(savedLevels);
        } else if (defaultStructures[structure]) {
          replace(defaultStructures[structure].map((name) => ({ name })));
        }
      }
    }, 0);
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
      if (mode === "edit" && defaultValues?._id) {
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
      setShowForm(false);
    } catch (error: any) {
      const err = error?.data?.message || "Something went wrong";
      toast.error(err);
    }
  };

  if (isSingleDataLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Loader />
      </div>
    );
  }

  const typeOptions = [
    { label: "Veda", value: "veda" },
    { label: "Purana", value: "purana" },
    { label: "Upanishad", value: "upanishad" },
  ];

  const structureOptions = [
    { label: "Chapter - Verse", value: "chapter-verse" },
    { label: "Mandala - Sukta - Rik", value: "mandala-sukta-rik" },
    { label: "Kanda - Sarga - Shloka", value: "kanda-sarga-shloka" },
    { label: "Custom", value: "custom" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
              {mode === "edit" ? "Edit" : "Add"} Book
            </h3>
            <button
              type="button"
              onClick={() => {
                reset();
                setShowForm(false);
                setMode("add");
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

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

            {/* Only show inputs if Custom */}
            {/* Only show inputs if Custom */}
            {watchStructure === "Custom" && (
              <div className="flex flex-col gap-4 bg-gray-100 p-3 rounded-xl">
                <h3 className=" font-semibold text-gray-900 dark:text-gray-200">
                  Add custom structures
                </h3>
                {fields.map((field, index) => (
                  <TextInput
                    key={index}
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
              isRequired={mode === "add"}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <Button
              label={mode === "edit" ? "Update" : "Add"}
              isLoading={isLoading || isUpdating}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookForm;
