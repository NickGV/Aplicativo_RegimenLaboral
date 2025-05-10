import { createContext, useEffect, useState } from "react";
import {
  register,
  login,
  listUsers,
  userDetail,
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
      console.log(access);
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const { access, refresh, user } = await login(credentials);
      setUser(user);
      console.log(access);
      console.log(refresh);
      console.log(user);
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
      return;
    } catch (err) {
      return;
    }
  };

  const handleUserDetail = async (id) => {
    try {
      return;
    } catch (err) {
      return;
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

    refreshTokenSilently();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
