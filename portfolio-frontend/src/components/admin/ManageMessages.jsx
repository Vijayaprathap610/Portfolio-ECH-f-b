import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import LoadingSpinner from "../common/LoadingSpinner";
import { formatDate, getErrorMessage } from "../../utils/helpers";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiMail, FiTrash2, FiX } from "react-icons/fi";
import {
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
} from "../../api/contactApi";

const STATUS_COLORS = {
  unread: "#6c63ff",
  read: "#3b82f6",
  replied: "#10b981",
  archived: "#6b7280",
};

function ManageMessages() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, loading, refetch } = useFetch(
    () => getMessages({ status: statusFilter, limit: 50 }),
    null,
    [statusFilter],
  );
  const [selected, setSelected] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [actingId, setActingId] = useState(null);

  const messages = data?.data || [];

  const handleView = async (msg) => {
    setViewLoading(true);
    try {
      const res = await getMessageById(msg._id);
      setSelected(res.data.data);
      refetch();
    } catch {
      setSelected(msg);
    } finally {
      setViewLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    setActingId(id);
    try {
      await updateMessageStatus(id, status);
      toast.success(`Marked as ${status}.`);
      if (selected?._id === id) setSelected((p) => ({ ...p, status }));
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    setActingId(id);
    try {
      await deleteMessage(id);
      toast.success("Message deleted.");
      if (selected?._id === id) setSelected(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading messages..." />;

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
          Messages
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            margin: 0,
            fontSize: "0.875rem",
          }}
        >
          {messages.length} message(s) found
        </p>
      </div>

      {/* Filter */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {["all", "unread", "read", "replied", "archived"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: "0.4rem 1rem",
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
              fontWeight: 600,
              fontSize: "0.78rem",
              cursor: "pointer",
              textTransform: "capitalize",
              fontFamily: "var(--font-primary)",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="row g-4">
        {/* Message List */}
        <div className={selected ? "col-12 col-lg-5" : "col-12"}>
          {messages.length === 0 ? (
            <div
              className="card-custom"
              style={{ padding: "3rem", textAlign: "center" }}
            >
              <FiMail
                size={40}
                style={{ color: "var(--text-muted)", marginBottom: "1rem" }}
              />
              <p style={{ color: "var(--text-muted)" }}>No messages found.</p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  layout
                  onClick={() => handleView(msg)}
                  className="card-custom"
                  style={{
                    padding: "1rem 1.25rem",
                    cursor: "pointer",
                    borderColor:
                      selected?._id === msg._id
                        ? "rgba(var(--accent-rgb),0.4)"
                        : "var(--border)",
                    borderLeftWidth: 4,
                    borderLeftStyle: "solid",
                    borderLeftColor:
                      STATUS_COLORS[msg.status] || "var(--border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {!msg.isRead && (
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "var(--accent)",
                              flexShrink: 0,
                              display: "inline-block",
                            }}
                          />
                        )}
                        <p
                          style={{
                            color: "var(--text-primary)",
                            fontWeight: 700,
                            margin: 0,
                            fontSize: "0.9rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {msg.name}
                        </p>
                      </div>
                      <p
                        style={{
                          color: "var(--accent)",
                          margin: "0 0 0.25rem",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {msg.subject}
                      </p>
                      <p
                        style={{
                          color: "var(--text-muted)",
                          margin: 0,
                          fontSize: "0.78rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {msg.email}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p
                        style={{
                          color: "var(--text-muted)",
                          margin: "0 0 0.3rem",
                          fontSize: "0.72rem",
                        }}
                      >
                        {formatDate(msg.createdAt, {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <span
                        style={{
                          padding: "0.15rem 0.5rem",
                          borderRadius: "var(--radius-full)",
                          background: `${STATUS_COLORS[msg.status]}18`,
                          color: STATUS_COLORS[msg.status],
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          textTransform: "capitalize",
                        }}
                      >
                        {msg.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <AnimatePresence>
          {(viewLoading || selected) && (
            <motion.div
              className="col-12 col-lg-7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {viewLoading && !selected ? (
                <div className="card-custom" style={{ padding: "1.5rem" }}>
                  <LoadingSpinner message="Loading message..." />
                </div>
              ) : (
                selected && (
                  <div className="card-custom" style={{ padding: "1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "1.25rem",
                      }}
                    >
                      <div>
                        <h5
                          style={{
                            color: "var(--text-primary)",
                            fontWeight: 800,
                            margin: "0 0 0.25rem",
                          }}
                        >
                          {selected.subject}
                        </h5>
                        <p
                          style={{
                            color: "var(--text-muted)",
                            margin: 0,
                            fontSize: "0.85rem",
                          }}
                        >
                          From: {selected.name} &lt;{selected.email}&gt;
                        </p>
                        {selected.phone && (
                          <p
                            style={{
                              color: "var(--text-muted)",
                              margin: 0,
                              fontSize: "0.85rem",
                            }}
                          >
                            Phone: {selected.phone}
                          </p>
                        )}
                        <p
                          style={{
                            color: "var(--text-muted)",
                            margin: "0.25rem 0 0",
                            fontSize: "0.78rem",
                          }}
                        >
                          {formatDate(selected.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelected(null)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-muted)",
                          padding: "0.25rem",
                        }}
                        aria-label="Close message"
                      >
                        <FiX size={20} />
                      </button>
                    </div>

                    <div
                      style={{
                        background: "var(--bg-secondary)",
                        borderRadius: "var(--radius-md)",
                        padding: "1.25rem",
                        marginBottom: "1.25rem",
                        lineHeight: 1.8,
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {selected.message}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <a
                        href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                        className="btn-accent"
                        style={{
                          padding: "0.5rem 1.125rem",
                          fontSize: "0.85rem",
                        }}
                      >
                        <FiMail size={14} /> Reply via Email
                      </a>
                      {selected.status !== "replied" && (
                        <button
                          onClick={() => handleStatus(selected._id, "replied")}
                          disabled={actingId === selected._id}
                          className="btn-outline-accent"
                          style={{
                            padding: "0.45rem 1.125rem",
                            fontSize: "0.85rem",
                          }}
                        >
                          <FiCheckCircle size={14} /> Mark Replied
                        </button>
                      )}
                      {selected.status !== "archived" && (
                        <button
                          onClick={() => handleStatus(selected._id, "archived")}
                          disabled={actingId === selected._id}
                          style={{
                            padding: "0.45rem 1.125rem",
                            borderRadius: "var(--radius-full)",
                            border: "1.5px solid var(--border)",
                            background: "transparent",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            fontFamily: "var(--font-primary)",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                          }}
                        >
                          Archive
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(selected._id)}
                        disabled={actingId === selected._id}
                        style={{
                          padding: "0.45rem 1rem",
                          borderRadius: "var(--radius-full)",
                          border: "1.5px solid rgba(239,68,68,0.3)",
                          background: "rgba(239,68,68,0.06)",
                          color: "var(--danger)",
                          cursor: "pointer",
                          fontFamily: "var(--font-primary)",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ManageMessages;
