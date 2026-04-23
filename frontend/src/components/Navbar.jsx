import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

const linkClass =
  "rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white/80 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800";

const Navbar = ({ darkMode, onToggleDarkMode }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Student Grievance Management System
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className={`${linkClass} ${isActive("/login") ? "bg-white dark:bg-slate-800" : ""}`}>
                Login
              </Link>
              <Link
                to="/register"
                className={`${linkClass} ${isActive("/register") ? "bg-white dark:bg-slate-800" : ""}`}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className={`${linkClass} ${isActive("/dashboard") ? "bg-white dark:bg-slate-800" : ""}`}
              >
                Dashboard
              </Link>
              <Link to="/dashboard#add-grievance" className={linkClass}>
                Add Grievance
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Logout
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onToggleDarkMode}
            className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200 md:hidden"
        >
          Menu
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mx-4 mb-3 rounded-2xl border border-white/50 bg-white/90 p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className={linkClass} onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className={linkClass} onClick={() => setOpen(false)}>
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/dashboard#add-grievance" className={linkClass} onClick={() => setOpen(false)}>
                  Add Grievance
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              {darkMode ? "Switch to Light" : "Switch to Dark"}
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
