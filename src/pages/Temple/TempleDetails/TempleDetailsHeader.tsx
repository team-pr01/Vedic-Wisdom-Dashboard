/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft } from "lucide-react";
import Button from "../../../components/Reusable/Button/Button";
import { useNavigate } from "react-router-dom";

const TempleDetailsHeader = ({ temple, templeId }: any) => {
  const navigate = useNavigate();
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-neutral-20" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-10 font-Inter capitalize">
                {temple.basicInfo.templeName}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(temple.status)}`}
              >
                {temple.status || "draft"}
              </span>
            </div>
            <p className="text-sm text-neutral-45 font-Roboto mt-1">
              Main Deity: {temple.basicInfo.mainDeity}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            label="Edit"
            variant="primary"
            onClick={() => navigate(`/temples/edit/${templeId}`)}
          />
          <Button
            label="Delete"
            variant="secondary"
            className="text-red-500 hover:bg-red-50 border-red-200"
          />
        </div>
      </div>
    </div>
  );
};

export default TempleDetailsHeader;
