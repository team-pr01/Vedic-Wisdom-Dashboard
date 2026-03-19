/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar, Clock, Map, Users } from "lucide-react";

const QuickStats = ({temple} : any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-8">
      <div className="bg-white rounded-lg border border-neutral-50 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Calendar size={20} className="text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-neutral-45">Established</p>
            <p className="font-semibold text-neutral-10">
              {temple?.otherInfo?.establishedYear || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-50 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Clock size={20} className="text-green-500" />
          </div>
          <div>
            <p className="text-xs text-neutral-45">Visiting Hours</p>
            <p className="font-semibold text-neutral-10">
              {temple?.otherInfo?.visitingHours || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-50 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Users size={20} className="text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-neutral-45">Category</p>
            <p className="font-semibold text-neutral-10 capitalize">
              {temple?.category}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-50 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-lg">
            <Map size={20} className="text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-neutral-45">Location</p>
            <p className="font-semibold text-neutral-10 truncate">
              {temple?.location.city}, {temple?.location.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
