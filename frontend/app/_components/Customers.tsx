"use client";

import { Star, BadgeCheck, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  review: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sabina Shrestha",
    rating: 5,
    review:
      "I'm blown away by the quality and fit of the clothes I received from Shop.co. Every piece feels well-made and true to size, exactly as described online.",
  },
  {
    id: 2,
    name: "Aashish Gurung",
    rating: 5,
    review:
      "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
  },
  {
    id: 3,
    name: "Prakriti Thapa",
    rating: 5,
    review:
      "As someone who's always on the lookout for unique pieces, I'm thrilled to have found this store. The attention to detail and quality of each item is evident, and I always get compliments.",
  },
  {
    id: 4,
    name: "Bibek Rai",
    rating: 5,
    review:
      "Shop.co has become my go-to for stylish, comfortable basics. The customer service is excellent and shipping is always fast — couldn't ask for a better experience.",
  },
  {
    id: 5,
    name: "Nisha Maharjan",
    rating: 4,
    review:
      "Great selection and reasonable prices. A couple of items ran slightly small, but the sizing guide helped, and the return process was painless when I needed to exchange.",
  },
  {
    id: 6,
    name: "Sujan Tamang",
    rating: 5,
    review:
      "Ordered a jacket for a friend's wedding and it arrived two days early, perfectly packaged. The fabric quality alone makes this worth every rupee.",
  },
  {
    id: 7,
    name: "Anjali Karki",
    rating: 5,
    review:
      "What I love most is how the website makes it easy to find exactly what I'm picturing. Every order so far has matched the photos perfectly, down to the stitching.",
  },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
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

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="h-full border border-border rounded-2xl p-5 sm:p-6 flex flex-col gap-3 bg-background">
      <StarRow rating={testimonial.rating} />
      <div className="flex items-center gap-1.5">
        <h3 className="font-bold text-base">{testimonial.name}</h3>
        <BadgeCheck className="h-4 w-4 text-green-500 fill-green-500/20" />
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {testimonial.review}
      </p>
    </div>
  );
}

function HappyCustomers() {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="w-full py-8 sm:py-10 md:py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-wide">
            OUR HAPPY CUSTOMERS
          </h2>

          <div className="hidden sm:flex items-center gap-2">
            <Button
              onClick={() => api?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Previous testimonial"
              className="h-9 w-9 flex items-center justify-center rounded-full border border-border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => api?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Next testimonial"
              className="h-9 w-9 flex items-center justify-center rounded-full border border-border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors hover:text-black"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 sm:-ml-5 md:-ml-6">
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="pl-4 sm:pl-5 md:pl-6 basis-[85%] xs:basis-[75%] sm:basis-1/2 lg:basis-1/3"
              >
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

export default HappyCustomers;
