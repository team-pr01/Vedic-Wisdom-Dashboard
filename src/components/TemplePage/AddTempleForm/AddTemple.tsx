/* eslint-disable @typescript-eslint/no-explicit-any */
// AddTemple.tsx
import { useForm, FormProvider } from "react-hook-form";
import { useState, useEffect } from "react";
import type { TTemple } from "../../../types/temple.types";
import {
  useAddTempleMutation,
  useUpdateTempleMutation,
} from "../../../redux/Features/Temple/templeApi";
import Modal from "../../Reusable/Modal/Modal";
import Loader from "../../Reusable/Loader/Loader";
import Button from "../../Reusable/Button/Button";
import BasicInfoStep from "./Steps/BasicInfoStep";
import LocationStep from "./Steps/LocationStep";
import OtherInfoStep from "./Steps/OtherInfoStep";
import SocialMediaStep from "./Steps/SocialMediaStep";
import MediaEventsStep from "./Steps/MediaEventsStep";
import StepProgress from "./StepProgress";

const steps = [
  { id: 1, title: "Basic Info" },
  { id: 2, title: "Location" },
  { id: 3, title: "Other Info" },
  { id: 4, title: "Social Media" },
  { id: 5, title: "Media & Events" },
  { id: 6, title: "Review" },
];

interface AddTempleProps {
  isAddOrUpdateTempleModalOpen: boolean;
  setIsAddOrUpdateTempleModalOpen: any;
  templeData?: TTemple;
  modalType?: "add" | "edit";
}

const AddTemple = ({
  isAddOrUpdateTempleModalOpen,
  setIsAddOrUpdateTempleModalOpen,
  templeData,
  modalType = "add",
}: AddTempleProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const [addTemple, { isLoading: isAdding }] = useAddTempleMutation();
  const [updateTemple, { isLoading: isUpdating }] = useUpdateTempleMutation();

  const methods = useForm({
    defaultValues: {
      basicInfo: { templeName: "", mainDeity: "", description: "" },
      location: {
        address: "",
        city: "",
        state: "",
        country: "",
        area: "",
        googleMapUrl: "",
      },
      otherInfo: {
        establishedYear: "",
        visitingHours: "",
        phoneNumber: "",
        email: "",
        website: "",
      },
      socialMedia: { facebook: "", youtube: "", instagram: "", linkedin: "" },
      media: { files: [], videoUrls: [] },
      category: "",
    },
    mode: "onChange",
  });

  const { handleSubmit, trigger, reset } = methods;

  useEffect(() => {
    if (templeData && modalType === "edit") {
      reset({
        basicInfo: templeData.basicInfo,
        location: templeData.location,
        otherInfo: templeData.otherInfo || {},
        socialMedia: templeData.socialMedia || {},
        events: templeData.event || [],
        category: templeData.category,
        status: templeData.status || "draft",
      });
    }
  }, [templeData, modalType, reset]);

  const validateCurrentStep = async () => {
    let fieldsToValidate: string[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "basicInfo.templeName",
          "basicInfo.mainDeity",
          "basicInfo.description",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "location.address",
          "location.city",
          "location.state",
          "location.country",
        ];
        break;
      case 3:
        fieldsToValidate = [];
        break;
      case 4:
        fieldsToValidate = [];
        break;
      case 5:
        fieldsToValidate = [];
        break;
      case 6:
        fieldsToValidate = ["category"];
        break;
    }

    const isValid = await trigger(fieldsToValidate as any);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      // Append all data
      Object.keys(data).forEach((key) => {
        if (key === "media") {
          if (data.media.files?.length) {
            Array.from(data.media.files).forEach((file: any) => {
              formData.append("files", file);
            });
          }
          if (data.media.videoUrls?.length) {
            Array.from(data.media.videoUrls).forEach((file: any) => {
              formData.append("media[videoUrls]", file);
            });
          }
        } else if (key === "events") {
          formData.append("events", JSON.stringify(data.events));
        } else {
          formData.append(key, JSON.stringify(data[key]));
        }
      });

      if (modalType === "add") {
        await addTemple(formData).unwrap();
      } else {
        await updateTemple({ id: templeData?._id, data: formData }).unwrap();
      }

      setIsAddOrUpdateTempleModalOpen();
      reset();
      setCurrentStep(1);
      setCompletedSteps([]);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <LocationStep />;
      case 3:
        return <OtherInfoStep />;
      case 4:
        return <SocialMediaStep />;
      case 5:
        return <MediaEventsStep />;
      // case 6:
      //   return <CategoryStatusStep />;
      default:
        return null;
    }
  };

  return (
    <Modal
      isModalOpen={isAddOrUpdateTempleModalOpen}
      setIsModalOpen={setIsAddOrUpdateTempleModalOpen}
      heading={`${modalType === "add" ? "Add" : "Edit"} Temple`}
    >
      <div className="relative">
        {(isAdding || isUpdating) && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
            <Loader
              size="lg"
              text={modalType === "add" ? "Adding temple..." : "Updating temple..."}
            />
          </div>
        )}

        <StepProgress
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={(stepId) => {
            if (completedSteps.includes(stepId) || stepId < currentStep) {
              setCurrentStep(stepId);
            }
          }}
        />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            <div className="min-h-[400px] max-h-[500px] overflow-y-auto px-1">
              {renderStep()}
            </div>

            <div className="flex items-center justify-between mt-8 pt-4 border-t border-neutral-50">
              <Button
                label="Previous"
                type="button"
                variant="secondary"
                onClick={handlePrevious}
                isDisabled={currentStep === 1}
                className="flex items-center gap-2"
              />

              <div className="flex items-center gap-3">
                <Button
                  label="Cancel"
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddOrUpdateTempleModalOpen(false)}
                />

                {currentStep === steps.length ? (
                  <Button
                    label={modalType === "add" ? "Add Temple" : "Update Temple"}
                    type="submit"
                    variant="primary"
                    isLoading={isAdding || isUpdating}
                  />
                ) : (
                  <Button
                    label="Next"
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                    className="flex items-center gap-2"
                  />
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </Modal>
  );
};

export default AddTemple;
