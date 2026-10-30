import { useState } from "react";
import { motion } from "framer-motion";
import { FiEdit2, FiPlus, FiSave, FiTrash2, FiX } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../utils/helpers";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../../api/skillsApi";
import { AnimatePresence } from "framer-motion";

const CATEGORIES = ["Frontend", "Backend", "Database", "UI/UX Design", "Tools", "Soft Skills"];
const FORM_INITIAL = {
  name: "",
  category: "Frontend",
  percentage: 80,
  icon: "FaCode",
  color: "#6c63ff",
  description: "",
  isVisible: true,
  order: 0,
};

const SkillForm = ({ initial, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(initial);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };
  const inputStyle = {
    width: "100%",
    padding: "0.7rem 1rem",
    background: "var(--bg-input)",
    border: "1.5px solid var(--border)",
    borderRadius: "var(--radius-md)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-primary)",
    fontSize: "0.875rem",
    outline: "none",
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="row g-3">
        <div className="col-12 col-sm-6">
          <label className="form-label-custom">Skill Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. React.js"
            style={inputStyle}
          />
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label-custom">Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-sm-4">
          <label className="form-label-custom">Proficiency % (0–100) *</label>
          <input
            name="percentage"
            type="number"
            min={0}
            max={100}
            value={form.percentage}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div className="col-12 col-sm-4">
          <label className="form-label-custom">Color (hex)</label>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
              style={{
                width: 44,
                height: 38,
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                padding: 2,
                background: "none",
              }}
            />
            <input
              name="color"
              value={form.color}
              onChange={handleChange}
              style={{ ...inputStyle, flex: 1 }}
              placeholder="#6c63ff"
            />
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <label className="form-label-custom">Order</label>
          <input
            name="order"
            type="number"
            value={form.order}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div className="col-12">
          <label className="form-label-custom">Icon Name (react-icons)</label>
          <input
            name="icon"
            value={form.icon}
            onChange={handleChange}
            placeholder="FaReact"
            style={inputStyle}
          />
        </div>
        <div className="col-12">
          <label className="form-label-custom">Description (optional)</label>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Brief description..."
            style={inputStyle}
          />
        </div>
        <div className="col-12">
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
            }}
          >
            <input
              type="checkbox"
              name="isVisible"
              checked={form.isVisible}
              onChange={handleChange}
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            Visible on portfolio
          </label>
        </div>
        <div
          className="col-12"
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline-accent"
            disabled={loading}
          >
            <FiX size={15} /> Cancel
          </button>
          <button type="submit" className="btn-accent" disabled={loading}>
            <FiSave size={15} /> {loading ? "Saving..." : "Save Skill"}
          </button>
        </div>
      </div>
    </form>
  );
};

function ManageSkills() {
  const { data, loading, error, refetch } = useFetch(getSkills);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const skills = data?.data?.skills || [];
  const grouped = data?.data?.grouped || {};

  const displaySkills =
    activeCategory === "All" ? skills : grouped[activeCategory] || [];

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await createSkill(form);
      toast.success("Skill created successfully.");
      setShowForm(false);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await updateSkill(editTarget._id, form);
      toast.success("Skill updated successfully.");
      setEditTarget(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    setDeletingId(id);
    try {
      await deleteSkill(id);
      toast.success("Skill deleted.");
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading skills..." />;
  if (error)
    return <p style={{ color: "var(--danger)" }}>Failed to load skills.</p>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1
            style={{
              color: "var(--text-primary)",
              fontWeight: 900,
              fontSize: "1.5rem",
              margin: 0,
            }}
          >
            Manage Skills
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              margin: 0,
              fontSize: "0.875rem",
            }}
          >
            {skills.length} total skills
          </p>
        </div>
        {!showForm && !editTarget && (
          <button onClick={() => setShowForm(true)} className="btn-accent">
            <FiPlus size={16} /> Add Skill
          </button>
        )}
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="card-custom"
            style={{ padding: "1.5rem", marginBottom: "2rem" }}
          >
            <h5
              style={{
                color: "var(--text-primary)",
                fontWeight: 700,
                marginBottom: "1.25rem",
              }}
            >
              Add New Skill
            </h5>
            <SkillForm
              initial={FORM_INITIAL}
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              loading={saving}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filter */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "var(--radius-full)",
              border: `1.5px solid ${activeCategory === cat ? "var(--accent)" : "var(--border)"}`,
              background:
                activeCategory === cat
                  ? "rgba(var(--accent-rgb),0.1)"
                  : "transparent",
              color:
                activeCategory === cat ? "var(--accent)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.8rem",
              cursor: "pointer",
              fontFamily: "var(--font-primary)",
              transition: "all 0.2s ease",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Table */}
      <div className="card-custom" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "var(--bg-secondary)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {["Skill", "Category", "Proficiency", "Visible", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.875rem 1.25rem",
                        textAlign: "left",
                        color: "var(--text-muted)",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {displaySkills.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "var(--text-muted)",
                    }}
                  >
                    No skills found.
                  </td>
                </tr>
              ) : (
                displaySkills.map((skill) => (
                  <tr
                    key={skill._id}
                    style={{
                      borderBottom: "1px solid var(--divider)",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--bg-card-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {editTarget?._id === skill._id ? (
                      <td colSpan={5} style={{ padding: "1.25rem" }}>
                        <SkillForm
                          initial={editTarget}
                          onSubmit={handleUpdate}
                          onCancel={() => setEditTarget(null)}
                          loading={saving}
                        />
                      </td>
                    ) : (
                      <>
                        <td style={{ padding: "1rem 1.25rem" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                            }}
                          >
                            <span
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                background: skill.color,
                                display: "inline-block",
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                color: "var(--text-primary)",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                              }}
                            >
                              {skill.name}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "1rem 1.25rem" }}>
                          <span
                            className="badge-custom"
                            style={{ fontSize: "0.72rem" }}
                          >
                            {skill.category}
                          </span>
                        </td>
                        <td style={{ padding: "1rem 1.25rem" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                height: 6,
                                background: "var(--bg-secondary)",
                                borderRadius: "var(--radius-full)",
                                overflow: "hidden",
                                minWidth: 80,
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  width: `${skill.percentage}%`,
                                  background: skill.color,
                                  borderRadius: "var(--radius-full)",
                                }}
                              />
                            </div>
                            <span
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "0.8rem",
                                fontFamily: "var(--font-mono)",
                                flexShrink: 0,
                              }}
                            >
                              {skill.percentage}%
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "1rem 1.25rem" }}>
                          <span
                            style={{
                              color: skill.isVisible
                                ? "var(--success)"
                                : "var(--text-muted)",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            {skill.isVisible ? "✓ Yes" : "✗ No"}
                          </span>
                        </td>
                        <td style={{ padding: "1rem 1.25rem" }}>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              onClick={() => setEditTarget(skill)}
                              style={{
                                width: 32,
                                height: 32,
                                border: "1px solid var(--border)",
                                borderRadius: "var(--radius-sm)",
                                background: "transparent",
                                cursor: "pointer",
                                color: "var(--accent)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              aria-label={`Edit ${skill.name}`}
                            >
                              <FiEdit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(skill._id)}
                              disabled={deletingId === skill._id}
                              style={{
                                width: 32,
                                height: 32,
                                border: "1px solid rgba(239,68,68,0.3)",
                                borderRadius: "var(--radius-sm)",
                                background: "transparent",
                                cursor: "pointer",
                                color: "var(--danger)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              aria-label={`Delete ${skill.name}`}
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageSkills;
