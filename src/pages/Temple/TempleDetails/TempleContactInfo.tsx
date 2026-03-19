/* eslint-disable @typescript-eslint/no-explicit-any */

import { Globe, Mail, Phone } from "lucide-react";
import { DetailSection, InfoRow } from "./TempleDetails";

const TempleContactInfo = ({ temple }: any) => {
  return (
    <DetailSection title="Contact Information">
      <div className="space-y-3">
        {temple.otherInfo?.phoneNumber && (
          <InfoRow
            label="Phone"
            value={temple.otherInfo.phoneNumber}
            icon={Phone}
          />
        )}
        {temple.otherInfo?.email && (
          <InfoRow label="Email" value={temple.otherInfo.email} icon={Mail} />
        )}
        {temple.otherInfo?.website && (
          <div className="flex items-start gap-2">
            <Globe size={16} className="text-neutral-45 mt-0.5" />
            <a
              href={temple.otherInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-10 hover:underline font-medium text-sm"
            >
              {temple.otherInfo.website}
            </a>
          </div>
        )}
      </div>
    </DetailSection>
  );
};

export default TempleContactInfo;
