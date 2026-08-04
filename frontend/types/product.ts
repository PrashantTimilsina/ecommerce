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
export interface FilterState {
  categories: string[];
  colors: string[];
  sizes: string[];
  maxPrice: number;
}

export function getDefaultFilters(products: Product[]): FilterState {
  const highest = products.reduce((max, p) => Math.max(max, p.price), 0);
  return {
    categories: [],
    colors: [],
    sizes: [],
    maxPrice: highest > 0 ? highest : 500,
  };
}
