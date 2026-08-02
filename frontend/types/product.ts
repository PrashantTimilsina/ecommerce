export type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  category: string;
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  numReviews: number;
  stock: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  slug: string;
};
export type AddToCartPayload = {
  product: string;
  quantity: number;
  size: string;
  color: string;
  image: string;
  price: number;
};
