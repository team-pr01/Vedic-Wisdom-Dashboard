/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Pen, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  useDeleteTextMutation,
  useGetAllTextsQuery,
} from "../../../redux/Features/Book/textsApi";
import DeleteConfirmationModal from "../../Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import Loader from "../../Reusable/Loader/Loader";
import Button from "../../Reusable/Button/Button";

export type TLocation = {
  levelName: string;
  value: string;
};

export type TBookText = {
  _id: string;
  bookId: {
    name: string;
  };
  location: TLocation[];
  originalText: string;
  primaryTranslation: string;
  tags: string[];
  isVerified?: boolean;
};

type AllTextsTableProps = {
  texts?: TBookText[];
  isLoading?: boolean;
  onEdit: (textId: string) => void;
};

const AllTextsTable: React.FC<AllTextsTableProps> = ({
  texts,
  isLoading,
  onEdit,
}) => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");

  const {
    data,
    isLoading: isBookTextsLoading,
    isFetching: isBookTextsFetching,
  } = useGetAllTextsQuery({
    skip,
    limit,
    keyword,
  });

  const bookTexts = data?.data;

  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteText] = useDeleteTextMutation();

  const handleConfirmDelete = async () => {
    if (!selectedTextId) return;
    toast.promise(deleteText({ id: selectedTextId }).unwrap(), {
      loading: "Deleting text...",
      success: "Text deleted successfully!",
      error: "Failed to delete text.",
    });
    setShowDeleteModal(false);
  };

  const booktextTheads: any[] = [
    { key: "bookLocation", label: "Book & Location" },
    { key: "text", label: "Text" },
    { key: "tags", label: "Tags" },
  ];

  const bookTextTableData = bookTexts?.map((item: any, index: number) => ({
  _id: item?._id,

  sl: index + 1,

  bookLocation: (
    <div className="flex flex-col">
      <span className="font-medium">{item?.bookName}</span>
      <span className="text-xs text-neutral-500">
        {item?.location}
      </span>
    </div>
  ),

  bookText: (
    <p className="text-sm text-neutral-700 line-clamp-2">
      {item?.text}
    </p>
  ),

  tags: (
    <div className="flex flex-wrap gap-1">
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
      <Button label="Add Text" className="px-3 py-2" />
    </div>
  );

  const handleSearch = (k: string) => {
    setKeyword(k);
  };

  return (
    <div>

    </div>
  );
};

export default AllTextsTable;
