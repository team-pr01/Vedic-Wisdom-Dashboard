/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Category from "../../components/Shared/Category/Category";
import toast from "react-hot-toast";
import { Clock, Eye, Play, Video, Youtube } from "lucide-react";
import Button from "../../components/Reusable/Button/Button";
import Table from "../../components/Reusable/Table/Table";
import { useGetAllCategoriesByAreaNameQuery } from "../../redux/Features/Categories/categoriesApi";
import DeleteConfirmationModal from "../../components/Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import {
  useDeleteVastuMutation,
  useGetAllVastuQuery,
} from "../../redux/Features/Vastu/vastuApi";
import type { TVastu } from "../../types/vastu.types";
import AddOrEditVastu from "../../components/VastuPage/AddOrEditVastu/AddOrEditVastu";
import VastuTips from "./VastuTips";

const Vastu = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [modalType, setModalType] = useState<string>("add");
  const [isAddOrEditVastuModalOpen, setIsAddOrEditVastuModalOpen] =
    useState<boolean>(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);
  const [vastuId, setVastuId] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useGetAllVastuQuery({
    skip,
    limit,
    keyword,
    category,
  });

  const { data: categories } = useGetAllCategoriesByAreaNameQuery("Vastu");

  const [deleteVastu] = useDeleteVastuMutation();

  const handleDeleteVastu = async () => {
    try {
      await toast.promise(deleteVastu(vastuId as string).unwrap(), {
        loading: "Loading...",
        success: "Vastu deleted successfully!",
        error: "Failed to delete Vastu. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting Vastu:", err);
    }
  };

  const vastuTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "videoSource", label: "Video Source" },
    { key: "duration", label: "Duration" },
    { key: "viewsCount", label: "Views" },
    { key: "viewVideo", label: "View Video" },
  ];

  const vastuData = data?.data?.vastu || [];

  const vastuTableData = vastuData?.map((item: TVastu, index: number) => ({
    _id: item?._id,

    sl: index + 1,

    title: (
      <p className="font-medium text-neutral-10 font-Inter line-clamp-2 max-w-[250px]">
        {item?.title}
      </p>
    ),

    category: (
      <span className="px-2.5 py-1 bg-primary-10/10 text-primary-10 text-xs font-medium rounded-full capitalize">
        {item?.category}
      </span>
    ),

    videoSource: (
      <div className="flex items-center gap-1.5">
        {item?.videoSource === "youtube" ? (
          <Youtube size={16} className="text-red-500" />
        ) : item?.videoSource === "vimeo" ? (
          <Video size={16} className="text-blue-500" />
        ) : (
          <Play size={16} className="text-purple-500" />
        )}
        <span
          className={`font-medium capitalize text-sm ${
            item?.videoSource === "youtube"
              ? "text-red-500"
              : item?.videoSource === "vimeo"
                ? "text-blue-500"
                : "text-purple-500"
          }`}
        >
          {item?.videoSource}
        </span>
      </div>
    ),

    duration: (
      <div className="flex items-center gap-1 text-sm text-neutral-45">
        <Clock size={14} />
        <span>{item?.duration}</span>
      </div>
    ),

    viewsCount: (
      <div className="flex items-center gap-1 text-sm text-neutral-45">
        <Eye size={14} />
        <span>{item?.viewsCount?.toLocaleString() || 0}</span>
      </div>
    ),

    viewVideo: (
      <a
        href={item?.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-10 bg-primary-10/10 rounded-lg hover:bg-primary-10/20 transition-colors cursor-pointer"
      >
        <Play className="size-3.5" />
        Watch Video
      </a>
    ),
  }));

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
      <Category areaName="Vastu" />
      <Button
        label="Add New Vastu"
        onClick={() => {
          setModalType("add");
          setIsAddOrEditVastuModalOpen(true);
        }}
        className="px-3 py-2"
      />
    </div>
  );

  const handleSearch = (k: string) => {
    setKeyword(k);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Table<any>
        title={`Vastu (${vastuData?.length || 0})`}
        description="Manage all recipes"
        theads={vastuTheads}
        data={vastuTableData}
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
          setVastuId(row?._id);
          setIsAddOrEditVastuModalOpen(true);
        }}
        onDeleteItem={(row: any) => {
          setVastuId(row?._id);
          setShowDeleteConfirmationModal(true);
        }}
      />

      {isAddOrEditVastuModalOpen && (
        <AddOrEditVastu
          isAddOrEditVastuModalOpen={isAddOrEditVastuModalOpen}
          setIsAddOrEditVastuModalOpen={setIsAddOrEditVastuModalOpen}
          modalType={modalType}
          setModalType={setModalType}
          vastuId={vastuId as string}
          categories={categories?.data || []}
        />
      )}

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmationModal(false)}
          onConfirm={handleDeleteVastu}
        />
      )}
      </div>


      <VastuTips/>
    </div>
  );
};

export default Vastu;
