import { createContext, useEffect, useState } from "react";
import {
  register,
  login,
  listUsers,
  userDetail,
  updateUser,
  deleteUser,
} from "../services/authService";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [error, setError] = useState(null);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/token/refresh/",
        {
          refresh: refreshToken,
        }
      );
      const { access } = response.data;
      localStorage.setItem("token", access);
      return access;
    } catch (error) {
      console.error("No se pudo refrescar el token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      const { access, user, refresh } = await register(userData);
      setUser(user);
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(user));
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const { access, refresh, user } = await login(credentials);
      setUser(user);
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(user));
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const handleListUsers = async () => {
    try {
      const users = await listUsers();
      return users;
    } catch (err) {
      setError(err);
      return null;
    }
  };

  const handleUserDetail = async (id) => {
    try {
      const userData = await userDetail(id);
      return userData;
    } catch (err) {
      setError(err);
      return null;
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      const updated = await updateUser(id, userData);
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setError(null);
      return updated;
    } catch (err) {
      setError(err);
      return null;
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    const refreshTokenSilently = async () => {
      try {
        const newToken = await refreshAccessToken();
        localStorage.setItem("access_token", newToken);
      } catch (err) {
        console.error("Error al refrescar el token:", err);
      }
    };
    if(user){
      refreshTokenSilently();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        error,
        handleRegister,
        handleLogin,
        handleListUsers,
        handleUserDetail,
        handleUpdateUser,
        handleDeleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
