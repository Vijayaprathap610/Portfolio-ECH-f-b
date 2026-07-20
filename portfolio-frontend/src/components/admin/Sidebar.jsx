import { useState } from "react";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUser,
  FiCode,
  FiFolderPlus,
  FiBriefcase,
  FiAward,
  FiMessageSquare,
  FiMail,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { path: "/admin/dashboard", icon: FiGrid, label: "Dashboard" },
  { path: "/admin/profile", icon: FiUser, label: "Profile" },
  { path: "/admin/skills", icon: FiCode, label: "Skills" },
  { path: "/admin/projects", icon: FiFolderPlus, label: "Projects" },
  { path: "/admin/experience", icon: FiBriefcase, label: "Experience" },
  { path: "/admin/certifications", icon: FiAward, label: "Certifications" },
  { path: "/admin/testimonials", icon: FiMessageSquare, label: "Testimonials" },
  { path: "/admin/messages", icon: FiMail, label: "Messages" },
];

function Sidebar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const onToggle = () => setCollapsed((prev) => !prev);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully.");
    navigate("/admin/login");
  };

  const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.875rem",
    padding: "0.75rem 1.25rem",
    borderRadius: "var(--radius-md)",
    color: "var(--text-muted)",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "0.9rem",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    overflow: "hidden",
    fontFamily: "var(--font-primary)",
  };

  const activeLinkStyle = {
    ...linkStyle,
    background: "rgba(var(--accent-rgb), 0.12)",
    color: "var(--accent)",
    fontWeight: 700,
  };

  return (
    <aside
      style={{
        width: collapsed ? 68 : 240,
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        transition: "width 0.3s ease",
        flexShrink: 0,
        zIndex: 100,
        overflowX: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "1.25rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: "0.5rem",
          minHeight: 64,
        }}
      >
        {!collapsed && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FiCode size={16} color="white" />
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: "0.95rem",
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
              }}
            >
              Admin Panel
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            padding: "0.25rem",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {collapsed ? <FiMenu size={18} /> : <FiX size={18} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav
        style={{
          flex: 1,
          padding: "0.75rem",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        role="navigation"
        aria-label="Admin navigation"
      >
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            title={collapsed ? label : undefined}
            style={({ isActive }) => ({
              ...(isActive ? activeLinkStyle : linkStyle),
              justifyContent: collapsed ? "center" : "flex-start",
              padding: collapsed ? "0.75rem" : "0.75rem 1.25rem",
              marginBottom: "0.25rem",
              display: "flex",
            })}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  style={{
                    flexShrink: 0,
                    color: isActive ? "var(--accent)" : "var(--text-muted)",
                  }}
                />
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin Info + Logout */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid var(--border)" }}>
        {!collapsed && (
          <div
            style={{
              padding: "0.75rem 1rem",
              marginBottom: "0.5rem",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <p
              style={{
                color: "var(--text-primary)",
                fontWeight: 700,
                margin: "0 0 0.15rem",
                fontSize: "0.85rem",
              }}
            >
              {admin?.name || "Admin"}
            </p>
            <span
              style={{
                padding: "0.15rem 0.5rem",
                borderRadius: "var(--radius-full)",
                background: "rgba(var(--accent-rgb),0.1)",
                color: "var(--accent)",
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
            >
              {admin?.role || "admin"}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          style={{
            ...linkStyle,
            width: "100%",
            border: "none",
            cursor: "pointer",
            background: "transparent",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "0.75rem" : "0.75rem 1.25rem",
            color: "var(--danger)",
            borderRadius: "var(--radius-md)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <FiLogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
