import { Link } from "react-router-dom";

const Footer = ({ darkMode, onToggleDarkMode }) => {
  return (
    <footer className="mt-auto border-t border-white/70 bg-gradient-to-r from-white via-slate-50 to-cyan-50 px-4 py-6 backdrop-blur-xl dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-6xl rounded-3xl border border-white/70 bg-white/80 px-5 py-5 shadow-lg dark:border-slate-800 dark:bg-slate-900/70 sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700 dark:text-cyan-300">
              Student Grievance Management System
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
              Helping students submit and track grievances with clarity.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              A simple, secure portal for managing complaints, monitoring status, and keeping the
              process transparent.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:bg-cyan-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:bg-cyan-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Dashboard
            </Link>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-cyan-500 dark:text-slate-900 dark:hover:bg-cyan-400"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© 2026 Student Grievance Management System</p>
          <p className="font-medium text-slate-600 dark:text-slate-300">Built for students, by students.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;