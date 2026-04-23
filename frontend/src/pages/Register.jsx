import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { registerStudent } from "../services/grievance.service.js";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await registerStudent(formData);
      toast.success("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-white/70 bg-white/70 p-7 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
      >
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Student Registration</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Create your account to submit and track grievances.
        </p>

        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            required
          />

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-cyan-700 dark:text-cyan-300">
            Login
          </Link>
        </p>
      </motion.div>
    </main>
  );
};

export default Register;
