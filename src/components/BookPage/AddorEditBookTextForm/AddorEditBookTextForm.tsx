/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import TextInput from "../../Reusable/TextInput/TextInput";
import Textarea from "../../Reusable/TextArea/TextArea";
import {
  useAddTextMutation,
  useUpdateTextMutation,
} from "../../../redux/Features/Book/textsApi";
import type { TBooks } from "../AllBooksTable/AllBooksTable";
import Loader from "../../Reusable/Loader/Loader";
import Button from "../../Reusable/Button/Button";

export type TAddorEditBookTextFormProps = {
  setShowForm: (show: boolean) => void;
  mode?: "add" | "edit";
  setMode: (mode: "add" | "edit") => void;
  defaultValues?: any;
  isSingleDataLoading?: boolean;
  bookNames: TBooks[];
};

type TLocation = {
  levelName: string;
  value: string;
};

type TFormValues = {
  bookId: string;
  location: TLocation[];
  originalText: string;
  primaryTranslation: string;
  tags: string[];
  isVerified: boolean;
};

const AddorEditBookTextForm: React.FC<TAddorEditBookTextFormProps> = ({
  setShowForm,
  mode = "add",
  setMode,
  defaultValues,
  isSingleDataLoading,
  bookNames,
}) => {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const [addText, { isLoading }] = useAddTextMutation();
  const [updateText, { isLoading: isUpdating }] = useUpdateTextMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TFormValues>({
    defaultValues: {
      bookId: "",
      location: [],
      originalText: "",
      primaryTranslation: "",
      tags: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "location",
  });

  const allBookNames = bookNames?.map((b) => ({
    _id: b._id,
    name: b.name,
    structure: b.structure,
    levels: b.levels,
  }));

  // 🟢 Handle selecting a book to auto-load structure levels
  const handleBookChange = (bookId: string) => {
    const book = allBookNames.find((b) => b._id === bookId);
    setSelectedBook(book);

    if (book?.levels?.length) {
      replace(
        book.levels.map((level: any) => ({ levelName: level.name, value: "" }))
      );
    } else {
      replace([]); // Empty if custom
    }
  };

  // 🟢 Setup defaults on edit or add
  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      reset({
        bookId: defaultValues.bookId?._id ?? "",
        location: defaultValues.location ?? [],
        originalText: defaultValues.originalText ?? "",
        primaryTranslation: defaultValues.primaryTranslation ?? "",
        tags: defaultValues.tags ?? [],
      });
      setTags(defaultValues.tags || []);
    } else if (mode === "add") {
      reset({
        bookId: "",
        location: [],
        originalText: "",
        primaryTranslation: "",
        tags: [],
      });
      setTags([]);
    }
  }, [defaultValues, mode, reset]);

  // 🟢 Tag input handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed))
        setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  // 🟢 Submit handler
  const onSubmit = async (data: TFormValues) => {
    const payload = {
      bookId: data.bookId,
      location: data.location,
      originalText: data.originalText,
      primaryTranslation: data.primaryTranslation,
      tags,
    };

    try {
      let response;
      if (mode === "edit" && defaultValues?._id) {
        response = await updateText({
          id: defaultValues._id,
          data: payload,
        }).unwrap();
        toast.success(response?.message || "Book text updated successfully");
      } else {
        response = await addText(payload).unwrap();
        toast.success(response?.message || "Book text added successfully");
      }

      reset();
      setShowForm(false);
      setMode("add");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  if (isSingleDataLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {mode === "edit" ? "Edit" : "Add"} Book Text
            </h3>
            <button
              type="button"
              onClick={() => {
                reset();
                setShowForm(false);
                setMode("add");
              }}
            >
              <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {/* Book Dropdown */}
          <div className="flex flex-col gap-2">
            <label>
              Book<span className="text-red-600">*</span>
            </label>
            <select
              {...register("bookId", { required: "Please select book" })}
              onChange={(e) => handleBookChange(e.target.value)}
              className="border rounded-lg p-3"
            >
              <option value="">Select Book</option>
              {allBookNames.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.name}
                </option>
              ))}
            </select>
            {errors.bookId && (
              <p className="text-red-500 text-sm">{errors.bookId.message}</p>
            )}
          </div>

          {/* Dynamic Location Fields */}
          {fields.length > 0 && (
            <div className="bg-gray-100 rounded-xl p-4">
              <h4 className="font-semibold mb-2">Location</h4>
              <div className="grid grid-cols-2 gap-3">
                {fields.map((field, index) => (
                  <TextInput
                    key={field.id}
                    label={field.levelName}
                    placeholder={`Enter ${field.levelName}`}
                    {...register(`location.${index}.value`, {
                      required: `${field.levelName} is required`,
                    })}
                    error={errors.location?.[index]?.value}
                  />
                ))}
              </div>
            </div>
          )}

          <Textarea
            label="Original Text"
            placeholder="Enter original text"
            {...register("originalText", {
              required: "Original text is required",
            })}
            error={errors.originalText}
          />

          <Textarea
            label="Primary Translation (English)"
            placeholder="Enter primary English translation"
            {...register("primaryTranslation", {
              required: "Translation is required",
            })}
            error={errors.primaryTranslation}
          />

          {/* Tags Section */}
          <div>
            <TextInput
              label="Tags"
              name="tags"
              placeholder="Press enter to add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              isRequired={false}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, i) => (
                <div
                  key={i}
                  className="bg-blue-100 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{tag}</span>
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X className="w-4 h-4 text-blue-500 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <Button label="Save" variant="primary" isLoading={isLoading || isUpdating} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddorEditBookTextForm;
