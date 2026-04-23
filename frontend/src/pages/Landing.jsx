import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ParticleBackground from "../components/ParticleBackground.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const floating = {
  y: [0, -10, 0],
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
};

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="relative overflow-hidden">
      <ParticleBackground />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/30 to-slate-100/80 dark:from-slate-950/80 dark:via-slate-950/45 dark:to-slate-950/85" />
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-cyan-300/40 blur-3xl dark:bg-cyan-900/50" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-900/40" />
        <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-emerald-300/40 blur-3xl dark:bg-emerald-900/40" />
      </div>

      <section className="mx-auto flex min-h-[86vh] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 inline-flex items-center rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200"
        >
          Student Support Portal
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="max-w-3xl text-4xl font-black leading-tight text-slate-900 dark:text-white md:text-6xl"
        >
          Raise, track, and resolve student grievances with confidence.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg"
        >
          Student Grievance Management System helps students submit concerns, monitor status,
          and stay updated through a secure dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-700 dark:bg-white dark:text-slate-900"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="rounded-full border border-slate-300 bg-white/80 px-7 py-3 text-sm font-semibold text-slate-800 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-white"
            >
              {isAuthenticated ? "View Dashboard" : "Login"}
            </Link>
          </motion.div>
          <a
            href="#features"
            className="rounded-full border border-transparent px-4 py-3 text-sm font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Explore Features
          </a>
        </motion.div>

        <motion.div animate={floating} className="mt-16 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-4">
          {[
            "Submit Grievance",
            "Track Status",
            "Secure Login",
            "Manage Complaints"
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/70 bg-white/80 p-5 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Built for speed, clarity, and transparent grievance resolution.
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Submit Grievance",
              text: "Raise a new grievance quickly with a simple form and clear categories."
            },
            {
              title: "Track Status",
              text: "Follow every request with status badges and a clean list view."
            },
            {
              title: "Secure Login",
              text: "Use authenticated access with JWT-based session handling."
            },
            {
              title: "Manage Complaints",
              text: "Edit or remove entries without losing the overall workflow."
            }
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60"
            >
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">About</h2>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
            This system gives students a clear and secure way to submit grievances, monitor review
            progress, and keep communication organized in one place.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-slate-900 px-8 py-8 text-center shadow-xl dark:bg-white dark:text-slate-900 md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-extrabold">Ready to manage grievances better?</h2>
            <p className="mt-2 text-sm text-slate-200 dark:text-slate-700">
              Jump into your dashboard or create an account and get started in minutes.
            </p>
          </div>
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:scale-[1.02] dark:bg-slate-900 dark:text-white"
          >
            {isAuthenticated ? "Go to Dashboard" : "Login to Continue"}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Landing;
