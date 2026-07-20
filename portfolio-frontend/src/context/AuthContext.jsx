/*eslint-disable react-refresh/only-export-components*/
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  adminLogin as loginAPI,
  adminLogout as logoutAPI,
  getAdminMe,
} from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("elitecodehub_admin");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(
    () => localStorage.getItem("elitecodehub_token") || null,
  );
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getAdminMe();
        setAdmin(res.data.data);
        localStorage.setItem(
          "elitecodehub_admin",
          JSON.stringify(res.data.data),
        );
      } catch {
        // Token invalid — clear everything
        localStorage.removeItem("elitecodehub_token");
        localStorage.removeItem("elitecodehub_admin");
        setAdmin(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token]);

  const login = useCallback(async (name, secretKey) => {
    setAuthError(null);
    try {
      const res = await loginAPI({ name, secretKey });
      const { token: newToken, admin: adminData } = res.data.data;
      localStorage.setItem("elitecodehub_token", newToken);
      localStorage.setItem("elitecodehub_admin", JSON.stringify(adminData));
      setToken(newToken);
      setAdmin(adminData);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setAuthError(message);
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAPI();
    } catch {
      // Proceed with local logout even if API fails
    } finally {
      localStorage.removeItem("elitecodehub_token");
      localStorage.removeItem("elitecodehub_admin");
      setAdmin(null);
      setToken(null);
    }
  }, []);

  const isAuthenticated = !!admin && !!token;

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        loading,
        authError,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;