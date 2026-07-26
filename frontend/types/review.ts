export type Review = {
  _id: string;
  user: {
    name: string;
  };
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
};
