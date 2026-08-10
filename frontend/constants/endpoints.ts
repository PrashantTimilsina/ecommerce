const API = process.env.NEXT_PUBLIC_APIURL;
const END_POINTS = {
  PRODUCTS: `${API}/products/`,
  REVIEWS: `${API}/reviews/`,
  LOGIN: `${API}/users/login/`,
  SIGNUP: `${API}/users/signup/`,
  CART: `${API}/users/add-to-cart/`,
  ME: `${API}/users/me/`,
  REMOVE_FROM_CART: `${API}/users/remove-from-cart/`,
  CHANGE_PASSWORD: `${API}/users/change-password/`,
  FORGOT_PASSWORD: `${API}/users/forgot-password/`,
  RESET_PASSWORD: `${API}/users/reset-password/`,
};
export default END_POINTS;
