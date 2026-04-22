import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (userName) {
      localStorage.setItem("userName", userName);
    } else {
      localStorage.removeItem("userName");
    }
  }, [userName]);

  const login = (nextToken, nextUserName) => {
    setToken(nextToken);
    setUserName(nextUserName || "");
  };

  const logout = () => {
    setToken("");
    setUserName("");
  };

  const value = useMemo(
    () => ({
      token,
      userName,
      isAuthenticated: Boolean(token),
      login,
      logout
    }),
    [token, userName]
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
