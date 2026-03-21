/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  useAddProductMutation,
  useGetSingleProductByIdQuery,
  useUpdateProductMutation,
} from "../../../../redux/Features/Shop/productsApi";
import type { TCategories } from "../../../Shared/Category/Category";
import toast from "react-hot-toast";
import Modal from "../../../Reusable/Modal/Modal";
import Loader from "../../../Reusable/Loader/Loader";
import TextInput from "../../../Reusable/TextInput/TextInput";
import SelectDropdown from "../../../Reusable/SelectDropdown/SelectDropdown";
import Textarea from "../../../Reusable/TextArea/TextArea";
import FileUploadInput from "../../../Reusable/FileUploadInput/FileUploadInput";
import Button from "../../../Reusable/Button/Button";

type TFormData = {
  name: string;
  category: string;
  description: string;
  priceCurrency: string;
  basePrice: string;
  discountedPrice: string;
  rating?: string;
  soldCount?: string;
  files?: any;
};

type TAddOrEditProductProps = {
  isAddOrEditProductModalOpen: boolean;
  setIsAddOrEditProductModalOpen: any;
  modalType: string;
  setModalType: (value: string) => void;
  productId?: string;
  categories: TCategories[];
};
const AddOrEditProduct: React.FC<TAddOrEditProductProps> = ({
  isAddOrEditProductModalOpen,
  setIsAddOrEditProductModalOpen,
  modalType,
  setModalType,
  productId,
  categories,
}) => {
  const { data, isLoading: isSingleProductLoading } =
    useGetSingleProductByIdQuery(productId);
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormData>();

  useEffect(() => {
    const singleProductData = data?.data || {};
    if (modalType === "edit" && singleProductData) {
      setValue("name", singleProductData?.name);
      setValue("category", singleProductData?.category);
      setValue("description", singleProductData?.description);
      setValue("priceCurrency", singleProductData?.priceCurrency);
      setValue("basePrice", singleProductData?.basePrice);
      setValue("discountedPrice", singleProductData?.discountedPrice);
      setValue("rating", singleProductData?.rating);
      setValue("soldCount", singleProductData?.soldCount);
    } else {
      reset();
    }
  }, [modalType, data, reset, setValue]);

  const handleSubmitProduct = async (data: TFormData) => {
    try {
      const formData = new FormData();

      // Basic Info
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("description", data.description);

      // Pricing
      formData.append("priceCurrency", data.priceCurrency);
      formData.append("basePrice", data.basePrice.toString());
      if (data.discountedPrice) {
        formData.append("discountedPrice", data.discountedPrice.toString());
      }

      // Statistics
      if (data.rating) {
        formData.append("rating", data.rating);
      }
      if (data.soldCount) {
        formData.append("soldCount", data.soldCount.toString());
      }

      // Multiple Images - Append all files
      if (data.files && data.files.length > 0) {
        Array.from(data.files).forEach((file: any) => {
          formData.append("files", file);
        });
      }

      // API Call
      if (modalType === "add") {
        await addProduct(formData).unwrap();
        toast.success("Product added successfully");
        setIsAddOrEditProductModalOpen(false);
        reset();
      } else {
        await updateProduct({ id: productId, data: formData }).unwrap();
        toast.success("Product updated successfully");
        setIsAddOrEditProductModalOpen(false);
        reset();
      }
    } catch (error: any) {
      console.error("Error submitting product:", error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const productCategories = categories?.map((category) => ({
    label: category.category,
    value: category.category,
  }));
  return (
    <Modal
      isModalOpen={isAddOrEditProductModalOpen}
      setIsModalOpen={setIsAddOrEditProductModalOpen}
      heading={`${modalType === "add" ? "Add" : "Update"} Audio Book`}
    >
      <div className="relative">
        {isSingleProductLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleSubmitProduct)}
          className="flex flex-col gap-6 font-Nunito mt-5"
        >
          <div className="flex flex-col gap-6">
            {/* Product Name */}
            <TextInput
              label="Product Name"
              placeholder="Enter product name"
              error={errors.name}
              {...register("name", { required: "Product name is required" })}
            />

            {/* Category */}
            <SelectDropdown
              label="Category"
              options={productCategories || []}
              error={errors.category}
              {...register("category", {
                required: "Category is required",
              })}
            />

            {/* Description */}
            <Textarea
              label="Description"
              placeholder="Enter product description"
              error={errors.description}
              {...register("description", {
                required: "Description is required",
              })}
            />

            {/* Price Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Currency */}
              <TextInput
                label="Currency"
                placeholder="Enter currency (e.g., ৳, $, €, £)"
                error={errors.priceCurrency}
                {...register("priceCurrency", {
                  required: "Currency is required",
                })}
              />

              {/* Base Price */}
              <TextInput
                label="Base Price"
                type="number"
                placeholder="Enter base price"
                error={errors.basePrice}
                {...register("basePrice", {
                  required: "Base price is required",
                  min: { value: 0, message: "Price must be greater than 0" },
                })}
              />
            </div>

            {/* Discounted Price */}
            <TextInput
              label="Discounted Price (Optional)"
              type="number"
              placeholder="Enter discounted price"
              error={errors.discountedPrice}
              {...register("discountedPrice", {
                min: {
                  value: 0,
                  message: "Discounted price must be greater than 0",
                },
              })}
            />

            {/* Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rating - Dropdown */}
              <SelectDropdown
                label="Rating (Optional)"
                options={[
                  { label: "Select rating", value: "" },
                  { label: "5", value: "5" },
                  { label: "4", value: "4" },
                  { label: "3", value: "3" },
                  { label: "2", value: "2" },
                  { label: "1", value: "1" },
                ]}
                error={errors.rating}
                {...register("rating")}
              />

              {/* Sold Count */}
              <TextInput
                label="Sold Count (Optional)"
                type="number"
                placeholder="Enter number of items sold"
                error={errors.soldCount}
                {...register("soldCount", {
                  min: {
                    value: 0,
                    message: "Sold count must be greater than 0",
                  },
                })}
              />
            </div>

            {/* Product Images */}
            <FileUploadInput
              label="Product Images"
              placeholder="Upload product images"
              helpText="You can upload multiple images (Max 5MB each)"
              accept="image/*"
              multiple
              maxFiles={5}
              maxSize={5}
              error={errors.files}
              {...register("files", {
                required:
                  modalType === "add"
                    ? "At least one product image is required"
                    : false,
                validate: {
                  fileType: (files) => {
                    if (files && files.length > 0) {
                      const invalidFiles = Array.from(files).filter(
                        (file: any) => !file.type.startsWith("image/"),
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
                        (file: any) => file.size > 5 * 1024 * 1024,
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
              label={"Cancel"}
              type="button"
              variant="secondary"
              className="py-1.75 w-full md:w-fit"
              onClick={() => {
                setIsAddOrEditProductModalOpen(false);
                setModalType("add");
              }}
            />
            <Button
              type="submit"
              label={modalType === "add" ? "Add Product" : "Update Product"}
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

export default AddOrEditProduct;
