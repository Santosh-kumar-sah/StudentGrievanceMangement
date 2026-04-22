import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/expense", expenseRoutes);

app.get("/", (req, res) => {
	res.status(200).json({ message: "Expense API is running" });
});

app.use((req, res) => {
	res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(err.statusCode || 500).json({
		message: err.message || "Internal server error"
	});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));