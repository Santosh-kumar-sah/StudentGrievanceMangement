import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  createGrievance,
  deleteGrievance,
  getGrievances,
  searchGrievancesByTitle,
  updateGrievance
} from "../services/grievance.service.js";
import PageLoader from "../components/PageLoader.jsx";

const categories = ["Academic", "Hostel", "Transport", "Other"];
const statuses = ["Pending", "Resolved"];
const GrievancePieChart = lazy(() => import("../components/charts/GrievancePieChart.jsx"));

const Dashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editGrievanceId, setEditGrievanceId] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Academic",
    status: "Pending"
  });

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const response = await getGrievances();
      setGrievances(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to fetch grievances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleSearch = async () => {
    try {
      const query = searchQuery.trim();

      if (!query) {
        fetchGrievances();
        return;
      }

      setSearchLoading(true);
      const response = await searchGrievancesByTitle(query);
      setGrievances(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to search grievances");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editGrievanceId) {
        await updateGrievance(editGrievanceId, formData);
        toast.success("Grievance updated");
      } else {
        await createGrievance(formData);
        toast.success("Grievance submitted");
      }

      setEditGrievanceId("");
      setFormData({ title: "", description: "", category: "Academic", status: "Pending" });
      fetchGrievances();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to save grievance");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGrievance(id);
      toast.success("Grievance deleted");
      fetchGrievances();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to delete grievance");
    }
  };

  const chartData = useMemo(() => {
    const totals = grievances.reduce((acc, grievance) => {
      const key = grievance.category;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [grievances]);

  const resolvedCount = useMemo(
    () => grievances.filter((grievance) => grievance.status === "Resolved").length,
    [grievances]
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <article className="glass-card md:col-span-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Grievance Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Track your submitted grievances and their resolution progress.
          </p>
        </article>
        <article className="glass-card">
          <p className="text-sm text-slate-600 dark:text-slate-300">Resolved Grievances</p>
          <p className="mt-1 text-3xl font-black text-cyan-700 dark:text-cyan-300">
            {resolvedCount}
          </p>
        </article>
      </motion.section>

      <section id="add-grievance" className="mt-4 grid gap-4 lg:grid-cols-3">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card lg:col-span-2"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {editGrievanceId ? "Update Grievance" : "Submit Grievance"}
          </h2>
          <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
            <select
              className="input"
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <textarea
              className="input md:col-span-2"
              rows="4"
              placeholder="Describe your grievance"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              required
            />

            <select
              className="input"
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button className="btn-primary" type="submit">
              {editGrievanceId ? "Update Grievance" : "Submit Grievance"}
            </button>

            {editGrievanceId && (
              <button
                type="button"
                className="btn-danger"
                onClick={() => {
                  setEditGrievanceId("");
                  setFormData({
                    title: "",
                    description: "",
                    category: "Academic",
                    status: "Pending"
                  });
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
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Grievance Category Split</h3>
          <div className="mt-2 h-[230px]">
            <Suspense fallback={<PageLoader label="Loading chart" compact />}>
              <GrievancePieChart chartData={chartData} />
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
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <input
            className="input md:col-span-3"
            type="text"
            placeholder="Search grievances by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="button" className="btn-primary" onClick={handleSearch} disabled={searchLoading}>
            {searchLoading ? "Searching..." : "Search"}
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-14 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-14 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-14 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        ) : grievances.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">No grievances found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="text-slate-600 dark:text-slate-300">
                  <th>Title</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {grievances.map((grievance) => (
                  <tr
                    key={grievance._id}
                    className="rounded-xl bg-white/70 shadow-sm dark:bg-slate-900/70"
                  >
                    <td className="rounded-l-xl px-3 py-3 font-semibold text-slate-900 dark:text-white">
                      {grievance.title}
                    </td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-200">
                      {grievance.description}
                    </td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-200">{grievance.category}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-200">{grievance.status}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-200">
                      {new Date(grievance.date).toLocaleDateString()}
                    </td>
                    <td className="rounded-r-xl px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="rounded-full bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-600"
                          onClick={() => {
                            setEditGrievanceId(grievance._id);
                            setFormData({
                              title: grievance.title,
                              description: grievance.description,
                              category: grievance.category,
                              status: grievance.status
                            });
                            document.getElementById("add-grievance")?.scrollIntoView({
                              behavior: "smooth"
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-full bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-600"
                          onClick={() => handleDelete(grievance._id)}
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
