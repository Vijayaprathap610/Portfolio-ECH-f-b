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
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";
import { getDashboardStats, getVisitorStats } from "../../api/analyticsApi";

const StatCard = ({ label, value, icon: Icon, color, link, badge }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3 }}
    className="card-custom"
    style={{ padding: "1.5rem", cursor: link ? "pointer" : "default" }}
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
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.8rem",
              margin: "0 0 0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </p>
          <p
            style={{
              color: "var(--text-primary)",
              fontWeight: 900,
              fontSize: "2rem",
              margin: 0,
              lineHeight: 1,
            }}
          >
            {value ?? "—"}
          </p>
          {badge !== undefined && badge > 0 && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                marginTop: "0.5rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "var(--radius-full)",
                background: "rgba(245,158,11,0.12)",
                color: "var(--warning)",
                fontSize: "0.72rem",
                fontWeight: 700,
              }}
            >
              <FiAlertCircle size={11} /> {badge} pending
            </span>
          )}
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "var(--radius-md)",
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={22} color={color} />
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

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const statCards = [
    {
      label: "Total Projects",
      value: stats?.totalProjects,
      icon: FiFolderPlus,
      color: "var(--accent)",
      link: "/admin/projects",
    },
    {
      label: "Total Skills",
      value: stats?.totalSkills,
      icon: FiCode,
      color: "#10b981",
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
      color: "#3b82f6",
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
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            color: "var(--text-primary)",
            fontWeight: 900,
            fontSize: "1.75rem",
            margin: "0 0 0.25rem",
          }}
        >
          Welcome back,{" "}
          <span style={{ color: "var(--accent)" }}>{admin?.name}</span> 👋
        </h1>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>
          Here's what's happening with your portfolio today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="row g-3 mb-4">
        {statCards.map((card, i) => (
          <div key={card.label} className="col-6 col-md-4 col-xl-2">
            <motion.div transition={{ delay: i * 0.05 }}>
              <StatCard {...card} />
            </motion.div>
          </div>
        ))}
      </div>

      {/* Visitor Chart + Quick Actions */}
      <div className="row g-4">
        {/* Visitor Sparkline */}
        <div className="col-12 col-lg-7">
          <div className="card-custom" style={{ padding: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <h5
                style={{
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Visitors (Last 14 Days)
              </h5>
              <span
                style={{
                  color: "var(--accent)",
                  fontWeight: 800,
                  fontSize: "1.2rem",
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
                  gap: "4px",
                  height: 80,
                }}
              >
                {visitorData.map((d, i) => {
                  const max = Math.max(...visitorData.map((v) => v.count), 1);
                  const h = Math.max(4, (d.count / max) * 80);
                  return (
                    <div
                      key={i}
                      title={`${d.date}: ${d.count} visitors`}
                      style={{
                        flex: 1,
                        height: h,
                        background:
                          "linear-gradient(to top, var(--accent), var(--accent-light))",
                        borderRadius: "3px 3px 0 0",
                        opacity: 0.8,
                        transition: "opacity 0.2s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.opacity = 1;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity = 0.8;
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  fontSize: "0.875rem",
                }}
              >
                No visitor data yet.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-12 col-lg-5">
          <div className="card-custom" style={{ padding: "1.5rem" }}>
            <h5
              style={{
                color: "var(--text-primary)",
                fontWeight: 700,
                marginBottom: "1.25rem",
              }}
            >
              Quick Actions
            </h5>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.625rem",
              }}
            >
              {[
                {
                  label: "Add New Project",
                  to: "/admin/projects",
                  icon: FiFolderPlus,
                },
                { label: "Add New Skill", to: "/admin/skills", icon: FiCode },
                {
                  label: "Review Testimonials",
                  to: "/admin/testimonials",
                  icon: FiMessageSquare,
                  badge: stats?.pendingTestimonials,
                },
                {
                  label: "View Messages",
                  to: "/admin/messages",
                  icon: FiMail,
                  badge: stats?.unreadMessages,
                },
              ].map(({ label, to, icon: Icon, badge }) => (
                <Link
                  key={label}
                  to={to}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    color: "var(--text-primary)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(var(--accent-rgb),0.3)";
                    e.currentTarget.style.background =
                      "rgba(var(--accent-rgb),0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "var(--bg-primary)";
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    <Icon size={16} color="var(--accent)" /> {label}
                  </span>
                  {badge > 0 && (
                    <span
                      style={{
                        background: "var(--warning)",
                        color: "white",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "var(--radius-full)",
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status Checks */}
      <div
        className="card-custom"
        style={{ padding: "1.5rem", marginTop: "1.5rem" }}
      >
        <h5
          style={{
            color: "var(--text-primary)",
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          Portfolio Health
        </h5>
        <div className="row g-3">
          {[
            { label: "Projects added", ok: stats?.totalProjects > 0 },
            { label: "Skills configured", ok: stats?.totalSkills > 0 },
            { label: "Experience added", ok: stats?.totalExperience > 0 },
            {
              label: "Certifications added",
              ok: stats?.totalCertifications > 0,
            },
            {
              label: "Testimonials approved",
              ok: stats?.totalTestimonials > 0,
            },
            {
              label: "Messages awaiting reply",
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
                  fontSize: "0.875rem",
                  color: ok
                    ? "var(--success)"
                    : warnIfFalse
                      ? "var(--warning)"
                      : "var(--text-muted)",
                }}
              >
                {ok ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
