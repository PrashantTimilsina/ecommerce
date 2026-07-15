import ProductHero from "./_components/ProductHero";
import Reviews from "./_components/Reviews";
import FAQ from "./_components/FAQ";
import YouMightAlsoLike from "./_components/Like";

function ProductDetail() {
  return (
    <div>
      <ProductHero />
      <Reviews />
      <FAQ />
      <YouMightAlsoLike />
    </div>
  );
}

export default ProductDetail;
