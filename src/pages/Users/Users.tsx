/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from "../../components/Reusable/Table/Table";
import { formatDate } from "../../utils/formatDate";
import { Eye, UserX, UserCheck, Trash2, RotateCcw } from "lucide-react";

const Users = () => {
  const userTheads: any[] = [
    { key: "userId", label: "User ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    { key: "registeredOn", label: "Registered On" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "isVerified", label: "Verified" },
  ];

  const users = [
    {
      _id: "1",
      userId: "USR001",
      name: "John Carter",
      email: "john@example.com",
      phone: "+8801712345678",
      city: "Dhaka",
      role: "Student",
      isVerified: true,
      isSuspended: false,
      createdAt: "2026-03-01",
    },
    {
      _id: "2",
      userId: "USR002",
      name: "Emily Watson",
      email: "emily@example.com",
      phone: "+8801812345678",
      city: "Chittagong",
      role: "Tutor",
      isVerified: false,
      isSuspended: true,
      createdAt: "2026-02-15",
    },
    {
      _id: "3",
      userId: "USR003",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+8801912345678",
      city: "Sylhet",
      role: "Student",
      isVerified: true,
      isSuspended: false,
      createdAt: "2026-01-10",
    },
  ];

  const userTableData = users.map((user) => ({
    _id: user._id,
    userId: user.userId,

    name: (
      <div>
        <p className="capitalize">{user.name}</p>
      </div>
    ),

    email: user.email,
    phone: user.phone,
    city: user.city,

    registeredOn: formatDate(user.createdAt),

    role: (
      <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
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

    isVerified: (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          user.isVerified
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
        }`}
      >
        {user.isVerified ? "Yes" : "No"}
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
  return (
    <div className="">
      <Table<any>
        title="All Registered Users"
        description="Manage all registered users of the platform."
        theads={userTheads}
        data={userTableData}
        totalPages={1}
        currentPage={1}
        onPageChange={() => {}}
        isLoading={false}
        onSearch={() => {}}
        actions={userActions}
        limit={10}
        setLimit={() => {}}
      />
    </div>
  );
};

export default Users;
