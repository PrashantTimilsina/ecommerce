export type Review = {
  _id: string;
  user: {
    name: string;
    _id: string;
  } | null;
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
};
