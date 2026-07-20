import { useState } from "react";
import { toast } from "react-toastify";
import {
  getErrorMessage,
  getImageUrl,
  formatMonthYear,
} from "../../utils/helpers";
import {
  FiEdit2,
  FiExternalLink,
  FiPlus,
  FiSave,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from "../../api/certificationsApi";

const CATEGORIES = ["Certificate", "Achievement", "Badge", "Award", "Course"];

const FORM_INITIAL = {
  title: "",
  organization: "",
  issueDate: "",
  expiryDate: "",
  doesExpire: false,
  credentialId: "",
  credentialUrl: "",
  description: "",
  skills: "",
  category: "Certificate",
  isVisible: true,
  isFeatured: false,
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

const CertForm = ({ initial, onSubmit, onCancel, saving }) => {
  const [form, setForm] = useState(initial);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!form.organization.trim()) {
      toast.error("Organization is required.");
      return;
    }
    if (!form.issueDate) {
      toast.error("Issue date is required.");
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (file) fd.append("image", file);
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12 col-sm-8">
          <label className="form-label-custom">Certificate Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="AWS Certified Solutions Architect"
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
        <div className="col-12 col-sm-6">
          <label className="form-label-custom">Issuing Organization *</label>
          <input
            name="organization"
            value={form.organization}
            onChange={handleChange}
            required
            placeholder="Amazon Web Services"
            style={inputStyle}
          />
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label-custom">Issue Date *</label>
          <input
            name="issueDate"
            type="date"
            value={form.issueDate}
            onChange={handleChange}
            required
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
              marginBottom: "0.5rem",
            }}
          >
            <input
              type="checkbox"
              name="doesExpire"
              checked={form.doesExpire}
              onChange={handleChange}
              style={{ width: 16, height: 16 }}
            />
            This certification expires
          </label>
          {form.doesExpire && (
            <input
              name="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={handleChange}
              style={inputStyle}
            />
          )}
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label-custom">Credential ID</label>
          <input
            name="credentialId"
            value={form.credentialId}
            onChange={handleChange}
            placeholder="ABC-123-XYZ"
            style={inputStyle}
          />
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label-custom">Credential URL</label>
          <input
            name="credentialUrl"
            type="url"
            value={form.credentialUrl}
            onChange={handleChange}
            placeholder="https://verify.cert.com/abc123"
            style={inputStyle}
          />
        </div>
        <div className="col-12">
          <label className="form-label-custom">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Brief description of what this certification covers..."
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>
        <div className="col-12">
          <label className="form-label-custom">
            Skills Covered{" "}
            <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
              (comma-separated)
            </span>
          </label>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Cloud Architecture, AWS S3, Lambda"
            style={inputStyle}
          />
        </div>
        <div className="col-12">
          <label className="form-label-custom">Certificate Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{ ...inputStyle, padding: "0.5rem", cursor: "pointer" }}
          />
          {(preview || initial?.image) && (
            <img
              src={preview || getImageUrl(initial.image)}
              alt="Certificate preview"
              style={{
                marginTop: "0.75rem",
                width: "100%",
                maxHeight: 160,
                objectFit: "cover",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
              }}
            />
          )}
        </div>
        <div
          className="col-12"
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
        >
          {[
            { name: "isFeatured", label: "Featured certificate" },
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

function ManageCertifications() {
  const { data, loading, refetch } = useFetch(getCertifications);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const certs = data?.data || [];

  const handleCreate = async (fd) => {
    setSaving(true);
    try {
      await createCertification(fd);
      toast.success("Certification added successfully.");
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
      await updateCertification(editTarget._id, fd);
      toast.success("Certification updated.");
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
      !window.confirm(
        "Delete this certification? This will also delete its image.",
      )
    )
      return;
    setDeletingId(id);
    try {
      await deleteCertification(id);
      toast.success("Certification deleted.");
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const prepareEdit = (cert) => ({
    ...FORM_INITIAL,
    ...cert,
    issueDate: cert.issueDate ? cert.issueDate.split("T")[0] : "",
    expiryDate: cert.expiryDate ? cert.expiryDate.split("T")[0] : "",
    skills: Array.isArray(cert.skills)
      ? cert.skills.join(", ")
      : cert.skills || "",
  });

  if (loading) return <LoadingSpinner message="Loading certifications..." />;

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
            Manage Certifications
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              margin: 0,
              fontSize: "0.875rem",
            }}
          >
            {certs.length} certifications
          </p>
        </div>
        {!showForm && !editTarget && (
          <button onClick={() => setShowForm(true)} className="btn-accent">
            <FiPlus size={16} /> Add Certification
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
              {editTarget ? "Edit Certification" : "Add New Certification"}
            </h5>
            <CertForm
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

      {certs.length === 0 ? (
        <div
          className="card-custom"
          style={{ padding: "3rem", textAlign: "center" }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🏅</div>
          <p style={{ color: "var(--text-muted)" }}>
            No certifications added yet.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {certs.map((cert) => (
            <div key={cert._id} className="col-12 col-md-6 col-xl-4">
              <motion.div
                layout
                className="card-custom"
                style={{ padding: 0, overflow: "hidden" }}
              >
                {cert.image && (
                  <img
                    src={getImageUrl(cert.image)}
                    alt={cert.title}
                    style={{ width: "100%", height: 130, objectFit: "cover" }}
                    loading="lazy"
                  />
                )}
                <div style={{ padding: "1.1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <h6
                      style={{
                        color: "var(--text-primary)",
                        fontWeight: 700,
                        margin: 0,
                        fontSize: "0.875rem",
                        lineHeight: 1.4,
                        flex: 1,
                      }}
                    >
                      {cert.title}
                    </h6>
                    <div
                      style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}
                    >
                      <button
                        onClick={() => setEditTarget(cert)}
                        aria-label={`Edit ${cert.title}`}
                        style={{
                          width: 28,
                          height: 28,
                          border: "1px solid var(--border)",
                          borderRadius: 6,
                          background: "transparent",
                          cursor: "pointer",
                          color: "var(--accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FiEdit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(cert._id)}
                        disabled={deletingId === cert._id}
                        aria-label={`Delete ${cert.title}`}
                        style={{
                          width: 28,
                          height: 28,
                          border: "1px solid rgba(239,68,68,0.3)",
                          borderRadius: 6,
                          background: "transparent",
                          cursor: "pointer",
                          color: "var(--danger)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <p
                    style={{
                      color: "var(--accent)",
                      fontWeight: 600,
                      margin: "0 0 0.4rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    {cert.organization}
                  </p>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      margin: "0 0 0.6rem",
                      fontSize: "0.75rem",
                    }}
                  >
                    Issued: {formatMonthYear(cert.issueDate)}
                    {cert.doesExpire &&
                      cert.expiryDate &&
                      ` · Expires: ${formatMonthYear(cert.expiryDate)}`}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.35rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      className="badge-custom"
                      style={{ fontSize: "0.68rem" }}
                    >
                      {cert.category}
                    </span>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        padding: "0.15rem 0.45rem",
                        borderRadius: "var(--radius-full)",
                        background: cert.isVisible
                          ? "rgba(16,185,129,0.1)"
                          : "rgba(107,114,128,0.1)",
                        color: cert.isVisible
                          ? "var(--success)"
                          : "var(--text-muted)",
                        fontWeight: 600,
                      }}
                    >
                      {cert.isVisible ? "Visible" : "Hidden"}
                    </span>
                    {cert.isFeatured && (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "var(--radius-full)",
                          background: "rgba(245,158,11,0.1)",
                          color: "var(--warning)",
                          fontWeight: 600,
                        }}
                      >
                        Featured
                      </span>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "0.68rem",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "var(--radius-full)",
                          background: "rgba(var(--accent-rgb),0.1)",
                          color: "var(--accent)",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.2rem",
                          textDecoration: "none",
                        }}
                      >
                        <FiExternalLink size={10} /> Verify
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageCertifications;
