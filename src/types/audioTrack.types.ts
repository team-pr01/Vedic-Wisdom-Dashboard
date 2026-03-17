
export type TAudioTrack = {
  _id : string
  audioBookId: string;
  title: string;
  url: string;
  duration: string;
  order: number;
  createdAt: Date;
  updatedAt?: Date;
};