import express from "express";
import roomController from "../controllers/roomController.js";
import verifyToken from "../config/middleware.js";

const router = express.Router();

router.get("/", verifyToken, roomController.getRooms);
router.post("/create", verifyToken, roomController.createRoom);
router.post("/join", verifyToken, roomController.joinRoom);

export default router;
