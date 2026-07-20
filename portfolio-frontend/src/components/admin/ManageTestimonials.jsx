import { useState } from "react";
import { motion } from "framer-motion";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import { formatDate, getErrorMessage, getInitials } from "../../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  getAllTestimonials,
  approveTestimonial,
  rejectTestimonial,
  deleteTestimonial,
} from "../../api/testimonialsApi";
import StarRating from "../common/StarRating";
import { FiCheck, FiTrash2, FiX } from "react-icons/fi";

const STATUS_COLORS = {
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
};

function ManageTestimonials() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const { data, loading, refetch } = useFetch(
    () => getAllTestimonials({ status: statusFilter, limit: 50 }),
    null,
    [statusFilter],
  );
  const [actingId, setActingId] = useState(null);
  const testimonials = data?.data || [];

  const act = async (fn, id, msg) => {
    setActingId(id);
    try {
      await fn(id);
      toast.success(msg);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading testimonials..." />;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            color: "var(--text-primary)",
            fontWeight: 900,
            fontSize: "1.5rem",
            margin: "0 0 0.25rem",
          }}
        >
          Manage Testimonials
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            margin: 0,
            fontSize: "0.875rem",
          }}
        >
          Review and approve testimonials from visitors.
        </p>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {["pending", "approved", "rejected", "all"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "var(--radius-full)",
              border: `1.5px solid ${statusFilter === s ? STATUS_COLORS[s] || "var(--accent)" : "var(--border)"}`,
              background:
                statusFilter === s
                  ? `${STATUS_COLORS[s] || "var(--accent)"}18`
                  : "transparent",
              color:
                statusFilter === s
                  ? STATUS_COLORS[s] || "var(--accent)"
                  : "var(--text-muted)",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
              textTransform: "capitalize",
              fontFamily: "var(--font-primary)",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {testimonials.length === 0 ? (
        <div
          className="card-custom"
          style={{ padding: "3rem", textAlign: "center" }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💬</div>
          <p style={{ color: "var(--text-muted)" }}>
            No {statusFilter} testimonials.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {testimonials.map((t) => (
            <motion.div
              key={t._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-custom"
              style={{ padding: "1.25rem" }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--accent), #a78bfa)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "white",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                  }}
                >
                  {getInitials(t.name)}
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          color: "var(--text-primary)",
                          fontWeight: 700,
                          margin: "0 0 0.15rem",
                          fontSize: "0.95rem",
                        }}
                      >
                        {t.name}
                      </p>
                      {(t.position || t.company) && (
                        <p
                          style={{
                            color: "var(--text-muted)",
                            margin: 0,
                            fontSize: "0.8rem",
                          }}
                        >
                          {[t.position, t.company].filter(Boolean).join(" @ ")}
                        </p>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <StarRating rating={t.rating} size={13} />
                      <span
                        style={{
                          padding: "0.2rem 0.6rem",
                          borderRadius: "var(--radius-full)",
                          background: `${STATUS_COLORS[t.status]}18`,
                          color: STATUS_COLORS[t.status],
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "capitalize",
                        }}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      margin: "0 0 0.75rem",
                      fontStyle: "italic",
                    }}
                  >
                    "{t.message}"
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.75rem",
                      }}
                    >
                      {formatDate(t.createdAt)}
                    </span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {t.status !== "approved" && (
                        <button
                          onClick={() =>
                            act(
                              approveTestimonial,
                              t._id,
                              "Testimonial approved.",
                            )
                          }
                          disabled={actingId === t._id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            padding: "0.4rem 0.875rem",
                            borderRadius: "var(--radius-full)",
                            border: "1.5px solid var(--success)",
                            background: "rgba(16,185,129,0.08)",
                            color: "var(--success)",
                            cursor: "pointer",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            fontFamily: "var(--font-primary)",
                          }}
                        >
                          <FiCheck size={13} /> Approve
                        </button>
                      )}
                      {t.status !== "rejected" && (
                        <button
                          onClick={() =>
                            act(
                              (id) =>
                                rejectTestimonial(
                                  id,
                                  "Does not meet quality standards.",
                                ),
                              t._id,
                              "Testimonial rejected.",
                            )
                          }
                          disabled={actingId === t._id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            padding: "0.4rem 0.875rem",
                            borderRadius: "var(--radius-full)",
                            border: "1.5px solid var(--danger)",
                            background: "rgba(239,68,68,0.08)",
                            color: "var(--danger)",
                            cursor: "pointer",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            fontFamily: "var(--font-primary)",
                          }}
                        >
                          <FiX size={13} /> Reject
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm("Delete this testimonial?"))
                            act(deleteTestimonial, t._id, "Deleted.");
                        }}
                        disabled={actingId === t._id}
                        style={{
                          width: 32,
                          height: 32,
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-sm)",
                          background: "transparent",
                          cursor: "pointer",
                          color: "var(--text-muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        aria-label="Delete testimonial"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageTestimonials;
