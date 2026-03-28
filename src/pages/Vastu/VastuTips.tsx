/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Category from "../../components/Shared/Category/Category";
import toast from "react-hot-toast";
import Button from "../../components/Reusable/Button/Button";
import Table from "../../components/Reusable/Table/Table";
import { useGetAllCategoriesByAreaNameQuery } from "../../redux/Features/Categories/categoriesApi";
import DeleteConfirmationModal from "../../components/Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import {
  useDeleteVastuTipsMutation,
  useGetAllVastuTipsQuery,
} from "../../redux/Features/Vastu/vastuTipsApi";
import AddOrEditVastuTips from "../../components/VastuPage/AddOrEditVastuTips/AddOrEditVastuTips";
import type { TVastuTips } from "../../types/vastuTips.types";

const VastuTips = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [modalType, setModalType] = useState<string>("add");
  const [isAddOrEditVastuTipsModalOpen, setIsAddOrEditVastuTipsModalOpen] =
    useState<boolean>(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);
  const [vastuTipsId, setVastuTipsId] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useGetAllVastuTipsQuery({
    skip,
    limit,
    keyword,
    category,
  });

  const { data: categories } = useGetAllCategoriesByAreaNameQuery("VastuTips");

  const [deleteVastuTips] = useDeleteVastuTipsMutation();

  const handleDeleteVastuTips = async () => {
    try {
      await toast.promise(deleteVastuTips(vastuTipsId as string).unwrap(), {
        loading: "Loading...",
        success: "Vastu tips deleted successfully!",
        error: "Failed to delete Vastu tips. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting Vastu tips:", err);
    }
  };

  const vastuTipsTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "tips", label: "Tips" },
  ];

  const vastuTipsData = data?.data?.vastuTips || [];

  const vastuTipsTableData = vastuTipsData?.map(
    (item: TVastuTips, index: number) => ({
      _id: item?._id,

      sl: index + 1,

      title: (
        <p className="font-medium text-neutral-10 font-Inter line-clamp-2">
          {item?.title}
        </p>
      ),

      category: (
        <span className="px-2.5 py-1 bg-primary-10/10 text-primary-10 text-xs font-medium rounded-full capitalize">
          {item?.category}
        </span>
      ),

      tips: (
        <div className="flex flex-col gap-2">
          {item?.tips?.map((tip:string, index:number) => (
            <p key={index} className="font-medium text-neutral-10 font-Inter line-clamp-2">
              {tip}
            </p>
          ))}
        </div>
      ),
    }),
  );

  const children = (
    <div className="flex items-center gap-3">
      <select
        value={category ?? ""}
        onChange={(e) => setCategory(e.target.value)}
        className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
      >
        <option value="">Select Category </option>
        {categories?.data?.map((category: any) => (
          <option key={category?.category} value={category?.category}>
            {category?.category}
          </option>
        ))}
      </select>
      <Category areaName="VastuTips" />
      <Button
        label="Add New Vastu"
        onClick={() => {
          setModalType("add");
          setIsAddOrEditVastuTipsModalOpen(true);
        }}
        className="px-3 py-2"
      />
    </div>
  );

  const handleSearch = (k: string) => {
    setKeyword(k);
  };

  return (
    <div>
      <Table<any>
        title={`Vastu Tips (${vastuTipsData?.length || 0})`}
        description="Manage all recipes"
        theads={vastuTipsTheads}
        data={vastuTipsTableData}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        limit={limit}
        setLimit={setLimit}
        children={children}
        onEditItem={(row: any) => {
          setModalType("edit");
          setVastuTipsId(row?._id);
          setIsAddOrEditVastuTipsModalOpen(true);
        }}
        onDeleteItem={(row: any) => {
          setVastuTipsId(row?._id);
          setShowDeleteConfirmationModal(true);
        }}
      />

      {isAddOrEditVastuTipsModalOpen && (
        <AddOrEditVastuTips
          isAddOrEditVastuTipsModalOpen={isAddOrEditVastuTipsModalOpen}
          setIsAddOrEditVastuTipsModalOpen={setIsAddOrEditVastuTipsModalOpen}
          modalType={modalType}
          setModalType={setModalType}
          vastuTipsId={vastuTipsId as string}
          categories={categories?.data || []}
        />
      )}

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmationModal(false)}
          onConfirm={handleDeleteVastuTips}
        />
      )}
    </div>
  );
};

export default VastuTips;
