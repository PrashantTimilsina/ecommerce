import END_POINTS from "@/constants/endpoints";
import { getToken, myFetch } from "@/lib/api";

export type ApiCartItem = {
  product: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
};

export type GetUserData = {
  user: {
    cartItems: ApiCartItem[];
  };
};

export const getUser = async () => {
  const token = await getToken();
  return await myFetch<GetUserData>(`${END_POINTS.ME}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
