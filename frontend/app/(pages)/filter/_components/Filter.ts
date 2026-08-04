export interface Product {
  id: string;
  slug: string;
  title: string;
  images: string[];
  price: number;
  discount: number; // percentage, 0 if none
  rating: number; // 0-5
  category: string; // e.g. "T-Shirts", "Jeans", "Hoodies"
  style: string; // e.g. "Casual", "Formal", "Party", "Gym"
  colors: string[]; // hex values, e.g. ["#000000", "#FFFFFF"]
  sizes: string[]; // e.g. ["S", "M", "L", "XL"]
}

export interface FilterState {
  categories: string[];
  styles: string[];
  colors: string[];
  sizes: string[];
  minPrice: number;
  maxPrice: number;
}

export const DEFAULT_FILTERS: FilterState = {
  categories: [],
  styles: [],
  colors: [],
  sizes: [],
  minPrice: 0,
  maxPrice: 500,
};
