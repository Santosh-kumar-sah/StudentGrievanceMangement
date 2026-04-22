import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
	addExpense,
	getExpenses,
	updateExpense,
	deleteExpense
} from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", authMiddleware, addExpense);
router.get("/", authMiddleware, getExpenses);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);

export default router;