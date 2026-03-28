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
import Loader from "../../Reusable/Loader/Loader";
import Button from "../../Reusable/Button/Button";
import { useGetAllBooksQuery } from "../../../redux/Features/Book/bookApi";
import Modal from "../../Reusable/Modal/Modal";

export type TAddOrEditBookTextFormProps = {
  isAddOrEditBookTextModalOpen: boolean;
  setIsAddOrEditBookTextModalOpen: any;
  modalType?: "add" | "edit";
  setModalType: (mode: "add" | "edit") => void;
  defaultValues?: any;
  isSingleDataLoading?: boolean;
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

const AddOrEditBookTextForm: React.FC<TAddOrEditBookTextFormProps> = ({
  isAddOrEditBookTextModalOpen,
  setIsAddOrEditBookTextModalOpen,
  modalType = "add",
  setModalType,
  defaultValues,
  isSingleDataLoading,
}) => {
  const { data } = useGetAllBooksQuery({});
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

  const allBookNames = data?.data?.data?.map((b: any) => ({
    _id: b._id,
    name: b.name,
    structure: b.structure,
    levels: b.levels,
  }));

  // 🟢 Handle selecting a book to auto-load structure levels
  const handleBookChange = (bookId: string) => {
    const book = allBookNames.find((b: any) => b._id === bookId);
    setSelectedBook(book);

    if (book?.levels?.length) {
      replace(
        book.levels.map((level: any) => ({ levelName: level.name, value: "" })),
      );
    } else {
      replace([]); // Empty if custom
    }
  };

  // 🟢 Setup defaults on edit or add
  useEffect(() => {
    if (modalType === "edit" && defaultValues) {
      reset({
        bookId: defaultValues.bookId?._id ?? "",
        location: defaultValues.location ?? [],
        originalText: defaultValues.originalText ?? "",
        primaryTranslation: defaultValues.primaryTranslation ?? "",
        tags: defaultValues.tags ?? [],
      });
      setTags(defaultValues.tags || []);
    } else if (modalType === "add") {
      reset({
        bookId: "",
        location: [],
        originalText: "",
        primaryTranslation: "",
        tags: [],
      });
      setTags([]);
    }
  }, [defaultValues, modalType, reset]);

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
      if (modalType === "edit" && defaultValues?._id) {
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
      setIsAddOrEditBookTextModalOpen(false);
      setModalType("add");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Modal
      isModalOpen={isAddOrEditBookTextModalOpen}
      setIsModalOpen={setIsAddOrEditBookTextModalOpen}
      heading={`${modalType === "add" ? "Add" : "Update"} Book Text`}
    >
      <div className="relative">
        {isSingleDataLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Book Dropdown */}
          <div className="flex flex-col gap-2">
            <label>
              Book<span className="text-red-600">*</span>
            </label>
            <select
              {...register("bookId", { required: "Please select book" })}
              onChange={(e) => handleBookChange(e.target.value)}
              className="appearance-none relative block w-full px-4 py-3 border text-neutral-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10 focus:border-transparent font-Roboto transition-all duration-200 cursor-pointer bg-white border-neutral-50"
            >
              <option value="">Select Book</option>
              {allBookNames?.map((book: any) => (
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
                  className="bg-white border border-primary-10 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{tag}</span>
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X className="w-4 h-4 text-primary-10 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              label="Cancel"
              variant="secondary"
              onClick={() => setIsAddOrEditBookTextModalOpen(false)}
            />

            <Button label="Save" isLoading={isLoading || isUpdating} />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddOrEditBookTextForm;
