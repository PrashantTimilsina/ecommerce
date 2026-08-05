import { Filters } from "./_components/Filters";
import { ProductCard } from "@/app/_components/NewArrival";
import { getAllProducts } from "@/api/product.api";
import { Product } from "@/types/product";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
type Props = {
  searchParams: Promise<{ category?: string; sizes: string; colors: string }>;
};
export default async function ProductsPage({ searchParams }: Props) {
  const { category, sizes, colors } = await searchParams;

  const response = await getAllProducts({ category, sizes, colors });

  const products = response.data as Product[];
  if (!products || products.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 font-medium flex flex-col gap-6">
        <Link href={"/filter"}>
          <div className="flex items-center gap-3 cursor-pointer">
            <MoveLeft size={14} />
            Back to products
          </div>
        </Link>
        <p className="text-xl">No products found.</p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-72 lg:shrink-0">
          <Filters product={products} />
        </div>

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
