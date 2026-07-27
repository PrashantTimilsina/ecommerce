"use client";

import { Star, Grid2x2, BadgeCheck } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Review } from "@/types/review";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
      </div>

      <div className="flex items-center gap-1.5">
        <h3 className="font-bold text-base">{review.user.name}</h3>
        <BadgeCheck className="h-4 w-4 text-green-500 fill-green-500/20" />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        &ldquo;{review.comment}&rdquo;
      </p>

      <span className="text-xs text-muted-foreground mt-1">
        {review.createdAt.split("T")[0]}
      </span>
    </div>
  );
}

function Reviews({ reviews }: { reviews: Review[] }) {
  const [isClicked,setIsClicked] = useState(false);
  const [review,setReview]=useState("");
  
  return (
    <section className="w-full py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="font-extrabold text-xl sm:text-2xl">
            All Reviews{" "}
            <span className="text-muted-foreground font-normal">
              ({reviews.length})
            </span>
          </h2>

          <div className="flex items-center gap-3  ">
            {isClicked && (
              <Input type="text" placeholder="Write a review..." value={review} onChange={(e) => setReview(e.target.value)} className="w-80 h-12"/>
            )}
            <button
              type="button"
              onClick={() => setIsClicked(isClicked => !isClicked)}
              className="rounded-md cursor-pointer bg-black text-white py-2 px-6"
            >
             {isClicked ? "Submit" : "Write a Review"}
            </button>
          </div>
        </div>

        {/* Review grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Reviews;
