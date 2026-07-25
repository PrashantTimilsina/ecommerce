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
    image: "https://loremflickr.com/1600/1200/casual,streetwear,fashion",
    colSpan: "md:col-span-2",
  },
  {
    id: 2,
    name: "Formal",
    image:
      "https://img4.dhresource.com/webp/m/0x0/f3/albu/ys/l/01/07ee527c-0747-4dd9-ba61-47ba4c7bf52a.jpg",
    colSpan: "md:col-span-3",
  },
  {
    id: 3,
    name: "Party",
    image:
      "https://www.bonsoir.co.in/cdn/shop/files/Navy_blue_Bandhgala_Blazer.jpg?crop=center&height=4927&v=1748426215&width=3285",
    colSpan: "md:col-span-3",
  },
  {
    id: 4,
    name: "Gym",
    image:
      "https://t3.ftcdn.net/jpg/01/13/24/70/360_F_113247091_aPZUthVxVscZhN6GGngRzKOoYjcXC0Pc.jpg",
    colSpan: "md:col-span-2",
  },
];

function DressStyleCard({ style }: { style: DressStyle }) {
  return (
    <div
      className={`group relative rounded-2xl overflow-hidden bg-muted h-56 sm:h-64 md:h-72 ${style.colSpan}`}
    >
      <Image
        src={style.image}
        alt={style.name}
        fill
        className="object-cover brightness-75 contrast-105 saturate-95 transition-transform duration-300 ease-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* dim overlay: darker at bottom-left where the label sits, subtle everywhere else */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

      <span className="absolute top-4 left-4 sm:top-6 sm:left-6 font-bold text-lg sm:text-xl text-white drop-shadow-md">
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