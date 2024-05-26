import express from "express";
const { getProfile } = require("../controllers/user.controller");
const accessValidation = require("../middlewares/authorize");

const router = express.Router();

router.get("/", accessValidation, getProfile);

module.exports = router;
