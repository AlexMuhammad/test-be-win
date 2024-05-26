import express from "express";
const router = express.Router();
const authRouter = require("./auth.route");
const productRouter = require("./product.route");
const profileRouter = require("./user.route");

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/profile", profileRouter);

module.exports = router;
