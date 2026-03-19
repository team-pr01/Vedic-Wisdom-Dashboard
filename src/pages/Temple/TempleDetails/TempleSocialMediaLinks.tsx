/* eslint-disable @typescript-eslint/no-explicit-any */

import { Facebook, Instagram, Linkedin, Share2 } from "lucide-react";
import { InfoCard } from "./TempleDetails";
import { Youtube } from 'lucide-react';

const TempleSocialMediaLinks = ({ temple }: any) => {
  return (
    <InfoCard icon={Share2} title="Social Media">
      <div className="space-y-2">
        {temple.socialMedia.facebook && (
          <a
            href={temple.socialMedia.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            <Facebook size={16} className="text-blue-600" />
            <span className="text-sm text-neutral-10">Facebook</span>
          </a>
        )}
        {temple.socialMedia.youtube && (
          <a
            href={temple.socialMedia.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            <Youtube size={16} className="text-red-500" />
            <span className="text-sm text-neutral-10">YouTube</span>
          </a>
        )}
        {temple.socialMedia.instagram && (
          <a
            href={temple.socialMedia.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            <Instagram size={16} className="text-pink-500" />
            <span className="text-sm text-neutral-10">Instagram</span>
          </a>
        )}
        {temple.socialMedia.linkedin && (
          <a
            href={temple.socialMedia.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            <Linkedin size={16} className="text-blue-700" />
            <span className="text-sm text-neutral-10">LinkedIn</span>
          </a>
        )}
      </div>
    </InfoCard>
  );
};

export default TempleSocialMediaLinks;
