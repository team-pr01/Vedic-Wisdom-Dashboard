
export type TVendor = {
  _id: string;
  userId: string;
  name: string;
  shopName: string;
  phoneNumber: string;
  email: string;
  documentUrls: string[];
  businessAddress: string;
  description: string;
  shopUrl: string;
  status: "applied" | "suspended" | "approved" | "rejected";
  suspensionReason?: string;
  suspendedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};