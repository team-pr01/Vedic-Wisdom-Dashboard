/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import toast from "react-hot-toast";
import Table from "../../components/Reusable/Table/Table";
import DeleteConfirmationModal from "../../components/Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import {
  useDeleteEmergencyMutation,
  useGetAllEmergenciesQuery,
  useUpdateStatusMutation,
} from "../../redux/Features/Emergency/emergencyApi";
import {
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Check,
  Share2,
  Send,
} from "lucide-react";
import type { TEmergency } from "../../types/emergency.types";
import { formatDate } from "../../utils/formatDate";
import ForwardMessage from "../../components/EmergencyPage/ForwardMessage/ForwardMessage";

const Emergency = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isForwardMessageModalOpen, setIsForwardMessageModalOpen] =
    useState<boolean>(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);
  const [emergencyId, setEmergencyId] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useGetAllEmergenciesQuery({
    skip,
    limit,
    keyword,
    status,
  });

  const [deleteEmergency] = useDeleteEmergencyMutation();

  const handleDeleteEmergencyMessage = async () => {
    try {
      await toast.promise(deleteEmergency(emergencyId as string).unwrap(), {
        loading: "Loading...",
        success: "Message deleted successfully!",
        error: "Failed to delete message. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const [updateStatus] = useUpdateStatusMutation();

  const handleUpdateStatus = async (id: string, status: string) => {
    const data = {
      status,
    };
    try {
      await toast.promise(updateStatus({ id, data }).unwrap(), {
        loading: "Loading...",
        success: "Status updated successfully!",
        error: "Failed to update status. Please try again.",
      });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const emergencyTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "user", label: "User" },
    { key: "phoneNumber", label: "Phone" },
    { key: "location", label: "Location" },
    { key: "message", label: "Message" },
    { key: "status", label: "Status" },
    { key: "resolvedAt", label: "Resolved At" },
    { key: "steps", label: "Steps" },
  ];

  const emergencies = data?.data || [];

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          label: "Pending",
          className: "bg-yellow-100 text-yellow-700 border-yellow-200",
          iconColor: "text-yellow-500",
        };
      case "processing":
        return {
          icon: AlertCircle,
          label: "Processing",
          className: "bg-blue-100 text-blue-700 border-blue-200",
          iconColor: "text-blue-500",
        };
      case "resolved":
        return {
          icon: CheckCircle,
          label: "Resolved",
          className: "bg-green-100 text-green-700 border-green-200",
          iconColor: "text-green-500",
        };
      case "forwarded":
        return {
          icon: Send,
          label: "Forwarded",
          className: "bg-teal-100 text-teal-700 border-teal-200",
          iconColor: "text-teal-500",
        };
      default:
        return {
          icon: Clock,
          label: "Pending",
          className: "bg-gray-100 text-gray-700 border-gray-200",
          iconColor: "text-gray-500",
        };
    }
  };

  const emergencyTableData = emergencies?.map(
    (emergency: TEmergency, index: number) => {
      const statusConfig = getStatusConfig(emergency.status);
      const StatusIcon = statusConfig.icon;

      return {
        _id: emergency?._id,

        sl: index + 1,

        user: (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <User size={14} className="text-neutral-45" />
              <span className="font-medium text-neutral-10 text-sm">
                {emergency?.userId?.name || "—"}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Mail size={12} className="text-neutral-45" />
              <span className="text-xs text-neutral-45">
                {emergency?.userId?.email || "—"}
              </span>
            </div>
          </div>
        ),

        phoneNumber: (
          <div className="flex items-center gap-1.5">
            <Phone size={14} className="text-neutral-45" />
            <span className="text-sm text-neutral-10">
              {emergency?.phoneNumber || "—"}
            </span>
          </div>
        ),

        location: (
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-neutral-45 shrink-0" />
            <span
              className="text-sm text-neutral-10 truncate"
              title={emergency?.location}
            >
              {emergency?.location || "—"}
            </span>
          </div>
        ),

        message: (
          <div>
            <div className="flex items-start gap-1.5">
              <MessageSquare
                size={14}
                className="text-neutral-45 shrink-0 mt-0.5"
              />
              <p className="text-sm text-neutral-10 line-clamp-2">
                {emergency?.message || "—"}
              </p>
            </div>
          </div>
        ),

        status: (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.className}`}
          >
            <StatusIcon size={12} className={statusConfig.iconColor} />
            {statusConfig.label}
          </span>
        ),

        resolvedAt: (
          <div className="text-sm text-neutral-45">
            {emergency?.resolvedAt ? formatDate(emergency?.resolvedAt) : "—"}
          </div>
        ),

        steps: (
          <div className="flex items-center gap-2">
            {/* Processing Button */}
            <button
              onClick={() => handleUpdateStatus(emergency._id, "processing")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
              title="Mark as processing"
            >
              <Clock size={14} className="text-blue-500" />
              <span className="text-xs font-medium">Processing</span>
            </button>

            {/* Resolved Button */}
            <button
              onClick={() => handleUpdateStatus(emergency._id, "resolved")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
              title="Mark as resolved"
            >
              <Check size={14} className="text-green-500" />
              <span className="text-xs font-medium">Resolved</span>
            </button>

            {/* Forward to Others Button */}
            <button
              onClick={() => {
                setEmergencyId(emergency._id);
                setIsForwardMessageModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
              title="Forward to others"
            >
              <Share2 size={14} className="text-purple-500" />
              <span className="text-xs font-medium">Forward</span>
            </button>
          </div>
        ),
      };
    },
  );

  const handleSearch = (k: string) => {
    setKeyword(k);
  };

  const statusFilters = [
    {
      label: "Pending",
      value: "pending",
    },
    {
      label: "Processing",
      value: "processing",
    },
    {
      label: "Forwarded",
      value: "forwarded",
    },
    {
      label: "Resolved",
      value: "resolved",
    },
  ];

  const children = (
    <div className="flex items-center gap-3">
      <select
        value={status ?? ""}
        onChange={(e) => setStatus(e.target.value)}
        className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
      >
        <option value="">Select Category </option>
        {statusFilters?.map((s: any) => (
          <option key={s?.label} value={s?.value}>
            {s?.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      <Table<any>
        title={`Emergency (${emergencies?.length || 0})`}
        description="Manage all emergencies here"
        theads={emergencyTheads}
        data={emergencyTableData}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        limit={10}
        setLimit={setLimit}
        children={children}
        onDeleteItem={(row: any) => {
          setEmergencyId(row?._id);
          setShowDeleteConfirmationModal(true);
        }}
      />

      {isForwardMessageModalOpen && (
        <ForwardMessage
          isForwardMessageModalOpen={isForwardMessageModalOpen}
          setIsForwardMessageModalOpen={setIsForwardMessageModalOpen}
          emergencyId={emergencyId as string}
        />
      )}

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmationModal(false)}
          onConfirm={handleDeleteEmergencyMessage}
        />
      )}
    </div>
  );
};

export default Emergency;
