import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { formatMonthYear } from "../../utils/helpers";
import useFetch from "../../hooks/useFetch";
import SectionHeader from "../common/SectionHeader";
import SkeletonCard from "../common/SkeletonCard";
import { getExperience } from "../../api/experienceApi";

const ExperienceCard = ({ exp, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay: index * 0.08 }}
    style={{ marginBottom: "1.25rem", position: "relative" }}
  >
    <div
      className="card-custom"
      style={{
        padding: "1.25rem 1.4rem",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      {/* Header Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "0.85rem",
        }}
      >
        <div>
          <h4
            style={{
              color: "var(--text-primary)",
              fontWeight: 800,
              margin: "0 0 0.2rem",
              fontSize: "1.05rem",
            }}
          >
            {exp.position}
          </h4>
          <p
            style={{
              color: "var(--accent-light)",
              fontWeight: 700,
              margin: "0 0 0.3rem",
              fontSize: "0.885rem",
            }}
          >
            {exp.company}
          </p>
          {exp.location && (
            <span
              style={{
                color: "var(--text-muted)",
                fontSize: "0.825rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <FaMapMarkerAlt size={11} /> {exp.location}
            </span>
          )}
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <span
            className="badge-custom"
            style={{
              fontSize: "0.75rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              marginBottom: "0.35rem",
            }}
          >
            <FaCalendarAlt size={10} />
            {formatMonthYear(exp.startDate)} —{" "}
            {exp.isCurrent ? "Present" : formatMonthYear(exp.endDate)}
          </span>
          {exp.type && (
            <div style={{ marginTop: "0.25rem" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "0.2rem 0.65rem",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(var(--accent-rgb), 0.12)",
                  color: "var(--accent-light)",
                  fontSize: "0.725rem",
                  fontWeight: 700,
                }}
              >
                {exp.type}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {exp.description && (
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.925rem",
            lineHeight: 1.75,
            marginBottom: "1rem",
          }}
        >
          {exp.description}
        </p>
      )}

      {/* Responsibilities list */}
      {exp.responsibilities?.length > 0 && (
        <div style={{ marginBottom: "1.25rem" }}>
          <h5
            style={{
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: "0.6rem",
            }}
          >
            Key Highlights & Deliverables
          </h5>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {exp.responsibilities.map((r, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.55rem",
                  color: "var(--text-secondary)",
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                }}
              >
                <FaCheckCircle
                  size={13}
                  color="var(--accent)"
                  style={{ flexShrink: 0, marginTop: 3 }}
                />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Technologies */}
      {exp.technologies?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", paddingTop: "0.5rem", borderTop: "1px solid var(--divider)" }}>
          {exp.technologies.map((tech) => (
            <span
              key={tech}
              style={{
                padding: "0.25rem 0.65rem",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-surface)",
                color: "var(--text-muted)",
                fontSize: "0.75rem",
                fontWeight: 600,
                border: "1px solid var(--border)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

function Experience() {
  const { data, loading, error } = useFetch(getExperience);
  const experiences = data?.data || [];

  return (
    <section
      id="experience"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="container-xl px-4">
        <SectionHeader
          title="Career"
          highlight="Experience"
          subtitle="Real-world development roles, engineering internships, and commercial project delivery."
        />

        {loading && (
          <div className="row g-4 justify-content-center">
            {[1, 2].map((i) => (
              <div key={i} className="col-12 col-lg-10">
                <SkeletonCard height={80} lines={5} />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div
            className="text-center"
            style={{
              color: "var(--danger)",
              padding: "2rem",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <p style={{ margin: 0 }}>Failed to load experience records.</p>
          </div>
        )}

        {!loading && !error && experiences.length === 0 && (
          <div
            className="text-center"
            style={{
              padding: "4rem 2rem",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💼</div>
            <h4 style={{ color: "var(--text-primary)", fontWeight: 700 }}>
              Entry-Level & Passion Projects
            </h4>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>
              Currently open to new fulltime software engineering and developer opportunities.
            </p>
          </div>
        )}

        {!loading && !error && experiences.length > 0 && (
          <div style={{ position: "relative", maxWidth: 840, margin: "0 auto" }}>
            {/* Timeline Bar */}
            <div
              style={{
                position: "absolute",
                left: 20,
                top: 15,
                bottom: 20,
                width: 2,
                background: "linear-gradient(to bottom, var(--accent), rgba(var(--accent-rgb), 0.05))",
                zIndex: 0,
              }}
            />

            {experiences.map((exp, i) => (
              <div
                key={exp._id}
                style={{ paddingLeft: "52px", position: "relative" }}
              >
                {/* Marker icon */}
                <div
                  style={{
                    position: "absolute",
                    left: 9,
                    top: 24,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    border: "3px solid var(--bg-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                    boxShadow: "0 0 12px rgba(var(--accent-rgb), 0.4)",
                  }}
                >
                  <FaBriefcase size={10} color="white" />
                </div>
                <ExperienceCard exp={exp} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Experience;
