import { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaQuoteLeft,
  FaStar,
} from "react-icons/fa";
import { getErrorMessage, getInitials } from "../../utils/helpers";
import useFetch from "../../hooks/useFetch";
import SectionHeader from "../common/SectionHeader";
import StarRating from "../common/StarRating";
import LoadingSpinner from "../common/LoadingSpinner";
import { submitTestimonial, getTestimonials } from "../../api/testimonialsApi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const FORM_INITIAL = {
  name: "",
  company: "",
  position: "",
  message: "",
  rating: 5,
};

const TestimonialCard = ({ testimonial }) => (
  <div
    className="card-custom"
    style={{
      padding: "1.35rem 1.45rem",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
    }}
  >
    {/* Subtle Watermark Quote */}
    <FaQuoteLeft
      size={26}
      style={{
        color: "var(--accent)",
        opacity: 0.08,
        position: "absolute",
        top: "1rem",
        right: "1rem",
      }}
    />

    {/* Star Rating */}
    <div style={{ marginBottom: "0.85rem" }}>
      <StarRating rating={testimonial.rating} size={13} />
    </div>

    {/* Message Content */}
    <p
      style={{
        color: "var(--text-secondary)",
        lineHeight: 1.65,
        fontSize: "0.885rem",
        fontStyle: "italic",
        flex: 1,
        marginBottom: "1.2rem",
      }}
    >
      "{testimonial.message}"
    </p>

    {/* Author Information */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginTop: "auto",
        paddingTop: "0.85rem",
        borderTop: "1px solid var(--divider)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "var(--accent-gradient)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontWeight: 800,
          color: "white",
          fontSize: "0.785rem",
          boxShadow: "0 2px 8px rgba(var(--accent-rgb), 0.25)",
        }}
      >
        {getInitials(testimonial.name)}
      </div>
      <div>
        <h5
          style={{
            color: "var(--text-primary)",
            fontWeight: 700,
            margin: "0 0 0.15rem",
            fontSize: "0.9rem",
          }}
        >
          {testimonial.name}
        </h5>
        {(testimonial.position || testimonial.company) && (
          <p
            style={{
              color: "var(--text-muted)",
              margin: 0,
              fontSize: "0.76rem",
            }}
          >
            {[testimonial.position, testimonial.company]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </div>
    </div>
  </div>
);

const SubmitForm = ({ onSuccess }) => {
  const [form, setForm] = useState(FORM_INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Your name is required.";
    if (!form.message.trim()) e.message = "Feedback message is required.";
    else if (form.message.trim().length < 20)
      e.message = "Message must be at least 20 characters long.";
    if (!form.rating) e.rating = "Rating selection is required.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await submitTestimonial(form);
      toast.success("Thank you! Your testimonial was submitted for review.");
      setForm(FORM_INITIAL);
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ marginTop: "1.5rem" }}>
      <div className="row g-3">
        <div className="col-12 col-sm-6">
          <label className="form-label-custom" htmlFor="t-name">
            Your Name *
          </label>
          <input
            id="t-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="form-control-custom"
          />
          {errors.name && (
            <p style={{ color: "var(--danger)", fontSize: "0.78rem", marginTop: "0.25rem" }}>
              {errors.name}
            </p>
          )}
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label-custom" htmlFor="t-company">
            Company / Organization
          </label>
          <input
            id="t-company"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Google, Microsoft, etc."
            className="form-control-custom"
          />
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label-custom" htmlFor="t-position">
            Role or Designation
          </label>
          <input
            id="t-position"
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Tech Lead, Manager, Peer"
            className="form-control-custom"
          />
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label-custom">Rating *</label>
          <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm((p) => ({ ...p, rating: star }))}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`Rate ${star} stars`}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.25rem",
                }}
              >
                <FaStar
                  size={24}
                  color={
                    (hoverRating || form.rating) >= star
                      ? "#f59e0b"
                      : "var(--border-strong)"
                  }
                  style={{ transition: "color 0.15s ease" }}
                />
              </button>
            ))}
            <span
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                marginLeft: "0.5rem",
                alignSelf: "center",
                fontWeight: 600,
              }}
            >
              {form.rating} / 5
            </span>
          </div>
        </div>
        <div className="col-12">
          <label className="form-label-custom" htmlFor="t-message">
            Feedback & Remarks *{" "}
            <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
              (minimum 20 characters)
            </span>
          </label>
          <textarea
            id="t-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Describe collaboration highlights, technical strengths, or project outcome..."
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
              padding: "0.85rem",
            }}
          >
            {loading ? "Submitting Review..." : "Submit Testimonial"}
          </button>
        </div>
      </div>
    </form>
  );
};

function Testimonials() {
  const { data, loading, refetch } = useFetch(getTestimonials);
  const testimonials = data?.data || [];
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const perPage = 3;
  const totalPages = Math.ceil(testimonials.length / perPage);
  const visible = testimonials.slice(
    current * perPage,
    current * perPage + perPage
  );

  return (
    <section
      id="testimonials"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="container-xl px-4">
        <SectionHeader
          title="Client & Peer"
          highlight="Endorsements"
          subtitle="Direct impressions and peer recommendations from developers and teams I've collaborated with."
        />

        {loading && <LoadingSpinner message="Retrieving endorsements..." />}

        {!loading && testimonials.length === 0 && (
          <div
            className="text-center"
            style={{
              padding: "3.5rem 2rem",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
              maxWidth: 600,
              margin: "0 auto 3rem",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>💬</div>
            <h4 style={{ color: "var(--text-primary)", fontWeight: 700 }}>
              No Public Endorsements Yet
            </h4>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>
              Be the first to share your experience working with me.
            </p>
          </div>
        )}

        {!loading && testimonials.length > 0 && (
          <div style={{ marginBottom: "3rem" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="row g-4 align-items-stretch"
              >
                {visible.map((t) => (
                  <div key={t._id} className="col-12 col-md-6 col-lg-4">
                    <TestimonialCard testimonial={t} />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1rem",
                  marginTop: "2.5rem",
                }}
              >
                <button
                  onClick={() => setCurrent((p) => Math.max(0, p - 1))}
                  disabled={current === 0}
                  aria-label="Previous endorsements"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    border: "1px solid var(--border)",
                    background: "var(--bg-card)",
                    color: current === 0 ? "var(--text-muted)" : "var(--text-primary)",
                    cursor: current === 0 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaChevronLeft size={13} />
                </button>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      aria-label={`Page ${i + 1}`}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        border: "none",
                        background: i === current ? "var(--accent)" : "var(--border)",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrent((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={current === totalPages - 1}
                  aria-label="Next endorsements"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    border: "1px solid var(--border)",
                    background: "var(--bg-card)",
                    color: current === totalPages - 1 ? "var(--text-muted)" : "var(--text-primary)",
                    cursor: current === totalPages - 1 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaChevronRight size={13} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action Panel to Write Testimonial */}
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <div
            className="card-custom"
            style={{
              padding: "2rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <h4
                  style={{
                    color: "var(--text-primary)",
                    fontWeight: 800,
                    margin: "0 0 0.25rem",
                    fontSize: "1.2rem",
                  }}
                >
                  Worked With Me?
                </h4>
                <p
                  style={{
                    color: "var(--text-muted)",
                    margin: 0,
                    fontSize: "0.9rem",
                  }}
                >
                  Leave a verified review regarding code quality, delivery speed, or collaboration.
                </p>
              </div>

              <button
                onClick={() => setShowForm((p) => !p)}
                className={showForm ? "btn-outline-accent" : "btn-accent"}
              >
                {showForm ? "Cancel Form" : "✍ Write an Endorsement"}
              </button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  <SubmitForm
                    onSuccess={() => {
                      setShowForm(false);
                      refetch();
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
