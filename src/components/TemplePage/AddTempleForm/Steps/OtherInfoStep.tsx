import { useFormContext } from "react-hook-form";
import TextInput from "../../../Reusable/TextInput/TextInput";

const OtherInfoStep = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-10 mb-4 font-Inter">
          Other Information
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Established Year"
              type="number"
              placeholder="e.g., 1800"
              {...register("otherInfo.establishedYear")}
            />

            <TextInput
              label="Visiting Hours"
              placeholder="e.g., 6:00 AM - 8:00 PM"
              {...register("otherInfo.visitingHours")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Phone Number"
              placeholder="Enter contact number"
              {...register("otherInfo.phoneNumber")}
            />

            <TextInput
              label="Email"
              type="email"
              placeholder="Enter email address"
              {...register("otherInfo.email")}
              isRequired={false}
            />
          </div>

          <TextInput
            label="Website"
            placeholder="Enter website URL"
            {...register("otherInfo.website")}
            isRequired={false}
          />
        </div>
      </div>
    </div>
  );
};

export default OtherInfoStep;
