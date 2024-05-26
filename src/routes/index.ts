import express from "express";
const router = express.Router();
const authRouter = require("./auth.route");

router.use("/auth", authRouter);

module.exports = router;
