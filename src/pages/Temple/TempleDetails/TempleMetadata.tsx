/* eslint-disable @typescript-eslint/no-explicit-any */
import { Info } from "lucide-react";
import { formatDate } from "../../../utils/formatDate";
import { InfoCard } from "./TempleDetails";

const TempleMetadata = ({ temple }: any) => {
  return (
    <InfoCard icon={Info} title="Information">
      <div className="space-y-2 text-sm">
        <p className="text-neutral-45">
          Temple ID:{" "}
          <span className="text-neutral-10 font-mono">{temple._id}</span>
        </p>
        <p className="text-neutral-45">
          Created:{" "}
          <span className="text-neutral-10">
            {temple.createdAt && formatDate(temple.createdAt)}
          </span>
        </p>
      </div>
    </InfoCard>
  );
};

export default TempleMetadata;
