const express = require("express");
const router = express.Router();

const {
  getProducts,
  addProduct,
  deleteProduct,
  searchProducts,
} = require("../controllers/productController");

// Note: It's best practice to put specific routes like /search
// above dynamic routes like /:id to prevent routing conflicts.

router.get("/search", searchProducts);
router.get("/", getProducts);
router.post("/", addProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
