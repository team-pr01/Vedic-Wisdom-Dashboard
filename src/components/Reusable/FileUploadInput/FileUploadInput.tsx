/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useState, useRef } from "react";
import { Upload, X, File, Image, FileText } from "lucide-react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface FileUploadInputProps {
  label?: string;
  name: string;
  placeholder?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  value?: File | File[] | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: any;
  isDisabled?: boolean;
  isRequired?: boolean;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  onFileRemove?: (index: number) => void;
  helpText?: string;
  variant?: "default" | "compact" | "avatar";
}

const FileUploadInput = forwardRef<HTMLInputElement, FileUploadInputProps>(
  (
    {
      label,
      name,
      placeholder = "Choose files or drag and drop",
      error,
      isDisabled = false,
      isRequired = true,
      accept = "image/*,.pdf,.doc,.docx",
      multiple = false,
      maxSize = 5, // 5MB default
      maxFiles = 5,
      onFileRemove,
      helpText,
      variant = "default",
      ...rest
    },
    ref,
  ) => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);

      // Validate file size
      const validFiles = selectedFiles.filter((file) => {
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > maxSize) {
          alert(`File ${file.name} exceeds ${maxSize}MB size limit`);
          return false;
        }
        return true;
      });

      // Validate max files
      if (multiple) {
        const totalFiles = [...files, ...validFiles];
        if (totalFiles.length > maxFiles) {
          alert(`You can only upload up to ${maxFiles} files`);
          return;
        }
        setFiles(totalFiles);
      } else {
        setFiles(validFiles.slice(0, 1));
      }

      // Create previews for images
      const newPreviews = validFiles.map((file) => {
        if (file.type.startsWith("image/")) {
          return URL.createObjectURL(file);
        }
        return "";
      });
      setPreviews((prev) =>
        multiple ? [...prev, ...newPreviews] : newPreviews,
      );

      // Trigger onChange if needed
      if (rest.onChange) {
        rest.onChange(e);
      }
    };

    const handleRemoveFile = (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      const newPreviews = previews.filter((_, i) => i !== index);

      // Revoke object URL to prevent memory leaks
      if (previews[index]) {
        URL.revokeObjectURL(previews[index]);
      }

      setFiles(newFiles);
      setPreviews(newPreviews);

      if (onFileRemove) {
        onFileRemove(index);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);

      // Validate file size
      const validFiles = droppedFiles.filter((file) => {
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > maxSize) {
          alert(`File ${file.name} exceeds ${maxSize}MB size limit`);
          return false;
        }
        return true;
      });

      // Validate max files
      if (multiple) {
        const totalFiles = [...files, ...validFiles];
        if (totalFiles.length > maxFiles) {
          alert(`You can only upload up to ${maxFiles} files`);
          return;
        }
        setFiles(totalFiles);
      } else {
        setFiles(validFiles.slice(0, 1));
      }

      // Create previews for images
      const newPreviews = validFiles.map((file) => {
        if (file.type.startsWith("image/")) {
          return URL.createObjectURL(file);
        }
        return "";
      });
      setPreviews((prev) =>
        multiple ? [...prev, ...newPreviews] : newPreviews,
      );
    };

    const getFileIcon = (file: File) => {
      if (file.type.startsWith("image/")) return Image;
      if (file.type === "application/pdf") return FileText;
      return File;
    };

    const getVariantStyles = () => {
      switch (variant) {
        case "compact":
          return "p-3";
        case "avatar":
          return "w-32 h-32 rounded-full p-0";
        default:
          return "p-6";
      }
    };

    return (
      <div className="flex flex-col gap-2 font-Nunito w-full">
        {label && (
          <label
            htmlFor={name}
            className="flex flex-row items-center w-full justify-between text-neutral-65"
          >
            <span className="text-neutral-20 leading-[18px] text-[15px] font-medium tracking-[-0.16]">
              {label}{" "}
              <span className="text-primary-10">{isRequired ? "*" : ""}</span>
            </span>
          </label>
        )}

        {/* File Upload Area */}
        <div
          className={twMerge(
            "relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer",
            isDragging
              ? "border-primary-10 bg-primary-10/5"
              : "border-neutral-50 hover:border-primary-10/50",
            isDisabled && "opacity-50 cursor-not-allowed bg-neutral-50/20",
            error ? "border-red-500" : "",
            getVariantStyles(),
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isDisabled && fileInputRef.current?.click()}
        >
          <input
            type="file"
            name={name}
            id={name}
            ref={(e) => {
              fileInputRef.current = e;
              if (typeof ref === "function") ref(e);
              else if (ref) ref.current = e;
            }}
            accept={accept}
            multiple={multiple}
            disabled={isDisabled}
            onChange={handleFileChange}
            className="hidden"
            {...rest}
          />

          {variant === "avatar" ? (
            // Avatar variant - show preview or placeholder
            <div className="w-full h-full rounded-full overflow-hidden">
              {previews[0] ? (
                <img
                  src={previews[0]}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neutral-50 flex items-center justify-center">
                  <Upload size={24} className="text-neutral-45" />
                </div>
              )}
            </div>
          ) : (
            // Default or compact variant
            <div className="flex flex-col items-center justify-center text-center">
              <Upload
                size={variant === "compact" ? 20 : 32}
                className="text-neutral-45 mb-2"
              />
              <p
                className={twMerge(
                  "text-neutral-45 font-Roboto",
                  variant === "compact" ? "text-xs" : "text-sm",
                )}
              >
                {placeholder}
              </p>
              {helpText && (
                <p className="text-xs text-neutral-45 mt-1 font-Roboto">
                  {helpText}
                </p>
              )}
              <p className="text-xs text-neutral-45 mt-2 font-Roboto">
                {multiple ? `Up to ${maxFiles} files, ` : ""}Max size: {maxSize}
                MB
              </p>
            </div>
          )}
        </div>

        {/* File List */}
        {files.length > 0 && variant !== "avatar" && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => {
              const FileIcon = getFileIcon(file);
              const fileSizeInKB = (file.size / 1024).toFixed(1);
              const fileSizeDisplay = fileSizeInKB + " KB";

              return (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-3 bg-neutral-50/20 rounded-lg border border-neutral-50"
                >
                  <div className="flex items-center space-x-3">
                    {previews[index] ? (
                      <img
                        src={previews[index]}
                        alt={file.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                        <FileIcon size={20} className="text-primary-10" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-10 truncate font-Inter">
                        {file.name}
                      </p>
                      <p className="text-xs text-neutral-45 font-Roboto">
                        {fileSizeDisplay}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                    className="p-1 hover:bg-red-50 rounded-full transition-colors duration-200"
                  >
                    <X size={16} className="text-red-500" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {error?.message && (
          <span className="text-red-500 text-sm mt-1">
            {String(error.message)}
          </span>
        )}
      </div>
    );
  },
);

FileUploadInput.displayName = "FileUploadInput";

export default FileUploadInput;
