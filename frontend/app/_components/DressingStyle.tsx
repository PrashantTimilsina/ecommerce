"use client";

import Image from "next/image";

interface DressStyle {
  id: number;
  name: string;
  image: string;
  colSpan: string; // tailwind col-span classes per breakpoint
}

const styles: DressStyle[] = [
  {
    id: 1,
    name: "Casual",
    image: "/dress-styles/casual.png",
    colSpan: "md:col-span-2",
  },
  {
    id: 2,
    name: "Formal",
    image: "/dress-styles/formal.png",
    colSpan: "md:col-span-3",
  },
  {
    id: 3,
    name: "Party",
    image: "/dress-styles/party.png",
    colSpan: "md:col-span-3",
  },
  {
    id: 4,
    name: "Gym",
    image: "/dress-styles/gym.png",
    colSpan: "md:col-span-2",
  },
];

function DressStyleCard({ style }: { style: DressStyle }) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-muted h-56 sm:h-64 md:h-72 ${style.colSpan}`}
    >
      <Image src={style.image} alt={style.name} fill className="object-cover" />
      <span className="absolute top-4 left-4 sm:top-6 sm:left-6 font-bold text-lg sm:text-xl text-black">
        {style.name}
      </span>
    </div>
  );
}

function BrowseByDressStyle() {
  return (
    <section className="w-full py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4">
        <div className="bg-muted/40 rounded-3xl p-4 sm:p-6 md:p-8">
          <h2 className="text-center font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-wide mb-6 sm:mb-8">
            BROWSE BY DRESS STYLE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
            {styles.map((style) => (
              <DressStyleCard key={style.id} style={style} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrowseByDressStyle;
