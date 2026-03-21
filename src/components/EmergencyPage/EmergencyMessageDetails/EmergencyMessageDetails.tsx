import { useGetSingleEmergencyByIdQuery } from "../../../redux/Features/Emergency/emergencyApi";
import {
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  CheckCircle,
  Calendar,
  ExternalLink,
  X,
} from "lucide-react";
import Loader from "../../Reusable/Loader/Loader";
import { getStatusConfig } from "../../../pages/Emergency/Emergency";

type TEmergencyMessageDetailsProps = {
  emergencyId: string;
  isEmergencyDetailsModalOpen: boolean;
  handleCloseDetails: () => void;
};

const EmergencyMessageDetails: React.FC<TEmergencyMessageDetailsProps> = ({
  emergencyId,
  isEmergencyDetailsModalOpen,
  handleCloseDetails,
}) => {
  const { data, isLoading } = useGetSingleEmergencyByIdQuery(emergencyId);
  const details = data?.data || {};

  const statusConfig = getStatusConfig(details.status);
  const StatusIcon = statusConfig.icon;

  // Format date
  const formatDate = (date?: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleString();
  };

  return (
    <div
      className={`${
        isEmergencyDetailsModalOpen ? "visible" : "invisible"
      } w-full h-screen fixed top-0 left-0 z-[9999] bg-neutral-5/60 backdrop-blur-xs flex items-center justify-center font-Nunito transition-all duration-500`}
    >
      <div
        className={`${
          isEmergencyDetailsModalOpen
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0"
        } w-[90%] sm:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[25%] h-fit max-h-[70vh] overflow-y-auto bg-white rounded-lg p-3 md:p-6 transition-all duration-300 relative`}
      >
        <div className="flex items-center justify-between w-full mb-5">
          <h1 className="text-base md:text-xl font-semibold ">
            Emergency Message Details
          </h1>
          <X className="text-lg cursor-pointer" onClick={handleCloseDetails} />
        </div>

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
              <Loader size="lg" text="Loading details..." />
            </div>
          )}

          <div className="space-y-6 mt-4">
            {/* Status Banner */}
            <div
              className={`flex items-center gap-3 p-4 rounded-lg border ${statusConfig.className}`}
            >
              <StatusIcon size={24} className={statusConfig.iconColor} />
              <div>
                <p className="font-semibold text-neutral-10">Current Status</p>
                <p className="text-sm">{statusConfig.label}</p>
              </div>
            </div>

            {/* User Information Section */}
            <div className="border border-neutral-50 rounded-lg p-4">
              <h3 className="text-md font-semibold text-neutral-10 mb-4 flex items-center gap-2">
                <User size={18} className="text-primary-10" />
                User Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User size={16} className="text-neutral-45 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-45">Name</p>
                    <p className="text-sm font-medium text-neutral-10">
                      {details.userId?.name || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-neutral-45 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-45">Email</p>
                    <a
                      href={`mailto:${details.userId?.email}`}
                      className="text-sm font-medium text-primary-10 hover:underline"
                    >
                      {details.userId?.email || "—"}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="border border-neutral-50 rounded-lg p-4">
              <h3 className="text-md font-semibold text-neutral-10 mb-4 flex items-center gap-2">
                <Phone size={18} className="text-primary-10" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-neutral-45 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-45">Phone Number</p>
                    <a
                      href={`tel:${details.phoneNumber}`}
                      className="text-sm font-medium text-primary-10 hover:underline"
                    >
                      {details.phoneNumber || "—"}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-neutral-45 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-45">Location</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-neutral-10">
                        {details.location || "—"}
                      </p>
                      {details.location && (
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(details.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-10 hover:underline"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Section */}
            <div className="border border-neutral-50 rounded-lg p-4">
              <h3 className="text-md font-semibold text-neutral-10 mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-primary-10" />
                Emergency Message
              </h3>
              <div className="bg-neutral-50/50 rounded-lg p-4">
                <p className="text-sm text-neutral-20 leading-relaxed whitespace-pre-wrap">
                  {details.message || "No message provided"}
                </p>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="border border-neutral-50 rounded-lg p-4">
              <h3 className="text-md font-semibold text-neutral-10 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-primary-10" />
                Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-neutral-45 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-45">Created At</p>
                    <p className="text-sm text-neutral-10">
                      {formatDate(details.createdAt)}
                    </p>
                  </div>
                </div>
                {details.resolvedAt && (
                  <div className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-green-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-neutral-45">Resolved At</p>
                      <p className="text-sm text-neutral-10">
                        {formatDate(details.resolvedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMessageDetails;
