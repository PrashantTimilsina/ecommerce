import { getAllProducts } from "@/api/product.api";
import HappyCustomers from "../_components/Customers";
import BrowseByDressStyle from "../_components/DressingStyle";

import Hero from "../_components/Hero";
import NewArrival from "../_components/NewArrival";

import TopSelling from "../_components/TopSelling";
import { Product } from "@/types/product";

async function App() {
  const response = await getAllProducts();
  const products = response.data as Product[];

  return (
    <main>
      <section id="Home">
        <Hero />
      </section>
      <section id="New Arrivals">
        <NewArrival products={products} />
      </section>
      <section id="Top Selling">
        <TopSelling products={products} />
      </section>
      <section>
        <BrowseByDressStyle />
      </section>
      <section>
        <HappyCustomers />
      </section>
    </main>
  );
}

export default App;
