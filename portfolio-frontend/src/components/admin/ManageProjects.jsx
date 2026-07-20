import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import { getErrorMessage, getImageUrl } from "../../utils/helpers";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../api/projectsApi";
import LoadingSpinner from "../common/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";

const CATEGORIES = [
  "Web App",
  "Mobile App",
  "API",
  "UI/UX",
  "Open Source",
  "Other",
];
const STATUSES = ["Completed", "In Progress", "Planned"];

const FORM_INITIAL = {
  title: "",
  description: "",
  shortDescription: "",
  category: "Web App",
  technologies: "",
  features: "",
  challenges: "",
  solutions: "",
  liveUrl: "",
  githubUrl: "",
  isFeatured: false,
  isVisible: true,
  status: "Completed",
};

const ProjectForm = ({ initial, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(initial);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    files.forEach((f) => fd.append("images", f));
    onSubmit(fd);
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
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12 col-sm-8">
          <label className="form-label-custom">Project Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="My Awesome Project"
            style={inputStyle}
          />
        </div>
        <div className="col-12 col-sm-4">
          <label className="form-label-custom">Category</label>
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
        <div className="col-12">
          <label className="form-label-custom">Short Description</label>
          <input
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            placeholder="One-liner summary..."
            style={inputStyle}
            maxLength={300}
          />
        </div>
        <div className="col-12">
          <label className="form-label-custom">Full Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Detailed description of the project..."
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label-custom">
            Technologies (comma-separated)
          </label>
          <input
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB"
            style={inputStyle}
          />
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label-custom">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <label className="form-label-custom">
            Key Features (comma-separated)
          </label>
          <input
            name="features"
            value={form.features}
            onChange={handleChange}
            placeholder="User Auth, Dark Mode, Responsive Design"
            style={inputStyle}
          />
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label-custom">Live URL</label>
          <input
            name="liveUrl"
            value={form.liveUrl}
            onChange={handleChange}
            type="url"
            placeholder="https://myproject.com"
            style={inputStyle}
          />
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label-custom">GitHub URL</label>
          <input
            name="githubUrl"
            value={form.githubUrl}
            onChange={handleChange}
            type="url"
            placeholder="https://github.com/user/repo"
            style={inputStyle}
          />
        </div>
        <div className="col-12">
          <label className="form-label-custom">Upload Images (max 10)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFiles}
            style={{ ...inputStyle, padding: "0.5rem", cursor: "pointer" }}
          />
          {previews.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginTop: "0.75rem",
              }}
            >
              {previews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Preview ${i + 1}`}
                  style={{
                    width: 80,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <div
          className="col-12"
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
        >
          {[
            { name: "isFeatured", label: "Featured project" },
            { name: "isVisible", label: "Visible on portfolio" },
          ].map(({ name, label }) => (
            <label
              key={name}
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
                name={name}
                checked={form[name]}
                onChange={handleChange}
                style={{ width: 16, height: 16 }}
              />
              {label}
            </label>
          ))}
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
            {loading ? "Saving..." : "Save Project"}
          </button>
        </div>
      </div>
    </form>
  );
};

function ManageProjects() {
  const { data, loading, refetch } = useFetch(() => getProjects({ limit: 50 }));
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const projects = data?.data || [];

  const handleCreate = async (fd) => {
    setSaving(true);
    try {
      await createProject(fd);
      toast.success("Project created successfully.");
      setShowForm(false);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (fd) => {
    setSaving(true);
    try {
      await updateProject(editTarget._id, fd);
      toast.success("Project updated.");
      setEditTarget(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Delete this project? This will also delete its images.")
    )
      return;
    setDeletingId(id);
    try {
      await deleteProject(id);
      toast.success("Project deleted.");
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading projects..." />;

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
            Manage Projects
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              margin: 0,
              fontSize: "0.875rem",
            }}
          >
            {projects.length} projects
          </p>
        </div>
        {!showForm && !editTarget && (
          <button onClick={() => setShowForm(true)} className="btn-accent">
            <FiPlus size={16} /> Add Project
          </button>
        )}
      </div>

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
              {editTarget ? "Edit Project" : "Add New Project"}
            </h5>
            <ProjectForm
              initial={
                editTarget
                  ? {
                      ...FORM_INITIAL,
                      ...editTarget,
                      technologies: editTarget.technologies?.join(", ") || "",
                      features: editTarget.features?.join(", ") || "",
                    }
                  : FORM_INITIAL
              }
              onSubmit={editTarget ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditTarget(null);
              }}
              loading={saving}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div
          className="card-custom"
          style={{ padding: "3rem", textAlign: "center" }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📁</div>
          <p style={{ color: "var(--text-muted)" }}>
            No projects yet. Add your first project!
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {projects.map((project) => (
            <div key={project._id} className="col-12 col-md-6 col-xl-4">
              <div
                className="card-custom"
                style={{ padding: 0, overflow: "hidden" }}
              >
                {project.images?.[0] && (
                  <img
                    src={getImageUrl(project.images[0].url)}
                    alt={project.title}
                    style={{ width: "100%", height: 160, objectFit: "cover" }}
                    loading="lazy"
                  />
                )}
                <div style={{ padding: "1.25rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <h6
                      style={{
                        color: "var(--text-primary)",
                        fontWeight: 700,
                        margin: 0,
                        fontSize: "0.95rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {project.title}
                    </h6>
                    <div
                      style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}
                    >
                      <button
                        onClick={() => setEditTarget(project)}
                        style={{
                          width: 30,
                          height: 30,
                          border: "1px solid var(--border)",
                          borderRadius: 6,
                          background: "transparent",
                          cursor: "pointer",
                          color: "var(--accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        aria-label={`Edit ${project.title}`}
                      >
                        <FiEdit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        disabled={deletingId === project._id}
                        style={{
                          width: 30,
                          height: 30,
                          border: "1px solid rgba(239,68,68,0.3)",
                          borderRadius: 6,
                          background: "transparent",
                          cursor: "pointer",
                          color: "var(--danger)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        aria-label={`Delete ${project.title}`}
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.35rem",
                      flexWrap: "wrap",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span
                      className="badge-custom"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {project.category}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "var(--radius-full)",
                        background: project.isVisible
                          ? "rgba(16,185,129,0.1)"
                          : "rgba(107,114,128,0.1)",
                        color: project.isVisible
                          ? "var(--success)"
                          : "var(--text-muted)",
                        fontWeight: 600,
                      }}
                    >
                      {project.isVisible ? "Visible" : "Hidden"}
                    </span>
                    {project.isFeatured && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "var(--radius-full)",
                          background: "rgba(245,158,11,0.1)",
                          color: "var(--warning)",
                          fontWeight: 600,
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>
                  {project.technologies?.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.3rem",
                      }}
                    >
                      {project.technologies.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: "0.68rem",
                            padding: "0.1rem 0.45rem",
                            borderRadius: "var(--radius-full)",
                            background: "var(--bg-secondary)",
                            color: "var(--text-muted)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span
                          style={{
                            fontSize: "0.68rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageProjects;
