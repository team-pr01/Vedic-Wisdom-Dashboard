/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import Button from "../../Reusable/Button/Button";
import Loader from "../../Reusable/Loader/Loader";
import Modal from "../../Reusable/Modal/Modal";
import SelectDropdown from "../../Reusable/SelectDropdown/SelectDropdown";
import TextInput from "../../Reusable/TextInput/TextInput";
import { useEffect, useState } from "react";
import type { TCategories } from "../../Shared/Category/Category";
import {
  useAddVastuTipsMutation,
  useGetSingleVastuTipsByIdQuery,
  useUpdateVastuTipsMutation,
} from "../../../redux/Features/Vastu/vastuTipsApi";
import { X } from "lucide-react";

type TFormData = {
  title: string;
  category: string;
  tips: string[];
};

type TAddOrEditVastuTipsProps = {
  isAddOrEditVastuTipsModalOpen: boolean;
  setIsAddOrEditVastuTipsModalOpen: any;
  modalType: string;
  setModalType: (value: string) => void;
  vastuTipsId?: string;
  categories?: TCategories[];
};
const AddOrEditVastuTips: React.FC<TAddOrEditVastuTipsProps> = ({
  isAddOrEditVastuTipsModalOpen,
  setIsAddOrEditVastuTipsModalOpen,
  modalType,
  setModalType,
  vastuTipsId,
  categories,
}) => {
  const [tips, setTips] = useState<string[]>([]);
  const [tipsInput, setTipsInput] = useState("");
  const { data, isLoading: isSingleVastuTipsDataLoading } =
    useGetSingleVastuTipsByIdQuery(vastuTipsId);
  const [addVastuTips, { isLoading: isAdding }] = useAddVastuTipsMutation();
  const [updateVastuTips, { isLoading: isUpdating }] =
    useUpdateVastuTipsMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormData>();

  //   Setting default values
  useEffect(() => {
    const singleVastuTipsData = data?.data || {};
    if (modalType === "edit" && singleVastuTipsData) {
      setValue("title", singleVastuTipsData?.title);
      setValue("category", singleVastuTipsData?.category);
      setTips(singleVastuTipsData?.tips);
    } else {
      reset();
    }
  }, [modalType, data, reset, setValue]);

  const handleSubmitVastuTips = async (data: TFormData) => {
    try {
      const payload = {
        title: data.title,
        category: data.category,
        tips,
      };

      if (modalType === "add") {
        await addVastuTips(payload).unwrap();

        setIsAddOrEditVastuTipsModalOpen(false);
      } else {
        await updateVastuTips({ id: vastuTipsId, data: payload }).unwrap();
        setIsAddOrEditVastuTipsModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const vastuTipsCategories = categories?.map((category) => ({
    label: category.category,
    value: category.category,
  }));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tipsInput.trim();
      if (trimmed && !tips.includes(trimmed)) setTips([...tips, trimmed]);
      setTipsInput("");
    }
  };

  const removeTip = (tipToRemove: string) => {
    setTips(tips.filter((tip) => tip !== tipToRemove));
  };

  return (
    <Modal
      isModalOpen={isAddOrEditVastuTipsModalOpen}
      setIsModalOpen={setIsAddOrEditVastuTipsModalOpen}
      heading={`${modalType === "add" ? "Add" : "Update"} Vastu`}
    >
      <div className="relative">
        {isSingleVastuTipsDataLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleSubmitVastuTips)}
          className="flex flex-col gap-6 font-Nunito mt-5"
        >
          <div className="flex flex-col gap-6">
            {/* Title */}
            <TextInput
              label="Title"
              placeholder="Enter title"
              error={errors.title}
              {...register("title", { required: "Title is required" })}
            />

            {/* Category */}
            <SelectDropdown
              label="Category"
              options={vastuTipsCategories || []}
              error={errors.category}
              {...register("category", {
                required: "Category is required",
              })}
            />

            <div>
              <TextInput
                label="Tips"
                name="tips"
                placeholder="Enter tip. Press enter to add another tip"
                value={tipsInput}
                onChange={(e) => setTipsInput(e.target.value)}
                onKeyDown={handleKeyDown}
                error={
                  Array.isArray(errors.tips) ? errors.tips[0] : errors.tips
                }
                isRequired={false}
              />
              {/* Display tips below the input */}
              <div className="flex flex-wrap gap-2 mt-2">
                {tips?.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-center border border-primary-10 text-primary-10 px-2 py-1 rounded-full text-sm"
                  >
                    <span>{tip}</span>
                    <button
                      type="button"
                      onClick={() => removeTip(tip)}
                      className="ml-1 text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              label={"Cancel"}
              type="button"
              variant="secondary"
              className="py-1.75 w-full md:w-fit"
              onClick={() => {
                setIsAddOrEditVastuTipsModalOpen(false);
                setModalType("add");
              }}
            />
            <Button
              type="submit"
              label={modalType === "add" ? "Add Notice" : "Update Notice"}
              variant="primary"
              className="py-1.75 w-full md:w-fit"
              isLoading={isAdding || isUpdating}
              isDisabled={isAdding || isUpdating}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddOrEditVastuTips;
