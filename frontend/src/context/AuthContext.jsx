import { createContext, useContext, useState, useEffect } from "react";
import api from "../apis";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeTeam, setActiveTeam] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.error("Auth error", err);
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    setUser(null);
    setActiveTeam(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("theme");
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        activeTeam,
        setActiveTeam,
        token,
        setToken,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
