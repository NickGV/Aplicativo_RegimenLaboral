import { createContext, useEffect, useState } from "react";
import {
  register,
  login,
  listUsers,
  userDetail,
} from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [error, setError] = useState(null);
  console.log(user);

  const handleRegister = async (userData) => {
    try {
      const { access, user } = await register(userData);
      console.log(user);
      setUser(user);
      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(user));
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const { access, user } = await login(credentials);
      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
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
