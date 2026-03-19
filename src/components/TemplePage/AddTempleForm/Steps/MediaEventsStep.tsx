// steps/MediaEventsStep.tsx (Simplified Version)
import { useFormContext, useFieldArray } from "react-hook-form";
import { Image, Video, Trash2 } from "lucide-react";
import FileUploadInput from "../../../Reusable/FileUploadInput/FileUploadInput";
import Button from "../../../Reusable/Button/Button";

const MediaEventsStep = () => {
  const { register, control } = useFormContext();

  // For video URLs array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "media.videoUrls",
  });

  return (
    <div className="space-y-6">
      {/* Images Section */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-10 mb-4 font-Inter flex items-center gap-2">
          <Image size={18} className="text-primary-10" />
          Temple Images
        </h3>
        <FileUploadInput
          label="Upload Images"
          placeholder="Upload temple images"
          accept="image/*"
          multiple
          maxFiles={10}
          maxSize={5}
          {...register("media.files")}
        />
      </div>

      {/* Video URLs Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-10 font-Inter flex items-center gap-2">
            <Video size={18} className="text-primary-10" />
            Video Links
          </h3>
          <Button
            label="Add Video Link"
            type="button"
            onClick={() => append("")}
          />
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="url"
                  placeholder="Enter video URL (YouTube, Facebook, etc.)"
                  className="w-full px-4 py-3 border border-neutral-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10 focus:border-transparent font-Roboto"
                  {...register(`media.videoUrls.${index}`, {
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                      message: "Please enter a valid URL",
                    },
                  })}
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-3 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-8 bg-neutral-50/20 rounded-lg">
              <Video size={32} className="mx-auto text-neutral-45 mb-2" />
              <p className="text-sm text-neutral-45">
                No video links added yet
              </p>
            </div>
          )}
        </div>

        <p className="text-xs text-neutral-45 mt-3">
          Supported: YouTube, Facebook
        </p>
      </div>
    </div>
  );
};

export default MediaEventsStep;
