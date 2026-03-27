import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useGetSingleUserByIdQuery } from "../../redux/Features/User/userApi";
import Loader from "../../components/Reusable/Loader/Loader";
import Button from "../../components/Reusable/Button/Button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Star,
  Coins,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import SuspendUserModal from "../../components/UsersPage/SuspendUserModal/SuspendUserModal";
import { formatDate } from "../../utils/formatDate";

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSuspendUserModalOpen, setIsSuspendUserModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data, isLoading: isSingleUserDataLoading } =
    useGetSingleUserByIdQuery(id);
  const userDetails = data?.data || {};

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return {
          label: "Admin",
          className: "bg-purple-100 text-purple-700",
          icon: Shield,
        };
      case "moderator":
        return {
          label: "Moderator",
          className: "bg-blue-100 text-blue-700",
          icon: Shield,
        };
      default:
        return {
          label: "User",
          className: "bg-gray-100 text-gray-700",
          icon: User,
        };
    }
  };

  const getStatusBadge = () => {
    if (userDetails.isSuspended) {
      return {
        label: "Suspended",
        className: "bg-red-100 text-red-700",
        icon: XCircle,
      };
    }
    return {
      label: "Active",
      className: "bg-green-100 text-green-700",
      icon: CheckCircle,
    };
  };

  const roleConfig = getRoleBadge(userDetails.role);
  const RoleIcon = roleConfig.icon;
  const statusConfig = getStatusBadge();
  const StatusIcon = statusConfig.icon;

  const handleSuspend = () => {
    setSelectedUserId(userDetails?._id);
    setIsSuspendUserModalOpen(true);
  };

  if (isSingleUserDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading user details..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-10 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-20 hover:text-white hover:bg-primary-10 rounded-lg transition-colors mb-2"
          title="Go back"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Status */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-neutral-50 p-6 text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-10/10 mx-auto">
                  {userDetails.profilePicture ? (
                    <img
                      src={userDetails.profilePicture}
                      alt={userDetails.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={32} className="text-primary-10" />
                    </div>
                  )}
                </div>
              </div>
              <h2 className="text-xl font-bold text-neutral-10 mt-4">
                {userDetails.name}
              </h2>
              <p className="text-sm text-neutral-45 mt-1">
                {userDetails.email}
              </p>

              {/* Role Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mt-3 bg-gray-100 text-gray-700">
                <RoleIcon size={12} />
                {roleConfig.label}
              </div>

              {/* Status Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mt-2 ml-2 ${statusConfig.className}`}
              >
                <StatusIcon size={12} />
                {statusConfig.label}
              </div>

              {/* Suspend Button */}
              {!userDetails.isSuspended && (
                <div className="mt-4">
                  <Button
                    label="Suspend User"
                    variant="secondary"
                    onClick={handleSuspend}
                    className="w-full border-red-500 text-red-500 hover:bg-red-50"
                  />
                </div>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl border border-neutral-50 p-6">
              <h3 className="text-sm font-semibold text-neutral-20 mb-4">
                Account Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-primary-10" />
                    <span className="text-sm text-neutral-45">
                      Referral Count
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-neutral-10">
                    {userDetails.referralCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins size={16} className="text-yellow-500" />
                    <span className="text-sm text-neutral-45">Coins</span>
                  </div>
                  <span className="text-sm font-semibold text-neutral-10">
                    {userDetails.coins || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-purple-500" />
                    <span className="text-sm text-neutral-45">Premium</span>
                  </div>
                  <span
                    className={`text-sm font-semibold ${userDetails.premiumUnlocked ? "text-green-600" : "text-neutral-45"}`}
                  >
                    {userDetails.premiumUnlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-500" />
                    <span className="text-sm text-neutral-45">Plan</span>
                  </div>
                  <span className="text-sm font-semibold text-neutral-10 capitalize">
                    {userDetails.plan || "Free"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - User Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-neutral-50 p-6">
              <h3 className="text-lg font-semibold text-neutral-10 mb-4 font-Inter">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-neutral-45 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-45">Email</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-neutral-10">
                        {userDetails.email}
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(userDetails.email, "Email")
                        }
                        className="hover:text-primary-10"
                      >
                        <Copy size={12} className="text-neutral-45" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-neutral-45 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-45">Phone Number</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-neutral-10">
                        {userDetails.countryCode}{" "}
                        {userDetails.phoneNumber || "—"}
                      </p>
                      {userDetails.phoneNumber && (
                        <a
                          href={`tel:${userDetails.countryCode}${userDetails.phoneNumber}`}
                          className="hover:text-primary-10"
                        >
                          <ExternalLink size={12} className="text-neutral-45" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-neutral-45 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-45">Location</p>
                    <p className="text-sm text-neutral-10">
                      {[
                        userDetails.city,
                        userDetails.state,
                        userDetails.country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </p>
                    {userDetails.address && (
                      <p className="text-xs text-neutral-45 mt-1">
                        {userDetails.address}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-neutral-45 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-45">Joined</p>
                    <p className="text-sm text-neutral-10">
                      {formatDate(userDetails.createdAt)}
                    </p>
                  </div>
                </div>

                {userDetails.lastLoggedIn && (
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-neutral-45 mt-0.5" />
                    <div>
                      <p className="text-xs text-neutral-45">Last Login</p>
                      <p className="text-sm text-neutral-10">
                        {formatDate(userDetails.lastLoggedIn)}
                      </p>
                    </div>
                  </div>
                )}

                {userDetails.referralCode && (
                  <div className="flex items-start gap-3">
                    <Award size={18} className="text-neutral-45 mt-0.5" />
                    <div>
                      <p className="text-xs text-neutral-45">Referral Code</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-mono text-primary-10">
                          {userDetails.referralCode}
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              userDetails.referralCode,
                              "Referral code",
                            )
                          }
                          className="hover:text-primary-10"
                        >
                          <Copy size={12} className="text-neutral-45" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-white rounded-xl border border-neutral-50 p-6">
              <h3 className="text-lg font-semibold text-neutral-10 mb-4 font-Inter">
                Usage Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-neutral-45">AI Chat Daily</p>
                  <p className="text-xl font-bold text-neutral-10">
                    {userDetails.usage?.aiChatDaily || 0}
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-neutral-45">AI Recipes Monthly</p>
                  <p className="text-xl font-bold text-neutral-10">
                    {userDetails.usage?.aiRecipesMonthly || 0}
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-neutral-45">Vastu AI Monthly</p>
                  <p className="text-xl font-bold text-neutral-10">
                    {userDetails.usage?.vastuAiMonthly || 0}
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-neutral-45">Kundli Monthly</p>
                  <p className="text-xl font-bold text-neutral-10">
                    {userDetails.usage?.kundliMonthly || 0}
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-neutral-45">Muhurta Monthly</p>
                  <p className="text-xl font-bold text-neutral-10">
                    {userDetails.usage?.muhurtaMonthly || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Assigned Pages */}
            {userDetails.assignedPages &&
              userDetails.assignedPages.length > 0 && (
                <div className="bg-white rounded-xl border border-neutral-50 p-6">
                  <h3 className="text-lg font-semibold text-neutral-10 mb-4 font-Inter">
                    Assigned Pages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {userDetails.assignedPages.map(
                      (page: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-primary-10/10 text-primary-10 rounded-lg text-sm font-medium"
                        >
                          {page}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Suspend Modal */}
      <SuspendUserModal
        selectedUserId={selectedUserId}
        isSuspendUserModalOpen={isSuspendUserModalOpen}
        setIsSuspendUserModalOpen={setIsSuspendUserModalOpen}
      />
    </div>
  );
};

export default UserDetails;
