/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Download,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  UserX,
} from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import Table from "../../components/Reusable/Table/Table";
import DeleteConfirmationModal from "../../components/Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import type { TApplication } from "../../types/application.types";
import {
  useGetAllApplicationsByJobIdQuery,
  useUpdateApplicationStatusMutation,
} from "../../redux/Features/Job/applicationApi";

const JobApplications = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [status, setStatus] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const skip = (page - 1) * limit;

  const { data, isLoading, isFetching, refetch } =
    useGetAllApplicationsByJobIdQuery({
      jobId,
      skip,
      limit,
      keyword,
      status,
    });

  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();

  const applications = data?.data?.applications || [];
  const meta = data?.data?.meta || {};

  const handleUpdateStatus = async (
    applicationId: string,
    newStatus: string,
  ) => {
    try {
      await toast.promise(
        updateApplicationStatus({
          id: applicationId,
          data: { status: newStatus },
        }).unwrap(),
        {
          loading: "Updating status...",
          success: `Application ${newStatus} successfully!`,
          error: "Failed to update status. Please try again.",
        },
      );
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "applied":
        return {
          label: "Applied",
          className: "bg-blue-100 text-blue-700",
          icon: Clock,
        };
      case "shortlisted":
        return {
          label: "Shortlisted",
          className: "bg-purple-100 text-purple-700",
          icon: UserCheck,
        };
      case "hired":
        return {
          label: "Hired",
          className: "bg-green-100 text-green-700",
          icon: CheckCircle,
        };
      case "rejected":
        return {
          label: "Rejected",
          className: "bg-red-100 text-red-700",
          icon: XCircle,
        };
      case "withdrawn":
        return {
          label: "Withdrawn",
          className: "bg-gray-100 text-gray-700",
          icon: UserX,
        };
      default:
        return {
          label: "Applied",
          className: "bg-blue-100 text-blue-700",
          icon: Clock,
        };
    }
  };

  const applicationTheads = [
    { key: "sl", label: "SL" },
    { key: "applicant", label: "Applicant" },
    { key: "contact", label: "Contact" },
    { key: "resume", label: "Resume" },
    { key: "note", label: "Note" },
    { key: "appliedDate", label: "Applied Date" },
    { key: "status", label: "Status" },
  ];

  const applicationTableData = applications?.map(
    (application: TApplication, index: number) => {
      const statusConfig = getStatusConfig(application.status);
      const StatusIcon = statusConfig.icon;
      const applicant = application?.applicant || {};

      return {
        _id: application._id,

        sl: skip + index + 1,

        applicant: (
          <p className="font-medium text-neutral-10 line-clamp-1">
            {applicant?.name || "—"}
          </p>
        ),

        contact: (
          <div>
            <p className="text-sm text-neutral-10">{applicant?.email || "—"}</p>
            <p className="text-xs text-neutral-45 mt-0.5">
              {applicant?.phoneNumber || "—"}
            </p>
          </div>
        ),

        resume: (
          <a
            href={application.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-primary-10 hover:underline text-sm"
          >
            <Download size={14} />
            View Resume
          </a>
        ),

        note: (
          <div className="max-w-48">
            <p className="text-sm text-neutral-45 line-clamp-2">
              {application.noteFromApplicant || "—"}
            </p>
          </div>
        ),

        appliedDate: (
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-neutral-45" />
            <span className="text-sm text-neutral-10">
              {formatDate(application.createdAt)}
            </span>
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
      };
    },
  );

  const statusFilters = [
    { label: "All", value: "" },
    { label: "Applied", value: "applied" },
    { label: "Shortlisted", value: "shortlisted" },
    { label: "Hired", value: "hired" },
    { label: "Rejected", value: "rejected" },
    { label: "Withdrawn", value: "withdrawn" },
  ];

  const applicationActions = [
    {
      label: "Shortlist",
      icon: <UserCheck className="inline mr-2 size-4 text-purple-500" />,
      onClick: (row: any) => {
        handleUpdateStatus(row._id, "shortlisted");
      },
      condition: (row: any) => row.status?.label === "Applied",
    },
    {
      label: "Hire",
      icon: <CheckCircle className="inline mr-2 size-4 text-green-500" />,
      onClick: (row: any) => {
        handleUpdateStatus(row._id, "hired");
      },
      condition: (row: any) => row.status?.label === "Shortlisted",
    },
    {
      label: "Reject",
      icon: <XCircle className="inline mr-2 size-4 text-red-500" />,
      onClick: (row: any) => {
        handleUpdateStatus(row._id, "rejected");
      },
      condition: (row: any) =>
        row.status?.label === "Applied" || row.status?.label === "Shortlisted",
    },
  ];

  const children = (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
      >
        {statusFilters.map((filter) => (
          <option key={filter.value} value={filter.value}>
            {filter.label}
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
      <Table
        title={`Job Applications (${meta?.total || 0})`}
        description="Manage all applications for this job"
        theads={applicationTheads}
        data={applicationTableData}
        totalPages={meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        onSearch={handleSearch}
        isLoading={isLoading || isFetching}
        limit={limit}
        setLimit={setLimit}
        children={children}
        actions={applicationActions}
      />

      {showWithdrawModal && selectedApplicationId && (
        <DeleteConfirmationModal
          onClose={() => {
            setShowWithdrawModal(false);
            setSelectedApplicationId(null);
          }}
          onConfirm={() => {
            handleUpdateStatus(selectedApplicationId, "withdrawn");
            setShowWithdrawModal(false);
            setSelectedApplicationId(null);
          }}
        />
      )}
    </div>
  );
};

export default JobApplications;
