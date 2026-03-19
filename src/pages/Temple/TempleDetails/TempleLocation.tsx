/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExternalLink, Map, MapPin } from "lucide-react";
import { DetailSection } from "./TempleDetails";

const TempleLocation = ({temple} : any) => {
    return (
        <DetailSection title="Location">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-primary-10 mt-1" />
                    <div>
                      <p className="text-neutral-10 font-medium">
                        {temple?.location.address}
                      </p>
                      <p className="text-neutral-45 text-sm mt-1">
                        {temple?.location.area && `${temple?.location.area}, `}
                        {temple?.location.city}, {temple?.location.state},{" "}
                        {temple?.location.country}
                      </p>
                    </div>
                  </div>

                  {temple?.location.googleMapUrl && (
                    <a
                      href={temple?.location.googleMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary-10 hover:text-primary-10/80 text-sm font-medium mt-2"
                    >
                      <Map size={16} />
                      View on Google Maps
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </DetailSection>
    );
};

export default TempleLocation;