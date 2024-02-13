import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/me", (req, res) => {
  res.send("Me");
});

export default router;
