"use client";

import HeroPicture from "@/assets/Hero.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CountUp from "react-countup";

const stats = [
  { value: 200, suffix: "+", label: "International Brands" },
  { value: 2000, suffix: "+", label: "High-Quality Products" },
  { value: 30000, suffix: "+", label: "Happy Customers" },
];

const brands = ["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"];

function Hero() {
  return (
    <section
      className="relative w-full rounded-2xl overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${HeroPicture.src})`,
      }}
    >
      <div className="relative container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-center px-4 sm:px-6 py-12 sm:py-16 min-h-137.5 sm:min-h-150 md:min-h-175">
        {/* Left column */}
        <div className="flex flex-col gap-4 sm:gap-6 text-center md:text-left items-center md:items-start">
          <h1 className="font-extrabold text-3xl sm:text-4xl lg:text-6xl tracking-wide leading-tight">
            FIND CLOTHES
            <br /> THAT MATCHES
            <br /> YOUR STYLE
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base max-w-xs sm:max-w-md">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out individuality and cater to your sense of
            style.
          </p>

          <Link href="/filter">
            <Button className="cursor-pointer w-40 sm:w-48 py-5 sm:py-6 rounded-full text-sm sm:text-base">
              Shop Now
            </Button>
          </Link>

          {/* Stats with count-up animation */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 sm:gap-8 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border w-full">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center md:items-start"
              >
                <span className="font-extrabold text-xl sm:text-2xl lg:text-3xl">
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    separator=","
                    enableScrollSpy
                    scrollSpyOnce
                  />
                  {stat.suffix}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column stays empty so the background image shows through */}
        <div className="hidden md:block" />

        {/* Decorative sparkles over the image — hidden on small screens to avoid clutter */}
        <span className="hidden sm:block absolute top-6 sm:top-8 right-6 sm:right-8 text-xl sm:text-2xl text-primary select-none">
          ✦
        </span>
        <span className="hidden sm:block absolute bottom-20 sm:bottom-24 right-1/4 md:right-1/3 text-lg sm:text-xl text-primary select-none">
          ✦
        </span>
      </div>

      {/* Brand logos strip */}
      <div className="relative bg-black py-4 sm:py-6">
        <div className="container mx-auto flex flex-wrap justify-center md:justify-around items-center gap-x-6 gap-y-3 sm:gap-6 px-4 sm:px-6">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-white font-semibold text-sm sm:text-base md:text-lg tracking-wide opacity-90"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
