/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useDeleteJobMutation,
  useGetAllJobsQuery,
  useUpdateJobStatusMutation,
} from "../../redux/Features/Job/jobApi";
import toast from "react-hot-toast";
import type { TJob } from "../../types/job.types";
import {
  MapPin,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
} from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import Button from "../../components/Reusable/Button/Button";
import Table from "../../components/Reusable/Table/Table";
import DeleteConfirmationModal from "../../components/Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import { Link, useNavigate } from "react-router-dom";

const Job = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useGetAllJobsQuery({
    skip,
    limit,
    keyword,
    status,
  });

  const [deleteJob] = useDeleteJobMutation();
  const [updateJobStatus] = useUpdateJobStatusMutation();

  const handleDeleteJob = async () => {
    try {
      await toast.promise(deleteJob(jobId as string).unwrap(), {
        loading: "Loading...",
        success: "Job deleted successfully!",
        error: "Failed to delete job. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  const jobTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "title", label: "Job Title" },
    { key: "location", label: "Location" },
    { key: "salary", label: "Salary" },
    { key: "jobType", label: "Job Type" },
    { key: "applicationDeadline", label: "Deadline" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const jobs = data?.data?.jobs || [];

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "active":
        return {
          label: "Active",
          className: "bg-green-100 text-green-700",
          icon: CheckCircle,
        };
      case "closed":
        return {
          label: "Closed",
          className: "bg-red-100 text-red-700",
          icon: Clock,
        };
      case "pending":
        return {
          label: "Pending",
          className: "bg-gray-100 text-gray-700",
          icon: Clock,
        };
      case "rejected":
        return {
          label: "Rejected",
          className: "bg-red-100 text-red-700",
          icon: XCircle,
        };
      default:
        return {
          label: "Active",
          className: "bg-green-100 text-green-700",
          icon: CheckCircle,
        };
    }
  };

  const jobTableData = jobs?.map((job: TJob, index: number) => {
    const statusConfig = getStatusConfig(job.status);
    const StatusIcon = statusConfig.icon;
    const jobType =
      job.jobType === "fullTime"
        ? "Full Time"
        : job.jobType === "partTime"
          ? "Part Time"
          : job.jobType === "freelance"
            ? "Freelance"
            : job.jobType === "contractual"
              ? "Contractual"
              : "Internship";

    const locationParts = [
      job.location.city,
      job.location.state,
      job.location.country,
    ].filter(Boolean);
    const locationText =
      locationParts.length > 0 ? locationParts.join(", ") : "—";

    return {
      _id: job?._id,

      sl: index + 1,

      title: (
        <div className="max-w-62">
          <p className="font-medium text-neutral-10 font-Inter line-clamp-2">
            {job?.title}
          </p>
          <p className="text-xs text-neutral-45 mt-1">
            {(job?.hiringType === "company" && job?.company?.name) ||
              (job?.hiringType === "individual" && job?.individual?.fullName)}
          </p>
        </div>
      ),

      location: (
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-neutral-45 shrink-0" />
          <span className="text-sm text-neutral-10" title={locationText}>
            {locationText}
          </span>
        </div>
      ),

      salary: (
        <div className="flex flex-col">
          {job?.salary.type === "paid" ? (
            <>
              <span className="text-sm font-medium text-green-600">
                {job?.salary.currency} {job.salary.minimum} -{" "}
                {job.salary.maximum}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium text-yellow-500 capitalize">
              {job?.salary.type}
            </span>
          )}
        </div>
      ),

      jobType: (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            job?.jobType === "fullTime"
              ? "bg-blue-100 text-blue-700"
              : job?.jobType === "partTime"
                ? "bg-purple-100 text-purple-700"
                : job?.jobType === "internship"
                  ? "bg-green-100 text-green-700"
                  : job?.jobType === "contractual"
                    ? "bg-orange-100 text-orange-700"
                    : job?.jobType === "freelance"
                      ? "bg-pink-100 text-orange-700"
                      : "bg-gray-100 text-gray-700"
          }`}
        >
          {jobType}
        </span>
      ),

      applicationDeadline: (
        <div className="flex items-center gap-1.5">
          <Calendar size={14} className="text-neutral-45" />
          <span
            className={`text-sm ${
              new Date(job?.applicationDeadline) < new Date()
                ? "text-red-500"
                : "text-neutral-10"
            }`}
          >
            {job?.applicationDeadline
              ? formatDate(job?.applicationDeadline)
              : "—"}
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

      actions: (
        <button
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-10 bg-primary-10/10 rounded-lg hover:bg-primary-10/20 transition-colors"
          onClick={() => {
            navigate(`/dashboard/job/update/${job?._id}`);
          }}
        >
          <Eye size={14} />
          View Details
        </button>
      ),
    };
  });

  const statues = [
    {
      label: "Pending",
      value: "pending",
    },
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Rejected",
      value: "rejected",
    },
    {
      label: "Closed",
      value: "closed",
    },
  ];

  const children = (
    <div className="flex items-center gap-3">
      <select
        value={status ?? ""}
        onChange={(e) => setStatus(e.target.value)}
        className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
      >
        <option value="">Select Status </option>
        {statues?.map((status: any) => (
          <option key={status?.value} value={status?.value}>
            {status?.label}
          </option>
        ))}
      </select>
      <Link to="/dashboard/job/post">
        <Button label="Post New" className="px-3 py-2" />
      </Link>
    </div>
  );

  const handleUpdateJobStatus = async (id: string, status: string) => {
    const payload = {
      status,
    };
    try {
      await toast.promise(updateJobStatus({ id, data: payload }).unwrap(), {
        loading: "Loading...",
        success: `Job ${status} successfully!`,
        error: `Failed to ${status}. Please try again.`,
      });
    } catch (err: any) {
      toast.error(
        err?.data?.message || `Failed to ${status}. Please try again.`,
      );
    }
  };

  const jobActions: any[] = [
    {
      label: "Accept Job",
      icon: <CheckCircle className="inline mr-2 size-4 text-green-500" />,
      onClick: (row: any) => {
        handleUpdateJobStatus(row._id, "active");
      },
    },
    {
      label: "Reject Job",
      icon: <XCircle className="inline mr-2 size-4 text-red-500" />,
      onClick: (row: any) => {
        handleUpdateJobStatus(row._id, "rejected");
      },
    },
    {
      label: "Close Job",
      icon: <Lock className="inline mr-2 size-4 text-gray-500" />,
      onClick: (row: any) => {
        handleUpdateJobStatus(row._id, "closed");
      },
    },
  ];

  const handleSearch = (k: string) => {
    setKeyword(k);
  };
  return (
    <div>
      <Table<any>
        title={`Jobs (${jobs?.length || 0})`}
        description="Manage all your jobs"
        theads={jobTheads}
        data={jobTableData}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        limit={10}
        setLimit={setLimit}
        children={children}
        onEditItem={(row: any) => {
          navigate(`/dashboard/job/update/${row?._id}`);
        }}
        onDeleteItem={(row: any) => {
          setJobId(row?._id);
          setShowDeleteConfirmationModal(true);
        }}
        actions={jobActions}
      />

      {/* {isAddOrEditRecipeModalOpen && (
        <AddOrEditRecipe
          isAddOrEditRecipeModalOpen={isAddOrEditRecipeModalOpen}
          setIsAddOrEditRecipeModalOpen={setIsAddOrEditRecipeModalOpen}
          modalType={modalType}
          setModalType={setModalType}
          recipeId={recipeId as string}
          categories={categories?.data || []}
        />
      )} */}

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmationModal(false)}
          onConfirm={handleDeleteJob}
        />
      )}
    </div>
  );
};

export default Job;
