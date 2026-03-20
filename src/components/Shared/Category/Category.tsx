import Loader from "../../Reusable/Loader/Loader";
import Modal from "../../Reusable/Modal/Modal";
import { useGetAllCategoriesByAreaNameQuery } from "../../../redux/Features/Categories/categoriesApi";
import { useState } from "react";
import AddCategoryForm from "./AddCategoryForm";
import Button from "../../Reusable/Button/Button";

export type TCategories = {
  _id: string;
  category: string;
  areaName: string;
  createdAt: string;
};

type TCategoryProps = {
  areaName: string;
};
const Category: React.FC<TCategoryProps> = ({ areaName }) => {
  const { data, isLoading } = useGetAllCategoriesByAreaNameQuery(areaName);
  const [isCategoryModalOpen, setIsCategoryModalOpen] =
    useState<boolean>(false);
  const [isAddCategoryForOpen, setIsAddCategoryForOpen] =
    useState<boolean>(false);

  return (
    <div>
      <Button
        label="Manage Categories"
        onClick={() => {
          setIsCategoryModalOpen(true);
        }}
        className="px-3 py-2"
      />

      {isCategoryModalOpen && (
        <Modal
          isModalOpen={isCategoryModalOpen}
          setIsModalOpen={setIsCategoryModalOpen}
          heading={`Category`}
        >
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
                <Loader size="lg" text="Please wait..." />
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-8 mb-6">
              {data?.data?.map((category: TCategories) => (
                <div
                  key={category?._id}
                  className="border border-neutral-60 px-3 py-2 rounded-lg text-neutral-5 text-sm"
                >
                  {category?.category}
                </div>
              ))}

              <Button
                label="Add New"
                onClick={() => {
                  setIsAddCategoryForOpen(true);
                }}
                className="px-3 py-2"
              />
            </div>

            {isAddCategoryForOpen && (
              <AddCategoryForm
                setIsAddCategoryForOpen={setIsAddCategoryForOpen}
                areaName={areaName}
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Category;
