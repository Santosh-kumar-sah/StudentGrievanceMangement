import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  addExpense,
  deleteExpense,
  getExpenses,
  updateExpense
} from "../services/api.js";
import PageLoader from "../components/PageLoader.jsx";

const categories = ["All", "Food", "Travel", "Bills", "Shopping", "Health", "Other"];
const ExpensePieChart = lazy(() => import("../components/charts/ExpensePieChart.jsx"));

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [editExpenseId, setEditExpenseId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food"
  });

  const fetchExpenses = async (category = "") => {
    try {
      setLoading(true);
      const response = await getExpenses(category);
      setExpenses(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const category = selectedCategory === "All" ? "" : selectedCategory;
    fetchExpenses(category);
  }, [selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount)
      };

      if (editExpenseId) {
        await updateExpense(editExpenseId, payload);
        toast.success("Expense updated");
      } else {
        await addExpense(payload);
        toast.success("Expense added");
      }

      setEditExpenseId("");
      setFormData({ title: "", amount: "", category: "Food" });

      const category = selectedCategory === "All" ? "" : selectedCategory;
      fetchExpenses(category);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to save expense");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      toast.success("Expense deleted");
      const category = selectedCategory === "All" ? "" : selectedCategory;
      fetchExpenses(category);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to delete expense");
    }
  };

  const visibleExpenses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return expenses;
    }

    return expenses.filter(
      (expense) =>
        expense.title.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query)
    );
  }, [expenses, searchQuery]);

  const chartData = useMemo(() => {
    const totals = visibleExpenses.reduce((acc, expense) => {
      const key = expense.category;
      acc[key] = (acc[key] || 0) + Number(expense.amount || 0);
      return acc;
    }, {});

    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [visibleExpenses]);

  const totalAmount = useMemo(
    () => visibleExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
    [visibleExpenses]
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <article className="glass-card md:col-span-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Expense Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Real-time expenses synced with your backend.
          </p>
        </article>
        <article className="glass-card">
          <p className="text-sm text-slate-600 dark:text-slate-300">Total Spend</p>
          <p className="mt-1 text-3xl font-black text-cyan-700 dark:text-cyan-300">
            ${totalAmount.toFixed(2)}
          </p>
        </article>
      </motion.section>

      <section id="add-expense" className="mt-4 grid gap-4 lg:grid-cols-3">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card lg:col-span-2"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {editExpenseId ? "Update Expense" : "Add Expense"}
          </h2>
          <form className="mt-4 grid gap-3 md:grid-cols-3" onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
            <input
              className="input"
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              required
            />
            <select
              className="input"
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            >
              {categories
                .filter((item) => item !== "All")
                .map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </select>

            <button className="btn-primary md:col-span-2" type="submit">
              {editExpenseId ? "Update Expense" : "Add Expense"}
            </button>
            {editExpenseId && (
              <button
                type="button"
                className="btn-danger"
                onClick={() => {
                  setEditExpenseId("");
                  setFormData({ title: "", amount: "", category: "Food" });
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card h-[290px]"
        >
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Category Split</h3>
          <div className="mt-2 h-[230px]">
            <Suspense fallback={<PageLoader label="Loading chart" compact />}>
              <ExpensePieChart chartData={chartData} />
            </Suspense>
          </div>
        </motion.article>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-4 glass-card"
      >
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <input
            className="input md:col-span-2"
            type="text"
            placeholder="Search by title or category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="input"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-14 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-14 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-14 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        ) : visibleExpenses.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">No expenses found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="text-slate-600 dark:text-slate-300">
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleExpenses.map((expense) => (
                  <tr
                    key={expense._id}
                    className="rounded-xl bg-white/70 shadow-sm dark:bg-slate-900/70"
                  >
                    <td className="rounded-l-xl px-3 py-3 font-semibold text-slate-900 dark:text-white">
                      {expense.title}
                    </td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-200">
                      ${Number(expense.amount).toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-200">{expense.category}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-200">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="rounded-r-xl px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="rounded-full bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-600"
                          onClick={() => {
                            setEditExpenseId(expense._id);
                            setFormData({
                              title: expense.title,
                              amount: expense.amount,
                              category: expense.category
                            });
                            document.getElementById("add-expense")?.scrollIntoView({
                              behavior: "smooth"
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-full bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-600"
                          onClick={() => handleDelete(expense._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>
    </main>
  );
};

export default Dashboard;
