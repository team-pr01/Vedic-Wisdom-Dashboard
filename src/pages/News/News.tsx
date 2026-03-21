/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Category from "../../components/Shared/Category/Category";
import toast from "react-hot-toast";
import Button from "../../components/Reusable/Button/Button";
import Table from "../../components/Reusable/Table/Table";
import { useGetAllCategoriesByAreaNameQuery } from "../../redux/Features/Categories/categoriesApi";
import DeleteConfirmationModal from "../../components/Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import type { TNews } from "../../types/news.types";
import {
  useDeleteNewsMutation,
  useGetAllNewsQuery,
} from "../../redux/Features/News/newsApi";
import {
  Image,
  Eye,
  ThumbsUp,
  Calendar,
  ExternalLink,
  Globe,
} from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import AddOrEditNews from "../../components/NewsPage/AddOrEditNews/AddOrEditNews";
import NewsDetails from "../../components/NewsPage/NewsDetails/NewsDetails";

const News = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [modalType, setModalType] = useState<string>("add");
  const [isAddOrEditNewsModalOpen, setIsAddOrEditNewsModalOpen] =
    useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);
  const [isNewsDetailsModalOpen, setIsNewsDetailsModalOpen] =
    useState<boolean>(false);
  const [newsId, setNewsId] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useGetAllNewsQuery({
    skip,
    limit,
    keyword,
    category,
    languageCode: "en",
  });

  const { data: categories } = useGetAllCategoriesByAreaNameQuery("News");

  const [deleteNews] = useDeleteNewsMutation();

  const handleDeleteNews = async () => {
    try {
      await toast.promise(deleteNews(newsId as string).unwrap(), {
        loading: "Loading...",
        success: "News deleted successfully!",
        error: "Failed to delete news. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting news:", err);
    }
  };

  const newsTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "image", label: "Image" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "language", label: "Language" },
    { key: "stats", label: "Stats" },
    { key: "createdAt", label: "Created" },
    { key: "actions", label: "Actions" },
  ];

  const news = data?.data?.news || [];

  const newsTableData = news?.map((newsItem: TNews, index: number) => {
    return {
      _id: newsItem?._id,

      sl: index + 1,

      image: (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-50">
          {newsItem?.imageUrl ? (
            <img
              src={newsItem.imageUrl}
              alt={newsItem?.title || "News"}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setPreviewImage(newsItem?.imageUrl)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image size={20} className="text-neutral-400" />
            </div>
          )}
        </div>
      ),

      title: (
        <div className="max-w-62.5">
          <p className="font-medium text-neutral-10 font-Inter line-clamp-2">
            {newsItem?.title || "—"}
          </p>
          {newsItem?.tags && newsItem.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              {newsItem.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs text-neutral-45 bg-neutral-50 px-1.5 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ),

      category: (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-10/10 text-primary-10 capitalize">
          {newsItem?.category || "Uncategorized"}
        </span>
      ),

      language: (
        <div className="flex items-center gap-1.5">
          <Globe size={14} className="text-neutral-45" />
          <span className="text-sm text-neutral-10">
            {newsItem?.languages?.length} language
            {newsItem?.languages?.length !== 1 ? "s" : ""}
          </span>
        </div>
      ),

      stats: (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-neutral-45" />
            <span className="text-xs text-neutral-10">
              {newsItem?.views || 0} views
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThumbsUp size={14} className="text-neutral-45" />
            <span className="text-xs text-neutral-10">
              {newsItem?.likes || 0} likes
            </span>
          </div>
        </div>
      ),

      createdAt: (
        <div className="flex items-center gap-1.5">
          <Calendar size={14} className="text-neutral-45" />
          <span className="text-xs text-neutral-10">
            {newsItem?.createdAt ? formatDate(newsItem.createdAt) : "—"}
          </span>
        </div>
      ),

      actions: (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setNewsId(newsItem?._id);
              setIsNewsDetailsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg transition-colors"
            title="View details"
          >
            <ExternalLink size={14} className="text-primary-500" />
            <span className="text-xs font-medium">View</span>
          </button>
        </div>
      ),
    };
  });

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
      <Category areaName="News" />
      <Button
        label="Add New News"
        onClick={() => {
          setModalType("add");
          setIsAddOrEditNewsModalOpen(true);
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
        title={`All News (${news?.length || 0})`}
        description="Manage all news"
        theads={newsTheads}
        data={newsTableData}
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
          setNewsId(row?._id);
          setIsAddOrEditNewsModalOpen(true);
        }}
        onDeleteItem={(row: any) => {
          setNewsId(row?._id);
          setShowDeleteConfirmationModal(true);
        }}
      />

      {isAddOrEditNewsModalOpen && (
        <AddOrEditNews
          isAddOrEditNewsModalOpen={isAddOrEditNewsModalOpen}
          setIsAddOrEditNewsModalOpen={setIsAddOrEditNewsModalOpen}
          modalType={modalType}
          setModalType={setModalType}
          newsId={newsId as string}
          categories={categories?.data || []}
        />
      )}

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmationModal(false)}
          onConfirm={handleDeleteNews}
        />
      )}

      {isNewsDetailsModalOpen && (
        <NewsDetails
          isNewsDetailsModalOpen={isNewsDetailsModalOpen}
          setIsNewsDetailsModalOpen={setIsNewsDetailsModalOpen}
          newsId={newsId as string}
        />
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            className="max-h-[90%] max-w-[90%] rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default News;
