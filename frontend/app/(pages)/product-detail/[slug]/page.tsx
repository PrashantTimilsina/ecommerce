import ProductHero from "./_components/ProductHero";
import Reviews from "./_components/Reviews";
import FAQ from "./_components/FAQ";
import YouMightAlsoLike from "./_components/Like";
import { getAllProducts, getProductBySlug } from "@/api/product.api";
import { Product } from "@/types/product";
import { getReviews } from "@/api/review.api";
import { Review } from "@/types/review";
import { cookies } from "next/headers";
type Props = {
  params: Promise<{ slug: string }>;
};
async function ProductDetail({ params }: Props) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const user = JSON.parse(cookieStore.get("user")?.value || "{}");
  const userId = user?.userId;

  const allProducts = await getAllProducts();

  const response = await getProductBySlug(slug);
  const product = response.data as Product;
  const products = allProducts.data.filter(
    (item) => item.category === product.category && item.slug !== product.slug,
  );
  const reviews = await getReviews(product._id);

  return (
    <div>
      <ProductHero product={product} />
      <Reviews
        reviews={reviews.data as Review[]}
        id={product._id}
        slug={product.slug}
        userId={userId}
      />
      <FAQ />
      <YouMightAlsoLike products={products} />
    </div>
  );
}

export default ProductDetail;
