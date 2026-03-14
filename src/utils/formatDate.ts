// utils/formatDate.ts
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);

  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString("en-US", { month: "short" }); // e.g. "Jan", "Feb", etc.

  return `${day} ${month}, ${year}`;
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }); // Dec, Jan, Feb
  const year = date.getFullYear();

  let hours: number | string = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // convert 0,13,14.. → 12-hour format
  hours = hours.toString().padStart(2, "0");

  return `${day} ${month}, ${year} | ${hours}:${minutes} ${ampm}`;
};
