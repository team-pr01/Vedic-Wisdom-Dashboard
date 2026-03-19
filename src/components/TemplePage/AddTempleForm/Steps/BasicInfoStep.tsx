// steps/BasicInfoStep.tsx
import { useFormContext } from "react-hook-form";
import { Building2 } from "lucide-react";
import TextInput from "../../../Reusable/TextInput/TextInput";
import Textarea from "../../../Reusable/TextArea/TextArea";
import SelectDropdown from "../../../Reusable/SelectDropdown/SelectDropdown";

const BasicInfoStep = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const categories = [
    {
      label: "Ganesha Temple",
      value: "Ganesha Temple",
    },
    {
      label: "Ram Temple",
      value: "Ganesha Temple",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="">
        <h3 className="text-lg font-semibold text-neutral-10 mb-4 font-Inter flex items-center gap-2">
          <Building2 size={18} className="text-primary-10" />
          Basic Information
        </h3>
        <div className="space-y-4">
          <SelectDropdown
            label="Category"
            options={categories}
            error={errors.category}
            {...register("category")}
          />

          <TextInput
            label="Temple Name"
            placeholder="Enter temple name"
            error={errors.basicInfo?.templeName}
            {...register("basicInfo.templeName", {
              required: "Temple name is required",
            })}
          />

          <TextInput
            label="Main Deity"
            placeholder="Enter main deity"
            error={errors.basicInfo?.mainDeity}
            {...register("basicInfo.mainDeity", {
              required: "Main deity is required",
            })}
          />

          <Textarea
            label="Description"
            placeholder="Enter temple description"
            error={errors.basicInfo?.description}
            {...register("basicInfo.description", {
              required: "Description is required",
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
