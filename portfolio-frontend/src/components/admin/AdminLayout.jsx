import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Sidebar from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { FiMoon, FiSun, FiExternalLink, FiShield } from "react-icons/fi";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const { admin } = useAuth();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-primary)",
      }}
    >
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {/* Top Header Bar */}
        <header
          style={{
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border)",
            padding: "0 1.5rem",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 50,
            gap: "1rem",
          }}
        >
          {/* Breadcrumb / Status Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.25rem 0.65rem",
                borderRadius: "var(--radius-full)",
                background: "rgba(var(--accent-rgb), 0.12)",
                color: "var(--accent-light)",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "1px solid rgba(var(--accent-rgb), 0.2)",
              }}
            >
              <FiShield size={12} /> Elite Code Hub Control Center
            </span>
          </div>

          {/* Top Actions */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            {/* View Live Portfolio Link */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.4rem 0.85rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text-secondary)",
                fontSize: "0.8rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all var(--transition-fast)",
              }}
            >
              <FiExternalLink size={13} color="var(--accent-light)" />
              <span className="d-none d-sm-inline">Live Website</span>
            </a>

            {/* Dark / Light Mode Switch */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                cursor: "pointer",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={isDark ? "sun" : "moon"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* Admin Profile Snapshot */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.35rem 0.75rem",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    color: "white",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                  }}
                >
                  {admin?.name?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <div className="d-none d-sm-block">
                <p
                  style={{
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    margin: 0,
                    fontSize: "0.8rem",
                    lineHeight: 1.1,
                  }}
                >
                  {admin?.name || "VIJAYAPRATHAP K"}
                </p>
                <p
                  style={{
                    color: "var(--accent-light)",
                    margin: 0,
                    fontSize: "0.68rem",
                    fontWeight: 600,
                  }}
                >
                  {admin?.role || "Administrator"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          style={{
            flex: 1,
            padding: "2rem 1.5rem",
            overflowY: "auto",
            background: "var(--bg-primary)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
