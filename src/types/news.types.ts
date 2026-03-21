
export type TNewsTranslation = {
  title: string;
  content: string;
  tags: string[];
};

export type TNews = {
  _id: string;
  imageUrl: string;
  title: string;
  content: string;
  tags: string[];
  languages : string[];
  translations: Map<string, TNewsTranslation>;
  category: string;
  likes?: number;
  likedBy?: string;
  views?: number;
  viewedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};