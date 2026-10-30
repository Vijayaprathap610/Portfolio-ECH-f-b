import { useState } from "react";
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
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="card-custom"
      style={{
        padding: 0,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      {/* Banner / Certificate image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16/9",
          background: "var(--bg-secondary)",
          overflow: "hidden",
          flexShrink: 0,
          borderBottom: "1px solid var(--border)",
        }}
      >
        {cert.image && !imgError ? (
          <img
            src={getImageUrl(cert.image)}
            alt={`${cert.title} certificate`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, rgba(var(--accent-rgb), 0.08), rgba(245, 158, 11, 0.08))",
            }}
          >
            <Icon size={40} color="var(--accent-light)" style={{ opacity: 0.6 }} />
          </div>
        )}

        {/* Badge category */}
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <span
            className="badge-custom"
            style={{
              fontSize: "0.7rem",
              background: "rgba(9, 13, 22, 0.75)",
              color: "white",
              borderColor: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
            }}
          >
            <Icon size={10} /> {cert.category}
          </span>
        </div>

        {cert.isFeatured && (
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <span
              style={{
                padding: "0.2rem 0.6rem",
                borderRadius: "var(--radius-full)",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "white",
                fontSize: "0.685rem",
                fontWeight: 700,
              }}
            >
              Featured
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
            fontWeight: 800,
            fontSize: "1rem",
            marginBottom: "0.35rem",
            lineHeight: 1.35,
          }}
        >
          {cert.title}
        </h5>
        <p
          style={{
            color: "var(--accent-light)",
            fontWeight: 600,
            fontSize: "0.85rem",
            marginBottom: "0.6rem",
          }}
        >
          {cert.organization}
        </p>

        {cert.description && (
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.825rem",
              lineHeight: 1.6,
              marginBottom: "0.85rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
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
              marginBottom: "1rem",
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
                  fontWeight: 600,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Footer date & link */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--divider)",
          }}
        >
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <FaCalendarAlt size={10} />
            {formatMonthYear(cert.issueDate)}
          </span>

          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-accent"
              style={{
                padding: "0.35rem 0.75rem",
                fontSize: "0.75rem",
              }}
              aria-label={`Verify ${cert.title}`}
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
          title="Verified"
          highlight="Certifications & Awards"
          subtitle="Accredited technical credentials, program completions, and professional development milestones."
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
            style={{
              color: "var(--danger)",
              padding: "2rem",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <p style={{ margin: 0 }}>Failed to load certifications.</p>
          </div>
        )}

        {!loading && !error && certs.length === 0 && (
          <div
            className="text-center"
            style={{
              padding: "4rem 2rem",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
              maxWidth: 550,
              margin: "0 auto",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🏆</div>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>
              No certifications currently registered.
            </p>
          </div>
        )}

        {!loading && !error && certs.length > 0 && (
          <div className="row g-4 align-items-stretch">
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
