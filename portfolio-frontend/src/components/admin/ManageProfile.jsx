import { useEffect, useState } from "react";
import { FiCamera, FiLink, FiSave } from "react-icons/fi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import LoadingSpinner from "../common/LoadingSpinner";
import { getImageUrl, getErrorMessage } from "../../utils/helpers";
import {
  getProfile,
  updateProfile,
  updateProfilePhoto,
  updateResume,
} from "../../api/profileApi";

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

const SectionCard = ({ title, children }) => (
  <div
    className="card-custom"
    style={{ padding: "1.5rem", marginBottom: "1.5rem" }}
  >
    <h5
      style={{
        color: "var(--text-primary)",
        fontWeight: 700,
        marginBottom: "1.25rem",
        fontSize: "1rem",
        paddingBottom: "0.75rem",
        borderBottom: "1px solid var(--divider)",
      }}
    >
      {title}
    </h5>
    {children}
  </div>
);

function ManageProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [resumeSaving, setResumeSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [langInput, setLangInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfile();
        const p = res.data.data;
        setProfile(p);
        setResumeUrl(p.resumeUrl || "");
      } catch {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setProfile((p) => ({ ...p, [parent]: { ...p[parent], [field]: value } }));
  };

  const handlePhotoChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setPhotoFile(f);
      setPhotoPreview(URL.createObjectURL(f));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profile);
      toast.success("Profile saved successfully.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) {
      toast.error("Please select a photo first.");
      return;
    }
    const fd = new FormData();
    fd.append("photo", photoFile);
    setPhotoSaving(true);
    try {
      const res = await updateProfilePhoto(fd);
      setProfile((p) => ({ ...p, profilePhoto: res.data.data.profilePhoto }));
      setPhotoFile(null);
      setPhotoPreview("");
      toast.success("Profile photo updated.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setPhotoSaving(false);
    }
  };

  const handleResumeUpdate = async () => {
    if (!resumeUrl.trim()) {
      toast.error("Resume URL cannot be empty.");
      return;
    }
    setResumeSaving(true);
    try {
      await updateResume(resumeUrl);
      setProfile((p) => ({ ...p, resumeUrl }));
      toast.success("Resume URL updated.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setResumeSaving(false);
    }
  };

  const addTag = (field, value, setter) => {
    if (!value.trim()) return;
    handleNestedChange("personalInfo", field, [
      ...(profile.personalInfo?.[field] || []),
      value.trim(),
    ]);
    setter("");
  };

  const removeTag = (field, index) => {
    const arr = [...(profile.personalInfo?.[field] || [])];
    arr.splice(index, 1);
    handleNestedChange("personalInfo", field, arr);
  };

  if (loading) return <LoadingSpinner message="Loading profile..." />;
  if (!profile)
    return <p style={{ color: "var(--danger)" }}>Failed to load profile.</p>;

  const currentPhoto =
    photoPreview ||
    (profile.profilePhoto ? getImageUrl(profile.profilePhoto) : null);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            color: "var(--text-primary)",
            fontWeight: 900,
            fontSize: "1.5rem",
            margin: 0,
          }}
        >
          Manage Profile
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            margin: 0,
            fontSize: "0.875rem",
          }}
        >
          Update your portfolio profile information.
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* Photo & Resume */}
        <SectionCard title="📸 Profile Photo & Resume">
          <div className="row g-4 align-items-start">
            <div className="col-12 col-sm-auto">
              <div style={{ position: "relative", width: 120, height: 120 }}>
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "3px solid var(--accent)",
                    background:
                      "linear-gradient(135deg, var(--accent), #a78bfa)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {currentPhoto ? (
                    <img
                      src={currentPhoto}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        color: "white",
                        fontWeight: 900,
                        fontSize: "2.5rem",
                      }}
                    >
                      {profile.fullName
                        ?.split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  )}
                </div>
                <label
                  htmlFor="photo-upload"
                  style={{
                    position: "absolute",
                    bottom: -6,
                    right: -6,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "2px solid var(--bg-primary)",
                  }}
                >
                  <FiCamera size={15} color="white" />
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="col">
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.875rem",
                  marginBottom: "0.75rem",
                }}
              >
                {photoFile
                  ? `Selected: ${photoFile.name}`
                  : "Click the camera icon to select a new photo. Max 5MB, JPEG/PNG/WebP."}
              </p>
              {photoFile && (
                <button
                  type="button"
                  onClick={handlePhotoUpload}
                  className="btn-accent"
                  disabled={photoSaving}
                  style={{ fontSize: "0.875rem", padding: "0.5rem 1.25rem" }}
                >
                  <FiCamera size={14} />{" "}
                  {photoSaving ? "Uploading..." : "Upload Photo"}
                </button>
              )}
            </div>
            <div className="col-12">
              <label className="form-label-custom">
                Resume URL / Download Link
              </label>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <input
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/... or /uploads/resume.pdf"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleResumeUpdate}
                  className="btn-accent"
                  disabled={resumeSaving}
                  style={{
                    flexShrink: 0,
                    padding: "0.7rem 1.25rem",
                    fontSize: "0.875rem",
                  }}
                >
                  <FiLink size={14} /> {resumeSaving ? "Saving..." : "Save URL"}
                </button>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Basic Info */}
        <SectionCard title="👤 Basic Information">
          <div className="row g-3">
            {[
              {
                name: "fullName",
                label: "Full Name *",
                placeholder: "Your Full Name",
                required: true,
              },
              {
                name: "title",
                label: "Professional Title *",
                placeholder: "Full Stack MERN Developer",
                required: true,
              },
              {
                name: "email",
                label: "Email *",
                placeholder: "you@email.com",
                type: "email",
                required: true,
              },
              { name: "phone", label: "Phone", placeholder: "+91 98765 43210" },
              {
                name: "location",
                label: "Location",
                placeholder: "Chennai, India",
              },
            ].map(({ name, label, placeholder, type = "text", required }) => (
              <div key={name} className="col-12 col-sm-6">
                <label className="form-label-custom">{label}</label>
                <input
                  name={name}
                  type={type}
                  value={profile[name] || ""}
                  onChange={handleChange}
                  required={required}
                  placeholder={placeholder}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
          <div className="row g-3" style={{ marginTop: "0.25rem" }}>
            <div className="col-12">
              <label className="form-label-custom">Biography</label>
              <textarea
                name="bio"
                value={profile.bio || ""}
                onChange={handleChange}
                rows={4}
                placeholder="Tell your story..."
                style={{ ...inputStyle, resize: "vertical" }}
                maxLength={2000}
              />
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  textAlign: "right",
                  margin: "0.25rem 0 0",
                }}
              >
                {(profile.bio || "").length}/2000
              </p>
            </div>
            <div className="col-12">
              <label className="form-label-custom">Career Objective</label>
              <textarea
                name="objective"
                value={profile.objective || ""}
                onChange={handleChange}
                rows={3}
                placeholder="Your career goal..."
                style={{ ...inputStyle, resize: "vertical" }}
                maxLength={1000}
              />
            </div>
          </div>
        </SectionCard>

        {/* Social Links */}
        <SectionCard title="🔗 Social Links">
          <div className="row g-3">
            {["github", "linkedin", "twitter", "instagram"].map((platform) => (
              <div key={platform} className="col-12 col-sm-6">
                <label
                  className="form-label-custom"
                  style={{ textTransform: "capitalize" }}
                >
                  {platform}
                </label>
                <input
                  value={profile.socialLinks?.[platform] || ""}
                  onChange={(e) =>
                    handleNestedChange("socialLinks", platform, e.target.value)
                  }
                  placeholder={`https://${platform}.com/username`}
                  type="url"
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Personal Info */}
        <SectionCard title="📋 Personal Information">
          <div className="row g-3">
            {[
              {
                field: "nationality",
                label: "Nationality",
                placeholder: "Indian",
              },
              {
                field: "dob",
                label: "Date of Birth",
                placeholder: "2002-01-01",
                type: "date",
              },
              {
                field: "availability",
                label: "Availability",
                placeholder: "Immediately Available",
              },
            ].map(({ field, label, placeholder, type = "text" }) => (
              <div key={field} className="col-12 col-sm-4">
                <label className="form-label-custom">{label}</label>
                <input
                  type={type}
                  value={profile.personalInfo?.[field] || ""}
                  onChange={(e) =>
                    handleNestedChange("personalInfo", field, e.target.value)
                  }
                  placeholder={placeholder}
                  style={inputStyle}
                />
              </div>
            ))}

            {/* Languages */}
            <div className="col-12 col-sm-6">
              <label className="form-label-custom">Languages</label>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <input
                  value={langInput}
                  onChange={(e) => setLangInput(e.target.value)}
                  placeholder="Add language..."
                  style={{ ...inputStyle, flex: 1 }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag("languages", langInput, setLangInput);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addTag("languages", langInput, setLangInput)}
                  className="btn-accent"
                  style={{
                    padding: "0.7rem 1rem",
                    fontSize: "0.875rem",
                    flexShrink: 0,
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {profile.personalInfo?.languages?.map((lang, i) => (
                  <span
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.3rem 0.7rem",
                      borderRadius: "var(--radius-full)",
                      background: "rgba(var(--accent-rgb),0.1)",
                      color: "var(--accent)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => removeTag("languages", i)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--accent)",
                        lineHeight: 1,
                        padding: 0,
                        fontSize: "1rem",
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="col-12 col-sm-6">
              <label className="form-label-custom">Interests</label>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <input
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  placeholder="Add interest..."
                  style={{ ...inputStyle, flex: 1 }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag("interests", interestInput, setInterestInput);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    addTag("interests", interestInput, setInterestInput)
                  }
                  className="btn-accent"
                  style={{
                    padding: "0.7rem 1rem",
                    fontSize: "0.875rem",
                    flexShrink: 0,
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {profile.personalInfo?.interests?.map((item, i) => (
                  <span
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.3rem 0.7rem",
                      borderRadius: "var(--radius-full)",
                      background: "rgba(var(--accent-rgb),0.1)",
                      color: "var(--accent)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeTag("interests", i)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--accent)",
                        lineHeight: 1,
                        padding: 0,
                        fontSize: "1rem",
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Save Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.02 }}
            whileTap={{ scale: saving ? 1 : 0.97 }}
            className="btn-accent"
            style={{ padding: "0.875rem 2.5rem", fontSize: "1rem" }}
          >
            <FiSave size={16} /> {saving ? "Saving..." : "Save All Changes"}
          </motion.button>
        </div>
      </form>
    </div>
  );
}

export default ManageProfile;
