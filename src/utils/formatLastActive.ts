import { format, isToday, isYesterday } from "date-fns";

export const getStatusText = (isGroup: boolean, isOnline: boolean, lastActiveAt?: string) => {
  if (isGroup) return ""; // Groups don't show online status
  if (isOnline) return "Online";
  if (!lastActiveAt) return "Offline";

  const date = new Date(lastActiveAt);
  
  const timeString = format(date, "h:mm a"); // e.g., 10:30 PM
  
  if (isToday(date)) {
    return `Last active today at ${timeString}`;
  }
  
  if (isYesterday(date)) {
    return `Last active yesterday at ${timeString}`;
  }
  
  return `Last active ${format(date, "dd/MM/yyyy")}`;
};