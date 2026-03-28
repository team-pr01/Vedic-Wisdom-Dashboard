import {
  Edit,
  Trash2,
  Calendar,
  Link2,
  Target,
  Image as ImageIcon,
} from "lucide-react";
import type { TPopup } from "../../../types/popup.types";
import { formatDate } from "../../../utils/formatDate";
import DeleteConfirmationModal from "../../Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import { useState } from "react";
import { useDeletePopupMutation } from "../../../redux/Features/Popup/popupApi";
import toast from "react-hot-toast";

type PopupCardProps = {
  popup: TPopup;
  setModalType: (value: string) => void;
  setIsAddOrEditPopupModalOpen: (value: boolean) => void;
  setSelectedPopupId: (id: string) => void;
};

const PopupCard = ({
  popup,
  setModalType,
  setIsAddOrEditPopupModalOpen,
  setSelectedPopupId,
}: PopupCardProps) => {
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);

  const [deletePopup] = useDeletePopupMutation();

  const handleDeletePopup = async () => {
    try {
      await toast.promise(deletePopup(popup._id as string).unwrap(), {
        loading: "Loading...",
        success: "Popup deleted successfully!",
        error: "Failed to delete popup. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting popup:", err);
    }
  };
  return (
    <>
      <div className="bg-white rounded-xl border border-neutral-50 overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="flex">
          {/* Image Section */}
          <div className="size-72 shrink-0 bg-neutral-50 overflow-hidden">
            {popup.imageUrl ? (
              <img
                src={popup.imageUrl}
                alt={popup.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon size={32} className="text-neutral-300" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-neutral-10">
                    {popup.title}
                  </h3>
                </div>
                <p className="text-sm text-neutral-45 line-clamp-2 mb-3">
                  {popup.content}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setModalType("edit");
                    setSelectedPopupId(popup._id as string);
                    setIsAddOrEditPopupModalOpen(true);
                  }}
                  className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit size={16} className="text-blue-500" />
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirmationModal(true);
                  }}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-neutral-50">
              {popup.targetPages && popup.targetPages.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-45">
                  <Target size={12} />
                  <span>Pages: {popup.targetPages.join(", ")}</span>
                </div>
              )}

              {popup.btnText && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-45">
                  <Link2 size={12} />
                  <a
                    href={popup.btnLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-10 transition-colors"
                  >
                    {popup.btnText}
                  </a>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-xs text-neutral-45">
                <Calendar size={12} />
                <span>Created: {formatDate(popup.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmationModal(false)}
          onConfirm={handleDeletePopup}
        />
      )}
    </>
  );
};

export default PopupCard;
