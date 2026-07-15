import HappyCustomers from "./_components/Customers";
import BrowseByDressStyle from "./_components/DressingStyle";

import Hero from "./_components/Hero";

import NewArrivals from "./_components/NewArrival";
import TopSelling from "./_components/TopSelling";

function App() {
  return (
    <main>
      <section>
        <Hero />
      </section>
      <section>
        <NewArrivals />
      </section>
      <section>
        <TopSelling />
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
