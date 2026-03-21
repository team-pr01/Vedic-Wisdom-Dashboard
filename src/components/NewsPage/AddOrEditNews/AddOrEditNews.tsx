/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import Button from "../../Reusable/Button/Button";
import Loader from "../../Reusable/Loader/Loader";
import Modal from "../../Reusable/Modal/Modal";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import TextInput from "../../Reusable/TextInput/TextInput";
import FileUploadInput from "../../Reusable/FileUploadInput/FileUploadInput";
import { useEffect, useState, useRef } from "react";
import {
  useAddNewsMutation,
  useGetSingleNewsByIdQuery,
  useTranslateNewsMutation,
  useUpdateNewsMutation,
} from "../../../redux/Features/News/newsApi";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import type { TCategories } from "../../Shared/Category/Category";
import { LANGUAGES } from "../../../constants/allLanguages";

type TFormData = {
  title: string;
  content: string;
  tags: string[];
  category: string;
  file?: any;
};

type TAddOrEditNewsProps = {
  isAddOrEditNewsModalOpen: boolean;
  setIsAddOrEditNewsModalOpen: any;
  modalType: string;
  setModalType: (value: string) => void;
  newsId?: string;
  categories?: TCategories[];
};

const AddOrEditNews: React.FC<TAddOrEditNewsProps> = ({
  isAddOrEditNewsModalOpen,
  setIsAddOrEditNewsModalOpen,
  modalType,
  setModalType,
  newsId,
  categories,
}) => {
  // Only fetch when modal is open and not in add mode
  const { data, isLoading: isSingleNewsDataLoading } =
    useGetSingleNewsByIdQuery(
      { id: newsId, languageCode: "en" },
      { skip: modalType === "add" || !isAddOrEditNewsModalOpen },
    );

  const defaultValues = data?.data || {};

  const [addNews, { isLoading: isAdding }] = useAddNewsMutation();
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();
  const [translateNews, { isLoading: isTranslating }] =
    useTranslateNewsMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TFormData>();

  const [currentArticle, setCurrentArticle] = useState<{ content: string }>({
    content: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<any[]>([]);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);

  // Use ref to track if initial load has happened
  const initialLoadDone = useRef(false);

  // ------------------------ TAG HANDLERS ------------------------
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed)) setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // ------------------------ CATEGORY FILTER ------------------------
  const filteredCategory = categories?.filter(
    (category: any) => category.areaName === "News",
  );
  const [allCategories, setAllCategories] = useState<string[]>(
    filteredCategory?.map((category: any) => category.category) || [],
  );

  // ------------------------ LOAD DEFAULT / EDIT DATA ------------------------
  // INITIALIZE DEFAULT LANGUAGE - only on first load
  useEffect(() => {
    if (!defaultValues || Object.keys(defaultValues).length === 0) return;
    if (initialLoadDone.current) return;

    const defaultLang =
      Object.keys(defaultValues.translations || {})[0] || "en";
    setActiveLanguage(defaultLang);
    setSelectedLanguages([]);
    initialLoadDone.current = true;
  }, [defaultValues]);

  // LOAD TRANSLATION WHEN LANGUAGE CHANGES
  useEffect(() => {
    if (!defaultValues || !activeLanguage) return;
    if (modalType === "add") return;

    if (defaultValues) {
      if (
        defaultValues.category &&
        !allCategories.includes(defaultValues.category)
      ) {
        setAllCategories((prev) => [...prev, defaultValues.category]);
      }
      loadTranslationToForm(defaultValues);
    }
  }, [activeLanguage, defaultValues, modalType]);

  const loadTranslationToForm = (translation: any) => {
    setValue("title", translation.title || "");
    setValue("category", translation.category || "");
    setCurrentArticle({ content: translation.content || "" });
    setTags(translation.tags || []);
  };

  // ------------------------ SUBMIT NEWS ------------------------
  const handleSubmitNews = async (data: TFormData) => {
    try {
      const formData = new FormData();

      if (data.file instanceof FileList && data.file.length > 0) {
        formData.append("file", data.file[0]);
      }

      const translationsPayload = {
        ...(defaultValues?.translations || {}),
        [activeLanguage || "en"]: {
          title: data.title,
          content: currentArticle.content,
          tags: tags,
        },
      };

      formData.append("category", data.category);
      formData.append("translations", JSON.stringify(translationsPayload));

      let response;
      if (modalType === "edit" && defaultValues?._id) {
        response = await updateNews({
          id: defaultValues._id,
          data: formData,
        }).unwrap();
        toast.success(response?.message || "News updated successfully");
      } else {
        response = await addNews(formData).unwrap();
        toast.success(response?.message || "News added successfully");
      }

      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const resetForm = () => {
    setIsAddOrEditNewsModalOpen(false);
    reset();
    setCurrentArticle({ content: "" });
    setTags([]);
    setTagInput("");
    setSelectedLanguages([]);
    setActiveLanguage(null);
    initialLoadDone.current = false;
  };

  // ------------------------ TRANSLATION ------------------------
  const handleTranslateLanguage = async () => {
    try {
      const missingLanguages = selectedLanguages.filter(
        (lang) => !defaultValues?.translations?.[lang.code],
      );

      if (!missingLanguages.length)
        return alert("Select at least one new language.");

      const payload = {
        newsId: defaultValues?._id,
        title: defaultValues?.translations?.en?.title,
        content: defaultValues?.translations?.en?.content,
        tags: defaultValues?.translations?.en?.tags,
        category: defaultValues?.translations?.en?.category,
        batchLanguages: missingLanguages.map((lang) => ({
          code: lang.code,
          name: lang.name,
        })),
      };

      const res = await translateNews(payload).unwrap();

      if (res?.translations) {
        defaultValues.translations = {
          ...defaultValues.translations,
          ...res.translations,
        };

        const generatedLang = missingLanguages[0].code;
        setActiveLanguage(generatedLang);
        loadTranslationToForm(res.translations[generatedLang]);
        toast.success("News translated successfully");
      }
    } catch (error) {
      console.error("Translation failed:", error);
      alert("Failed to translate batch");
    }
  };

  // ------------------------ LANGUAGE HANDLERS ------------------------
  const toggleLanguage = (language: any, checked: boolean) => {
    if (checked) setSelectedLanguages((prev) => [...prev, language]);
    else
      setSelectedLanguages((prev) =>
        prev.filter((lang) => lang.code !== language.code),
      );
  };

  const handleLanguageClick = (language: any) => {
    setActiveLanguage(language.code);

    const translation = defaultValues?.translations?.[language.code];
    if (translation) loadTranslationToForm(translation);
    else
      loadTranslationToForm({ title: "", category: "", content: "", tags: [] });
  };

  const newsCategories = categories?.map((category) => ({
    label: category.category,
    value: category.category,
  }));

  console.log(defaultValues);
  return (
    <Modal
      isModalOpen={isAddOrEditNewsModalOpen}
      setIsModalOpen={setIsAddOrEditNewsModalOpen}
      heading={`${modalType === "add" ? "Add" : "Update"} Audio Book`}
    >
      <div className="relative">
        {isSingleNewsDataLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}

        <div className="flex items-center w-full overflow-x-auto gap-4 mt-3">
          {LANGUAGES.map((language) => {
            const isChecked = selectedLanguages.some(
              (lang) => lang.code === language.code,
            );

            return (
              <div key={language.code} className="flex items-center gap-2">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => toggleLanguage(language, e.target.checked)}
                  className="form-checkbox h-4 w-4 text-purple-500 rounded border-gray-300 focus:ring-purple-500"
                />

                {/* Button */}
                <button
                  type="button"
                  onClick={() => {
                    handleLanguageClick(language);
                    toggleLanguage(language, !isChecked);
                  }}
                  className={`flex items-center justify-center px-2 py-1 rounded shadow-sm text-xs font-medium whitespace-nowrap border
      ${
        activeLanguage === language.code ||
        defaultValues?.languages?.includes(language.code)
          ? "bg-primary-10 border-primary-10 text-white"
          : "bg-white border-primary-10 text-primary-10"
      }`}
                >
                  {language.name}
                </button>
              </div>
            );
          })}
        </div>
        {/* Generate by AI button */}
        <button
          type="button"
          onClick={handleTranslateLanguage}
          className="ml-auto flex items-center px-3 py-1.5 rounded bg-purple-500 text-white text-xs font-medium shadow-sm"
        >
          {isTranslating ? "Translating..." : "Generate by AI"}
        </button>

        <form
          onSubmit={handleSubmit(handleSubmitNews)}
          className="flex flex-col gap-6 font-Nunito mt-5"
        >
          <div className="flex flex-col gap-6">
            <TextInput
              label="Title"
              placeholder="Enter Title"
              {...register("title", {
                required: "Title is required",
              })}
              error={errors.title}
            />

            {/* Category */}
            <SelectDropdown
              label="Category"
              options={newsCategories || []}
              error={errors.category}
              {...register("category", {
                required: "Category is required",
              })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content
              </label>
              <div className="mt-1">
                <ReactQuill
                  value={currentArticle.content}
                  onChange={(content: string) =>
                    setCurrentArticle({ ...currentArticle, content })
                  }
                  className="bg-white dark:bg-gray-700"
                />
              </div>
            </div>

            <div>
              <TextInput
                label="Tags"
                name="tags"
                placeholder="Enter tag. Press enter to add another tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                error={
                  Array.isArray(errors.tags) ? errors.tags[0] : errors.tags
                }
                isRequired={false}
              />
              {/* Display tags below the input */}
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center border border-primary-10 text-primary-10 px-2 py-1 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

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
                setIsAddOrEditNewsModalOpen(false);
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

export default AddOrEditNews;
