/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useDeleteTempleMutation,
  useGetAllTemplesQuery,
} from "../../redux/Features/Temple/templeApi";
import toast from "react-hot-toast";
import type { TTemple } from "../../types/temple.types";
import { Landmark, Pencil, Trash2 } from "lucide-react";
import Button from "../../components/Reusable/Button/Button";
import Table from "../../components/Reusable/Table/Table";
import AddOrUpdateTemple from "../../components/TemplePage/AddTempleForm/AddTemple";
import { Link } from "react-router-dom";

const Temple = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [modalType, setModalType] = useState<string>("add");
  const [isAddOrUpdateTempleModalOpen, setIsAddOrUpdateTempleModalOpen ] =
    useState<boolean>(false);
  const [templeId, setTempleId] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useGetAllTemplesQuery({
    skip,
    limit,
    keyword,
    status,
  });

  const [deleteTemple] = useDeleteTempleMutation();

  const handleDeleteTemple = async (id: string) => {
    try {
      await toast.promise(deleteTemple(id).unwrap(), {
        loading: "Loading...",
        success: "Temple deleted successfully!",
        error: "Failed to delete temple. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting temple:", err);
    }
  };

  const templeTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "image", label: "Image" },
    { key: "basicInfo", label: "Basic Info" },
    { key: "location", label: "Location" },
    { key: "googleMap", label: "Google Map" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
    { key: "details", label: "Details" },
  ];

  const audioBooks = data?.data?.temples || [];

  const templeTableData = audioBooks?.map((temple: TTemple, index: number) => ({
    _id: temple._id,

    sl: index + 1,

    image: (
      <img
        src={temple?.media?.imageUrls![0]}
        alt={temple?.basicInfo?.templeName}
        className="w-12 h-12 rounded object-cover cursor-pointer"
      />
    ),

    basicInfo: (
      <div>
        <p className="font-medium">{temple?.basicInfo?.templeName}</p>
        <p className="text-sm text-gray-600">
          Deity : {temple?.basicInfo?.mainDeity}
        </p>
      </div>
    ),

    location: (
      <div>
        <p className="font-medium">
          {temple?.location?.city}, {temple?.location?.state},{" "}
          {temple?.location?.country}
        </p>
        <p className="text-sm text-gray-600">{temple?.location?.address}</p>
      </div>
    ),

    googleMap: (
      <a
        href={temple?.location?.googleMapUrl}
        target="_blank"
        className="text-orange-500"
      >
        View in Map
      </a>
    ),

    description: (
      <p className="max-w-[350px] truncate text-sm text-gray-600">
        {temple?.basicInfo?.description}
      </p>
    ),

    category: temple?.category,

    status: (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
          temple?.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : temple?.status === "approved"
              ? "bg-green-100 text-green-500"
              : temple?.status === "rejected"
                ? "bg-red-100 text-red-500"
                : "bg-gray-100 text-gray-600"
        }`}
      >
        {temple?.status}
      </span>
    ),

    details: (
      <Link
        to={`/dashboard/temple/${temple?._id}`}
        className="flex items-center gap-1 text-sm text-primary hover:underline cursor-pointer"
      >
        <Landmark className="size-4" />
        View
      </Link>
    ),
  }));

  const templeActions: any[] = [
    {
      label: "Edit",
      icon: <Pencil className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        setModalType("update");
        setIsAddAudioBookModalOpen(true);
        setTempleId(row?._id);
      },
    },
    {
      label: "Delete",
      icon: <Trash2 className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        handleDeleteTemple(row._id);
      },
    },
  ];

  const filters = [
    {
      label: "Pending",
      value: "pending",
    },
    {
      label: "Approved",
      value: "approved",
    },
    {
      label: "Rejected",
      value: "rejected",
    },
  ];

  const children = (
    <div className="flex items-center gap-3">
      <select
        value={status ?? ""}
        onChange={(e) => setStatus && setStatus(e.target.value)}
        className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
      >
        <option value="">Select Status </option>
        {filters?.map((filter: any) => (
          <option key={filter?.value} value={filter?.value}>
            {filter?.label}
          </option>
        ))}
      </select>

      <Button
        label="Add New Temple"
        onClick={() => {
          setModalType("add");
          setIsAddOrUpdateTempleModalOpen(true);
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
        theads={templeTheads}
        data={templeTableData}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        actions={templeActions}
        limit={10}
        setLimit={setLimit}
        children={children}
      />

      {
        isAddOrUpdateTempleModalOpen &&
        <AddOrUpdateTemple isAddOrUpdateTempleModalOpen={isAddOrUpdateTempleModalOpen} setIsAddOrUpdateTempleModalOpen={setIsAddOrUpdateTempleModalOpen} modalType={modalType} />
      }
    </div>
  );
};

export default Temple;
