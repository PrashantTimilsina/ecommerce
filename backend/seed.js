import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Review from "./models/Review.js";

import usersData from "./data/users.json" assert { type: "json" };
import productsData from "./data/products.json" assert { type: "json" };
import reviewsData from "./data/reviews.json" assert { type: "json" };

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");

    await Review.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log("Old data cleared");

    const createdUsers = await User.create(usersData);
    const createdProducts = await Product.create(productsData);

    const productMap = {};
    createdProducts.forEach((p) => {
      productMap[p.slug] = p._id;
    });

    const userMap = {};
    createdUsers.forEach((u) => {
      userMap[u.email] = u._id;
    });

    const reviewsToInsert = reviewsData.map((r) => ({
      product: productMap[r.productSlug],
      user: userMap[r.userEmail],
      rating: r.rating,
      comment: r.comment,
    }));

    const createdReviews = await Review.insertMany(reviewsToInsert);
    console.log(`Inserted ${createdReviews.length} reviews`);

    for (const product of createdProducts) {
      const stats = await Review.aggregate([
        { $match: { product: product._id } },
        {
          $group: {
            _id: "$product",
            avgRating: { $avg: "$rating" },
            numReviews: { $sum: 1 },
          },
        },
      ]);

      product.rating = stats[0]?.avgRating || 0;
      product.numReviews = stats[0]?.numReviews || 0;
      await product.save();
    }

    console.log("Seed complete ✅");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed ❌", err);
    process.exit(1);
  }
}

seed();
