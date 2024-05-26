import express from "express";
const {
  getListProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
} = require("../controllers/product.controller");
const router = express.Router();
const accessValidation = require("../middlewares/authorize");
const validator = require("../middlewares/validation");

router.get("/", accessValidation, getListProduct);
router.get("/:id", accessValidation, getProductDetail);
router.post("/", validator, accessValidation, createProduct);
router.patch("/:id", validator, accessValidation, updateProduct);
router.delete("/:id", accessValidation, deleteProduct);

module.exports = router;
