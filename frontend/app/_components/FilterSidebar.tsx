"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ListFilter, ChevronRight } from "lucide-react";

const categories = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];

const colors = [
  "#22C55E",
  "#EF4444",
  "#EAB308",
  "#F97316",
  "#3B82F6",
  "#EC4899",
  "#8B5CF6",
  "#FFFFFF",
  "#000000",
  "#14B8A6",
  "#6366F1",
  "#78716C",
];

const sizes = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "3X-Large",
  "4X-Large",
];

const dressStyles = ["Casual", "Formal", "Party", "Gym"];

interface FilterSidebarProps {
  onApply?: (filters: {
    priceRange: number[];
    color: string | null;
    size: string | null;
  }) => void;
}

function FilterSidebar({ onApply }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>("Large");

  return (
    <aside className="w-full lg:w-64 shrink-0 border border-border rounded-2xl p-5 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Filters</h3>
        <ListFilter className="h-4 w-4 text-muted-foreground" />
      </div>

      <hr className="border-border" />

      {/* Categories */}
      <div className="flex flex-col gap-3">
        {categories.map((cat) => (
          <Button
            key={cat}
            className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {cat}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <hr className="border-border" />

      {/* Price */}
      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-base">Price</h4>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as number[])}
          min={0}
          max={300}
          step={5}
          className="w-full"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <hr className="border-border" />

      {/* Colors */}
      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-base">Colors</h4>
        <div className="grid grid-cols-6 gap-3">
          {colors.map((color) => (
            <Button
              key={color}
              onClick={() => setSelectedColor(color)}
              aria-label={color}
              className={`h-6 w-6 rounded-full ring-offset-2 transition-all cursor-pointer ${
                selectedColor === color ? "ring-2 ring-foreground" : "ring-0"
              } ${color === "#FFFFFF" ? "border border-border" : ""}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <hr className="border-border" />

      {/* Size */}
      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-base">Size</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                selectedSize === size
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <hr className="border-border" />

      {/* Dress Style */}
      <div className="flex flex-col gap-3">
        <h4 className="font-bold text-base">Dress Style</h4>
        {dressStyles.map((style) => (
          <Button
            key={style}
            className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {style}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <Button
        onClick={() =>
          onApply?.({
            priceRange,
            color: selectedColor,
            size: selectedSize,
          })
        }
        className="rounded-full h-11 mt-2 cursor-pointer"
      >
        Apply Filter
      </Button>
    </aside>
  );
}

export default FilterSidebar;
