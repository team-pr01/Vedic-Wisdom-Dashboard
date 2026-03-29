
export type TConsultation = {
  _id: string;
  userId: {
    name: string;
    email: string;
    phoneNumber?: string;
  };
  consultationId: string;
  consultantId: {
    name: string;
    email: string;
    phoneNumber: string;
    category: string;
  };
  concern?: string;
  scheduledAt?: string;
  meetingLink?: string;
  status?: "pending" | "scheduled" | "closed" | "cancelled";
  createdAt?: string;
  updatedAt?: string;
};
