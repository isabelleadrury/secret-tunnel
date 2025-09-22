import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");
  const [verified, setVerified] = useState(false);

  // TODO: signup
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

  // TODO: authenticate

  async function authenticateUser() {
    try {
      if (!token) throw new Error("No token found");
      await authenticate(token); // assume authenticate() is defined
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
    setLocation,
    verified,
    signupUser,
    authenticateUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
