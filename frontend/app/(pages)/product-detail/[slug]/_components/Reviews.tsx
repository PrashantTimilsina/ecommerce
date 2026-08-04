"use client";

import { Star, BadgeCheck, EllipsisVertical } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Review } from "@/types/review";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { postReviewAction } from "@/action/product.action";
import { toast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteReviewAction, updateReviewAction } from "@/action/auth.action";

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

function ReviewCard({
  review,
  userId,
  slug,
}: {
  review: Review;
  userId: string;
  slug: string;
}) {
  const isReviewOfCurrentUser = review.user._id === userId;

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const editSchema = z.object({
    rating: z
      .string()
      .min(1, "Please select a rating.")
      .max(5, "Rating must be at most 5 characters."),
    review: z
      .string()
      .min(6, "Review must be at least 6 characters.")
      .max(100, "Review must be at most 100 characters."),
  });

  const editForm = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      rating: String(review.rating),
      review: review.comment,
    },
  });

  async function handleEditSubmit(data: z.infer<typeof editSchema>) {
    await updateReviewAction({
      id: review._id,
      rating: parseInt(data.rating),
      comment: data.review,
      slug: slug,
    });

    setEditOpen(false);
  }

  async function handleDeleteConfirm() {
    setIsDeleting(true);
    try {
      await deleteReviewAction(review._id, slug);
      toast.add({
        title: "Review deleted successfully",
        type: "success",
      });

      setDeleteOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="border border-border rounded-2xl p-5 flex justify-between gap-3 bg-background">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <StarRow rating={review.rating} />
        </div>

        <div className="flex items-center gap-1.5">
          <h3 className="font-bold text-base">{review.user.name}</h3>
          <BadgeCheck className="h-4 w-4 text-green-500 fill-green-500/20" />
        </div>

        <p className="text-sm font-medium leading-relaxed">
          &ldquo;{review.comment}&rdquo;
        </p>

        <span className="text-xs text-muted-foreground mt-1">
          {review.createdAt.split("T")[0]}
        </span>
      </div>

      {isReviewOfCurrentUser && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger render={<EllipsisVertical size={14} />} />
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel
                  className="cursor-pointer"
                  onClick={() => {
                    editForm.reset({
                      rating: String(review.rating),
                      review: review.comment,
                    });
                    setEditOpen(true);
                  }}
                >
                  Edit
                </DropdownMenuLabel>
                <DropdownMenuLabel
                  className="cursor-pointer text-red-500"
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete
                </DropdownMenuLabel>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Edit Dialog */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="sm:max-w-106.25">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  Edit Review
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={editForm.handleSubmit(handleEditSubmit)}
                className="space-y-4"
              >
                <Controller
                  name="rating"
                  control={editForm.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="w-full h-12!"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select a rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <p className="text-sm text-red-500">
                          {fieldState.error?.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="review"
                  control={editForm.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <Label>Comment</Label>
                      <Textarea
                        {...field}
                        placeholder="Write your review here..."
                        className="h-20 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <p className="text-sm text-red-500">
                          {fieldState.error?.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Button
                  type="submit"
                  className="bg-black text-white py-5 px-6 mt-4 w-full cursor-pointer"
                  disabled={editForm.formState.isSubmitting}
                >
                  {editForm.formState.isSubmitting
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  Delete Review
                </DialogTitle>
              </DialogHeader>

              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this review? This action cannot
                be undone.
              </p>

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setDeleteOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

function Reviews({
  reviews,
  id,
  slug,
  userId,
}: {
  reviews: Review[];
  id: string;
  slug: string;
  userId: string;
}) {
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    rating: z
      .string()
      .min(1, "Please select a rating.")
      .max(5, "Rating must be at most 5 characters."),
    review: z
      .string()
      .min(6, "Review must be at least 6 characters.")
      .max(100, "Review must be at most 100 characters."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: "",
      review: "",
    },
  });

  async function handleAddReview(data: z.infer<typeof formSchema>) {
    const res = await postReviewAction({
      product: id,
      rating: parseInt(data.rating),
      comment: data.review,
      slug,
    });

    if (res.status) {
      toast.add({
        title: "Review added successfully",
        type: "success",
      });
      form.reset();
      setOpen(false);
    } else {
      toast.add({
        title: res.message,

        type: "error",
      });
    }
  }

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

          <div className="flex items-center gap-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className="rounded-md cursor-pointer bg-black text-white py-2 px-6">
                Write a Review
              </DialogTrigger>

              <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold">
                    Write a Review
                  </DialogTitle>
                </DialogHeader>

                <form
                  id="form-rhf-demo"
                  onSubmit={form.handleSubmit(handleAddReview)}
                  className="space-y-4"
                >
                  <Controller
                    name="rating"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div className="space-y-2">
                        <Label>Rating</Label>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className="w-full h-12!"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Select a rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <p className="text-sm text-red-500">
                            {fieldState.error?.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="review"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div className="space-y-2">
                        <Label>Comment</Label>
                        <Textarea
                          {...field}
                          placeholder="Write your review here..."
                          className="h-20 resize-none"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <p className="text-sm text-red-500">
                            {fieldState.error?.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <Button
                    type="submit"
                    className="bg-black text-white py-5 px-6 mt-4 w-full cursor-pointer"
                  >
                    Submit Review
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Review grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              userId={userId}
              slug={slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Reviews;
