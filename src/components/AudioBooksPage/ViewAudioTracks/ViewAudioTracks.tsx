import { useState } from "react";
import Modal from "../../Reusable/Modal/Modal";
import Loader from "../../Reusable/Loader/Loader";
import AudioTrackCard from "../AudioTrackCard/AudioTrackCard";
import Button from "../../Reusable/Button/Button";
import AddAudioTrack from "../AddAudioTrack/AddAudioTrack";
import type { TAudioTrack } from "../../../types/audioTrack.types";
import NoData from "../../Reusable/NoData/NoData";

type TViewAudioTracksProps = {
  audioBookId: string;
  isViewAudioTracksModalOpen: boolean;
  setIsViewAudioTracksModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  data: TAudioTrack[];
};
const ViewAudioTracks: React.FC<TViewAudioTracksProps> = ({
  audioBookId,
  isViewAudioTracksModalOpen,
  setIsViewAudioTracksModalOpen,
  isLoading,
  data,
}) => {
  const [isAddAudioTrackModalOpen, setIsAddAudioTrackModalOpen] =
    useState<boolean>(false);
  return (
    <Modal
      isModalOpen={isViewAudioTracksModalOpen}
      setIsModalOpen={setIsViewAudioTracksModalOpen}
      heading={
        isAddAudioTrackModalOpen
          ? "Add Audio Track"
          : `Audio Tracks (${data?.length || 0})`
      }
    >
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
          <Loader size="lg" text="Please wait..." />
        </div>
      )}

      {!isAddAudioTrackModalOpen && (
        <div className="relative">
          {data?.length === 0 && !isLoading && (
            <NoData title="No Audio Tracks Found" />
          )}

          {/* Audio Tracks */}
          <div className="flex flex-col gap-4">
            {data?.map((track) => (
              <AudioTrackCard key={track?._id} track={track} />
            ))}
          </div>

          <div className="sticky bottom-0 flex justify-end">
            <Button
              label="Add"
              onClick={() => {
                setIsAddAudioTrackModalOpen(true);
              }}
              variant="primary"
            />
          </div>
        </div>
      )}

      {isAddAudioTrackModalOpen && (
        <AddAudioTrack
          audioBookId={audioBookId}
          setIsAddAudioTrackModalOpen={setIsAddAudioTrackModalOpen}
        />
      )}
    </Modal>
  );
};

export default ViewAudioTracks;
