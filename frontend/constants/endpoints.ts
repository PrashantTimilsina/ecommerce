const API = process.env.NEXT_PUBLIC_APIURL;
const END_POINTS = {
  PRODUCTS: `${API}/products/`,
  REVIEWS: `${API}/reviews/`,
  LOGIN: `${API}/users/login/`,
  SIGNUP: `${API}/users/signup/`,
};
export default END_POINTS;
