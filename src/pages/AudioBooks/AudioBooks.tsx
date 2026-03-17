/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Table from "../../components/Reusable/Table/Table";
import { Pencil, Trash2, Music } from "lucide-react";
import ViewAudioTracks from "../../components/AudioBooksPage/ViewAudioTracks/ViewAudioTracks";
import Button from "../../components/Reusable/Button/Button";
import {
  useDeleteAudioBookMutation,
  useGetAllAudioBooksQuery,
} from "../../redux/Features/AudioBooks/audioBooksApi";
import type { TAudioBook } from "../../types/audioBook.types";
import { useGetAllAudioTracksOfABookQuery } from "../../redux/Features/AudioTracks/audioTracksApi";
import toast from "react-hot-toast";
import AddOrUpdateAudioBook from "../../components/AudioBooksPage/AddOrUpdateAudioBook/AddOrUpdateAudioBook";

const AudioBooks = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [isPremium, setIsPremium] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isViewAudioTracksModalOpen, setIsViewAudioTracksModalOpen] =
    useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [isAddAudioBookModalOpen, setIsAddAudioBookModalOpen] =
    useState<boolean>(false);
  const [audioBookId, setAudioBookId] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useGetAllAudioBooksQuery({
    skip,
    limit,
    keyword,
    isPremium: isPremium as string,
  });
  console.log(data);
  const { data: audioTracks, isLoading: isAudioTracksLoading } =
    useGetAllAudioTracksOfABookQuery(audioBookId);

  const [deleteAudioBook] = useDeleteAudioBookMutation();

  const handleDeleteAudioBook = async (id: string) => {
    try {
      await toast.promise(deleteAudioBook(id).unwrap(), {
        loading: "Loading...",
        success: "Audio book deleted successfully!",
        error: "Failed to delete audio book. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting audio book:", err);
    }
  };

  const audioBookTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "image", label: "Image" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "isPremium", label: "Premium" },
    { key: "tracks", label: "Tracks" },
  ];

  const audioBooks = data?.data?.data || [];

  const audioBookTableData = audioBooks?.map(
    (book: TAudioBook, index: number) => ({
      _id: book._id,

      sl: index + 1,

      image: (
        <img
          src={book?.thumbnailUrl}
          alt={book.name}
          className="w-12 h-12 rounded object-cover cursor-pointer"
          onClick={() => setPreviewImage(book?.thumbnailUrl)}
        />
      ),

      name: <p className="font-medium">{book.name}</p>,

      description: (
        <p className="max-w-[350px] truncate text-sm text-gray-600">
          {book.description}
        </p>
      ),

      isPremium: (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            book.isPremium
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {book.isPremium ? "Premium" : "Free"}
        </span>
      ),

      tracks: (
        <button
          className="flex items-center gap-1 text-sm text-primary hover:underline cursor-pointer"
          onClick={() => {
            setAudioBookId(book?._id);
            setIsViewAudioTracksModalOpen(true);
          }}
        >
          <Music className="size-4" />
          View Audio Tracks
        </button>
      ),
    }),
  );

  const audioBookActions: any[] = [
    {
      label: "Edit",
      icon: <Pencil className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        setModalType("update");
        setIsAddAudioBookModalOpen(true);
        setAudioBookId(row?._id);
      },
    },
    {
      label: "Delete",
      icon: <Trash2 className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        handleDeleteAudioBook(row._id);
      },
    },
  ];

  const filters = [
    {
      label: "Premium",
      value: "true",
    },
    {
      label: "Free",
      value: "false",
    },
  ];

  const children = (
    <div className="flex items-center gap-3">
      <select
        value={isPremium ?? ""}
        onChange={(e) => setIsPremium && setIsPremium(e.target.value)}
        className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
      >
        <option value="">Select Access Type </option>
        {filters?.map((filter: any) => (
          <option key={filter?.value} value={filter?.value}>
            {filter?.label}
          </option>
        ))}
      </select>

      <Button
        label="Add New Book"
        onClick={() => {
          setModalType("add");
          setIsAddAudioBookModalOpen(true);
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
        title={`Audio Books (${audioBooks?.length || 0})`}
        description="Manage all audiobooks available in the platform."
        theads={audioBookTheads}
        data={audioBookTableData}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        actions={audioBookActions}
        limit={10}
        setLimit={setLimit}
        children={children}
      />

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

      {isViewAudioTracksModalOpen && (
        <ViewAudioTracks
          isViewAudioTracksModalOpen={isViewAudioTracksModalOpen}
          setIsViewAudioTracksModalOpen={setIsViewAudioTracksModalOpen}
          isLoading={isAudioTracksLoading}
          data={audioTracks?.data?.tracks || []}
          audioBookId={audioBookId as string}
        />
      )}

      {isAddAudioBookModalOpen && (
        <AddOrUpdateAudioBook
          isAddAudioBookModalOpen={isAddAudioBookModalOpen}
          setIsAddAudioBookModalOpen={setIsAddAudioBookModalOpen}
          isLoading={false}
          modalType={modalType}
          setModalType={setModalType}
          audioBookId={audioBookId as string}
        />
      )}
    </div>
  );
};

export default AudioBooks;
