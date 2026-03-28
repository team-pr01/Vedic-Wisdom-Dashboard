/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Table from "../../components/Reusable/Table/Table";
import { formatDate } from "../../utils/formatDate";
import {
  Eye,
  UserX,
  UserCheck,
  RotateCcw,
  Info,
  FileText,
} from "lucide-react";
import ReferralList from "../../components/UsersPage/ReferralList/ReferralList";
import {
  useActiveUserMutation,
  useGetAllUsersQuery,
  useRestoreDeletedAccountMutation,
} from "../../redux/Features/User/userApi";
import AccountDeleteReason from "../../components/UsersPage/AccountDeleteOrSuspensionReason/AccountDeleteOrSuspensionReason";
import SuspendUserModal from "../../components/UsersPage/SuspendUserModal/SuspendUserModal";
import toast from "react-hot-toast";
import IconButtonWithToolTip from "../../components/Reusable/IconButtonWithToolTip/IconButtonWithToolTip";
import AssignPage from "../../components/UsersPage/AssignPage/AssignPage";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [premiumUnlocked, setPremiumUnlocked] = useState<string>("");

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedUSerName, setSelectedUSerName] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isReferralListModalOpen, setIsReferralListModalOpen] =
    useState<boolean>(false);
  const [isSuspendUserModalOpen, setIsSuspendUserModalOpen] =
    useState<boolean>(false);
  const [
    isDeleteOrSuspensionReasonModalOpen,
    setIsDeleteOrSuspensionReasonModalOpen,
  ] = useState<boolean>(false);
  const [isAssignPageModalOpen, setIsAssignPageModalOpen] =
    useState<boolean>(false);
  const [activeUser] = useActiveUserMutation();
  const [restoreDeletedAccount] = useRestoreDeletedAccountMutation();
  const { data, isLoading, isFetching } = useGetAllUsersQuery({
    skip,
    limit,
    keyword,
    status,
    premiumUnlocked,
  });

  const users = data?.data?.data || [];

  const userTheads: any[] = [
    { key: "userId", label: "User ID" },
    { key: "name", label: "Name" },
    { key: "address", label: "Location" },
    { key: "registeredOn", label: "Registered On" },
    { key: "referralInfo", label: "Referral Info" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ];

  const userTableData = users?.map((user) => ({
    _id: user._id,
    userId: (
      <p
        className={`capitalize font-semibold ${user?.isDeleted ? "text-red-500" : "text-neutral-5"}`}
      >
        {user.userId}
      </p>
    ),

    name: (
      <div>
        <div className="flex items-center gap-2">
          <p
            className={`capitalize font-semibold ${user?.isDeleted ? "text-red-500" : "text-neutral-5"}`}
          >
            {user.name}
          </p>
          {user?.isDeleted && (
            <IconButtonWithToolTip
              Icon={Info}
              tooltip="Account Delete Reason"
              onClick={() => {
                setReason(user.accountDeleteReason);
                setIsDeleteOrSuspensionReasonModalOpen(true);
              }}
              textColor="text-red-500"
            />
          )}
        </div>
        <p>{user.email}</p>
        <p>
          {user.countryCode} {user.phoneNumber}
        </p>
      </div>
    ),

    address: (
      <div>
        {(() => {
          const locationParts = [user.city, user.state, user.country].filter(
            Boolean,
          );
          const hasLocation = locationParts.length > 0;
          const hasAddress = user.address;

          if (!hasLocation && !hasAddress) {
            return <p className="text-neutral-45">N/A</p>;
          }

          return (
            <>
              {hasLocation && (
                <p className="capitalize font-semibold">
                  {locationParts.join(", ")}
                </p>
              )}
              {hasAddress && (
                <p className="text-sm text-neutral-45">
                  {hasLocation ? `Address: ${user.address}` : user.address}
                </p>
              )}
            </>
          );
        })()}
      </div>
    ),

    registeredOn: formatDate(user.createdAt),

    referralInfo: (
      <div className="space-y-2">
        <p>Referred User: {user.referralCount || 0}</p>
        <p>
          Referral Code:{" "}
          <span className="font-semibold">{user.referralCode || "N/A"}</span>
        </p>
        <button
          onClick={() => {
            setSelectedUSerName(user.name);
            setSelectedUserId(user._id);
            setIsReferralListModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-10 bg-primary-10/10 rounded-lg hover:bg-primary-10/20 transition-colors cursor-pointer"
        >
          <Eye size={14} />
          View Referrals
        </button>
      </div>
    ),
    role: (
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 text-xs rounded-full bg-primary-10 text-white capitalize">
          {user.role}
        </span>
        {user?.role === "admin" || user?.role === "moderator" ? (
          <IconButtonWithToolTip
            Icon={FileText}
            tooltip="Assign Page"
            onClick={() => {
              setSelectedUserId(user._id);
              setSelectedUSerName(user.name);
              setIsAssignPageModalOpen(true);
            }}
            textColor="text-primary-10"
          />
        ) : (
          ""
        )}
      </div>
    ),

    status: (
      <div className="flex items-center gap-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            user.isSuspended
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {user.isSuspended ? "Suspended" : "Active"}
        </span>
        {user?.isSuspended && (
          <IconButtonWithToolTip
            Icon={Info}
            tooltip="Suspension Reason"
            onClick={() => {
              setReason(user.suspensionReason);
              setIsDeleteOrSuspensionReasonModalOpen(true);
            }}
            textColor="text-neutral-5"
          />
        )}
      </div>
    ),
  }));

  const handleActiveTutor = async (id: string) => {
    try {
      await toast.promise(activeUser(id).unwrap(), {
        loading: "Loading...",
        success: "User re-activated successfully!",
        error: "Failed to reactivate user. Please try again.",
      });
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to reactivate user. Please try again.",
      );
    }
  };

  const handleRestoreDeletedAccount = async (id: string) => {
    try {
      await toast.promise(restoreDeletedAccount(id).unwrap(), {
        loading: "Please wait...",
        success: "Account restored successfully!",
        error: "Failed. Please try again.",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed. Please try again.");
    }
  };

  const userActions: any[] = [
    {
      label: "View Profile",
      icon: <Eye className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        navigate(`/dashboard/user/${row?._id}`)
      },
    },
    {
      label: "Suspend User",
      icon: <UserX className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        setSelectedUserId(row._id);
        setIsSuspendUserModalOpen(true);
      },
    },
    {
      label: "Activate User",
      icon: <UserCheck className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        handleActiveTutor(row._id);
      },
    },
    {
      label: "Restore Account",
      icon: <RotateCcw className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        handleRestoreDeletedAccount(row._id);
      },
    },
  ];

  const statues = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Suspended",
      value: "true",
    },
  ];

  const lifeTimePremiumMemberFilters = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Premium Members",
      value: "true",
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
          <option key={status?.label} value={status?.value}>
            {status?.label}
          </option>
        ))}
      </select>
      <select
        value={premiumUnlocked ?? ""}
        onChange={(e) => setPremiumUnlocked(e.target.value)}
        className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
      >
        <option value="">Select Membership </option>
        {lifeTimePremiumMemberFilters?.map((filter: any) => (
          <option key={filter?.label} value={filter?.value}>
            {filter?.label}
          </option>
        ))}
      </select>
    </div>
  );

  const handleSearch = (k: string) => {
    setKeyword(k);
  };
  return (
    <div className="">
      <Table<any>
        title={`All Registered Users (${users.length})`}
        description="Manage all registered users of the platform."
        theads={userTheads}
        data={userTableData}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        limit={limit}
        setLimit={setLimit}
        children={children}
        actions={userActions}
      />

      <SuspendUserModal
        selectedUserId={selectedUserId}
        isSuspendUserModalOpen={isSuspendUserModalOpen}
        setIsSuspendUserModalOpen={setIsSuspendUserModalOpen}
      />

      {isReferralListModalOpen && (
        <ReferralList
          userName={selectedUSerName}
          userId={selectedUserId}
          isReferralListModalOpen={isReferralListModalOpen}
          setIsReferralListModalOpen={setIsReferralListModalOpen}
        />
      )}

      {isDeleteOrSuspensionReasonModalOpen && (
        <AccountDeleteReason
          isDeleteOrSuspensionReasonModalOpen={
            isDeleteOrSuspensionReasonModalOpen
          }
          setIsDeleteOrSuspensionReasonModalOpen={
            setIsDeleteOrSuspensionReasonModalOpen
          }
          reason={reason}
        />
      )}

      {isAssignPageModalOpen && (
        <AssignPage
          isAssignPageModalOpen={isAssignPageModalOpen}
          setIsAssignPageModalOpen={setIsAssignPageModalOpen}
          userId={selectedUserId}
          userName={selectedUSerName}
        />
      )}
    </div>
  );
};

export default Users;
