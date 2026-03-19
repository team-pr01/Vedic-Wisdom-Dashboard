// steps/LocationStep.tsx
import { useFormContext } from "react-hook-form";
import { MapPin } from "lucide-react";
import TextInput from "../../../Reusable/TextInput/TextInput";

const LocationStep = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-10 mb-4 font-Inter flex items-center gap-2">
          <MapPin size={18} className="text-primary-10" />
          Location Information
        </h3>
        <div className="space-y-4">
          <TextInput
            label="Address"
            placeholder="Enter full address"
            error={errors.location?.address}
            {...register("location.address", { 
              required: "Address is required" 
            })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="City"
              placeholder="Enter city"
              error={errors.location?.city}
              {...register("location.city", { 
                required: "City is required" 
              })}
            />

            <TextInput
              label="State"
              placeholder="Enter state"
              error={errors.location?.state}
              {...register("location.state", { 
                required: "State is required" 
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Country"
              placeholder="Enter country"
              error={errors.location?.country}
              {...register("location.country", { 
                required: "Country is required" 
              })}
            />

            <TextInput
              label="Area"
              placeholder="Enter area/locality"
              {...register("location.area")}
            />
          </div>

          <TextInput
            label="Google Map URL"
            placeholder="Enter Google Maps link"
            {...register("location.googleMapUrl")}
          />
        </div>
      </div>
    </div>
  );
};

export default LocationStep;