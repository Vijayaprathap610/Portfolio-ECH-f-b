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
      padding: "2rem",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Quote Icon */}
    <FaQuoteLeft
      size={36}
      style={{
        color: "var(--accent)",
        opacity: 0.15,
        position: "absolute",
        top: "1rem",
        right: "1rem",
      }}
    />

    {/* Stars */}
    <div style={{ marginBottom: "1rem" }}>
      <StarRating rating={testimonial.rating} />
    </div>

    {/* Message */}
    <p
      style={{
        color: "var(--text-secondary)",
        lineHeight: 1.8,
        fontSize: "0.95rem",
        fontStyle: "italic",
        flex: 1,
        marginBottom: "1.5rem",
      }}
    >
      "{testimonial.message}"
    </p>

    {/* Author */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.875rem",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent), #a78bfa)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontWeight: 800,
          color: "white",
          fontSize: "0.9rem",
        }}
      >
        {getInitials(testimonial.name)}
      </div>
      <div>
        <p
          style={{
            color: "var(--text-primary)",
            fontWeight: 700,
            margin: 0,
            fontSize: "0.95rem",
          }}
        >
          {testimonial.name}
        </p>
        {(testimonial.position || testimonial.company) && (
          <p
            style={{
              color: "var(--text-muted)",
              margin: 0,
              fontSize: "0.8rem",
            }}
          >
            {[testimonial.position, testimonial.company]
              .filter(Boolean)
              .join(" @ ")}
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
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.message.trim()) e.message = "Message is required.";
    if (form.message.trim().length < 20)
      e.message = "Message must be at least 20 characters.";
    if (!form.rating) e.rating = "Rating is required.";
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
      toast.success(
        "Thank you! Your testimonial has been submitted for review.",
      );
      setForm(FORM_INITIAL);
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "0.75rem 1rem",
    background: "var(--bg-input)",
    border: `1.5px solid ${errors[field] ? "var(--danger)" : "var(--border)"}`,
    borderRadius: "var(--radius-md)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-primary)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s ease",
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
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
            placeholder="Vijay K"
            style={inputStyle("name")}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.name
                ? "var(--danger)"
                : "var(--border)";
            }}
          />
          {errors.name && (
            <p
              style={{
                color: "var(--danger)",
                fontSize: "0.78rem",
                marginTop: "0.25rem",
              }}
            >
              {errors.name}
            </p>
          )}
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label-custom" htmlFor="t-company">
            Company
          </label>
          <input
            id="t-company"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Acme Inc."
            style={inputStyle("company")}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border)";
            }}
          />
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label-custom" htmlFor="t-position">
            Your Position
          </label>
          <input
            id="t-position"
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Software Engineer"
            style={inputStyle("position")}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border)";
            }}
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
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.25rem",
                  transition: "transform 0.15s ease",
                }}
              >
                <FaStar
                  size={26}
                  color={
                    (hoverRating || form.rating) >= star
                      ? "#fbbf24"
                      : "var(--border)"
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
              }}
            >
              {form.rating}/5
            </span>
          </div>
          {errors.rating && (
            <p
              style={{
                color: "var(--danger)",
                fontSize: "0.78rem",
                marginTop: "0.25rem",
              }}
            >
              {errors.rating}
            </p>
          )}
        </div>
        <div className="col-12">
          <label className="form-label-custom" htmlFor="t-message">
            Your Message *{" "}
            <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
              (min. 20 characters)
            </span>
          </label>
          <textarea
            id="t-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="Share your experience working with me..."
            style={{ ...inputStyle("message"), resize: "vertical" }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.message
                ? "var(--danger)"
                : "var(--border)";
            }}
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
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
              {form.message.length}/1000
            </span>
          </div>
        </div>
        <div className="col-12">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="btn-accent"
            style={{
              width: "100%",
              justifyContent: "center",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Submitting..." : "✉ Submit Testimonial"}
          </motion.button>
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
    current * perPage + perPage,
  );

  return (
    <section
      id="testimonials"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="container-xl px-4">
        <SectionHeader
          title="What People"
          highlight="Say"
          subtitle="Kind words from colleagues and mentors who I've worked with."
        />

        {loading && <LoadingSpinner message="Loading testimonials..." />}

        {!loading && testimonials.length === 0 && (
          <div
            className="text-center"
            style={{ padding: "3rem 0", marginBottom: "2rem" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💬</div>
            <p style={{ color: "var(--text-muted)" }}>
              No testimonials yet. Be the first to share your experience!
            </p>
          </div>
        )}

        {!loading && testimonials.length > 0 && (
          <div style={{ marginBottom: "3rem" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="row g-4"
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
                  marginTop: "2rem",
                }}
              >
                <button
                  onClick={() => setCurrent((p) => Math.max(0, p - 1))}
                  disabled={current === 0}
                  aria-label="Previous testimonials"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1.5px solid var(--border)",
                    background: "var(--bg-card)",
                    color:
                      current === 0
                        ? "var(--text-muted)"
                        : "var(--text-primary)",
                    cursor: current === 0 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaChevronLeft size={14} />
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
                        background:
                          i === current ? "var(--accent)" : "var(--border)",
                        cursor: "pointer",
                        padding: 0,
                        transition: "background 0.2s ease",
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrent((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={current === totalPages - 1}
                  aria-label="Next testimonials"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1.5px solid var(--border)",
                    background: "var(--bg-card)",
                    color:
                      current === totalPages - 1
                        ? "var(--text-muted)"
                        : "var(--text-primary)",
                    cursor:
                      current === totalPages - 1 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Submit Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: 700, margin: "0 auto" }}
        >
          <div className="card-custom" style={{ padding: "2rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: showForm ? "1.5rem" : 0,
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <h4
                  style={{
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    margin: "0 0 0.25rem",
                    fontSize: "1.1rem",
                  }}
                >
                  Share Your Experience
                </h4>
                <p
                  style={{
                    color: "var(--text-muted)",
                    margin: 0,
                    fontSize: "0.875rem",
                  }}
                >
                  Worked with me? I'd love to hear your feedback!
                </p>
              </div>
              <button
                onClick={() => setShowForm((p) => !p)}
                className={showForm ? "btn-outline-accent" : "btn-accent"}
                style={{ flexShrink: 0 }}
              >
                {showForm ? "✕ Cancel" : "✍ Write a Review"}
              </button>
            </div>
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35 }}
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
        </motion.div>
      </div>
    </section>
  );
}

export default Testimonials;
