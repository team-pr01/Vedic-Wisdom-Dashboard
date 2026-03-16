import { useState } from "react";
import Modal from "../../Reusable/Modal/Modal";
import Loader from "../../Reusable/Loader/Loader";
import AudioTrackCard from "../AudioTrackCard/AudioTrackCard";
import Button from "../../Reusable/Button/Button";
import AddAudioTrack from "../AddAudioTrack/AddAudioTrack";

type TViewAudioTracksProps = {
  isViewAudioTracksModalOpen: boolean;
  setIsViewAudioTracksModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
};
const ViewAudioTracks: React.FC<TViewAudioTracksProps> = ({
  isViewAudioTracksModalOpen,
  setIsViewAudioTracksModalOpen,
  isLoading,
  data,
}) => {
  const [isAddAudioTrackModalOpen, setIsAddAudioTrackModalOpen] =
    useState<boolean>(false);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  const handlePlayPause = (trackId: string) => {
    setPlayingTrack(playingTrack === trackId ? null : trackId);
  };
  return (
    <Modal
      isModalOpen={isViewAudioTracksModalOpen}
      setIsModalOpen={setIsViewAudioTracksModalOpen}
      heading={isAddAudioTrackModalOpen ? "Add Audio Track" : "Audio Tracks"}
    >
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/30 z-50">
            <Loader size="lg" text="Please wait..." />
          </div>
        )}
      </div>

      {!isAddAudioTrackModalOpen && (
        <div className="relative">
          {/* Audio Tracks */}
          <div className="flex flex-col gap-4">
            {data?.map((track) => (
              <AudioTrackCard
                key={track.id}
                title={track.title}
                artist={track.artist}
                duration={track.duration}
                isPlaying={playingTrack === track.id}
                onPlayPause={() => handlePlayPause(track.id)}
              />
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
          setIsAddAudioTrackModalOpen={setIsAddAudioTrackModalOpen}
        />
      )}
    </Modal>
  );
};

export default ViewAudioTracks;
