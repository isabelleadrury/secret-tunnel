import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [location, setLocation] = useState("GATE");
  const [verified, setVerified] = useState(false);

  // === API helper functions ===
  async function signup(username, password) {
    const response = await fetch(`${API}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error("Signup failed");
    return response.json();
  }

  async function authenticate(token) {
    const response = await fetch(`${API}/authenticate`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Authentication failed");
    return response.json();
  }

  // === Context functions ===
  async function signupUser(username, password) {
    try {
      const { token } = await signup(username, password);
      setToken(token);
      localStorage.setItem("token", token);
      setVerified(false);
      setLocation("TABLET");
    } catch (error) {
      console.error(error);
      setLocation("GATE");
    }
  }

  async function authenticateUser() {
    try {
      if (!token) throw new Error("No token found");

      await authenticate(token);

      setVerified(true);
      setLocation("TUNNEL");
    } catch (error) {
      console.error(error);
      setLocation("GATE");
    }
  }

  const value = {
    token,
    location,
    verified,
    signupUser,
    authenticateUser,
    setLocation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
