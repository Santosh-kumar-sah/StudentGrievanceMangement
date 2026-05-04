import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/Landing.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Footer from "./components/Footer.jsx";
import PageLoader from "./components/PageLoader.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Chatbot from "./components/chatbot.jsx";

const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));

const App = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode((prev) => !prev)} />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader label="Loading page" />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </div>
      <Footer darkMode={darkMode} onToggleDarkMode={() => setDarkMode((prev) => !prev)} />
      <Chatbot />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2800,
          style: {
            borderRadius: "12px",
            border: "1px solid #cbd5e1"
          }
        }}
      />
    </div>
  );
};

export default App;
