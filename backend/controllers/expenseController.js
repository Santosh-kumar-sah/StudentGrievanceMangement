import Expense from "../models/Expense.js";

export const addExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({ message: "Title, amount and category are required" });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    const expense = new Expense({
      userId: req.user.id,
      title,
      amount: Number(amount),
      category
    });

    const savedExpense = await expense.save();

    return res.status(201).json({
      message: "Expense added successfully",
      expense: savedExpense
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { userId: req.user.id };
    if (category) {
      filter.category = category;
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    return res.status(200).json(expenses);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({ message: "Title, amount and category are required" });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        title,
        amount: Number(amount),
        category
      },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};