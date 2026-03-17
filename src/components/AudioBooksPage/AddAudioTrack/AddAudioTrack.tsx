/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import Button from "../../Reusable/Button/Button";
import FileUploadInput from "../../Reusable/FileUploadInput/FileUploadInput";
import TextInput from "../../Reusable/TextInput/TextInput";
import { useAddAudioTrackMutation } from "../../../redux/Features/AudioTracks/audioTracksApi";

type TFormData = {
  audioBookId: string;
  title: string;
  file?: any;
};

type TAddAudioTrackProps = {
  audioBookId: string;
  setIsAddAudioTrackModalOpen: (value: boolean) => void;
};

const AddAudioTrack: React.FC<TAddAudioTrackProps> = ({
  audioBookId,
  setIsAddAudioTrackModalOpen,
}) => {
  const [addAudioTrack, { isLoading }] = useAddAudioTrackMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormData>();

  const handleAddAudioTrack = async (data: TFormData) => {
    try {
      const formData = new FormData();

      formData.append("audioBookId", audioBookId);
      formData.append("title", data.title);

      if (data.file?.[0]) {
        formData.append("file", data.file[0]);
      }

      await addAudioTrack(formData).unwrap();

      setIsAddAudioTrackModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <form
      onSubmit={handleSubmit(handleAddAudioTrack)}
      className="flex flex-col gap-6 font-Nunito mt-5"
    >
      <div className="flex flex-col gap-6">
        {/* Title */}
        <TextInput
          label="Title"
          placeholder="Enter book title"
          error={errors.title}
          {...register("title", { required: "Title is required" })}
        />

        {/* Audio Track */}
        <FileUploadInput
          label="Audio Track"
          placeholder="Upload audio track"
          accept="audio/mpeg,audio/mp3,video/mp4"
          helpText="Please upload MP3/MP4 file"
          maxSize={20}
          error={errors.file}
          {...register("file", {
            required: "Audio track is required",
            validate: {
              fileType: (files) => {
                if (
                  files?.[0] &&
                  !(
                    files[0].type.startsWith("audio/") ||
                    files[0].type.startsWith("video/")
                  )
                ) {
                  return "Please upload mp3 or mp4 file";
                }
                return true;
              },
              fileSize: (files) => {
                if (files?.[0] && files[0].size > 20 * 1024 * 1024) {
                  return "File size must be less than 20MB";
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
            setIsAddAudioTrackModalOpen(false);
          }}
        />
        <Button
          type="submit"
          label="Add Audio Track"
          variant="primary"
          className="py-1.75 w-full md:w-fit"
          isLoading={isLoading}
          isDisabled={isLoading}
        />
      </div>
    </form>
  );
};

export default AddAudioTrack;
