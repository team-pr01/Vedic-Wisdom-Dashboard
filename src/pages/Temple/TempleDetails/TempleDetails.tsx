/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../../components/Reusable/Loader/Loader";
import { useGetSingleTempleByIdQuery } from "../../../redux/Features/Temple/templeApi";
import NoData from "../../../components/Reusable/NoData/NoData";
import Button from "../../../components/Reusable/Button/Button";
import QuickStats from "./QuickStats";
import TempleDetailsHeader from "./TempleDetailsHeader";
import TempleLocation from "./TempleLocation";
import TempleContactInfo from "./TempleContactInfo";
import TempleMediaGallery from "./TempleMediaGallery";
import TempleSocialMediaLinks from "./TempleSocialMediaLinks";
import TempleMetadata from "./TempleMetadata";

// Info Card Component
export const InfoCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg border border-neutral-50 p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 bg-primary-10/10 rounded-lg">
        <Icon size={20} className="text-primary-10" />
      </div>
      <h3 className="font-semibold text-neutral-10 font-Inter">{title}</h3>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

// Info Row Component
export const InfoRow = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string;
  icon?: any;
}) => (
  <div className="flex items-start gap-2 text-sm">
    {Icon && <Icon size={16} className="text-neutral-45 mt-0.5" />}
    <div className="flex-1">
      <span className="text-neutral-45 font-Roboto">{label}:</span>
      <span className="ml-2 text-neutral-10 font-medium font-Roboto">
        {value || "—"}
      </span>
    </div>
  </div>
);

// Detail Section Component
export const DetailSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-neutral-10 font-Inter mb-4">
      {title}
    </h2>
    <div className="bg-white rounded-xl border border-neutral-50 p-6">
      {children}
    </div>
  </div>
);

const TempleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetSingleTempleByIdQuery(id!);

  const temple = data?.data || {};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading temple details..." />
      </div>
    );
  }

  if (error || !temple) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <NoData
          icon="alert"
          title="Temple Not Found"
          message="The temple you're looking for doesn't exist or has been removed."
        >
          <Button
            label="Back to Temples"
            variant="primary"
            onClick={() => navigate("/temples")}
            className="mt-4"
          />
        </NoData>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="">
        <TempleDetailsHeader temple={temple} templeId={id!} />

        {/* Main Content */}
        <div className="">
          {/* Quick Stats */}
          <QuickStats temple={temple} />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Info & Location */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <DetailSection title="About">
                <p className="text-neutral-20 font-Roboto leading-relaxed">
                  {temple.basicInfo.description}
                </p>
              </DetailSection>

              {/* Location Details */}
              <TempleLocation temple={temple} />

              {/* Contact Information */}
              {(temple.otherInfo?.phoneNumber ||
                temple.otherInfo?.email ||
                temple.otherInfo?.website) && (
                <TempleContactInfo temple={temple} />
              )}
            </div>

            <div className="space-y-6">
              {/* Right Column - Sidebar Info */}
            <TempleMediaGallery temple={temple} />

            {/* Social Media Links */}
            {temple.socialMedia &&
              Object.values(temple.socialMedia).some(Boolean) && (
                <TempleSocialMediaLinks temple={temple} />
              )}

            {/* Metadata */}
            <TempleMetadata temple={temple} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleDetails;
