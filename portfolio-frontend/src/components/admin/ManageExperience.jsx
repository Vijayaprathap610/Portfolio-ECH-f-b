import { useState } from "react";
import { FiEdit2, FiPlus, FiSave, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import useFetch from "../../hooks/useFetch";
import LoadingSpinner from "../common/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { getErrorMessage, formatMonthYear } from "../../utils/helpers";
import {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../../api/experienceApi";

const TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Freelance",
  "Contract",
  "Volunteer",
];

const FORM_INITIAL = {
  company: "",
  position: "",
  type: "Internship",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  responsibilities: "",
  technologies: "",
  isVisible: true,
  order: 0,
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

const ExperienceForm = ({ initial, onSubmit, onCancel, saving }) => {
  const [form, setForm] = useState(initial);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company.trim()) {
      toast.error("Company name is required.");
      return;
    }
    if (!form.position.trim()) {
      toast.error("Position is required.");
      return;
    }
    if (!form.startDate) {
      toast.error("Start date is required.");
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12 col-sm-6">
          <label className="form-label-custom">Company Name *</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            required
            placeholder="Tech Startup"
            style={inputStyle}
          />
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label-custom">Position *</label>
          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            required
            placeholder="Full Stack Developer Intern"
            style={inputStyle}
          />
        </div>
        <div className="col-12 col-sm-4">
          <label className="form-label-custom">Employment Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-sm-4">
          <label className="form-label-custom">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Chennai, TN (Remote)"
            style={inputStyle}
          />
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
        <div className="col-12 col-sm-6">
          <label className="form-label-custom">Start Date *</label>
          <input
            name="startDate"
            type="date"
            value={form.startDate ? form.startDate.split("T")[0] : ""}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label-custom">End Date</label>
          <input
            name="endDate"
            type="date"
            value={form.endDate ? form.endDate.split("T")[0] : ""}
            onChange={handleChange}
            disabled={form.isCurrent}
            style={{ ...inputStyle, opacity: form.isCurrent ? 0.5 : 1 }}
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
              name="isCurrent"
              checked={form.isCurrent}
              onChange={handleChange}
              style={{ width: 16, height: 16 }}
            />
            I currently work here
          </label>
        </div>
        <div className="col-12">
          <label className="form-label-custom">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Brief overview of the role..."
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>
        <div className="col-12">
          <label className="form-label-custom">
            Key Responsibilities{" "}
            <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
              (one per line)
            </span>
          </label>
          <textarea
            name="responsibilities"
            value={form.responsibilities}
            onChange={handleChange}
            rows={4}
            placeholder={`Built React.js dashboard components\nDesigned MongoDB schemas\nCollaborated in code reviews`}
            style={{
              ...inputStyle,
              resize: "vertical",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
            }}
          />
        </div>
        <div className="col-12">
          <label className="form-label-custom">
            Technologies Used{" "}
            <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
              (comma-separated)
            </span>
          </label>
          <input
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            placeholder="React.js, Node.js, MongoDB, Express.js"
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
              style={{ width: 16, height: 16 }}
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
            disabled={saving}
          >
            <FiX size={15} /> Cancel
          </button>
          <button type="submit" className="btn-accent" disabled={saving}>
            <FiSave size={15} /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

function ManageExperience() {
  const { data, loading, refetch } = useFetch(getExperience);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const experiences = data?.data || [];

  const preparePayload = (form) => ({
    ...form,
    responsibilities: form.responsibilities
      ? form.responsibilities
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean)
      : [],
    technologies: form.technologies
      ? form.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
  });

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await createExperience(preparePayload(form));
      toast.success("Experience added successfully.");
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
      await updateExperience(editTarget._id, preparePayload(form));
      toast.success("Experience updated.");
      setEditTarget(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this experience entry?")) return;
    setDeletingId(id);
    try {
      await deleteExperience(id);
      toast.success("Experience deleted.");
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const prepareEdit = (exp) => ({
    ...exp,
    startDate: exp.startDate ? exp.startDate.split("T")[0] : "",
    endDate: exp.endDate ? exp.endDate.split("T")[0] : "",
    responsibilities: Array.isArray(exp.responsibilities)
      ? exp.responsibilities.join("\n")
      : exp.responsibilities || "",
    technologies: Array.isArray(exp.technologies)
      ? exp.technologies.join(", ")
      : exp.technologies || "",
  });

  if (loading) return <LoadingSpinner message="Loading experience..." />;

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
            Manage Experience
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              margin: 0,
              fontSize: "0.875rem",
            }}
          >
            {experiences.length} experience entries
          </p>
        </div>
        {!showForm && !editTarget && (
          <button onClick={() => setShowForm(true)} className="btn-accent">
            <FiPlus size={16} /> Add Experience
          </button>
        )}
      </div>

      {/* Create / Edit Form */}
      <AnimatePresence>
        {(showForm || editTarget) && (
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
              {editTarget ? "Edit Experience" : "Add New Experience"}
            </h5>
            <ExperienceForm
              initial={editTarget ? prepareEdit(editTarget) : FORM_INITIAL}
              onSubmit={editTarget ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditTarget(null);
              }}
              saving={saving}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Experience List */}
      {experiences.length === 0 ? (
        <div
          className="card-custom"
          style={{ padding: "3rem", textAlign: "center" }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💼</div>
          <p style={{ color: "var(--text-muted)" }}>
            No experience entries yet. Add your first one!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {experiences.map((exp) => (
            <motion.div
              key={exp._id}
              layout
              className="card-custom"
              style={{ padding: "1.25rem" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      marginBottom: "0.35rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <h5
                      style={{
                        color: "var(--text-primary)",
                        fontWeight: 800,
                        margin: 0,
                        fontSize: "1rem",
                      }}
                    >
                      {exp.position}
                    </h5>
                    <span
                      className="badge-custom"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {exp.type}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "var(--radius-full)",
                        background: exp.isVisible
                          ? "rgba(16,185,129,0.1)"
                          : "rgba(107,114,128,0.1)",
                        color: exp.isVisible
                          ? "var(--success)"
                          : "var(--text-muted)",
                        fontWeight: 600,
                      }}
                    >
                      {exp.isVisible ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "var(--accent)",
                      fontWeight: 700,
                      margin: "0 0 0.25rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    {exp.company}
                  </p>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      margin: "0 0 0.5rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    {formatMonthYear(exp.startDate)} →{" "}
                    {exp.isCurrent ? "Present" : formatMonthYear(exp.endDate)}
                    {exp.location && ` · ${exp.location}`}
                  </p>
                  {exp.technologies?.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.3rem",
                      }}
                    >
                      {exp.technologies.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          style={{
                            fontSize: "0.68rem",
                            padding: "0.1rem 0.45rem",
                            borderRadius: "var(--radius-full)",
                            background: "var(--bg-secondary)",
                            color: "var(--text-muted)",
                            border: "1px solid var(--border)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                      {exp.technologies.length > 5 && (
                        <span
                          style={{
                            fontSize: "0.68rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          +{exp.technologies.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  <button
                    onClick={() => setEditTarget(exp)}
                    aria-label={`Edit ${exp.position}`}
                    style={{
                      width: 34,
                      height: 34,
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      background: "transparent",
                      cursor: "pointer",
                      color: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FiEdit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    disabled={deletingId === exp._id}
                    aria-label={`Delete ${exp.position}`}
                    style={{
                      width: 34,
                      height: 34,
                      border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: 8,
                      background: "transparent",
                      cursor: "pointer",
                      color: "var(--danger)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageExperience;
