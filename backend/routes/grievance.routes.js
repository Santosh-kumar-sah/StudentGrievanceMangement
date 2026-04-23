import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
	createGrievance,
	getGrievances,
	getGrievanceById,
	updateGrievance,
	deleteGrievance,
	searchGrievances
} from "../controllers/grievance.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createGrievance);
router.get("/", authMiddleware, getGrievances);
router.get("/search", authMiddleware, searchGrievances);
router.get("/:id", authMiddleware, getGrievanceById);
router.put("/:id", authMiddleware, updateGrievance);
router.delete("/:id", authMiddleware, deleteGrievance);

export default router;