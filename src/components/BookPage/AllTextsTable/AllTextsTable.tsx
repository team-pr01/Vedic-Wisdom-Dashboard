/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  useDeleteTextMutation,
  useGetAllTextsQuery,
  useGetSingleTextQuery,
} from "../../../redux/Features/Book/textsApi";
import DeleteConfirmationModal from "../../Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import Button from "../../Reusable/Button/Button";
import Table from "../../Reusable/Table/Table";
import AddOrEditBookTextForm from "../AddOrEditBookTextForm/AddOrEditBookTextForm";

const AllTextsTable = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");

  const { data, isLoading, isFetching } = useGetAllTextsQuery({
    skip,
    limit,
    keyword,
  });

  const bookTexts = data?.data;

  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<string>("add");
  const [isAddOrEditBookTextModalOpen, setIsAddOrEditBookTextModalOpen] =
    useState<boolean>(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);
  const { data: singleBookText, isLoading: isSingleBookTextLoading } =
    useGetSingleTextQuery(selectedTextId || "", { skip: !selectedTextId });
  const [deleteText] = useDeleteTextMutation();

  const handleDeleteBookText = async () => {
    try {
      await toast.promise(deleteText(selectedTextId as string).unwrap(), {
        loading: "Loading...",
        success: "Text deleted successfully!",
        error: "Failed to delete text. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting text:", err);
    }
  };

  const booktextTheads: any[] = [
    { key: "bookLocation", label: "Book & Location" },
    { key: "originalText", label: "Original Text" },
    { key: "tags", label: "Tags" },
  ];

  const bookTextTableData = bookTexts?.map((item: any, index: number) => ({
    _id: item?._id,

    sl: index + 1,

    bookLocation: (
      <div className="flex flex-col">
        <span className="font-medium">{item?.bookId?.name}</span>
        <span className="text-xs text-neutral-500">
          {item?.bookId?.structure}
        </span>
        <span className="text-xs text-neutral-500">
          {item?.location
            ?.map((location: any) => `${location.levelName}-${location?.value}`)
            .join(", ")}
        </span>
      </div>
    ),

    originalText: (
      <p className="text-sm text-neutral-700 line-clamp-2">
        {item?.originalText}
      </p>
    ),

    tags: (
      <div className="flex flex-wrap gap-1 capitalize">
        {(Array.isArray(item?.tags)
          ? item.tags
          : item?.tags?.split(",") || []
        ).map((tag: string, i: number) => (
          <span
            key={i}
            className="px-2 py-0.5 bg-primary-10/10 text-primary-10 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    ),
  }));

  const children = (
    <div className="flex items-center gap-3">
      <Button onClick={() => {
        setModalType("add");
        setIsAddOrEditBookTextModalOpen(true)
      }} label="Add Text" className="px-3 py-2" />
    </div>
  );

  const handleSearch = (k: string) => {
    setKeyword(k);
  };

  return (
    <div>
      <Table<any>
        title={`Book Texts (${bookTexts?.length || 0})`}
        description="Manage all the texts of the books"
        theads={booktextTheads}
        data={bookTextTableData}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        limit={limit}
        setLimit={setLimit}
        children={children}
        onEditItem={(row) => {
          setSelectedTextId(row?._id);
          setModalType("edit");
          setIsAddOrEditBookTextModalOpen(true);
        }}
        onDeleteItem={(row: any) => {
          setSelectedTextId(row?._id);
          setShowDeleteConfirmationModal(true);
        }}
      />
      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmationModal(false)}
          onConfirm={handleDeleteBookText}
        />
      )}

      {/* Add Form Modal */}
      {isAddOrEditBookTextModalOpen && (
        <AddOrEditBookTextForm
          isAddOrEditBookTextModalOpen={isAddOrEditBookTextModalOpen}
          setIsAddOrEditBookTextModalOpen={setIsAddOrEditBookTextModalOpen}
          defaultValues={singleBookText?.data}
          modalType={modalType as "add" | "edit"}
          setModalType={setModalType}
          isSingleDataLoading={isSingleBookTextLoading}
        />
      )}
    </div>
  );
};

export default AllTextsTable;
