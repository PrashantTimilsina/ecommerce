import { MOCK_PRODUCTS } from "./_components/MockProduct";
import { Filters } from "./_components/Filters";
import { ProductCard } from "@/app/_components/NewArrival";
import { getAllProducts } from "@/api/product.api";

export default async function ProductsPage() {
  // const products = MOCK_PRODUCTS;
  const response = await getAllProducts();
  console.log(response);
  const products = response.data;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-72 lg:shrink-0">
          <Filters />
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-2xl font-bold">All Products</h1>
            <p className="text-sm text-muted-foreground">
              Showing {products.length} of {products.length} products
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
