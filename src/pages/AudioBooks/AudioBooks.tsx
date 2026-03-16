/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Table from "../../components/Reusable/Table/Table";
import { Eye, Pencil, Trash2, Music } from "lucide-react";
import ViewAudioTracks from "../../components/AudioBooksPage/ViewAudioTracks/ViewAudioTracks";
import Button from "../../components/Reusable/Button/Button";
import AddAudioBook from "../../components/AudioBooksPage/AddAudioBook/AddAudioBook";

const AudioBooks = () => {
  const [isPremium, setIsPremium] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isViewAudioTracksModalOpen, setIsViewAudioTracksModalOpen] =
    useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [isAddAudioBookModalOpen, setIsAddAudioBookModalOpen] =
    useState<boolean>(false);

  const audioBookTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "image", label: "Image" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "isPremium", label: "Premium" },
    { key: "tracks", label: "Tracks" },
  ];

  const audioBooks = [
    {
      _id: "1",
      name: "The Power of Habit",
      description: "A book about habits and how they shape our lives.",
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
      isPremium: true,
    },
    {
      _id: "2",
      name: "Atomic Habits",
      description: "Build good habits and break bad ones.",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500",
      isPremium: false,
    },
    {
      _id: "3",
      name: "Deep Work",
      description: "Focused success in a distracted world.",
      image:
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500",
      isPremium: true,
    },
  ];

  const audioBookTableData = audioBooks.map((book, index) => ({
    _id: book._id,

    sl: index + 1,

    image: (
      <img
        src={book.image}
        alt={book.name}
        className="w-12 h-12 rounded object-cover cursor-pointer"
        onClick={() => setPreviewImage(book.image)}
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
        onClick={() => setIsViewAudioTracksModalOpen(true)}
      >
        <Music className="size-4" />
        View Audio Tracks
      </button>
    ),
  }));

  const audioBookActions: any[] = [
    {
      label: "View",
      icon: <Eye className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        console.log("View AudioBook:", row);
      },
    },
    {
      label: "Edit",
      icon: <Pencil className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        console.log("Edit AudioBook:", row);
      },
    },
    {
      label: "Delete",
      icon: <Trash2 className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        console.log("Delete AudioBook:", row);
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
          setIsAddAudioBookModalOpen(true);
          setModalType("add");
        }}
        className="px-3 py-2"
      />
    </div>
  );

  // Sample data
  const tracks = [
    {
      id: "1",
      title: "Peaceful Meditation",
      artist: "Mindfulness Collective",
      duration: "12:34",
    },
    {
      id: "2",
      title: "Ocean Waves",
      artist: "Nature Sounds",
      duration: "8:22",
    },
    {
      id: "3",
      title: "Morning Yoga Flow",
      artist: "Yoga Music Academy",
      duration: "15:45",
    },
    {
      id: "4",
      title: "Deep Sleep Hypnosis",
      artist: "Sleep Therapy",
      duration: "30:00",
    },
    {
      id: "1",
      title: "Peaceful Meditation",
      artist: "Mindfulness Collective",
      duration: "12:34",
    },
    {
      id: "2",
      title: "Ocean Waves",
      artist: "Nature Sounds",
      duration: "8:22",
    },
    {
      id: "3",
      title: "Morning Yoga Flow",
      artist: "Yoga Music Academy",
      duration: "15:45",
    },
    {
      id: "4",
      title: "Deep Sleep Hypnosis",
      artist: "Sleep Therapy",
      duration: "30:00",
    },
    {
      id: "1",
      title: "Peaceful Meditation",
      artist: "Mindfulness Collective",
      duration: "12:34",
    },
    {
      id: "2",
      title: "Ocean Waves",
      artist: "Nature Sounds",
      duration: "8:22",
    },
    {
      id: "3",
      title: "Morning Yoga Flow",
      artist: "Yoga Music Academy",
      duration: "15:45",
    },
    {
      id: "4",
      title: "Deep Sleep Hypnosis",
      artist: "Sleep Therapy",
      duration: "30:00",
    },
  ];

  return (
    <div>
      <Table<any>
        title={`Audio Books (${audioBooks.length})`}
        description="Manage all audiobooks available in the platform."
        theads={audioBookTheads}
        data={audioBookTableData}
        totalPages={1}
        currentPage={1}
        onPageChange={() => {}}
        isLoading={false}
        onSearch={() => {}}
        actions={audioBookActions}
        limit={10}
        setLimit={() => {}}
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
          isLoading={false}
          data={tracks}
        />
      )}

      {isAddAudioBookModalOpen && (
        <AddAudioBook
          isAddAudioBookModalOpen={isAddAudioBookModalOpen}
          setIsAddAudioBookModalOpen={setIsAddAudioBookModalOpen}
          isLoading={false}
          modalType={modalType}
          setModalType={setModalType}
        />
      )}
    </div>
  );
};

export default AudioBooks;
