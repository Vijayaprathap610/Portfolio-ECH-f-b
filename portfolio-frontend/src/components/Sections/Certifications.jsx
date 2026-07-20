import { motion } from "framer-motion";
import {
  FaAward,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaMedal,
} from "react-icons/fa";
import { HiCheckBadge } from "react-icons/hi2";
import { formatMonthYear, getImageUrl } from "../../utils/helpers";
import { getCertifications } from "../../api/certificationsApi";
import useFetch from "../../hooks/useFetch";
import SectionHeader from "../common/SectionHeader";
import SkeletonCard from "../common/SkeletonCard";

const CATEGORY_ICONS = {
  Certificate: FaAward,
  Achievement: FaMedal,
  Badge: HiCheckBadge,
  Award: FaMedal,
  Course: FaAward,
};

const CertCard = ({ cert, index }) => {
  const Icon = CATEGORY_ICONS[cert.category] || FaAward;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card-custom"
      style={{
        padding: 0,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Certificate Image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16/9",
          background:
            "linear-gradient(135deg, rgba(var(--accent-rgb),0.15), rgba(167,139,250,0.15))",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {cert.image ? (
          <img
            src={getImageUrl(cert.image)}
            alt={`${cert.title} certificate`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={48} color="var(--accent)" style={{ opacity: 0.4 }} />
          </div>
        )}
        {/* Category badge */}
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <span
            className="badge-custom"
            style={{
              fontSize: "0.7rem",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              color: "white",
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            <Icon size={10} /> {cert.category}
          </span>
        </div>
        {cert.isFeatured && (
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <span
              style={{
                padding: "0.25rem 0.6rem",
                borderRadius: "var(--radius-full)",
                background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                color: "white",
                fontSize: "0.7rem",
                fontWeight: 700,
              }}
            >
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: "1.25rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h5
          style={{
            color: "var(--text-primary)",
            fontWeight: 700,
            fontSize: "0.95rem",
            marginBottom: "0.4rem",
            lineHeight: 1.4,
          }}
        >
          {cert.title}
        </h5>
        <p
          style={{
            color: "var(--accent)",
            fontWeight: 600,
            fontSize: "0.85rem",
            marginBottom: "0.75rem",
          }}
        >
          {cert.organization}
        </p>

        {cert.description && (
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.8rem",
              lineHeight: 1.6,
              marginBottom: "0.75rem",
            }}
          >
            {cert.description}
          </p>
        )}

        {/* Skills */}
        {cert.skills?.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.3rem",
              marginBottom: "0.75rem",
            }}
          >
            {cert.skills.map((skill) => (
              <span
                key={skill}
                style={{
                  padding: "0.15rem 0.5rem",
                  borderRadius: "var(--radius-full)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-muted)",
                  fontSize: "0.7rem",
                  border: "1px solid var(--border)",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "0.78rem",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <FaCalendarAlt size={11} />
            {formatMonthYear(cert.issueDate)}
            {cert.doesExpire &&
              cert.expiryDate &&
              ` → ${formatMonthYear(cert.expiryDate)}`}
          </span>

          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-accent"
              style={{ padding: "0.35rem 0.875rem", fontSize: "0.78rem" }}
              aria-label={`Verify ${cert.title} credential`}
            >
              <FaExternalLinkAlt size={10} /> Verify
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

function Certifications() {
  const { data, loading, error } = useFetch(getCertifications);
  const certs = data?.data || [];
  return (
    <section
      id="certifications"
      className="section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="container-xl px-4">
        <SectionHeader
          title="Certifications &"
          highlight="Achievements"
          subtitle="Proof of my continuous learning and professional development."
        />

        {loading && (
          <div className="row g-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-3">
                <SkeletonCard height={140} lines={3} />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div
            className="text-center"
            style={{ color: "var(--danger)", padding: "2rem" }}
          >
            <p>Failed to load certifications. Please try again later.</p>
          </div>
        )}

        {!loading && !error && certs.length === 0 && (
          <div className="text-center" style={{ padding: "4rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>
            <p style={{ color: "var(--text-muted)" }}>
              No certifications added yet.
            </p>
          </div>
        )}

        {!loading && !error && certs.length > 0 && (
          <div className="row g-4">
            {certs.map((cert, i) => (
              <div key={cert._id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <CertCard cert={cert} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Certifications;
