export const productPrice = (product) =>
  Number((product.price - product.price * (product.discount || 0) / 100).toFixed(2));
