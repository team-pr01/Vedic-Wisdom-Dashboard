/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Table from "../../components/Reusable/Table/Table";
import { ExternalLink, Eye } from "lucide-react";
import { useGetAllVendorsQuery } from "../../redux/Features/Shop/vendorApi";
import type { TVendor } from "../../types/vendor.types";
import { Link } from "react-router-dom";

const Vendors = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const { data, isLoading, isFetching } = useGetAllVendorsQuery({
    skip,
    limit,
    keyword,
    status,
  });

  const vendorTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "shopName", label: "Shop Name" },
    { key: "name", label: "Owner" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const vendors = data?.data?.data || [];

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "approved":
        return {
          label: "Approved",
          className: "bg-green-100 text-green-700 border-green-200",
          icon: "✓",
        };
      case "pending":
        return {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-700 border-yellow-200",
          icon: "⏳",
        };
      case "rejected":
        return {
          label: "Rejected",
          className: "bg-red-100 text-red-700 border-red-200",
          icon: "✗",
        };
      case "suspended":
        return {
          label: "Suspended",
          className: "bg-orange-100 text-orange-700 border-orange-200",
          icon: "⚠",
        };
      default:
        return {
          label: "Applied",
          className: "bg-blue-100 text-blue-700 border-blue-200",
          icon: "📝",
        };
    }
  };

  const vendorTableData = vendors?.map((vendor: TVendor, index: number) => {
    const statusConfig = getStatusConfig(vendor.status);

    return {
      _id: vendor._id,

      sl: index + 1,

      shopName: (
        <div>
          <p className="font-medium text-neutral-10 font-Inter line-clamp-2">
            {vendor.shopName}
          </p>
          {vendor.shopUrl && (
            <a
              href={vendor.shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-10 hover:underline flex items-center gap-1 mt-1"
            >
              <ExternalLink size={10} />
              Visit Shop
            </a>
          )}
        </div>
      ),

      name: <p className="text-sm text-neutral-10">{vendor.name}</p>,

      email: (
        <a
          href={`mailto:${vendor.email}`}
          className="text-sm text-primary-10 hover:underline"
        >
          {vendor.email}
        </a>
      ),

      phoneNumber: (
        <a
          href={`tel:${vendor.phoneNumber}`}
          className="text-sm text-neutral-10 hover:text-primary-10"
        >
          {vendor.phoneNumber}
        </a>
      ),

      status: (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}
        >
          <span>{statusConfig.icon}</span>
          {statusConfig.label}
        </span>
      ),

      actions: (
        <Link
          to={`/dashboard/vendor/${vendor._id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-10 bg-primary-10/10 rounded-lg hover:bg-primary-10/20 transition-colors"
        >
          <Eye size={14} />
          View Details
        </Link>
      ),
    };
  });

  const statuses = [
    { label: "Applied", value: "applied" },
    { label: "Suspended", value: "suspended" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  const children = (
    <div className="flex items-center gap-3">
      <select
        value={status ?? ""}
        onChange={(e) => setStatus(e.target.value)}
        className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
      >
        <option value="">Select Status </option>
        {statuses?.map((status: any) => (
          <option key={status} value={status?.value}>
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
    <div>
      <Table<any>
        title={`Vendors (${vendors?.length || 0})`}
        description="Manage all the vendors here."
        theads={vendorTheads}
        data={vendorTableData}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        limit={10}
        setLimit={setLimit}
        children={children}
      />
    </div>
  );
};

export default Vendors;
