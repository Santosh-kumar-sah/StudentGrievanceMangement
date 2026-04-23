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
import { useAuth } from "../context/AuthContext.jsx";

const categories = ["Academic", "Hostel", "Transport", "Other"];
const statuses = ["Pending", "Resolved"];
const GrievancePieChart = lazy(() => import("../components/charts/GrievancePieChart.jsx"));

const Dashboard = () => {
  const { studentName } = useAuth();
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

  const pendingCount = useMemo(
    () => grievances.filter((grievance) => grievance.status === "Pending").length,
    [grievances]
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
              Student Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white md:text-4xl">
              Welcome{studentName ? `, ${studentName.split(" ")[0]}` : ""}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
              Manage grievances, review their progress, and keep your communication organized.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-lg dark:bg-white dark:text-slate-900">
              <p className="text-xs uppercase tracking-widest text-slate-300 dark:text-slate-500">Total</p>
              <p className="mt-1 text-2xl font-black">{grievances.length}</p>
            </div>
            <div className="rounded-2xl bg-amber-500 px-4 py-3 text-white shadow-lg">
              <p className="text-xs uppercase tracking-widest text-amber-100">Pending</p>
              <p className="mt-1 text-2xl font-black">{pendingCount}</p>
            </div>
            <div className="rounded-2xl bg-emerald-500 px-4 py-3 text-white shadow-lg">
              <p className="text-xs uppercase tracking-widest text-emerald-100">Resolved</p>
              <p className="mt-1 text-2xl font-black">{resolvedCount}</p>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          className="input md:max-w-xl"
          type="text"
          placeholder="Search grievances by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="button" className="btn-primary md:w-40" onClick={handleSearch} disabled={searchLoading}>
          {searchLoading ? "Searching..." : "Search"}
        </button>
      </div>

      <section id="add-grievance" className="grid gap-4 lg:grid-cols-3">
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
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Category</label>
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
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
              <textarea
                className="input"
                rows="4"
                placeholder="Describe your grievance"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</label>
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
            </div>

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
            <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-left text-sm">
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
                    className="rounded-xl bg-white/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/70"
                  >
                    <td className="rounded-l-xl px-3 py-3 font-semibold text-slate-900 dark:text-white">
                      {grievance.title}
                    </td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-200">
                      <span className="line-clamp-2">{grievance.description}</span>
                    </td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-200">{grievance.category}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-200">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          grievance.status === "Resolved"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                        }`}
                      >
                        {grievance.status}
                      </span>
                    </td>
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
