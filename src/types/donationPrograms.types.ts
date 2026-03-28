
export type TDonationPrograms = {
  _id: string;
  imageUrl?: string;
  title: string;
  description: string;
  currency: string;
  amountNeeded: number;
  amountRaised?: number;
  createdAt: Date;
  updatedAt: Date;
};