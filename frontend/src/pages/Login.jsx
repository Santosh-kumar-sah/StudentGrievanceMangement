import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { loginUser } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await loginUser(formData);
      login(response.data.token, response.data.user?.name || "User");
      toast.success("Login successful");
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to login");
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
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Welcome Back</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Sign in to continue managing your expenses.
        </p>

        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
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
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          New here?{" "}
          <Link to="/register" className="font-semibold text-cyan-700 dark:text-cyan-300">
            Create account
          </Link>
        </p>
      </motion.div>
    </main>
  );
};

export default Login;
