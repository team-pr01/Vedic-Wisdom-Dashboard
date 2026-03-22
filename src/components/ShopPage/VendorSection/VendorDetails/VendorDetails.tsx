import {
  useGetSingleVendorByIdQuery,
  useUpdateVendorStatusMutation,
} from "../../../../redux/Features/Shop/vendorApi";
import Loader from "../../../Reusable/Loader/Loader";
import Button from "../../../Reusable/Button/Button";
import { useState } from "react";
import {
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "../../../../utils/formatDate";
import { Link, useNavigate, useParams } from "react-router-dom";
import SuspendVendorModal from "../SuspendVendorModal/SuspendVendorModal";

const VendorDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGetSingleVendorByIdQuery(id);
  const vendorDetails = data?.data || {};

  const [updateVendorStatus, { isLoading: isUpdatingStatus }] =
    useUpdateVendorStatusMutation();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSuspendVendorModalOpen, setIsSuspendVendorModalOpen] =
    useState(false);

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "approved":
        return {
          label: "Approved",
          className: "bg-green-100 text-green-700 border-green-200",
          icon: CheckCircle,
          iconColor: "text-green-500",
        };
      case "pending":
        return {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-700 border-yellow-200",
          icon: Clock,
          iconColor: "text-yellow-500",
        };
      case "rejected":
        return {
          label: "Rejected",
          className: "bg-red-100 text-red-700 border-red-200",
          icon: XCircle,
          iconColor: "text-red-500",
        };
      case "suspended":
        return {
          label: "Suspended",
          className: "bg-orange-100 text-orange-700 border-orange-200",
          icon: AlertCircle,
          iconColor: "text-orange-500",
        };
      default:
        return {
          label: "Applied",
          className: "bg-blue-100 text-blue-700 border-blue-200",
          icon: Clock,
          iconColor: "text-blue-500",
        };
    }
  };

  const statusConfig = getStatusConfig(vendorDetails.status);
  const StatusIcon = statusConfig.icon;

  const handleUpdateVendorStatus = async (status: string) => {
    try {
      const payload = { status };
      await toast.promise(updateVendorStatus({ id, data: payload }).unwrap(), {
        loading: "Loading...",
        success: "Status updated successfully!",
        error: "Failed to update status. Please try again.",
      });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const nextImage = () => {
    if (vendorDetails.documentUrls?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === vendorDetails.documentUrls.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (vendorDetails.documentUrls?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? vendorDetails.documentUrls.length - 1 : prev - 1,
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50 rounded-lg">
            <Loader size="lg" text="Loading vendor details..." />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-20 hover:text-white hover:bg-primary-10 rounded-lg transition-colors"
              title="Go back"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            {/* It's vendorId */}
            <Link to={`/dashboard/vendor-products/${id}`}>
              <Button
                label="View Products"
                variant="primary"
                className="px-2 py-2"
              />
            </Link>
          </div>
          {/* Status Banner */}
          <div
            className={`flex items-center gap-3 p-4 rounded-lg border ${statusConfig.className} mb-6`}
          >
            <StatusIcon size={24} className={statusConfig.iconColor} />
            <div>
              <p className="font-semibold text-neutral-10">Vendor Status</p>
              <p className="text-sm">{statusConfig.label}</p>
            </div>
          </div>

          {/* Document Images Gallery */}
          {vendorDetails.documentUrls &&
            vendorDetails.documentUrls.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-20 mb-2">
                  Documents & Certificates
                </label>
                <div className="relative h-64 rounded-xl overflow-hidden bg-neutral-100">
                  <img
                    src={vendorDetails.documentUrls[currentImageIndex]}
                    alt={`Document ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />

                  {vendorDetails.documentUrls.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
                      >
                        <ChevronLeft size={20} className="text-neutral-20" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
                      >
                        <ChevronRight size={20} className="text-neutral-20" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {vendorDetails.documentUrls.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {vendorDetails.documentUrls.map(
                      (url: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                            currentImageIndex === idx
                              ? "border-primary-10"
                              : "border-transparent hover:border-neutral-50"
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}

          {/* Shop Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              {[
                {
                  icon: Store,
                  iconSize: 24,
                  iconBg: true,
                  label: "Shop Name",
                  value: vendorDetails.shopName,
                  className: "text-lg font-semibold",
                },
                {
                  icon: User,
                  iconSize: 18,
                  label: "Owner Name",
                  value: vendorDetails.name,
                  className: "text-sm font-medium",
                },
                {
                  icon: Mail,
                  iconSize: 18,
                  label: "Email",
                  value: vendorDetails.email,
                  isLink: true,
                  linkType: "email",
                  className: "text-sm text-primary-10 hover:underline",
                },
              ].map((item, idx) => {
                const Icon = item.icon;

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${item.iconBg ? "p-4 bg-primary-10/5 rounded-lg" : ""}`}
                  >
                    <Icon
                      size={item.iconSize}
                      className="text-neutral-45 mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="text-xs text-neutral-45">{item.label}</p>
                      {item.isLink && item.linkType === "email" ? (
                        <a
                          href={`mailto:${item.value}`}
                          className={item.className}
                        >
                          {item.value || "—"}
                        </a>
                      ) : (
                        <p
                          className={
                            item.className || "text-sm text-neutral-10"
                          }
                        >
                          {item.value || "—"}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {[
                {
                  icon: MapPin,
                  iconSize: 18,
                  label: "Business Address",
                  value: vendorDetails.businessAddress,
                },
                {
                  icon: Globe,
                  iconSize: 18,
                  label: "Shop URL",
                  value: vendorDetails.shopUrl,
                  isLink: true,
                  linkType: "url",
                },
                {
                  icon: Calendar,
                  iconSize: 18,
                  label: "Registered On",
                  value: formatDate(vendorDetails.createdAt),
                },
                {
                  icon: Phone,
                  iconSize: 18,
                  label: "Phone Number",
                  value: vendorDetails.phoneNumber,
                  isLink: true,
                  linkType: "phone",
                },
              ].map((item, idx) => {
                const Icon = item.icon;

                const renderValue = () => {
                  if (!item.value)
                    return <p className="text-sm text-neutral-45">—</p>;

                  if (item.isLink) {
                    if (item.linkType === "url") {
                      return (
                        <a
                          href={item.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-10 hover:underline flex items-center gap-1"
                        >
                          {item.value}
                          <ExternalLink size={12} />
                        </a>
                      );
                    }
                    if (item.linkType === "phone") {
                      return (
                        <a
                          href={`tel:${item.value}`}
                          className="text-sm text-neutral-10 hover:text-primary-10"
                        >
                          {item.value}
                        </a>
                      );
                    }
                  }

                  return (
                    <p className="text-sm text-neutral-10">{item.value}</p>
                  );
                };

                return (
                  <div key={idx} className="flex items-start gap-3">
                    <Icon
                      size={item.iconSize}
                      className="text-neutral-45 mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="text-xs text-neutral-45">{item.label}</p>
                      {renderValue()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          {vendorDetails.description && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-neutral-20 mb-2 flex items-center gap-2">
                <FileText size={16} />
                About the Shop
              </h3>
              <p className="text-sm text-neutral-20 font-Roboto leading-relaxed bg-neutral-50/50 p-4 rounded-lg">
                {vendorDetails.description}
              </p>
            </div>
          )}

          {/* Suspension Details */}
          {vendorDetails.status === "suspended" &&
            vendorDetails.suspensionReason && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700">
                      Suspension Reason
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      {vendorDetails.suspensionReason}
                    </p>
                    {vendorDetails.suspendedAt && (
                      <p className="text-xs text-red-500 mt-2">
                        Suspended on: {formatDate(vendorDetails.suspendedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

          {/* Suspension Reason Modal */}
          {isSuspendVendorModalOpen && (
            <SuspendVendorModal
              isSuspendVendorModalOpen={isSuspendVendorModalOpen}
              setIsSuspendVendorModalOpen={setIsSuspendVendorModalOpen}
              vendorId={id as string}
            />
          )}

          {/* Action Buttons */}
          <div className="border-t border-neutral-50 pt-4 flex gap-3">
            <Button
              label="Approve"
              variant="primary"
              onClick={() => handleUpdateVendorStatus("approved")}
              isLoading={isUpdatingStatus}
              className="flex-1 bg-green-600 hover:bg-green-700"
            />
            <Button
              label="Reject"
              variant="secondary"
              onClick={() => handleUpdateVendorStatus("rejected")}
              isLoading={isUpdatingStatus}
              className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
            />
            {vendorDetails.status !== "suspended" && (
              <Button
                label="Suspend Vendor"
                variant="secondary"
                onClick={() => {
                  setIsSuspendVendorModalOpen(true);
                }}
                className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-50"
              />
            )}
            {vendorDetails.status === "suspended" && (
              <Button
                label="Withdraw Suspension"
                variant="secondary"
                onClick={() => {
                  handleUpdateVendorStatus("approved");
                }}
                className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-50"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
