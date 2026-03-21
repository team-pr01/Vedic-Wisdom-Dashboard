/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Category from "../../components/Shared/Category/Category";
import toast from "react-hot-toast";
import { Clock, Play, Youtube } from "lucide-react";
import Button from "../../components/Reusable/Button/Button";
import Table from "../../components/Reusable/Table/Table";
import { useGetAllCategoriesByAreaNameQuery } from "../../redux/Features/Categories/categoriesApi";
import DeleteConfirmationModal from "../../components/Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import {
  useDeleteAyurvedaMutation,
  useGetAllAyurvedaQuery,
} from "../../redux/Features/Ayurveda/ayurvedaApi";
import type { TAyurveda } from "../../types/ayurveda.types";
import AddOrEditAyurveda from "../../components/AyurvedaPage/AddOrEditAyurveda/AddOrEditAyurveda";

const Ayurveda = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [modalType, setModalType] = useState<string>("add");
  const [isAddOrEditAyurvedaModalOpen, setIsAddOrEditAyurvedaModalOpen] =
    useState<boolean>(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);
  const [ayurvedaId, setAyurvedaId] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useGetAllAyurvedaQuery({
    skip,
    limit,
    keyword,
    category,
  });

  const { data: categories } = useGetAllCategoriesByAreaNameQuery("Ayurveda");

  const [deleteAyurveda] = useDeleteAyurvedaMutation();

  const handleDeleteAyurveda = async () => {
    try {
      await toast.promise(deleteAyurveda(ayurvedaId as string).unwrap(), {
        loading: "Loading...",
        success: "Ayurveda deleted successfully!",
        error: "Failed to delete Ayurveda. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting Ayurveda:", err);
    }
  };

  const ayurvedaTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "videoSource", label: "Video Source" },
    { key: "duration", label: "Duration" },
    { key: "viewVideo", label: "View Video" },
  ];

  const ayurvedaVideos = data?.data?.ayurveda || [];

  const ayurvedaTableData = ayurvedaVideos?.map(
    (video: TAyurveda, index: number) => ({
      _id: video?._id,

      sl: index + 1,

      title: (
        <p className="font-medium text-neutral-10 font-Inter line-clamp-2">
          {video?.title}
        </p>
      ),

      category: (
        <span className="px-2.5 py-1 bg-primary-10/10 text-primary-10 text-xs font-medium rounded-full capitalize">
          {video?.category}
        </span>
      ),

      videoSource: (
        <div className="flex items-center gap-1.5">
          {video?.videoSource === "youtube" ? (
            <Youtube size={16} className="text-red-500" />
          ) : (
            <Play size={16} className="text-blue-500" />
          )}
          <span
            className={`font-medium capitalize text-sm ${
              video?.videoSource === "youtube"
                ? "text-red-500"
                : "text-blue-500"
            }`}
          >
            {video?.videoSource}
          </span>
        </div>
      ),

      duration: (
        <div className="flex items-center gap-1 text-sm text-neutral-45">
          <Clock size={14} />
          <span>{video?.duration}</span>
        </div>
      ),

      viewVideo: (
        <a
          href={video?.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-10 bg-primary-10/10 rounded-lg hover:bg-primary-10/20 transition-colors cursor-pointer"
        >
          <Play className="size-3.5" />
          Watch Video
        </a>
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
      <Category areaName="Ayurveda" />
      <Button
        label="Add New Ayurveda"
        onClick={() => {
          setModalType("add");
          setIsAddOrEditAyurvedaModalOpen(true);
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
        title={`Ayurveda (${ayurvedaVideos?.length || 0})`}
        description="Manage all Ayurveda"
        theads={ayurvedaTheads}
        data={ayurvedaTableData}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        limit={10}
        setLimit={setLimit}
        children={children}
        onEditItem={(row: any) => {
          setModalType("edit");
          setAyurvedaId(row?._id);
          setIsAddOrEditAyurvedaModalOpen(true);
        }}
        onDeleteItem={(row: any) => {
          setAyurvedaId(row?._id);
          setShowDeleteConfirmationModal(true);
        }}
      />

      {isAddOrEditAyurvedaModalOpen && (
        <AddOrEditAyurveda
          isAddOrEditAyurvedaModalOpen={isAddOrEditAyurvedaModalOpen}
          setIsAddOrEditAyurvedaModalOpen={setIsAddOrEditAyurvedaModalOpen}
          modalType={modalType}
          setModalType={setModalType}
          ayurvedaId={ayurvedaId as string}
          categories={categories?.data || []}
        />
      )}

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmationModal(false)}
          onConfirm={handleDeleteAyurveda}
        />
      )}
    </div>
  );
};

export default Ayurveda;
