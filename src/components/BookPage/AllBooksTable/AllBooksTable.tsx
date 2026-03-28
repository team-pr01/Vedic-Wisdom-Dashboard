/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  useDeleteBookMutation,
  useGetAllBooksQuery,
} from "../../../redux/Features/Book/bookApi";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import Table from "../../Reusable/Table/Table";
import Category from "../../Shared/Category/Category";
import Button from "../../Reusable/Button/Button";
import { useGetAllCategoriesByAreaNameQuery } from "../../../redux/Features/Categories/categoriesApi";

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

type AllBooksTableProps = {
  onAddBook: () => void;
  onEdit: (bookId: string) => void;
};

const AllBooksTable: React.FC<AllBooksTableProps> = ({ onAddBook, onEdit }) => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [selectedBookId, setSelectedBookId] = useState<any>(null);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);

  const { data, isLoading, isFetching } = useGetAllBooksQuery({
    skip,
    limit,
    keyword,
    category,
  });


  const { data: categories } = useGetAllCategoriesByAreaNameQuery("Book");
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
      <Category areaName="Book" />
      <Button label="Add New Book" onClick={onAddBook} className="px-3 py-2" />
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
        limit={10}
        setLimit={setLimit}
        children={children}
        onEditItem={onEdit}
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
    </div>
  );
};

export default AllBooksTable;
