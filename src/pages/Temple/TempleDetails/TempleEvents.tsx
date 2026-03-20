import { Calendar, Image as ImageIcon } from "lucide-react";
import type { TEvent } from "../../../types/temple.types";
import { formatDate } from "../../../utils/formatDate";
import { DetailSection } from "./TempleDetails";
import NoData from "../../../components/Reusable/NoData/NoData";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useDeleteEventMutation } from "../../../redux/Features/Temple/templeApi";

interface TempleEventsProps {
  events?: TEvent[];
  templeId: string;
}

// Event Card Component
const EventCard = ({ event }: { event: TEvent }) => {
  const [deleteEvent] = useDeleteEventMutation();
  const handleDeleteEvent = async () => {

    try {
      await toast.promise(deleteEvent({templeId, eventId:event?._id}).unwrap(), {
        loading: "Loading...",
        success: "Event deleted successfully!",
        error: "Failed to delete event. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };
  return (
    <div className="bg-white rounded-lg p-5 hover:shadow-md transition-shadow border border-neutral-50">
      {/* Event Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-neutral-10 font-Inter text-lg">
          {event.name}
        </h4>

        {/* Delete Button */}
        <button onClick={handleDeleteEvent} className="text-red-500 hover:text-red-600">
          <Trash size={20} />
        </button>
      </div>

      {/* Event Date */}
      <div className="flex items-center gap-2 text-neutral-45 mb-3">
        <Calendar size={16} />
        <span className="text-sm font-medium">{formatDate(event.date)}</span>
      </div>

      {/* Event Description */}
      <p className="text-sm text-neutral-20 font-Roboto mb-4 leading-relaxed">
        {event.description}
      </p>

      {/* Event Images */}
      {event.imageUrls && event.imageUrls.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon size={16} className="text-primary-10" />
            <span className="text-xs font-medium text-neutral-45">
              {event.imageUrls.length} photo
              {event.imageUrls.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-4 gap-2">
            {event.imageUrls.slice(0, 4).map((url, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => window.open(url, "_blank")}
              >
                <img
                  src={url}
                  alt={`${event.name} - ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {idx === 3 && event.imageUrls.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      +{event.imageUrls.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
const TempleEvents = ({ events, templeId }: TempleEventsProps) => {
  if (!events || events.length === 0) {
    return (
      <DetailSection title="Events">
        <NoData
          title="No Events"
          message="No events have been scheduled for this temple yet."
        />
      </DetailSection>
    );
  }

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events
    .filter((event) => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <DetailSection title="Events">
      <div className="space-y-8">
        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-primary-10 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-10 rounded-full"></span>
              Upcoming Events ({upcomingEvents.length})
            </h4>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <EventCard key={`upcoming-${index}`} event={event} templeId={templeId} />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-neutral-45 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-neutral-45 rounded-full"></span>
              Past Events ({pastEvents.length})
            </h4>
            <div className="space-y-4">
              {pastEvents.slice(0, 3).map((event, index) => (
                <EventCard key={`past-${index}`} event={event} />
              ))}
              {pastEvents.length > 3 && (
                <div className="text-center py-3 bg-neutral-50/50 rounded-lg">
                  <p className="text-sm text-neutral-45">
                    +{pastEvents.length - 3} more past events
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DetailSection>
  );
};

export default TempleEvents;
