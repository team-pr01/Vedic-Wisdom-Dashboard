import { useForm } from "react-hook-form";
import Button from "../../Reusable/Button/Button";
import TextInput from "../../Reusable/TextInput/TextInput";
import { useAddCategoryMutation } from "../../../redux/Features/Categories/categoriesApi";

type TFormData = {
  category: string;
  areaName: string;
};

type TAddCategoryFormProps = {
  setIsAddCategoryForOpen: React.Dispatch<React.SetStateAction<boolean>>;
  areaName: string;
};

const AddCategoryForm: React.FC<TAddCategoryFormProps> = ({
  setIsAddCategoryForOpen,
  areaName,
}) => {
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormData>();

  const handleAddCategory = async (data: TFormData) => {
    try {
      const payload = {
        category: data.category,
        areaName,
      };
      const res = await addCategory(payload).unwrap();
      if (res?.success) {
        setIsAddCategoryForOpen(false);
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(handleAddCategory)}
      className="flex flex-col gap-6 font-Nunito mt-5"
    >
      <div className="flex flex-col gap-6">
        {/* Title */}
        <TextInput
          label="Category"
          placeholder="Enter category"
          error={errors.category}
          {...register("category", { required: "Category is required" })}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          label={"Cancel"}
          type="button"
          variant="secondary"
          className="py-1.75 w-full md:w-fit"
          onClick={() => {
            setIsAddCategoryForOpen(false);
          }}
        />
        <Button
          type="submit"
          label={"Submit"}
          variant="primary"
          className="py-1.75 w-full md:w-fit"
          isLoading={isAdding}
          isDisabled={isAdding}
        />
      </div>
    </form>
  );
};

export default AddCategoryForm;
