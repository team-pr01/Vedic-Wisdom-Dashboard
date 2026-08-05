/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUpload,
  FaFilePdf,
  FaTimes,
  FaSpinner,
  FaBook,
  FaInfoCircle,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { useAddDataMutation } from "../../redux/Features/DataCenter/dataCenterApi";
import TextInput from "../../components/Reusable/TextInput/TextInput";

// ==================== CATEGORIES ====================

const CATEGORIES = [
  "Scriptures",
  "Vedic Recipes",
  "Ayurveda",
  "Vedic Books",
  "Spiritual Discourses",
  "Puranas",
  "Upanishads",
  "Mantras",
  "Yoga",
  "Meditation",
  "Vedic Astrology",
];

// ==================== COMPONENT ====================

const DataCenter = () => {
  const [addData, { isLoading }] = useAddDataMutation();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      title: "",
      category: "",
      subCategory: "",
      author: "",
      source: "",
    },
  });

  // ==================== TAG HANDLING ====================

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // ==================== CATEGORY HANDLING ====================

  const filteredCategories = CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes(categoryInput.toLowerCase()),
  );

  const selectCategory = (category: string) => {
    setCategoryInput(category);
    setValue("category", category);
    setShowSuggestions(false);
  };

  // ==================== FILE HANDLING ====================

  const handleFileChange = (file: File) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      toast.error("Please upload a valid PDF file");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  // ==================== SUBMIT ====================

  const onSubmit = async (data: any) => {
    if (!selectedFile) {
      toast.error("Please select a PDF file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const payload = {
        title: data.title,
        category: data.category,
        subCategory: data.subCategory || "",
        author: data.author || "",
        source: data.source || "",
        tags: tags,
      };

      formData.append("data", JSON.stringify(payload));

      setUploadProgress(30);

      await addData(formData).unwrap();

      setUploadProgress(100);
      setIsSuccess(true);
      toast.success("Document uploaded successfully!");

      setTimeout(() => {
        reset();
        setSelectedFile(null);
        setTags([]);
        setTagInput("");
        setCategoryInput("");
        setUploadProgress(0);
        setIsSuccess(false);
      }, 2000);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error?.data?.message || "Failed to upload document");
      setUploadProgress(0);
    }
  };

  // ==================== RENDER ====================

  return (
    <div className="max-w-5xl mx-auto py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-primary-10 rounded-xl shadow-lg shadow-primary-10/20">
            <FaBook className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1C2542] tracking-tight">
              Vedic Knowledge Center
            </h1>
            <p className="text-neutral-45 text-sm">
              Upload sacred texts, scriptures, and Vedic wisdom documents
            </p>
          </div>
        </div>
        <div className="h-0.5 w-16 bg-primary-10 rounded-full mt-1" />
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-neutral-55 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-neutral-55 bg-[#faf9f6]">
          <div className="flex items-center gap-2.5">
            <FaFileAlt className="text-primary-10 text-sm" />
            <span className="font-medium text-[#1C2542] text-sm">
              Upload New Document
            </span>
            <span className="ml-auto text-xs text-neutral-60">
              * Required fields
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Title */}
              <TextInput
                label="Title"
                placeholder="e.g., The Bhagavad Gita - Chapter 1"
                error={errors.title?.message}
                {...register("title")}
              />

              {/* Category - Text Input with Suggestions */}
              <div className="relative">
                <label className="flex flex-row items-center w-full justify-between text-neutral-65 mb-2">
                  <span className="text-neutral-20 leading-4.5 text-[15px] font-medium tracking-[-0.16]">
                    Category <span className="text-primary-10">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => {
                    setCategoryInput(e.target.value);
                    setValue("category", e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  placeholder="Search or enter category..."
                  className={`appearance-none relative block w-full px-4 py-3 border text-neutral-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10 focus:border-transparent font-Roboto transition-all duration-200 ${
                    errors.category ? "border-red-500" : "border-neutral-50"
                  }`}
                />
                {errors.category?.message &&
                  typeof errors.category.message === "string" && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.category.message}
                    </p>
                  )}

                {showSuggestions && filteredCategories.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-55 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {filteredCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => selectCategory(cat)}
                        className="w-full  px-4 py-3 text-left hover:bg-[#f8f6f1] text-[#1C2542] text-sm transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sub Category */}
              <TextInput
                label="Sub Category"
                placeholder="e.g., Gita, Vedanta, Yoga Sutras"
                {...register("subCategory")}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Author */}
              <TextInput
                label="Author"
                placeholder="e.g., Ved Vyasa, Valmiki"
                {...register("author")}
              />

              {/* Source */}
              <TextInput
                label="Source"
                placeholder="e.g., Bhagavad Gita, Rig Veda"
                {...register("source")}
              />

              {/* Tags */}
              <div>
                <label className="flex flex-row items-center w-full justify-between text-neutral-65 mb-2">
                  <span className="text-neutral-20 leading-4.5 text-[15px] font-medium tracking-[-0.16]">
                    Tags <span className="text-primary-10">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type tag and press Enter"
                  className={`appearance-none relative block w-full px-4 py-3 border text-neutral-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10 focus:border-transparent font-Roboto transition-all duration-200 border-neutral-50`}
                />
                <p className="text-xs text-neutral-60 mt-1.5">
                  Press Enter to add tags
                </p>

                {/* Tag Chips */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f8f6f1] border border-neutral-55 rounded-full text-sm text-[#1C2542]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-neutral-60 hover:text-red-500 transition-colors"
                        >
                          <FaTimes className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* File Upload - Full Width */}
          <div className="mt-6">
            <label className="text-sm font-medium text-[#1C2542] mb-1.5">
              PDF Document <span className="text-primary-10">*</span>
            </label>

            <div
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
                isDragging
                  ? "border-primary-10 bg-primary-10/5"
                  : selectedFile
                    ? "border-green-400 bg-green-50/50"
                    : "border-neutral-55 hover:border-primary-10 hover:bg-primary-10/5"
              }`}
            >
              {selectedFile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-50 rounded-lg">
                      <FaFilePdf className="text-red-500 text-lg" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1C2542] text-sm truncate max-w-50">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-neutral-60">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-neutral-45 hover:text-red-500"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-primary-10/10 rounded-full">
                      <FaUpload className="text-primary-10 text-lg" />
                    </div>
                  </div>
                  <p className="text-[#1C2542] font-medium text-sm">
                    Drop your PDF here
                  </p>
                  <p className="text-neutral-60 text-xs mt-0.5">
                    or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange(file);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-neutral-60 mt-1.5">
              Only PDF files accepted (Max: 50MB)
            </p>
          </div>

          {/* Upload Progress */}
          <AnimatePresence>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-5"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-neutral-45">Uploading...</span>
                  <span className="text-primary-10 font-medium">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="h-1 bg-neutral-55 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-10 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success State */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200 flex items-center gap-2.5"
              >
                <FaCheckCircle className="text-green-500" />
                <span className="text-green-700 font-medium text-sm">
                  Document uploaded successfully!
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isLoading || uploadProgress > 0}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-medium text-white text-sm transition-all duration-300 ${
                isLoading || uploadProgress > 0
                  ? "bg-neutral-60 cursor-not-allowed"
                  : "bg-primary-10 hover:shadow-lg hover:shadow-primary-10/25 hover:scale-[1.01] active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload />
                  Upload Document
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                reset();
                setSelectedFile(null);
                setTags([]);
                setTagInput("");
                setCategoryInput("");
                setIsSuccess(false);
              }}
              className="px-6 py-2.5 rounded-xl border border-neutral-55 text-neutral-45 font-medium text-sm hover:bg-[#f8f6f1] transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-5 p-4 bg-[#f8f6f1] rounded-xl border border-neutral-55">
            <div className="flex items-start gap-2.5">
              <FaInfoCircle className="text-primary-10 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-neutral-20">
                  This document will be processed and added to the Vedic
                  Knowledge Base. The AI assistant will use this content to
                  answer user queries.
                </p>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DataCenter;
