import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

const baseLinkClass =
  "rounded-full px-4 py-2 text-sm font-medium transition hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-950";

const Navbar = ({ darkMode, onToggleDarkMode }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout, studentName } = useAuth();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `${baseLinkClass} ${isActive ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950" : "text-slate-700 dark:text-slate-200"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            SGMS
          </Link>
          <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:inline-flex">
            Student Grievance Management System
          </span>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navClass}>
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className={navClass}>
                Dashboard
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Logout{studentName ? `, ${studentName.split(" ")[0]}` : ""}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onToggleDarkMode}
            className="ml-1 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:bg-cyan-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900 md:hidden"
        >
          Menu
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-3 rounded-2xl border border-white/60 bg-white/95 p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-col gap-2">
            <NavLink to="/" className={navClass} onClick={() => setOpen(false)}>
              Home
            </NavLink>
            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className={navClass} onClick={() => setOpen(false)}>
                  Login
                </NavLink>
                <NavLink to="/register" className={navClass} onClick={() => setOpen(false)}>
                  Register
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard" className={navClass} onClick={() => setOpen(false)}>
                  Dashboard
                </NavLink>
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
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-cyan-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
