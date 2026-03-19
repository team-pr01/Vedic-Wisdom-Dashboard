// steps/SocialMediaStep.tsx
import { useFormContext } from "react-hook-form";
import TextInput from "../../../Reusable/TextInput/TextInput";
const SocialMediaStep = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-10 mb-4 font-Inter">
          Social Media Links
        </h3>
        <div className="space-y-4">
          <TextInput
            label="Facebook"
            placeholder="Facebook page URL"
            {...register("socialMedia.facebook")}
            isRequired={false}
          />

          <TextInput
            label="YouTube"
            placeholder="YouTube channel URL"
            {...register("socialMedia.youtube")}
            isRequired={false}
          />

          <TextInput
            label="Instagram"
            placeholder="Instagram profile URL"
            {...register("socialMedia.instagram")}
            isRequired={false}
          />

          <TextInput
            label="LinkedIn"
            placeholder="LinkedIn profile URL"
            {...register("socialMedia.linkedin")}
            isRequired={false}
          />
        </div>
      </div>
    </div>
  );
};

export default SocialMediaStep;
