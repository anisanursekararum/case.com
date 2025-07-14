import api from "./index";

export const register = ({ name, email, password }) => {
  return api.post("/auth/register", { name, email, password });
};

export const login = ({ email, password }) => {
  return api.post("/auth/login", { email, password });
};

export const getCurrentUser = (token) => {
  return api.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
};  