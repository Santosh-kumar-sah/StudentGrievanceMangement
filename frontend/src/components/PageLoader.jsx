import { motion } from "framer-motion";

const PageLoader = ({ label = "Loading", compact = false }) => {
  return (
    <div className={`flex items-center justify-center ${compact ? "h-full" : "min-h-[40vh]"}`}>
      <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-5 py-3 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-5 w-5 rounded-full border-2 border-cyan-500 border-t-transparent"
        />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      </div>
    </div>
  );
};

export default PageLoader;
