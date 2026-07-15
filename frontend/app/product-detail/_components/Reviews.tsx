"use client";

import { Star, Grid2x2, MoreHorizontal, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Review {
  id: number;
  name: string;
  rating: number;
  review: string;
  date: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Samantha D.",
    rating: 5,
    review:
      "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
    date: "Posted on August 14, 2023",
  },
  {
    id: 2,
    name: "Alex M.",
    rating: 5,
    review:
      "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
    date: "Posted on August 15, 2023",
  },
  {
    id: 3,
    name: "Ethan R.",
    rating: 4,
    review:
      "This t-shirt is a must-have for anyone who appreciates good design. The minimalist yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt.",
    date: "Posted on August 16, 2023",
  },
  {
    id: 4,
    name: "Olivia P.",
    rating: 5,
    review:
      "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out.",
    date: "Posted on August 17, 2023",
  },
  {
    id: 5,
    name: "Liam K.",
    rating: 5,
    review:
      "This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill. It's like wearing a piece of art that reflects my passion for both design and fashion.",
    date: "Posted on August 18, 2023",
  },
  {
    id: 6,
    name: "Ava H.",
    rating: 4,
    review:
      "I'm not just wearing a t-shirt; I'm wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter.",
    date: "Posted on August 19, 2023",
  },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border border-border rounded-2xl p-5 flex flex-col gap-3 bg-background">
      <div className="flex items-start justify-between">
        <StarRow rating={review.rating} />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label="More options"
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              />
            }
          >
            <MoreHorizontal className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Report review</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-1.5">
        <h3 className="font-bold text-base">{review.name}</h3>
        <BadgeCheck className="h-4 w-4 text-green-500 fill-green-500/20" />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        &ldquo;{review.review}&rdquo;
      </p>

      <span className="text-xs text-muted-foreground mt-1">{review.date}</span>
    </div>
  );
}

function Reviews() {
  return (
    <section className="w-full py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="font-extrabold text-xl sm:text-2xl">
            All Reviews{" "}
            <span className="text-muted-foreground font-normal">(451)</span>
          </h2>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Grid view"
              className="h-10 w-10 flex items-center justify-center rounded-full border border-border hover:bg-muted transition-colors cursor-pointer"
            >
              <Grid2x2 className="h-4 w-4" />
            </button>

            <Select defaultValue="latest">
              <SelectTrigger className="w-32 rounded-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>

            <button type="button" className="rounded-full cursor-pointer">
              Write a Review
            </button>
          </div>
        </div>

        {/* Review grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Load more */}
        <div className="flex justify-center mt-8 sm:mt-10">
          <Button
            type="button"
            variant="outline"
            className="rounded-full px-8 sm:px-10 py-4 sm:py-5 cursor-pointer"
          >
            Load More Reviews
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Reviews;
