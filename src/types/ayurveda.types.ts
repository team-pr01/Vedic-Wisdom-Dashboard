export type TAyurveda = {
  _id: string;
  title: string;
  category: string;
  videoSource: "youtube" | "facebook";
  videoUrl: string;
  duration: string;
  createdAt?: Date;
  updatedAt?: Date;
};