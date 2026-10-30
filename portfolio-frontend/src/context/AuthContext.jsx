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

const getStoredUser = () => {
  try {
    const raw =
      localStorage.getItem("elitecodehub_admin") ||
      localStorage.getItem("elitecodehub_user");
    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const getStoredToken = () => {
  const t = localStorage.getItem("elitecodehub_token");
  if (!t || t === "undefined" || t === "null") return null;
  return t;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Verify token and user data on mount
  useEffect(() => {
    let isMounted = true;
    const verify = async () => {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const res = await getAdminMe();
        const payload = res.data?.data;
        const resolved = payload?.user || payload?.admin || payload;
        if (isMounted && resolved) {
          setAdmin(resolved);
          localStorage.setItem("elitecodehub_admin", JSON.stringify(resolved));
          localStorage.setItem("elitecodehub_user", JSON.stringify(resolved));
        }
      } catch {
        // Token invalid or expired — clear storage safely
        localStorage.removeItem("elitecodehub_token");
        localStorage.removeItem("elitecodehub_admin");
        localStorage.removeItem("elitecodehub_user");
        if (isMounted) {
          setAdmin(null);
          setToken(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    verify();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = useCallback(async (name, secretKey) => {
    setAuthError(null);
    try {
      const res = await loginAPI({ name, secretKey });
      const payload = res.data?.data;
      const newToken = payload?.token;
      const adminData = payload?.admin || payload?.user || payload;

      if (newToken) {
        localStorage.setItem("elitecodehub_token", newToken);
        setToken(newToken);
      }
      if (adminData) {
        localStorage.setItem("elitecodehub_admin", JSON.stringify(adminData));
        localStorage.setItem("elitecodehub_user", JSON.stringify(adminData));
        setAdmin(adminData);
      }
      return { success: true, user: adminData, admin: adminData };
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please check credentials.";
      setAuthError(message);
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAPI();
    } catch {
      // Proceed with local logout regardless of API response
    } finally {
      localStorage.removeItem("elitecodehub_token");
      localStorage.removeItem("elitecodehub_admin");
      localStorage.removeItem("elitecodehub_user");
      setAdmin(null);
      setToken(null);
    }
  }, []);

  const isAuthenticated = Boolean(admin && token);

  return (
    <AuthContext.Provider
      value={{
        user: admin,
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
