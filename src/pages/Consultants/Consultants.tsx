/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/Reusable/Button/Button";
import Table from "../../components/Reusable/Table/Table";
import DeleteConfirmationModal from "../../components/Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import {
  useDeleteConsultantMutation,
  useGetAllConsultantsQuery,
} from "../../redux/Features/Consultants/consultantsApi";
import { formatDate } from "../../utils/formatDate";
import AddOrEditConsultant from "../../components/ConsultantPage/AddOrEditConsultant/AddOrEditConsultant";
import { useGetAllCategoriesByAreaNameQuery } from "../../redux/Features/Categories/categoriesApi";
import Category from "../../components/Shared/Category/Category";

const Consultants = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [modalType, setModalType] = useState<string>("add");
  const [category, setCategory] = useState<string>("");
  const [isAddOrEditConsultantModalOpen, setIsAddOrEditConsultantModalOpen] =
    useState<boolean>(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [consultantId, setConsultantId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetAllConsultantsQuery({
    skip,
    limit,
    keyword,
    category,
  });

  const { data: categories } =
    useGetAllCategoriesByAreaNameQuery("Consultants");

  const [deleteConsultant] = useDeleteConsultantMutation();

  const handleDeleteConsultant = async () => {
    try {
      await toast.promise(deleteConsultant(consultantId as string).unwrap(), {
        loading: "Loading...",
        success: "Consultant deleted successfully!",
        error: "Failed to delete consultant. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting consultant:", err);
    }
  };

  const consultantTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "image", label: "Image" },
    { key: "name", label: "Name" },
    { key: "specialties", label: "Specialties" },
    { key: "category", label: "Category" },
    { key: "fees", label: "Fees" },
    { key: "rating", label: "Rating" },
    { key: "createdAt", label: "Created At" },
  ];

  const consultants = data?.data?.consultants || [];

  const consultantTableData = consultants?.map((item: any, index: number) => ({
    _id: item._id,

    sl: index + 1,

    image: (
      <button
        type="button"
        onClick={() => setPreviewImage(item?.imageUrl)}
        className="size-12 rounded-lg overflow-hidden"
      >
        <img
          src={item?.imageUrl || "/placeholder.png"}
          alt={item?.name}
          className="w-full h-full object-cover"
        />
      </button>
    ),

    name: (
      <div className="max-w-52">
        <p className="font-medium text-neutral-10">{item?.name}</p>
        <p className="text-xs text-neutral-500">{item?.email}</p>
        <p className="text-xs text-neutral-500">{item?.phoneNumber}</p>
      </div>
    ),

    specialties: (
      <div className="flex flex-wrap gap-1 max-w-52">
        {item?.specialties?.map((sp: string, i: number) => (
          <span
            key={i}
            className="px-2 py-0.5 bg-primary-10/10 text-primary-10 text-xs rounded-full"
          >
            {sp}
          </span>
        ))}
      </div>
    ),

    category: (
      <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full capitalize">
        {item?.category}
      </span>
    ),

    fees: (
      <span className="text-sm font-medium text-neutral-700">{item?.fees}</span>
    ),

    rating: (
      <span className="text-sm font-medium text-yellow-500">
        ⭐ {item?.rating}
      </span>
    ),

    createdAt: (
      <span className="text-sm text-neutral-500">
        {formatDate(item?.createdAt)}
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
      <Category areaName="Consultants" />
      <Button
        label="Add New"
        onClick={() => {
          setModalType("add");
          setIsAddOrEditConsultantModalOpen(true);
        }}
        className="px-3 py-2"
      />
    </div>
  );

  const handleSearch = (k: string) => setKeyword(k);

  return (
    <div>
      <Table<any>
        title={`All Consultants (${consultants.length})`}
        description="Manage all consultants"
        theads={consultantTheads}
        data={consultantTableData}
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
          setConsultantId(row?._id);
          setIsAddOrEditConsultantModalOpen(true);
        }}
        onDeleteItem={(row: any) => {
          setConsultantId(row?._id);
          setShowDeleteConfirmationModal(true);
        }}
      />

      {isAddOrEditConsultantModalOpen && (
        <AddOrEditConsultant
          isAddOrEditConsultantModalOpen={isAddOrEditConsultantModalOpen}
          setIsAddOrEditConsultantModalOpen={setIsAddOrEditConsultantModalOpen}
          modalType={modalType as "add" | "edit"}
          setModalType={setModalType}
          consultantId={consultantId as string}
        />
      )}

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmationModal(false)}
          onConfirm={handleDeleteConsultant}
        />
      )}

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

export default Consultants;
