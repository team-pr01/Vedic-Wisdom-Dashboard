export type TEmergency = {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  phoneNumber: string;
  location: string;
  message: string;
  status?: "pending" | "processing" | "resolved";
  resolvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};
