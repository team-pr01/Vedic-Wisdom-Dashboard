/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/Reusable/Button/Button";
import Table from "../../components/Reusable/Table/Table";
import DeleteConfirmationModal from "../../components/Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import {
  useDeleteDonationProgramMutation,
  useGetAllDonationProgramsQuery,
} from "../../redux/Features/DonationPrograms/donationProgramApi";
import AddOrEditDonationProgram from "../../components/DonationProgramPage/AddOrEditDonationProgram/AddOrEditDonationProgram";

const DonationPrograms = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [modalType, setModalType] = useState<string>("add");
  const [
    isAddOrEditDonationProgramModalOpen,
    setIsAddOrEditDonationProgramModalOpen,
  ] = useState<boolean>(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [donationProgramId, setDonationProgramId] = useState<string | null>(
    null,
  );
  const { data, isLoading, isFetching } = useGetAllDonationProgramsQuery({
    skip,
    limit,
    keyword,
  });

  console.log(data);

  const [deleteDonationProgram] = useDeleteDonationProgramMutation();

  const handleDeleteDonationProgram = async () => {
    try {
      await toast.promise(
        deleteDonationProgram(donationProgramId as string).unwrap(),
        {
          loading: "Loading...",
          success: "Donation Program deleted successfully!",
          error: "Failed to delete donation program. Please try again.",
        },
      );
    } catch (err) {
      console.error("Error deleting donation program:", err);
    }
  };

  const donationProgramTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "image", label: "Image" },
    { key: "title", label: "Title" },
    { key: "amount", label: "Amount" },
    { key: "progress", label: "Progress" },
    { key: "createdAt", label: "Created At" },
  ];

  const donationPrograms = data?.data?.donationPrograms || [];

  const donationProgramTableData = donationPrograms?.map(
    (program: any, index: number) => ({
      _id: program._id,

      sl: index + 1,

      image: (
        <button
          type="button"
          onClick={() => setPreviewImage(program?.imageUrl as string)}
          className="size-12 rounded-lg overflow-hidden"
        >
          <img
            src={program?.imageUrl || "/placeholder.png"}
            alt={program?.title}
            className="w-full h-full object-cover"
          />
        </button>
      ),

      title: (
        <div className="max-w-62">
          <p className="font-medium text-neutral-10 line-clamp-1">
            {program?.title}
          </p>
          <p className="text-xs text-neutral-500 line-clamp-2">
            {program?.description}
          </p>
        </div>
      ),

      amount: (
        <div className="text-sm font-medium text-neutral-700">
          {program?.currency} {program?.amountNeeded}
        </div>
      ),

      progress: (
        <div className="flex flex-col gap-1 w-35">
          <div className="flex justify-between text-xs text-neutral-500">
            <span>
              {program?.currency} {program?.amountRaised || 0}
            </span>
            <span>
              {Math.min(
                100,
                Math.round(
                  ((program?.amountRaised || 0) / program?.amountNeeded) * 100,
                ),
              )}
              %
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-10"
              style={{
                width: `${Math.min(
                  100,
                  ((program?.amountRaised || 0) / program?.amountNeeded) * 100,
                )}%`,
              }}
            />
          </div>
        </div>
      ),

      createdAt: (
        <span className="text-sm text-neutral-500">
          {program?.createdAt
            ? new Date(program.createdAt).toLocaleDateString()
            : "-"}
        </span>
      ),
    }),
  );

  const children = (
    <div className="flex items-center gap-3">
      <Button
        label="Add New"
        onClick={() => {
          setModalType("add");
          setIsAddOrEditDonationProgramModalOpen(true);
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
        title={`All Donation Programs (${donationProgramId?.length || 0})`}
        description="Manage all donation programs"
        theads={donationProgramTheads}
        data={donationProgramTableData}
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
          setDonationProgramId(row?._id);
          setIsAddOrEditDonationProgramModalOpen(true);
        }}
        onDeleteItem={(row: any) => {
          setDonationProgramId(row?._id);
          setShowDeleteConfirmationModal(true);
        }}
      />

      {isAddOrEditDonationProgramModalOpen && (
        <AddOrEditDonationProgram
          isAddOrEditDonationProgramModalOpen={
            isAddOrEditDonationProgramModalOpen
          }
          setIsAddOrEditDonationProgramModalOpen={
            setIsAddOrEditDonationProgramModalOpen
          }
          modalType={modalType}
          setModalType={setModalType}
          donationProgramId={donationProgramId as string}
        />
      )}

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmationModal(false)}
          onConfirm={handleDeleteDonationProgram}
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

export default DonationPrograms;
