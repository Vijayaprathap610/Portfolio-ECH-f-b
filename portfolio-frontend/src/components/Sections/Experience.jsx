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

const ExperienceCard = ({ exp, index, isLeft }) => (
  <motion.div
    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    style={{ marginBottom: "2rem", position: "relative" }}
  >
    <div className="card-custom" style={{ padding: "1.5rem" }}>
      {/* Top Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h5
            style={{
              color: "var(--text-primary)",
              fontWeight: 800,
              margin: "0 0 0.25rem",
              fontSize: "1.05rem",
            }}
          >
            {exp.position}
          </h5>
          <p
            style={{
              color: "var(--accent)",
              fontWeight: 700,
              margin: "0 0 0.25rem",
              fontSize: "0.95rem",
            }}
          >
            {exp.company}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {exp.location && (
              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <FaMapMarkerAlt size={11} /> {exp.location}
              </span>
            )}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <span
            className="badge-custom"
            style={{
              fontSize: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              marginBottom: "0.4rem",
            }}
          >
            <FaCalendarAlt size={11} />
            {formatMonthYear(exp.startDate)} —{" "}
            {exp.isCurrent ? "Present" : formatMonthYear(exp.endDate)}
          </span>
          <span
            style={{
              display: "inline-block",
              padding: "0.2rem 0.6rem",
              borderRadius: "var(--radius-full)",
              background: "rgba(var(--accent-rgb),0.1)",
              color: "var(--accent)",
              fontSize: "0.72rem",
              fontWeight: 600,
            }}
          >
            {exp.type}
          </span>
        </div>
      </div>

      {/* Duration Badge */}
      {exp.duration && (
        <div style={{ marginBottom: "0.75rem" }}>
          <span
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
            }}
          >
            Duration: {exp.duration}
          </span>
        </div>
      )}

      {/* Description */}
      {exp.description && (
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
            lineHeight: 1.7,
            marginBottom: "1rem",
          }}
        >
          {exp.description}
        </p>
      )}

      {/* Responsibilities */}
      {exp.responsibilities?.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <p
            style={{
              color: "var(--text-secondary)",
              fontWeight: 700,
              fontSize: "0.85rem",
              marginBottom: "0.6rem",
            }}
          >
            Key Responsibilities:
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {exp.responsibilities.map((r, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  marginBottom: "0.4rem",
                  color: "var(--text-muted)",
                  fontSize: "0.875rem",
                }}
              >
                <FaCheckCircle
                  size={13}
                  color="var(--success)"
                  style={{ flexShrink: 0, marginTop: 3 }}
                />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Technologies */}
      {exp.technologies?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {exp.technologies.map((tech) => (
            <span
              key={tech}
              style={{
                padding: "0.2rem 0.6rem",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-secondary)",
                color: "var(--text-muted)",
                fontSize: "0.72rem",
                border: "1px solid var(--border)",
                fontFamily: "var(--font-mono)",
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
          title="Work"
          highlight="Experience"
          subtitle="My professional journey and internship experience."
        />

        {loading && (
          <div className="row g-4">
            {[1, 2].map((i) => (
              <div key={i} className="col-12">
                <SkeletonCard height={60} lines={5} />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div
            className="text-center"
            style={{ color: "var(--danger)", padding: "2rem" }}
          >
            <p>Failed to load experience. Please try again later.</p>
          </div>
        )}

        {!loading && !error && experiences.length === 0 && (
          <div className="text-center" style={{ padding: "4rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💼</div>
            <p style={{ color: "var(--text-muted)" }}>
              No experience entries yet.
            </p>
          </div>
        )}

        {!loading && !error && experiences.length > 0 && (
          <div
            style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}
          >
            {/* Vertical Timeline Line */}
            <div
              style={{
                position: "absolute",
                left: 24,
                top: 0,
                bottom: 0,
                width: 2,
                background:
                  "linear-gradient(to bottom, var(--accent), transparent)",
                zIndex: 0,
              }}
            />

            {experiences.map((exp, i) => (
              <div
                key={exp._id}
                style={{ paddingLeft: "60px", position: "relative" }}
              >
                {/* Timeline Dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    position: "absolute",
                    left: 12,
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
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  <FaBriefcase size={10} color="white" />
                </motion.div>
                <ExperienceCard exp={exp} index={i} isLeft={i % 2 === 0} />
              </div>
            ))}
          </div>
        )}

        {/* Fresher Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: 600, margin: "2rem auto 0", textAlign: "center" }}
        >
          <div
            className="card-custom"
            style={{
              padding: "1.25rem",
              borderColor: "rgba(var(--accent-rgb),0.2)",
            }}
          >
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.875rem",
                margin: 0,
              }}
            >
              💡 As a fresher, I combine internship experience with strong
              self-directed learning and hands-on personal projects to build
              production-ready applications.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Experience;
