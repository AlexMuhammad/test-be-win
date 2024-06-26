import express from "express";
const { register, login } = require("../controllers/auth.controller");
const { getProfile } = require("../controllers/user.controller");
const accessValidation = require("../middlewares/authorize");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", accessValidation, getProfile);

module.exports = router;
