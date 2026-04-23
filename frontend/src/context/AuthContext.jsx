import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [studentName, setStudentName] = useState(localStorage.getItem("studentName") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (studentName) {
      localStorage.setItem("studentName", studentName);
    } else {
      localStorage.removeItem("studentName");
    }
  }, [studentName]);

  const login = (nextToken, nextStudentName) => {
    setToken(nextToken);
    setStudentName(nextStudentName || "");
  };

  const logout = () => {
    setToken("");
    setStudentName("");
  };

  const value = useMemo(
    () => ({
      token,
      studentName,
      isAuthenticated: Boolean(token),
      login,
      logout
    }),
    [token, studentName]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
