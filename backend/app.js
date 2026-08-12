import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middlewares/errorMiddleware.js";
import productRoutes from "./routes/product.routes.js";
import reviewRoutes from "./routes/reviews.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import swaggerUi from "swagger-ui-express";

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use(globalErrorHandler);

export default app;
