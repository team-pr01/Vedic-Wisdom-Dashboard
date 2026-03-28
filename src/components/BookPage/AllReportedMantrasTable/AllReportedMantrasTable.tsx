import React, { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useDeleteReportedMantraMutation } from "../../../redux/Features/Book/reportedMantraApi";
import ReviewMantraModal from "./ReviewMantraModal";
import Loader from "../../Reusable/Loader/Loader";
import DeleteConfirmationModal from "../../Reusable/DeleteConfirmationModal/DeleteConfirmationModal";

export type TReportedMantra = {
  _id: string;
  originalText: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  isHumanVerified?: boolean;
};

type AllReportedMantrasTableProps = {
  reportedMantras?: TReportedMantra[];
  isLoading: boolean;
  isReviewMantraModalOpen: boolean;
  setIsReviewMantraModalOpen: (open: boolean) => void;
};

const AllReportedMantrasTable: React.FC<AllReportedMantrasTableProps> = ({
  reportedMantras,
  isLoading,
  isReviewMantraModalOpen,
  setIsReviewMantraModalOpen,
}) => {
  const [selectedMantraId, setSelectedMantraId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteReportedMantra] = useDeleteReportedMantraMutation();

  const handleConfirmDelete = async () => {
    if (!selectedReportId) return;
    toast.promise(deleteReportedMantra({ id: selectedReportId }).unwrap(), {
      loading: "Deleting report...",
      success: "Report deleted successfully!",
      error: "Failed to delete report.",
    });
    setShowDeleteModal(false);
  };

  // status badge colors
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300";
      case "dismissed":
        return "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <Loader />
      </div>
    );
  }

  if (!reportedMantras || reportedMantras?.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-20 text-gray-500 dark:text-gray-400 text-lg">
        No reported mantras found
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto mt-8">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-gray-700 dark:text-gray-200">
            <th className="pb-2">Original Text</th>
            <th className="pb-2">Reason</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Human Verified</th>
            <th className="pb-2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5}>
              <div className="border-b border-gray-300 dark:border-gray-600 mb-2"></div>
            </td>
          </tr>

          {reportedMantras?.map((mantra) => (
            <React.Fragment key={mantra._id}>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 align-middle">
                <td className="py-2 text-gray-700 dark:text-gray-200">
                  {mantra.originalText}
                </td>
                <td className="py-2 text-gray-700 dark:text-gray-200 capitalize">
                  {mantra.reason}
                </td>
                <td className="py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusClasses(
                      mantra.status,
                    )}`}
                  >
                    {mantra.status}
                  </span>
                </td>
                <td className="py-2">
                  {mantra.isHumanVerified ? (
                    <span className="text-green-500 font-medium inline">
                      Verified <Check className="w-5 h-5 inline" />
                    </span>
                  ) : (
                    <span className="text-red-500">Not Verified</span>
                  )}
                </td>
                <td className="py-2 flex gap-3 items-center">
                  <button
                    onClick={() => {
                      setIsReviewMantraModalOpen(true);
                      setSelectedMantraId(mantra._id);
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => {
                      setSelectedReportId(mantra._id);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </td>
              </tr>

              <tr>
                <td colSpan={5}>
                  <div className="border-b border-gray-200 dark:border-gray-600 my-2"></div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {showDeleteModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {isReviewMantraModalOpen && (
        <ReviewMantraModal
          selectedMantraId={selectedMantraId as string}
          setIsReviewMantraModalOpen={setIsReviewMantraModalOpen}
        />
      )}
    </div>
  );
};

export default AllReportedMantrasTable;
