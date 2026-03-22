/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Table from "../../components/Reusable/Table/Table";
import { formatDate } from "../../utils/formatDate";
import { Eye, UserX, UserCheck, Trash2, RotateCcw, Info } from "lucide-react";
import ReferralList from "../../components/UsersPage/ReferralList/ReferralList";
import { useGetAllUsersQuery } from "../../redux/Features/User/userApi";
import AccountDeleteReason from "../../components/UsersPage/AccountDeleteReason/AccountDeleteReason";

const Users = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedUSerName, setSelectedUSerName] = useState<string>("");
  const [accountDeleteReason, setAccountDeleteReason] = useState<string>("");
  const [isReferralListModalOpen, setIsReferralListModalOpen] =
    useState<boolean>(false);
  const [isAccountDeleteReasonModalOpen, setIsAccountDeleteReasonModalOpen] =
    useState<boolean>(false);
  const { data, isLoading, isFetching } = useGetAllUsersQuery({
    skip,
    limit,
    keyword,
    status,
  });

  const users = data?.data?.data || [];

  console.log(data);
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
            <Info onClick={() => {
              setAccountDeleteReason(user.accountDeleteReason)
              setIsAccountDeleteReasonModalOpen(true)
            }} size={16} className="text-red-500 cursor-pointer" />
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
        <p className="capitalize font-semibold">
          Referred User: {user.referralCount || 0}
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
      <span className="px-3 py-1 text-xs rounded-full bg-primary-10 text-white capitalize">
        {user.role}
      </span>
    ),

    status: (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          user.isSuspended
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        {user.isSuspended ? "Suspended" : "Active"}
      </span>
    ),
  }));

  const userActions: any[] = [
    {
      label: "View Profile",
      icon: <Eye className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        console.log("View Profile:", row);
      },
    },
    {
      label: "Suspend User",
      icon: <UserX className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        console.log("Suspend User:", row);
      },
    },
    {
      label: "Activate User",
      icon: <UserCheck className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        console.log("Activate User:", row);
      },
    },
    {
      label: "Delete Account",
      icon: <Trash2 className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        console.log("Delete Account:", row);
      },
    },
    {
      label: "Restore Account",
      icon: <RotateCcw className="inline mr-2 size-4" />,
      onClick: (row: any) => {
        console.log("Restore Account:", row);
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
        limit={10}
        setLimit={setLimit}
        children={children}
        actions={userActions}
        onEditItem={(row: any) => {
          // setModalType("edit");
          // setRecipeId(row?._id);
          // setIsAddOrEditRecipeModalOpen(true);
        }}
        onDeleteItem={(row: any) => {
          // setRecipeId(row?._id);
          // setShowDeleteConfirmationModal(true);
        }}
      />

      {isReferralListModalOpen && (
        <ReferralList
          userName={selectedUSerName}
          userId={selectedUserId}
          isReferralListModalOpen={isReferralListModalOpen}
          setIsReferralListModalOpen={setIsReferralListModalOpen}
        />
      )}

      {isAccountDeleteReasonModalOpen && (
        <AccountDeleteReason
          isAccountDeleteReasonModalOpen={isAccountDeleteReasonModalOpen}
          setIsAccountDeleteReasonModalOpen={setIsAccountDeleteReasonModalOpen}
          reason={accountDeleteReason}
        />
      )}
    </div>
  );
};

export default Users;
