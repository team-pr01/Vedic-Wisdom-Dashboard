
export type TReels = {
  _id: string;
  title: string;
  description: string;
  videoSource: string;
  videoUrl: string;
  category: string;
  likes?: number;
  likedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
};