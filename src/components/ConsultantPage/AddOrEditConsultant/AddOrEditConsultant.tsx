/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../../Reusable/Button/Button";
import Loader from "../../Reusable/Loader/Loader";
import Modal from "../../Reusable/Modal/Modal";
import TextInput from "../../Reusable/TextInput/TextInput";
import FileUploadInput from "../../Reusable/FileUploadInput/FileUploadInput";

import {
  useAddConsultantMutation,
  useGetSingleConsultantByIdQuery,
  useUpdateConsultantMutation,
} from "../../../redux/Features/Consultants/consultantsApi";
import { X } from "lucide-react";

type TFormData = {
  name: string;
  email?: string;
  phoneNumber: string;
  specialties: string[];
  experience: string;
  category: string;
  fees: string;
  rating: string;
  imageUrl?: any;
};

type TAddOrEditConsultantProps = {
  isAddOrEditConsultantModalOpen: boolean;
  setIsAddOrEditConsultantModalOpen: any;
  modalType: "add" | "edit";
  setModalType: (value: "add" | "edit") => void;
  consultantId?: string;
};

const AddOrEditConsultant: React.FC<TAddOrEditConsultantProps> = ({
  isAddOrEditConsultantModalOpen,
  setIsAddOrEditConsultantModalOpen,
  modalType,
  setModalType,
  consultantId,
}) => {
  const [specialtyInput, setSpecialtyInput] = useState<string>("");
  const [specialties, setSpecialties] = useState<string[]>([]);

  // Handler for Enter key
  const handleSpecialtyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = specialtyInput.trim();
      if (trimmed && !specialties.includes(trimmed)) {
        setSpecialties((prev) => [...prev, trimmed]);
      }
      setSpecialtyInput("");
    }
  };

  // Remove specialty
  const removeSpecialty = (specialty: string) =>
    setSpecialties((prev) => prev.filter((s) => s !== specialty));

  const { data, isLoading: isSingleDataLoading } =
    useGetSingleConsultantByIdQuery(consultantId as string);

  const [addConsultant, { isLoading: isAdding }] = useAddConsultantMutation();
  const [updateConsultant, { isLoading: isUpdating }] =
    useUpdateConsultantMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormData>({
    defaultValues: {
      specialties: [],
    },
  });

  // Setting default values
  useEffect(() => {
    if (modalType === "edit" && data?.data) {
      const consultant = data.data;

      setValue("name", consultant.name);
      setValue("email", consultant.email || "");
      setValue("phoneNumber", consultant.phoneNumber);
      setSpecialties(consultant.specialties || []);
      setValue("experience", consultant.experience);
      setValue("category", consultant.category);
      setValue("fees", consultant.fees);
      setValue("rating", consultant.rating);
    } else {
      reset();
      setSpecialties([]);
    }
  }, [modalType, data, reset, setValue]);

  const handleSubmitConsultant = async (formData: TFormData) => {
    try {
      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("email", formData.email || "");
      payload.append("phoneNumber", formData.phoneNumber);
      payload.append("experience", formData.experience);
      payload.append("category", formData.category);
      payload.append("fees", formData.fees);
      payload.append("rating", formData.rating);

      // Append specialties array from local state
      specialties.forEach((sp) => payload.append("specialties", sp));

      // Append image file if selected
      if (formData.imageUrl?.[0]) {
        payload.append("file", formData.imageUrl[0]);
      }

      if (modalType === "add") {
        await addConsultant(payload).unwrap();
        toast.success("Consultant added successfully!");
      } else {
        await updateConsultant({
          id: consultantId as string,
          data: payload,
        }).unwrap();
        toast.success("Consultant updated successfully!");
      }

      setIsAddOrEditConsultantModalOpen(false);
      setModalType("add");
      reset();
      setSpecialties([]); // Clear specialties after submit
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Modal
      isModalOpen={isAddOrEditConsultantModalOpen}
      setIsModalOpen={setIsAddOrEditConsultantModalOpen}
      heading={`${modalType === "add" ? "Add" : "Update"} Consultant`}
    >
      <div className="relative">
        {isSingleDataLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleSubmitConsultant)}
          className="flex flex-col gap-6 font-Nunito mt-5"
        >
          {/* Name */}
          <TextInput
            label="Name"
            placeholder="Enter full name"
            error={errors.name}
            {...register("name", { required: "Name is required" })}
          />

          {/* Email */}
          <TextInput
            label="Email"
            placeholder="Enter email (optional)"
            error={errors.email}
            {...register("email")}
          />

          {/* Phone Number */}
          <TextInput
            label="Phone Number"
            placeholder="Enter phone number"
            error={errors.phoneNumber}
            {...register("phoneNumber", {
              required: "Phone number is required",
            })}
          />

          {/* Specialties */}
          <div>
            <TextInput
              name="specialties"
              label="Specialties"
              placeholder="Press Enter to add a specialty"
              value={specialtyInput}
              onChange={(e) => setSpecialtyInput(e.target.value)}
              onKeyDown={handleSpecialtyKeyDown}
              isRequired={true}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {specialties.map((s, i) => (
                <div
                  key={i}
                  className="bg-white border border-primary-10 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{s}</span>
                  <button type="button" onClick={() => removeSpecialty(s)}>
                    <X className="w-4 h-4 text-primary-10 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <TextInput
            label="Experience"
            placeholder="Enter experience"
            error={errors.experience}
            {...register("experience", { required: "Experience is required" })}
          />

          {/* Category */}
          <TextInput
            label="Category"
            placeholder="Enter category"
            error={errors.category}
            {...register("category", { required: "Category is required" })}
          />

          {/* Fees */}
          <TextInput
            label="Fees"
            placeholder="Ex: USD 10/hr"
            error={errors.fees}
            {...register("fees", { required: "Fees are required" })}
          />

          {/* Rating */}
          <TextInput
            label="Rating"
            placeholder="Enter rating (e.g., 4.5)"
            error={errors.rating}
            {...register("rating", { required: "Rating is required" })}
          />

          {/* Image Upload */}
          <FileUploadInput
            label="Profile Image"
            placeholder="Upload profile image"
            accept="image/*"
            maxSize={5}
            error={errors.imageUrl}
            {...register("imageUrl", {
              required: modalType === "add" ? "Image is required" : false,
            })}
          />

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              label="Cancel"
              type="button"
              variant="secondary"
              onClick={() => {
                setIsAddOrEditConsultantModalOpen(false);
                setModalType("add");
                reset();
              }}
            />
            <Button
              type="submit"
              label={
                modalType === "add" ? "Add Consultant" : "Update Consultant"
              }
              isLoading={isAdding || isUpdating}
              isDisabled={isAdding || isUpdating}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddOrEditConsultant;
