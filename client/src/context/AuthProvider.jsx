import { createContext, useState } from "react";
import {
  register,
  login,
  listUsers,
  userDetail,
} from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleRegister = async (userData) => {
    try {
      const newUser = await register(userData);
      setUser(newUser);
      const { access } = newUser;
      localStorage.setItem("token", access);
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const { access, user } = await login(credentials);
      localStorage.setItem("token", access);
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
