import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import {
  FiCode,
  FiEye,
  FiEyeOff,
  FiLock,
  FiLogIn,
  FiUser,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", secretKey: "" });
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate("/admin/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Admin name is required.";
    if (!form.secretKey.trim()) e.secretKey = "Secret key is required.";
    else if (form.secretKey.length < 6)
      e.secretKey = "Secret key must be at least 6 characters.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setErrors({});
    const result = await login(form.name.trim(), form.secretKey);
    if (result.success) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      setErrors({ submit: result.message });
    }
    setLoading(false);
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "0.875rem 1rem 0.875rem 2.75rem",
    background: "var(--bg-input)",
    border: `1.5px solid ${errors[field] ? "var(--danger)" : "var(--border)"}`,
    borderRadius: "var(--radius-md)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-primary)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        position: "relative",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          width: 40,
          height: 40,
          borderRadius: "var(--radius-full)",
          border: "1px solid var(--border)",
          background: "var(--bg-card)",
          cursor: "pointer",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        {isDark ? "☀️" : "🌙"}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              <FiCode size={22} color="white" />
            </div>
            <span
              style={{
                fontWeight: 900,
                fontSize: "1.3rem",
                color: "var(--text-primary)",
              }}
            >
              Elite<span style={{ color: "var(--accent)" }}>Code</span>Hub
            </span>
          </Link>
          <p
            style={{
              color: "var(--text-muted)",
              marginTop: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div className="card-custom" style={{ padding: "2rem" }}>
          <h2
            style={{
              color: "var(--text-primary)",
              fontWeight: 800,
              textAlign: "center",
              marginBottom: "0.25rem",
              fontSize: "1.4rem",
            }}
          >
            Welcome Back
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              textAlign: "center",
              marginBottom: "1.75rem",
              fontSize: "0.875rem",
            }}
          >
            Sign in to manage your portfolio
          </p>

          {/* Error Banner */}
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "0.875rem 1rem",
                borderRadius: "var(--radius-md)",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "var(--danger)",
                fontSize: "0.875rem",
                marginBottom: "1.25rem",
                textAlign: "center",
              }}
            >
              {errors.submit}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Admin Name */}
            <div style={{ marginBottom: "1rem" }}>
              <label className="form-label-custom" htmlFor="admin-name">
                Admin Name
              </label>
              <div style={{ position: "relative" }}>
                <FiUser
                  size={16}
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="admin-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, name: e.target.value }));
                    if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                  }}
                  placeholder="Enter admin name"
                  autoComplete="username"
                  style={inputStyle("name")}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--accent)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(108,99,255,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.name
                      ? "var(--danger)"
                      : "var(--border)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              {errors.name && (
                <p
                  style={{
                    color: "var(--danger)",
                    fontSize: "0.78rem",
                    margin: "0.25rem 0 0",
                  }}
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Secret Key */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="form-label-custom" htmlFor="secret-key">
                Secret Key
              </label>
              <div style={{ position: "relative" }}>
                <FiLock
                  size={16}
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="secret-key"
                  type={showKey ? "text" : "password"}
                  value={form.secretKey}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, secretKey: e.target.value }));
                    if (errors.secretKey)
                      setErrors((p) => ({ ...p, secretKey: "" }));
                  }}
                  placeholder="Enter your secret key"
                  autoComplete="current-password"
                  style={{ ...inputStyle("secretKey"), paddingRight: "3rem" }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--accent)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(108,99,255,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.secretKey
                      ? "var(--danger)"
                      : "var(--border)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  aria-label={showKey ? "Hide secret key" : "Show secret key"}
                  style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showKey ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.secretKey && (
                <p
                  style={{
                    color: "var(--danger)",
                    fontSize: "0.78rem",
                    margin: "0.25rem 0 0",
                  }}
                >
                  {errors.secretKey}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="btn-accent"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "0.9rem",
                fontSize: "1rem",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  Authenticating...
                </span>
              ) : (
                <>
                  <FiLogIn size={17} /> Sign In
                </>
              )}
            </motion.button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.8rem",
            marginTop: "1.5rem",
          }}
        >
          <Link to="/" style={{ color: "var(--accent)" }}>
            ← Back to Portfolio
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
