import ProductHero from "./_components/ProductHero";
import Reviews from "./_components/Reviews";
import FAQ from "./_components/FAQ";
import YouMightAlsoLike from "./_components/Like";
import { getAllProducts, getProductBySlug } from "@/api/product.api";
import { Product } from "@/types/product";
type Props={
  params:Promise<{slug:string}>
}
async function ProductDetail({ params }: Props) {
  const {slug}=await params;
  const allProducts=await getAllProducts();
  const products=allProducts.data.slice(5,9);

  const response=await getProductBySlug(slug);
  const product=response.data as Product;

  return (
    <div>
      <ProductHero  product={product}/>
      <Reviews />
      <FAQ />
      <YouMightAlsoLike products={products} />
    </div>
  );
}

export default ProductDetail;
