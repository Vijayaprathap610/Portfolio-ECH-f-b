import { motion } from "framer-motion";
import SectionHeader from "../common/SectionHeader";
import SkeletonCard from "../common/SkeletonCard";
import { formatDate, getImageUrl, scrollToSection } from "../../utils/helpers";
import { FiTarget, FiMail, FiPhone, FiMapPin, FiCalendar, FiGlobe, FiClock } from "react-icons/fi";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaGraduationCap,
  FaHeart,
  FaLanguage,
  FaCheckCircle,
} from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0 },
};

function About({ profile, loading, error }) {
  if (loading) {
    return (
      <section id="about" className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container-xl px-4">
          <SectionHeader
            title="Engineering"
            highlight="Profile & Bio"
            subtitle="Background, career objective, academic credentials, and professional mindset."
          />
          <div className="row g-4">
            <div className="col-12 col-lg-4">
              <SkeletonCard height={320} lines={4} />
            </div>
            <div className="col-12 col-lg-8">
              <SkeletonCard height={180} lines={5} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section id="about" className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container-xl px-4">
          <SectionHeader
            title="Engineering"
            highlight="Profile & Bio"
            subtitle="Background, career objective, academic credentials, and professional mindset."
          />
          <div
            className="card-custom text-center"
            style={{ padding: "3rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}
          >
            <p style={{ color: "var(--text-muted)", margin: 0 }}>
              {error ? "Unable to load profile details from server." : "Profile details are being initialized."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const { fullName, bio, objective, personalInfo, education, profilePhoto } = profile;

  return (
    <section
      id="about"
      className="section"
      style={{
        background: "var(--bg-secondary)",
        position: "relative",
      }}
    >
      <div className="container-xl px-4">
        <SectionHeader
          title="Engineering"
          highlight="Profile & Bio"
          subtitle="Background, career objective, academic credentials, and professional mindset."
        />

        <div className="row g-4 align-items-stretch">
          {/* ── Photo + Essential Contact Card ── */}
          <div className="col-12 col-lg-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem", height: "100%" }}
            >
              {/* Profile Card */}
              <div
                className="card-custom"
                style={{
                  padding: "1.75rem",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Fixed Photograph with Animated Gradient Frame */}
                <div className="animated-photo-frame-wrap">
                  {/* Subtle moving gradient border & glowing aura */}
                  <div className="animated-photo-frame-aura" />
                  <div className="animated-photo-frame-ring" />

                  {/* Completely Fixed Stable Photograph Container */}
                  <div className="photo-inner-fixed">
                    {profilePhoto ? (
                      <img
                        src={getImageUrl(profilePhoto)}
                        alt={fullName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                        loading="lazy"
                        onError={(e) => {
                          if (!e.target.dataset.fallbackTried && profilePhoto) {
                            e.target.dataset.fallbackTried = "true";
                            e.target.src = profilePhoto.startsWith('/') ? profilePhoto : `/${profilePhoto}`;
                          }
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          color: "var(--accent-light)",
                          fontSize: "2.5rem",
                          fontWeight: 900,
                        }}
                      >
                        {fullName
                          ?.split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: 8,
                      right: 12,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "var(--success)",
                      border: "3px solid var(--bg-card)",
                      boxShadow: "0 0 10px rgba(212,160,74,0.5)",
                      zIndex: 4,
                    }}
                    title="Available for opportunities"
                  />
                </div>

                <h3
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    margin: "0 0 0.35rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {fullName}
                </h3>
                <p
                  style={{
                    color: "var(--accent-light)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    margin: "0 0 1rem",
                  }}
                >
                  {profile?.title || "Full Stack Developer"}
                </p>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.3rem 0.85rem",
                    borderRadius: "var(--radius-full)",
                    background: "rgba(var(--accent-rgb), 0.12)",
                    color: "var(--accent-light)",
                    fontSize: "0.785rem",
                    fontWeight: 700,
                  }}
                >
                  <FaCheckCircle size={12} /> Ready for Production Roles
                </div>
              </div>

              {/* Personal Details List */}
              <div
                className="card-custom"
                style={{
                  padding: "1.5rem",
                  flex: 1,
                }}
              >
                <h4
                  style={{
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    marginBottom: "1rem",
                    fontSize: "0.95rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Direct Contacts & Bio
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {[
                    { icon: FiMapPin, label: "Location", value: profile?.location },
                    { icon: FiMail, label: "Email", value: profile?.email },
                    { icon: FiPhone, label: "Phone", value: profile?.phone },
                    { icon: FiGlobe, label: "Nationality", value: personalInfo?.nationality },
                    {
                      icon: FiCalendar,
                      label: "Date of Birth",
                      value: personalInfo?.dob
                        ? formatDate(personalInfo.dob, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "",
                    },
                    { icon: FiClock, label: "Availability", value: personalInfo?.availability },
                  ]
                    .filter((item) => item.value)
                    .map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.75rem",
                          paddingBottom: "0.6rem",
                          borderBottom: "1px solid var(--divider)",
                        }}
                      >
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "var(--radius-sm)",
                            background: "var(--bg-secondary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--accent-light)",
                            flexShrink: 0,
                            marginTop: "0.15rem",
                          }}
                        >
                          <Icon size={14} />
                        </div>
                        <div style={{ overflow: "hidden" }}>
                          <span
                            style={{
                              display: "block",
                              fontSize: "0.75rem",
                              color: "var(--text-muted)",
                              fontWeight: 600,
                              textTransform: "uppercase",
                            }}
                          >
                            {label}
                          </span>
                          <span
                            style={{
                              color: "var(--text-primary)",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              wordBreak: "break-all",
                            }}
                          >
                            {value}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Main Bio, Objective, Education, Attributes ── */}
          <div className="col-12 col-lg-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem", height: "100%" }}
            >
              {/* Bio Summary */}
              {bio && (
                <div
                  className="card-custom"
                  style={{ padding: "1.75rem" }}
                >
                  <h3
                    style={{
                      color: "var(--text-primary)",
                      fontWeight: 800,
                      fontSize: "1.3rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Professional Overview
                  </h3>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      lineHeight: 1.85,
                      fontSize: "0.975rem",
                      margin: 0,
                    }}
                  >
                    {bio}
                  </p>
                </div>
              )}

              {/* Career Objective */}
              {objective && (
                <div
                  className="card-custom"
                  style={{
                    padding: "1.5rem",
                    borderLeft: "4px solid var(--accent)",
                    background: "rgba(var(--accent-rgb), 0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <FiTarget color="var(--accent-light)" size={18} />
                    <h4
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        fontSize: "1.05rem",
                      }}
                    >
                      Career Objective
                    </h4>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--text-secondary)",
                      lineHeight: 1.75,
                      fontSize: "0.925rem",
                    }}
                  >
                    {objective}
                  </p>
                </div>
              )}

              {/* Education Section */}
              {education?.length > 0 && (
                <div
                  className="card-custom"
                  style={{ padding: "1.75rem" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <FaGraduationCap color="var(--accent-light)" size={20} />
                    <h4
                      style={{
                        margin: 0,
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        fontSize: "1.15rem",
                      }}
                    >
                      Academic Background
                    </h4>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {education.map((edu, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "1.2rem",
                          borderRadius: "var(--radius-md)",
                          background: "var(--bg-surface)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            alignItems: "flex-start",
                            gap: "0.5rem",
                            marginBottom: "0.35rem",
                          }}
                        >
                          <div>
                            <h5
                              style={{
                                color: "var(--text-primary)",
                                fontWeight: 700,
                                fontSize: "1rem",
                                margin: "0 0 0.2rem",
                              }}
                            >
                              {edu.degree}
                            </h5>
                            <p
                              style={{
                                color: "var(--accent-light)",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                margin: 0,
                              }}
                            >
                              {edu.institution}
                            </p>
                            {edu.board && (
                              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                                {edu.board}
                              </span>
                            )}
                          </div>

                          <div style={{ textAlign: "right" }}>
                            <span
                              className="badge-custom"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                fontSize: "0.75rem",
                              }}
                            >
                              <FaCalendarAlt size={10} /> {edu.year}
                            </span>
                            {edu.percentage && (
                              <div
                                style={{
                                  color: "var(--success)",
                                  fontWeight: 700,
                                  fontSize: "0.85rem",
                                  marginTop: "0.25rem",
                                }}
                              >
                                {edu.percentage}
                              </div>
                            )}
                          </div>
                        </div>

                        {edu.description && (
                          <p
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "0.85rem",
                              margin: "0.5rem 0 0",
                              lineHeight: 1.6,
                            }}
                          >
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages & Interests */}
              <div className="row g-3">
                {personalInfo?.languages?.length > 0 && (
                  <div className="col-12 col-sm-6">
                    <div
                      className="card-custom"
                      style={{ padding: "1.25rem", height: "100%" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <FaLanguage color="var(--accent-light)" size={18} />
                        <h5
                          style={{
                            margin: 0,
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            color: "var(--text-primary)",
                          }}
                        >
                          Languages
                        </h5>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                        {personalInfo.languages.map((lang) => (
                          <span key={lang} className="badge-custom">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {personalInfo?.interests?.length > 0 && (
                  <div className="col-12 col-sm-6">
                    <div
                      className="card-custom"
                      style={{ padding: "1.25rem", height: "100%" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <FaHeart color="#ec4899" size={16} />
                        <h5
                          style={{
                            margin: 0,
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            color: "var(--text-primary)",
                          }}
                        >
                          Interests & Focus
                        </h5>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                        {personalInfo.interests.map((interest) => (
                          <span key={interest} className="badge-custom">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="btn-accent"
                  style={{ padding: "0.75rem 1.75rem" }}
                >
                  <FaBriefcase size={14} /> Discuss Project Opportunities
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
