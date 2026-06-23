require("dotenv").config();

const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local development
      "https://your-frontend.vercel.app", // deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json());

// Routes
app.use("/products", productRoutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
