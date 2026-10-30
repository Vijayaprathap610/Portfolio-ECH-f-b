import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiAward,
  FiBriefcase,
  FiCheckCircle,
  FiCode,
  FiFolderPlus,
  FiMail,
  FiMessageSquare,
  FiExternalLink,
  FiArrowUpRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";
import { getDashboardStats, getVisitorStats } from "../../api/analyticsApi";

const StatCard = ({ label, value, icon: Icon, color, link, badge }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className="card-custom"
    style={{
      padding: "1.25rem 1.5rem",
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      height: "100%",
    }}
  >
    <Link to={link || "#"} style={{ textDecoration: "none" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              display: "block",
              marginBottom: "0.4rem",
            }}
          >
            {label}
          </span>
          <span
            style={{
              color: "var(--text-primary)",
              fontWeight: 900,
              fontSize: "1.85rem",
              lineHeight: 1.1,
              display: "block",
            }}
          >
            {value ?? "0"}
          </span>

          {badge !== undefined && badge > 0 ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                marginTop: "0.5rem",
                padding: "0.2rem 0.55rem",
                borderRadius: "var(--radius-full)",
                background: "rgba(245, 158, 11, 0.12)",
                color: "var(--warning)",
                fontSize: "0.725rem",
                fontWeight: 700,
              }}
            >
              <FiAlertCircle size={11} /> {badge} pending
            </span>
          ) : (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                marginTop: "0.5rem",
                color: "var(--text-muted)",
                fontSize: "0.725rem",
              }}
            >
              Synced with DB
            </span>
          )}
        </div>

        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-md)",
            background: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color,
            flexShrink: 0,
          }}
        >
          <Icon size={20} />
        </div>
      </div>
    </Link>
  </motion.div>
);

function Dashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [visitors, setVisitors] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, visitorRes] = await Promise.all([
          getDashboardStats(),
          getVisitorStats(14),
        ]);
        setStats(statsRes.data.data);
        setVisitors(visitorRes.data.data);
      } catch {
        /* handled gracefully */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner message="Loading administration dashboard..." />;

  const statCards = [
    {
      label: "Projects",
      value: stats?.totalProjects,
      icon: FiFolderPlus,
      color: "#8b1a2b",
      link: "/admin/projects",
    },
    {
      label: "Skills",
      value: stats?.totalSkills,
      icon: FiCode,
      color: "#8b1a2b",
      link: "/admin/skills",
    },
    {
      label: "Testimonials",
      value: stats?.totalTestimonials,
      icon: FiMessageSquare,
      color: "#f59e0b",
      link: "/admin/testimonials",
      badge: stats?.pendingTestimonials,
    },
    {
      label: "Messages",
      value: stats?.totalMessages,
      icon: FiMail,
      color: "#2c6b8a",
      link: "/admin/messages",
      badge: stats?.unreadMessages,
    },
    {
      label: "Certifications",
      value: stats?.totalCertifications,
      icon: FiAward,
      color: "#ec4899",
      link: "/admin/certifications",
    },
    {
      label: "Experience",
      value: stats?.totalExperience,
      icon: FiBriefcase,
      color: "#8b5cf6",
      link: "/admin/experience",
    },
  ];

  const totalVisitors = visitors?.totalVisitors || 0;
  const visitorData = visitors?.stats || [];

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
          paddingBottom: "1.25rem",
          borderBottom: "1px solid var(--divider)",
        }}
      >
        <div>
          <h1
            style={{
              color: "var(--text-primary)",
              fontWeight: 900,
              fontSize: "1.85rem",
              margin: "0 0 0.35rem",
              letterSpacing: "-0.02em",
            }}
          >
            Welcome, <span className="gradient-text">{admin?.name || "Admin"}</span>
          </h1>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>
            Operational telemetry, database content counters, and quick management links.
          </p>
        </div>

        <Link
          to="/"
          target="_blank"
          className="btn-outline-accent"
          style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
        >
          View Public Site <FiExternalLink size={13} />
        </Link>
      </div>

      {/* Stats Counter Grid */}
      <div className="row g-3 mb-4">
        {statCards.map((card) => (
          <div key={card.label} className="col-12 col-sm-6 col-md-4 col-xl-2">
            <StatCard {...card} />
          </div>
        ))}
      </div>

      {/* Analytics & Quick Actions Section */}
      <div className="row g-4 mb-4">
        {/* Visitor Activity Chart */}
        <div className="col-12 col-lg-7">
          <div
            className="card-custom"
            style={{
              padding: "1.75rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <h3
                  style={{
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    margin: "0 0 0.2rem",
                  }}
                >
                  Visitor Volume (Last 14 Days)
                </h3>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  Unique sessions registered across portfolio routes
                </span>
              </div>
              <span
                style={{
                  color: "var(--accent-light)",
                  fontWeight: 900,
                  fontSize: "1.5rem",
                }}
              >
                {totalVisitors.toLocaleString()}
              </span>
            </div>

            {visitorData.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "6px",
                  height: 110,
                  marginTop: "auto",
                  paddingTop: "1rem",
                }}
              >
                {visitorData.map((d, i) => {
                  const max = Math.max(...visitorData.map((v) => v.count), 1);
                  const h = Math.max(8, (d.count / max) * 100);
                  return (
                    <div
                      key={i}
                      title={`${d.date}: ${d.count} visits`}
                      style={{
                        flex: 1,
                        height: `${h}%`,
                        background: "var(--accent-gradient)",
                        borderRadius: "4px 4px 0 0",
                        opacity: 0.85,
                        transition: "all var(--transition-fast)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.transform = "scaleY(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "0.85";
                        e.currentTarget.style.transform = "none";
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  height: 110,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  fontSize: "0.875rem",
                  background: "var(--bg-surface)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                No visitor telemetry recorded in this period.
              </div>
            )}
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="col-12 col-lg-5">
          <div
            className="card-custom"
            style={{
              padding: "1.75rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              height: "100%",
            }}
          >
            <h3
              style={{
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: "1.1rem",
                marginBottom: "1.25rem",
              }}
            >
              Content Management Quick Tasks
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {[
                {
                  label: "Manage Portfolio Projects",
                  to: "/admin/projects",
                  icon: FiFolderPlus,
                  color: "#8b1a2b",
                },
                {
                  label: "Configure Technical Skills",
                  to: "/admin/skills",
                  icon: FiCode,
                  color: "#8b1a2b",
                },
                {
                  label: "Review Endorsements",
                  to: "/admin/testimonials",
                  icon: FiMessageSquare,
                  color: "#f59e0b",
                  badge: stats?.pendingTestimonials,
                },
                {
                  label: "Review Inbound Messages",
                  to: "/admin/messages",
                  icon: FiMail,
                  color: "#2c6b8a",
                  badge: stats?.unreadMessages,
                },
              ].map(({ label, to, icon: Icon, color, badge }) => (
                <Link
                  key={label}
                  to={to}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.85rem 1rem",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    color: "var(--text-primary)",
                    transition: "all var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.transform = "translateX(3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}
                  >
                    <Icon size={16} color={color} /> {label}
                  </span>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {badge > 0 && (
                      <span
                        style={{
                          background: "var(--warning)",
                          color: "#ffffff",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          padding: "0.15rem 0.5rem",
                          borderRadius: "var(--radius-full)",
                        }}
                      >
                        {badge} new
                      </span>
                    )}
                    <FiArrowUpRight size={15} color="var(--text-muted)" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Integrity & Readiness Card */}
      <div
        className="card-custom"
        style={{
          padding: "1.5rem",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <h3
          style={{
            color: "var(--text-primary)",
            fontWeight: 700,
            fontSize: "1rem",
            marginBottom: "1rem",
          }}
        >
          Portfolio System Health
        </h3>
        <div className="row g-3">
          {[
            { label: "Projects Online", ok: stats?.totalProjects > 0 },
            { label: "Skills Seeded", ok: stats?.totalSkills > 0 },
            { label: "Experience Registered", ok: stats?.totalExperience > 0 },
            { label: "Certificates Configured", ok: stats?.totalCertifications > 0 },
            { label: "Endorsements Active", ok: stats?.totalTestimonials > 0 },
            {
              label: "Zero Unread Inquiries",
              ok: stats?.unreadMessages === 0,
              warnIfFalse: true,
            },
          ].map(({ label, ok, warnIfFalse }) => (
            <div key={label} className="col-12 col-sm-6 col-md-4">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: ok
                    ? "var(--success)"
                    : warnIfFalse
                    ? "var(--warning)"
                    : "var(--text-muted)",
                }}
              >
                {ok ? <FiCheckCircle size={15} /> : <FiAlertCircle size={15} />}
                <span>{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
