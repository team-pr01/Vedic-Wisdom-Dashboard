
export type TConsultant = {
  _id: string;
  imageUrl?: string;
  name: string;
  email?:string;
  phoneNumber:string;
  specialties: string[];
  experience: string;
  category: string;
  fees: string;
  rating: string;
  createdAt: Date;
  updatedAt: Date;
};