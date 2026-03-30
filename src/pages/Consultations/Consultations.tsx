/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useDeleteConsultationMutation,
  useGetAllConsultationsQuery,
} from "../../redux/Features/Consultation/consultationApi";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  Edit,
} from "lucide-react";
import Table from "../../components/Reusable/Table/Table";
import DeleteConfirmationModal from "../../components/Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import { formatDate } from "../../utils/formatDate";
import type { TConsultation } from "../../types/consultations.types";
import IconButtonWithToolTip from "../../components/Reusable/IconButtonWithToolTip/IconButtonWithToolTip";
import ScheduleConsultation from "../../components/ConsultationPage/ScheduleConsultation/ScheduleConsultation";
import UpdateConsultationStatus from "../../components/ConsultationPage/UpdateConsultationStatus/UpdateConsultationStatus";

const Consultations = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] =
    useState<boolean>(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] =
    useState<boolean>(false);
  const [consultationId, setConsultationId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetAllConsultationsQuery({
    skip,
    limit,
    keyword,
    status,
  });

  const [deleteConsultation] = useDeleteConsultationMutation();

  const handleDeleteConsultation = async () => {
    try {
      await toast.promise(
        deleteConsultation(consultationId as string).unwrap(),
        {
          loading: "Loading...",
          success: "Consultation deleted successfully!",
          error: "Failed to delete consultation. Please try again.",
        },
      );
      setShowDeleteConfirmationModal(false);
      setConsultationId(null);
    } catch (err) {
      console.error("Error deleting consultation:", err);
    }
  };

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "scheduled":
        return {
          label: "Scheduled",
          className: "bg-blue-100 text-blue-700",
          icon: Calendar,
        };
      case "completed":
        return {
          label: "Completed",
          className: "bg-green-100 text-green-700",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          className: "bg-red-100 text-red-700",
          icon: XCircle,
        };
      case "pending":
        return {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-700",
          icon: Clock,
        };
      default:
        return {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-700",
          icon: Clock,
        };
    }
  };

  const consultationTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "consultationId", label: "Consultation ID" },
    { key: "user", label: "User" },
    { key: "consultant", label: "Consultant" },
    { key: "category", label: "Category" },
    { key: "concern", label: "Concern" },
    { key: "scheduledAt", label: "Scheduled At" },
    { key: "meetingLink", label: "Meeting" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const consultations = data?.data?.consultations || [];

  const consultationTableData = consultations?.map(
    (consultation: TConsultation, index: number) => {
      const statusConfig = getStatusConfig(consultation.status);
      const StatusIcon = statusConfig.icon;

      return {
        _id: consultation?._id,

        sl: skip + index + 1,

        consultationId: consultation?.consultationId,

        user: (
          <div className="max-w-48">
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-neutral-45" />
              <p className="text-sm font-medium text-neutral-10">
                {consultation?.userId?.name || "—"}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <Mail size={12} className="text-neutral-45" />
              <p className="text-xs text-neutral-45">
                {consultation?.userId?.email || "—"}
              </p>
            </div>
            {consultation?.userId?.phoneNumber && (
              <div className="flex items-center gap-1.5 mt-1">
                <Phone size={12} className="text-neutral-45" />
                <p className="text-xs text-neutral-45">
                  {consultation?.userId?.phoneNumber}
                </p>
              </div>
            )}
          </div>
        ),

        consultant: (
          <div className="max-w-48">
            <p className="text-sm font-medium text-neutral-10">
              {consultation?.consultantId?.name || "—"}
            </p>
            <p className="text-xs text-neutral-45 mt-1">
              {consultation?.consultantId?.email || "—"}
            </p>
            {consultation?.consultantId?.phoneNumber && (
              <p className="text-xs text-neutral-45 mt-1">
                {consultation?.consultantId?.phoneNumber}
              </p>
            )}
          </div>
        ),

        category: (
          <span className="px-2 py-1 bg-primary-10/10 text-primary-10 text-xs font-medium rounded-full capitalize">
            {consultation?.consultantId?.category}
          </span>
        ),
        concern: (
          <div className="max-w-52">
            <p className="text-sm text-neutral-45 line-clamp-2">
              {consultation?.concern || "—"}
            </p>
          </div>
        ),

        scheduledAt: (
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-neutral-45" />
            <span className="text-sm text-neutral-10">
              {consultation?.scheduledAt
                ? formatDate(consultation.scheduledAt)
                : "—"}
            </span>
          </div>
        ),

        meetingLink: (
          <div>
            {consultation?.meetingLink ? (
              <a
                href={consultation.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary-10 hover:underline"
              >
                <Video size={14} />
                Join Meeting
              </a>
            ) : (
              <span className="text-sm text-neutral-45">—</span>
            )}
          </div>
        ),

        status: (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}
          >
            <StatusIcon size={12} />
            {statusConfig.label}
          </span>
        ),

        actions: (
          <div className="flex items-center gap-2">
            {/* Schedule Meeting Button */}
            <IconButtonWithToolTip
              Icon={Calendar}
              tooltip="Schedule"
              onClick={() => {
                setConsultationId(consultation._id);
                setIsScheduleModalOpen(true);
              }}
              textColor="text-blue-500"
            />

            {/* Update Status Button */}
            <IconButtonWithToolTip
              Icon={Edit}
              tooltip="Update Status"
              onClick={() => {
                setConsultationId(consultation._id);
                setIsUpdateStatusModalOpen(true);
              }}
              textColor="text-green-500"
            />
          </div>
        ),
      };
    },
  );

  const statusOptions = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const children = (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const handleSearch = (k: string) => {
    setKeyword(k);
  };

  return (
    <div>
      <Table<any>
        title={`Consultations (${consultations?.length || 0})`}
        description="Manage all consultation requests"
        theads={consultationTheads}
        data={consultationTableData}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        limit={limit}
        setLimit={setLimit}
        children={children}
        onDeleteItem={(row: any) => {
          setConsultationId(row?._id);
          setShowDeleteConfirmationModal(true);
        }}
      />

      {isScheduleModalOpen && (
        <ScheduleConsultation
          isScheduleModalOpen={isScheduleModalOpen}
          setIsScheduleModalOpen={setIsScheduleModalOpen}
          consultationId={consultationId as string}
        />
      )}

      {isUpdateStatusModalOpen && (
        <UpdateConsultationStatus
          isUpdateStatusStatusModalOpen={isUpdateStatusModalOpen}
          setIsUpdateStatusStatusModalOpen={setIsUpdateStatusModalOpen}
          consultationId={consultationId as string}
        />
      )}

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmationModal(false)}
          onConfirm={handleDeleteConsultation}
          itemName="Consultation"
          itemType="Consultation"
        />
      )}
    </div>
  );
};

export default Consultations;
