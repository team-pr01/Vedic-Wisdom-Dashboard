/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FaCheckCircle,
  FaFilePdf,
  FaInfoCircle,
  FaSpinner,
  FaTimes,
  FaUpload,
} from "react-icons/fa";
import Modal from "../../Reusable/Modal/Modal";
import { useAddDataMutation } from "../../../redux/Features/DataCenter/dataCenterApi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const UploadDocument = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [addData, { isLoading }] = useAddDataMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const { handleSubmit, reset } = useForm<any>();

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

  const onSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a PDF file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("files", selectedFile);

      await addData(formData).unwrap();

      setIsSuccess(true);
      toast.success("Document uploaded successfully!");

      setTimeout(() => {
        reset();
        setSelectedFile(null);
        setIsSuccess(false);
      }, 2000);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error?.data?.message || "Failed to upload document");
    }
  };

  return (
    <Modal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      heading="Upload Documents"
    >
      {/* Main Card */}
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* File Upload - Full Width */}
          <div>
            <label className="text-sm font-medium text-[#1C2542]">
              PDF Document <span className="text-primary-10">*</span>
            </label>

            <div
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 mt-2 ${
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
          {/* {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-5">
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
            </div>
          )} */}

          {/* Success State */}
          {isSuccess && (
            <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200 flex items-center gap-2.5">
              <FaCheckCircle className="text-green-500" />
              <span className="text-green-700 font-medium text-sm">
                Document uploaded successfully!
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                reset();
                setSelectedFile(null);
                setIsSuccess(false);
              }}
              className="px-6 py-2.5 rounded-xl border border-neutral-55 text-neutral-45 font-medium text-sm hover:bg-[#f8f6f1] transition-colors"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-medium text-white text-sm transition-all duration-300 ${
                isLoading
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
      </div>
    </Modal>
  );
};

export default UploadDocument;
