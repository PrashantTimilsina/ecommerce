const API = process.env.NEXT_PUBLIC_APIURL;
const END_POINTS = {
  PRODUCTS: `${API}/products/`,
  REVIEWS: `${API}/reviews/`,
  LOGIN: `${API}/users/login/`,
  SIGNUP: `${API}/users/signup/`,
  CART: `${API}/users/add-to-cart/`,
  ME: `${API}/users/me/`,
  REMOVE_FROM_CART: `${API}/users/remove-from-cart/`,
};
export default END_POINTS;
