export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export type AdminProduct = {
  _id: string;
  title: string;
  category: string;
  price: number;
  discount: number;
  stock: number;
  rating: number;
  numReviews: number;
  status: "active" | "draft" | "archived";
  createdAt: string;
  image: string;
};

export const dummyUsers: AdminUser[] = [
  {
    _id: "u_1a2b3c4d",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    role: "user",
    createdAt: "2024-02-14T09:00:00.000Z",
  },
  {
    _id: "u_2b3c4d5e",
    name: "Sneha Karki",
    email: "sneha.karki@example.com",
    role: "user",
    createdAt: "2024-03-22T09:00:00.000Z",
  },
  {
    _id: "u_3c4d5e6f",
    name: "David Gurung",
    email: "david.gurung@example.com",
    role: "user",
    createdAt: "2024-04-05T09:00:00.000Z",
  },
  {
    _id: "u_4d5e6f70",
    name: "Priya Thapa",
    email: "priya.thapa@example.com",
    role: "user",
    createdAt: "2023-11-18T09:00:00.000Z",
  },
  {
    _id: "u_5e6f7081",
    name: "Rahul Rai",
    email: "rahul.rai@example.com",
    role: "user",
    createdAt: "2024-06-30T09:00:00.000Z",
  },
  {
    _id: "u_6f708192",
    name: "Emily Shrestha",
    email: "emily.shrestha@example.com",
    role: "admin",
    createdAt: "2023-01-09T09:00:00.000Z",
  },
  {
    _id: "u_708192a3",
    name: "John Bista",
    email: "john.bista@example.com",
    role: "user",
    createdAt: "2024-08-12T09:00:00.000Z",
  },
  {
    _id: "u_8192a3b4",
    name: "Maya Lama",
    email: "maya.lama@example.com",
    role: "user",
    createdAt: "2023-09-27T09:00:00.000Z",
  },
];

export const dummyProducts: AdminProduct[] = [
  {
    _id: "p_aaa111bbb",
    title: "Classic Cotton T-Shirt",
    category: "T-Shirts",
    price: 24.99,
    discount: 10,
    stock: 120,
    rating: 4.5,
    numReviews: 210,
    status: "active",
    createdAt: "2024-01-15",
    image: "https://picsum.photos/seed/tshirt/100/100",
  },
  {
    _id: "p_bbb222ccc",
    title: "Slim Fit Jeans",
    category: "Jeans",
    price: 59.99,
    discount: 20,
    stock: 45,
    rating: 4.2,
    numReviews: 132,
    status: "active",
    createdAt: "2024-02-02",
    image: "https://picsum.photos/seed/jeans/100/100",
  },
  {
    _id: "p_ccc333ddd",
    title: "Leather Biker Jacket",
    category: "Jackets",
    price: 149.99,
    discount: 0,
    stock: 18,
    rating: 4.8,
    numReviews: 89,
    status: "active",
    createdAt: "2023-12-20",
    image: "https://picsum.photos/seed/jacket/100/100",
  },
  {
    _id: "p_ddd444eee",
    title: "Wool Winter Overcoat",
    category: "Coats",
    price: 189.99,
    discount: 25,
    stock: 9,
    rating: 4.7,
    numReviews: 54,
    status: "draft",
    createdAt: "2024-03-11",
    image: "https://picsum.photos/seed/coat/100/100",
  },
  {
    _id: "p_eee555fff",
    title: "Running Sneakers",
    category: "Footwear",
    price: 79.99,
    discount: 15,
    stock: 66,
    rating: 4.4,
    numReviews: 301,
    status: "active",
    createdAt: "2024-02-28",
    image: "https://picsum.photos/seed/shoes/100/100",
  },
  {
    _id: "p_fff666000",
    title: "Canvas Tote Bag",
    category: "Accessories",
    price: 19.99,
    discount: 5,
    stock: 200,
    rating: 4.0,
    numReviews: 77,
    status: "active",
    createdAt: "2024-04-09",
    image: "https://picsum.photos/seed/bag/100/100",
  },
  {
    _id: "p_000777111",
    title: "Polarized Sunglasses",
    category: "Accessories",
    price: 45.0,
    discount: 0,
    stock: 34,
    rating: 3.9,
    numReviews: 45,
    status: "archived",
    createdAt: "2023-10-03",
    image: "https://picsum.photos/seed/sunglasses/100/100",
  },
  {
    _id: "p_111888222",
    title: "Woolen Beanie Hat",
    category: "Accessories",
    price: 14.99,
    discount: 30,
    stock: 0,
    rating: 4.1,
    numReviews: 63,
    status: "draft",
    createdAt: "2024-05-17",
    image: "https://picsum.photos/seed/beanie/100/100",
  },
];

export const revenueData = [
  { month: "Jan", revenue: 12500, orders: 320 },
  { month: "Feb", revenue: 14800, orders: 385 },
  { month: "Mar", revenue: 13200, orders: 340 },
  { month: "Apr", revenue: 17900, orders: 452 },
  { month: "May", revenue: 16400, orders: 418 },
  { month: "Jun", revenue: 21300, orders: 540 },
  { month: "Jul", revenue: 19800, orders: 501 },
  { month: "Aug", revenue: 24500, orders: 612 },
  { month: "Sep", revenue: 23100, orders: 588 },
  { month: "Oct", revenue: 26700, orders: 677 },
  { month: "Nov", revenue: 31200, orders: 790 },
  { month: "Dec", revenue: 35800, orders: 903 },
];

export const categorySales = [
  { name: "T-Shirts", value: 4200 },
  { name: "Jeans", value: 2800 },
  { name: "Jackets", value: 1900 },
  { name: "Footwear", value: 3300 },
  { name: "Accessories", value: 1500 },
];

export const dummyAdminCredentials = {
  email: "admin@shop.co",
  password: "admin123",
};
