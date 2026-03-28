/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useDeleteBookMutation,
  useGetAllBooksQuery,
  useGetSingleBookQuery,
} from "../../../redux/Features/Book/bookApi";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import Table from "../../Reusable/Table/Table";
import Button from "../../Reusable/Button/Button";
import AddOrEditBookForm from "../AddOrEditBookForm/AddOrEditBookForm";

export type TBooks = {
  _id: string;
  imageUrl?: string;
  name: string;
  type: "veda" | "purana" | "upanishad";
  structure:
    | "Chapter-Verse"
    | "Mandala-Sukta-Rik"
    | "Kanda-Sarga-Shloka"
    | "Custom";
  level1Name?: string;
  level2Name?: string;
  level3Name?: string;
};

const AllBooksTable = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [selectedBookId, setSelectedBookId] = useState<any>(null);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [isAddOrEditBookModalOpen, setIsAddOrEditBookModalOpen] =
    useState<boolean>(false);

  const { data: singleBook, isLoading: isSingleBookLoading } =
    useGetSingleBookQuery(selectedBookId);

  const { data, isLoading, isFetching } = useGetAllBooksQuery({
    skip,
    limit,
    keyword,
  });

  const [deleteBook] = useDeleteBookMutation();

  const handleDeleteBook = async () => {
    try {
      await toast.promise(deleteBook(selectedBookId as string).unwrap(), {
        loading: "Loading...",
        success: "Book deleted successfully!",
        error: "Failed to delete book. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  const bookTheads: any[] = [
    { key: "cover", label: "Cover" },
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "structure", label: "Structure" },
  ];

  const books = data?.data?.data;
  const booksTableData = books?.map((book: any, index: number) => ({
    _id: book?._id,

    sl: index + 1,

    cover: (
      <img
        src={book?.imageUrl}
        alt={book?.name}
        className="w-20 object-cover rounded-md"
      />
    ),

    name: <p className="font-medium">{book?.name}</p>,

    type: (
      <span className="px-2 py-1 bg-primary-10/10 text-primary-10 text-xs font-medium rounded-full capitalize">
        {book?.type}
      </span>
    ),

    structure: (
      <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full capitalize">
        {book?.structure}
      </span>
    ),
  }));

  const children = (
    <div className="flex items-center gap-3">
      <Button
        label="Add New Book"
        onClick={() => {
          setModalType("add");
          setIsAddOrEditBookModalOpen(true);
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
        title={`Books (${books?.length || 0})`}
        description="Manage all books"
        theads={bookTheads}
        data={booksTableData}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        limit={limit}
        setLimit={setLimit}
        children={children}
        onEditItem={(row) => {
          setSelectedBookId(row?._id);
          setModalType("edit");
          setIsAddOrEditBookModalOpen(true);
        }}
        onDeleteItem={(row: any) => {
          setSelectedBookId(row?._id);
          setShowDeleteConfirmationModal(true);
        }}
      />

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmationModal(false)}
          onConfirm={handleDeleteBook}
        />
      )}

      {/* Add Form Modal */}
      {isAddOrEditBookModalOpen && (
        <AddOrEditBookForm
          isAddOrEditBookModalOpen={isAddOrEditBookModalOpen}
          setIsAddOrEditBookModalOpen={setIsAddOrEditBookModalOpen}
          defaultValues={singleBook?.data}
          modalType={modalType as "add" | "edit"}
          setModalType={setModalType}
          isSingleDataLoading={isSingleBookLoading}
        />
      )}
    </div>
  );
};

export default AllBooksTable;
