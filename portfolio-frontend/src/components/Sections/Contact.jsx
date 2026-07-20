import { useState } from "react";
import { motion } from "framer-motion";
import { getErrorMessage } from "../../utils/helpers";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhone,
  FaInstagram,
} from "react-icons/fa";
import SectionHeader from "../common/SectionHeader";
import { submitContact } from "../../api/contactApi";

const FORM_INITIAL = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const validate = (form) => {
  const e = {};
  if (!form.name.trim()) e.name = "Name is required.";
  if (!form.email.trim()) e.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    e.email = "Please enter a valid email.";
  if (form.phone && !/^[+\d\s\-()]*$/.test(form.phone))
    e.phone = "Invalid phone number format.";
  if (!form.subject.trim()) e.subject = "Subject is required.";
  if (!form.message.trim()) e.message = "Message is required.";
  else if (form.message.trim().length < 10)
    e.message = "Message must be at least 10 characters.";
  return e;
};

function Contact({ profile }) {
  const [form, setForm] = useState(FORM_INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      toast.success("Message sent successfully! I'll get back to you soon.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = (field) => ({
    width: "100%",
    padding: "0.85rem 1.1rem",
    background: "var(--bg-input)",
    border: `1.5px solid ${errors[field] ? "var(--danger)" : "var(--border)"}`,
    borderRadius: "var(--radius-md)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-primary)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  });

  const focusHandlers = (field) => ({
    onFocus: (e) => {
      e.target.style.borderColor = "var(--accent)";
      e.target.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.12)";
    },
    onBlur: (e) => {
      e.target.style.borderColor = errors[field]
        ? "var(--danger)"
        : "var(--border)";
      e.target.style.boxShadow = "none";
    },
  });

  const socials = [
    {
      icon: FaGithub,
      href: profile?.socialLinks?.github,
      label: "GitHub",
      color: "#181717",
    },
    {
      icon: FaLinkedin,
      href: profile?.socialLinks?.linkedin,
      label: "LinkedIn",
      color: "#0A66C2",
    },
    {
      icon: FaInstagram,
      href: profile?.socialLinks?.instagram,
      label: "Instagram",
      color: "#1DA1F2",
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
          title="Get In"
          highlight="Touch"
          subtitle="Have a project in mind? Let's talk! I'm always open to new opportunities."
        />

        <div className="row g-5 align-items-start">
          {/* Info Side */}
          <div className="col-12 col-lg-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3
                style={{
                  color: "var(--text-primary)",
                  fontWeight: 800,
                  marginBottom: "1rem",
                  fontSize: "1.5rem",
                }}
              >
                Let's build something great together
              </h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  lineHeight: 1.8,
                  marginBottom: "2rem",
                }}
              >
                Whether you have a full project, a question, or just want to say
                hello — I'd love to hear from you. I typically respond within 24
                hours.
              </p>

              {/* Contact Details */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  marginBottom: "2rem",
                }}
              >
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
                    value: profile?.location,
                  },
                ]
                  .filter((c) => c.value)
                  .map(({ icon: Icon, label, value, href }) => (
                    <div
                      key={label}
                      className="card-custom"
                      style={{
                        padding: "1rem 1.25rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "var(--radius-md)",
                          background: "rgba(var(--accent-rgb), 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={16} color="var(--accent)" />
                      </div>
                      <div>
                        <p
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.75rem",
                            margin: "0 0 0.15rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {label}
                        </p>
                        {href ? (
                          <a
                            href={href}
                            style={{
                              color: "var(--text-primary)",
                              fontWeight: 600,
                              fontSize: "0.9rem",
                            }}
                          >
                            {value}
                          </a>
                        ) : (
                          <p
                            style={{
                              color: "var(--text-primary)",
                              fontWeight: 600,
                              margin: 0,
                              fontSize: "0.9rem",
                            }}
                          >
                            {value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Social Links */}
              {socials.length > 0 && (
                <div>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Find me on
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    {socials.map(({ icon: Icon, href, label }) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        whileHover={{ y: -3, scale: 1.1 }}
                        className="card-custom"
                        style={{
                          width: 46,
                          height: 46,
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--text-muted)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--accent)";
                          e.currentTarget.style.borderColor =
                            "rgba(var(--accent-rgb),0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--text-muted)";
                          e.currentTarget.style.borderColor = "var(--border)";
                        }}
                      >
                        <Icon size={18} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Form Side */}
          <div className="col-12 col-lg-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="card-custom"
              style={{ padding: "2rem" }}
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: "center", padding: "3rem 1rem" }}
                >
                  <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
                    ✅
                  </div>
                  <h4
                    style={{
                      color: "var(--text-primary)",
                      fontWeight: 800,
                      marginBottom: "0.75rem",
                    }}
                  >
                    Message Sent!
                  </h4>
                  <p style={{ color: "var(--text-muted)" }}>
                    Thank you for reaching out. I'll get back to you within 24
                    hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-outline-accent"
                    style={{ marginTop: "1.5rem" }}
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h4
                    style={{
                      color: "var(--text-primary)",
                      fontWeight: 700,
                      marginBottom: "1.5rem",
                      fontSize: "1.15rem",
                    }}
                  >
                    Send a Message
                  </h4>
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <label className="form-label-custom" htmlFor="c-name">
                        Full Name *
                      </label>
                      <input
                        id="c-name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Vijay K"
                        style={fieldStyle("name")}
                        {...focusHandlers("name")}
                      />
                      {errors.name && (
                        <p
                          style={{
                            color: "var(--danger)",
                            fontSize: "0.78rem",
                            margin: "0.25rem 0 0",
                          }}
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label-custom" htmlFor="c-email">
                        Email Address *
                      </label>
                      <input
                        id="c-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="vijay@example.com"
                        style={fieldStyle("email")}
                        {...focusHandlers("email")}
                      />
                      {errors.email && (
                        <p
                          style={{
                            color: "var(--danger)",
                            fontSize: "0.78rem",
                            margin: "0.25rem 0 0",
                          }}
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label-custom" htmlFor="c-phone">
                        Phone Number
                      </label>
                      <input
                        id="c-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        style={fieldStyle("phone")}
                        {...focusHandlers("phone")}
                      />
                      {errors.phone && (
                        <p
                          style={{
                            color: "var(--danger)",
                            fontSize: "0.78rem",
                            margin: "0.25rem 0 0",
                          }}
                        >
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label-custom" htmlFor="c-subject">
                        Subject *
                      </label>
                      <input
                        id="c-subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="Project Inquiry / Job Opportunity"
                        style={fieldStyle("subject")}
                        {...focusHandlers("subject")}
                      />
                      {errors.subject && (
                        <p
                          style={{
                            color: "var(--danger)",
                            fontSize: "0.78rem",
                            margin: "0.25rem 0 0",
                          }}
                        >
                          {errors.subject}
                        </p>
                      )}
                    </div>
                    <div className="col-12">
                      <label className="form-label-custom" htmlFor="c-message">
                        Message *
                      </label>
                      <textarea
                        id="c-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Tell me about your project, timeline, budget, or anything you'd like to discuss..."
                        style={{ ...fieldStyle("message"), resize: "vertical" }}
                        {...focusHandlers("message")}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "0.25rem",
                        }}
                      >
                        {errors.message ? (
                          <p
                            style={{
                              color: "var(--danger)",
                              fontSize: "0.78rem",
                              margin: 0,
                            }}
                          >
                            {errors.message}
                          </p>
                        ) : (
                          <span />
                        )}
                        <span
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.75rem",
                          }}
                        >
                          {form.message.length}/5000
                        </span>
                      </div>
                    </div>
                    <div className="col-12">
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.97 }}
                        className="btn-accent"
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          fontSize: "1rem",
                          padding: "0.875rem",
                          opacity: loading ? 0.7 : 1,
                        }}
                      >
                        {loading ? (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <span
                              style={{
                                width: 16,
                                height: 16,
                                border: "2px solid rgba(255,255,255,0.3)",
                                borderTopColor: "white",
                                borderRadius: "50%",
                                display: "inline-block",
                                animation: "spin 0.8s linear infinite",
                              }}
                            />
                            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                            Sending...
                          </span>
                        ) : (
                          <>
                            <FaPaperPlane size={15} /> Send Message
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
