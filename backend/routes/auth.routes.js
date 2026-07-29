import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";
import { validateSignup, validateLogin } from "../middleware/validator.middleware.js";

const router = express.Router();

router.post("/signup", authLimiter, validateSignup, signup);

router.post("/login", authLimiter, validateLogin, login);

router.post("/logout", logout);

export default router;
