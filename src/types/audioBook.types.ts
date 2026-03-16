export type TAudioBook = {
  _id: string;
  thumbnailUrl: string;
  name: string;
  description: string;
  isPremium: boolean;

  createdAt?: Date;
  updatedAt?: Date;
};