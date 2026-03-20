import { useForm } from "react-hook-form";
import { useAddEventMutation } from "../../redux/Features/Temple/templeApi";
import Loader from "../Reusable/Loader/Loader";
import Modal from "../Reusable/Modal/Modal";
import TextInput from "../Reusable/TextInput/TextInput";
import Textarea from "../Reusable/TextArea/TextArea";
import FileUploadInput from "../Reusable/FileUploadInput/FileUploadInput";
import Button from "../Reusable/Button/Button";

type TAddEventProps = {
  isAddEventModalOpen: boolean;
  setIsAddEventModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  templeId: string;
};

type EventFormData = {
  name: string;
  date: string;
  description: string;
  files: FileList;
};

const AddEvent: React.FC<TAddEventProps> = ({
  isAddEventModalOpen,
  setIsAddEventModalOpen,
  templeId,
}) => {
  const [addEvent, { isLoading }] = useAddEventMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormData>();

  const handleAddEvent = async (data: EventFormData) => {
    try {
      const formData = new FormData();

      // Append event object as JSON string
      formData.append(
        "event",
        JSON.stringify({
          name: data.name,
          date: data.date,
          description: data.description || "",
        }),
      );

      // Append templeId separately
      formData.append("templeId", templeId);

      // Append images as "files"
      if (data.files && data.files.length > 0) {
        Array.from(data.files).forEach((file) => {
          formData.append("files", file);
        });
      }

      await addEvent({ id: templeId, data: formData }).unwrap();

      // Close modal and reset form on success
      setIsAddEventModalOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };

  return (
    <Modal
      isModalOpen={isAddEventModalOpen}
      setIsModalOpen={setIsAddEventModalOpen}
      heading="Add Event"
    >
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleAddEvent)}
          className="flex flex-col gap-6 font-Nunito mt-5"
        >
          <div className="flex flex-col gap-6">
            {/* Event Name */}
            <TextInput
              label="Event Name"
              placeholder="Enter event name"
              error={errors.name}
              {...register("name", {
                required: "Event name is required",
              })}
            />

            {/* Event Date */}
            <TextInput
              label="Event Date"
              placeholder="Enter event date"
              type="date"
              error={errors.date}
              {...register("date", {
                required: "Event date is required",
              })}
            />

            {/* Description */}
            <Textarea
              label="Description"
              placeholder="Enter description"
              error={errors.description}
              {...register("description")}
              isRequired={false}
            />

            {/* Event Images */}
            <FileUploadInput
              label="Event Images"
              placeholder="Upload event images"
              helpText="You can upload multiple images (Max 5MB each)"
              accept="image/*"
              multiple
              maxFiles={5}
              maxSize={5}
              error={errors.files}
              {...register("files", {
                validate: {
                  fileType: (files) => {
                    if (files && files.length > 0) {
                      const invalidFiles = Array.from(files).filter(
                        (file) => !file.type.startsWith("image/"),
                      );
                      if (invalidFiles.length > 0) {
                        return "Please upload only image files";
                      }
                    }
                    return true;
                  },
                  fileSize: (files) => {
                    if (files && files.length > 0) {
                      const oversizedFiles = Array.from(files).filter(
                        (file) => file.size > 5 * 1024 * 1024,
                      );
                      if (oversizedFiles.length > 0) {
                        return "Some files exceed 5MB size limit";
                      }
                    }
                    return true;
                  },
                },
              })}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              label="Cancel"
              type="button"
              variant="secondary"
              className="py-1.75 w-full md:w-fit"
              onClick={() => {
                setIsAddEventModalOpen(false);
                reset();
              }}
            />
            <Button
              type="submit"
              label="Add Event"
              variant="primary"
              className="py-1.75 w-full md:w-fit"
              isLoading={isLoading}
              isDisabled={isLoading}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddEvent;
