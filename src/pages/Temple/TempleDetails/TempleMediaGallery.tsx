/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageIcon } from "lucide-react";
import { InfoCard } from "./TempleDetails";

const TempleMediaGallery = ({ temple }: any) => {
  return (
    <InfoCard icon={ImageIcon} title="Gallery">
      <div className="grid grid-cols-3 gap-2">
        {temple.media.imageUrls?.map((url: string, index: number) => (
          <img
            key={index}
            src={url}
            alt={`Temple ${index + 1}`}
            className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => {
              /* Open lightbox */
            }}
          />
        ))}
      </div>
    </InfoCard>
  );
};

export default TempleMediaGallery;
