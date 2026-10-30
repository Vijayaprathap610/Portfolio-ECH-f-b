import { useState, useEffect } from "react";
import { getErrorMessage } from "../../utils/helpers";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaInstagram,
} from "react-icons/fa";
import { FiSend, FiCheckCircle } from "react-icons/fi";
import SectionHeader from "../common/SectionHeader";
import { submitContact } from "../../api/contactApi";

const FORM_INITIAL = {
  name: "",
  email: "",
  phone: "",
  subject: "[Employment Opportunity] Full Stack Engineering Inquiry",
  message: "",
};

const validate = (form) => {
  const e = {};
  if (!form.name.trim()) e.name = "Full name is required.";
  if (!form.email.trim()) e.email = "Email address is required.";
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    e.email = "Please provide a valid email format.";
  if (form.phone && !/^[+\d\s\-()]*$/.test(form.phone))
    e.phone = "Invalid phone number format.";
  if (!form.subject.trim()) e.subject = "Subject line is required.";
  if (!form.message.trim()) e.message = "Message text is required.";
  else if (form.message.trim().length < 10)
    e.message = "Message should be at least 10 characters long.";
  return e;
};

function Contact({ profile }) {
  const [form, setForm] = useState(FORM_INITIAL);
  const [selectedPurpose, setSelectedPurpose] = useState("Employment Opportunity");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSelectPurpose = (purpose) => {
    setSelectedPurpose(purpose);
    setForm((prev) => ({
      ...prev,
      subject: `[${purpose}] Full Stack Engineering Inquiry`,
    }));
  };

  useEffect(() => {
    const handlePurposeEvent = (e) => {
      if (e.detail) {
        handleSelectPurpose(e.detail);
      }
    };
    window.addEventListener("select-contact-purpose", handlePurposeEvent);
    return () => window.removeEventListener("select-contact-purpose", handlePurposeEvent);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await submitContact(form);
      setSubmitted(true);
      setForm(FORM_INITIAL);
      toast.success("Message dispatched! I will get back to you shortly.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const socials = [
    {
      icon: FaGithub,
      href: profile?.socialLinks?.github,
      label: "GitHub",
    },
    {
      icon: FaLinkedin,
      href: profile?.socialLinks?.linkedin,
      label: "LinkedIn",
    },
    {
      icon: FaInstagram,
      href: profile?.socialLinks?.instagram,
      label: "Instagram",
    },
  ].filter((s) => s.href);

  return (
    <section
      id="contact"
      className="section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="container-xl px-4">
        <SectionHeader
          title="Start a"
          highlight="Conversation"
          subtitle="Available for fulltime engineering opportunities, contract projects, and architecture reviews."
        />

        <div className="row g-4 align-items-stretch">
          {/* Info Side */}
          <div className="col-12 col-lg-5">
            <div
              className="card-custom"
              style={{
                padding: "2rem",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
              }}
            >
              <h3
                style={{
                  color: "var(--text-primary)",
                  fontWeight: 800,
                  fontSize: "1.4rem",
                  marginBottom: "0.75rem",
                }}
              >
                Let's Build Something High Performance
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  fontSize: "0.95rem",
                  marginBottom: "2rem",
                }}
              >
                Whether you have a technical question, architecture requirements, or a role to discuss,
                feel free to reach out directly through the form or my social handles.
              </p>

              {/* Direct channels */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                {[
                  {
                    icon: FaEnvelope,
                    label: "Email",
                    value: profile?.email,
                    href: `mailto:${profile?.email}`,
                  },
                  {
                    icon: FaPhone,
                    label: "Phone",
                    value: profile?.phone,
                    href: `tel:${profile?.phone}`,
                  },
                  {
                    icon: FaMapMarkerAlt,
                    label: "Location",
                    value: profile?.location || "India",
                  },
                ]
                  .filter((c) => c.value)
                  .map(({ icon: Icon, label, value, href }) => (
                    <div
                      key={label}
                      style={{
                        padding: "1rem",
                        borderRadius: "var(--radius-md)",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "var(--radius-md)",
                          background: "rgba(var(--accent-rgb), 0.12)",
                          color: "var(--accent-light)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                            fontWeight: 700,
                          }}
                        >
                          {label}
                        </span>
                        {href ? (
                          <a
                            href={href}
                            style={{
                              color: "var(--text-primary)",
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              wordBreak: "break-all",
                            }}
                          >
                            {value}
                          </a>
                        ) : (
                          <span
                            style={{
                              color: "var(--text-primary)",
                              fontWeight: 600,
                              fontSize: "0.9rem",
                            }}
                          >
                            {value}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Social Channels */}
              {socials.length > 0 && (
                <div style={{ marginTop: "auto" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Social & Code Profiles
                  </span>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    {socials.map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "var(--radius-md)",
                          background: "var(--bg-surface)",
                          border: "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--text-secondary)",
                          transition: "all var(--transition-fast)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--accent-light)";
                          e.currentTarget.style.borderColor = "var(--accent)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--text-secondary)";
                          e.currentTarget.style.borderColor = "var(--border)";
                          e.currentTarget.style.transform = "none";
                        }}
                      >
                        <Icon size={17} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Side */}
          <div className="col-12 col-lg-7">
            <div
              className="card-custom"
              style={{
                padding: "2rem",
                height: "100%",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
              }}
            >
              {submitted ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "rgba(16,185,129,0.12)",
                      color: "var(--success)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <FiCheckCircle size={32} />
                  </div>
                  <h3 style={{ color: "var(--text-primary)", fontWeight: 800, marginBottom: "0.5rem" }}>
                    Message Dispatched Successfully
                  </h3>
                  <p style={{ color: "var(--text-muted)", maxWidth: 400, marginBottom: "1.75rem" }}>
                    Thanks for reaching out! Your note has been registered in the database, and I will reply to your provided email address shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-accent"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h4
                    style={{
                      color: "var(--text-primary)",
                      fontWeight: 800,
                      fontSize: "1.2rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    Send a Direct Message
                  </h4>

                  {/* Purpose of Contact Selection */}
                  <div style={{ marginBottom: "1.35rem" }}>
                    <label
                      className="form-label-custom"
                      style={{ marginBottom: "0.55rem" }}
                    >
                      Select Contact Purpose:
                    </label>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.45rem",
                      }}
                    >
                      {[
                        "Employment Opportunity",
                        "Freelance Project",
                        "Collaboration",
                        "General Inquiry",
                      ].map((purpose) => {
                        const isSelected = selectedPurpose === purpose;
                        return (
                          <button
                            key={purpose}
                            type="button"
                            className={`purpose-chip ${
                              isSelected ? "active" : ""
                            }`}
                            onClick={() => handleSelectPurpose(purpose)}
                          >
                            {isSelected && (
                              <FiCheckCircle
                                size={13}
                                color="var(--accent-light)"
                              />
                            )}
                            {purpose}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <label className="form-label-custom" htmlFor="c-name">
                        Your Full Name *
                      </label>
                      <input
                        id="c-name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Alex Morgan"
                        className="form-control-custom"
                      />
                      {errors.name && (
                        <p style={{ color: "var(--danger)", fontSize: "0.78rem", marginTop: "0.25rem" }}>
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label-custom" htmlFor="c-email">
                        Your Email Address *
                      </label>
                      <input
                        id="c-email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="alex@example.com"
                        className="form-control-custom"
                      />
                      {errors.email && (
                        <p style={{ color: "var(--danger)", fontSize: "0.78rem", marginTop: "0.25rem" }}>
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label-custom" htmlFor="c-phone">
                        Phone (Optional)
                      </label>
                      <input
                        id="c-phone"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="form-control-custom"
                      />
                      {errors.phone && (
                        <p style={{ color: "var(--danger)", fontSize: "0.78rem", marginTop: "0.25rem" }}>
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label-custom" htmlFor="c-subject">
                        Subject Line *
                      </label>
                      <input
                        id="c-subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="Opportunity / Collaboration"
                        className="form-control-custom"
                      />
                      {errors.subject && (
                        <p style={{ color: "var(--danger)", fontSize: "0.78rem", marginTop: "0.25rem" }}>
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label-custom" htmlFor="c-message">
                        Message Content *
                      </label>
                      <textarea
                        id="c-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Write your project context, timeline, or position details..."
                        className="form-control-custom"
                        style={{ resize: "vertical" }}
                      />
                      {errors.message && (
                        <p style={{ color: "var(--danger)", fontSize: "0.78rem", marginTop: "0.25rem" }}>
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <div className="col-12">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-accent"
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          padding: "0.9rem",
                          fontSize: "0.95rem",
                        }}
                      >
                        {loading ? (
                          "Dispatched Message..."
                        ) : (
                          <>
                            <FiSend size={15} /> Send Message Directly
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
