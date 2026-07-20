import { motion } from "framer-motion";
import SectionHeader from "../common/SectionHeader";
import { formatDate, getImageUrl, scrollToSection } from "../../utils/helpers";
import { FiTarget } from "react-icons/fi";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaGraduationCap,
  FaHeart,
  FaLanguage,
} from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function About({ profile }) {
  if (!profile) return null;
  const { fullName, bio, objective, personalInfo, education, profilePhoto } =
    profile;
  return (
    <section
      id="about"
      className="section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="container-xl px-4">
        <SectionHeader
          title="About"
          highlight="Me"
          subtitle="A glimpse into who I am and what drives me."
        />

        <div className="row g-5 align-items-start">
          {/* ── Photo + Personal Info ── */}
          <div className="col-12 col-lg-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
            >
              {/* Photo */}
              <div
                style={{
                  borderRadius: 24,
                  overflow: "hidden",
                  border: "3px solid rgba(var(--accent-rgb), 0.3)",
                  marginBottom: "1.5rem",
                  position: "relative",
                  aspectRatio: "4/5",
                  background: "linear-gradient(135deg, var(--accent), #a78bfa)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {profilePhoto ? (
                  <img
                    src={getImageUrl(profilePhoto)}
                    alt={fullName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    loading="lazy"
                  />
                ) : (
                  <span
                    style={{
                      color: "white",
                      fontSize: "5rem",
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
                <div
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "var(--radius-full)",
                    padding: "0.4rem 1rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      color: "#10b981",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                    }}
                  >
                    ● Available for Work
                  </span>
                </div>
              </div>

              {/* Personal Details */}
              <div className="card-custom" style={{ padding: "1.25rem" }}>
                <h5
                  style={{
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    marginBottom: "1rem",
                    fontSize: "0.95rem",
                  }}
                >
                  Personal Information
                </h5>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {[
                    { label: "Nationality", value: personalInfo?.nationality },
                    {
                      label: "Date of Birth",
                      value: personalInfo?.dob
                        ? formatDate(personalInfo.dob, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "",
                    },
                    {
                      label: "Availability",
                      value: personalInfo?.availability,
                    },
                    { label: "Location", value: profile?.location },
                    { label: "Email", value: profile?.email },
                    { label: "Phone", value: profile?.phone },
                  ]
                    .filter((i) => i.value)
                    .map(({ label, value }) => (
                      <li
                        key={label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "0.55rem 0",
                          borderBottom: "1px solid var(--divider)",
                          gap: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.85rem",
                            flexShrink: 0,
                          }}
                        >
                          {label}
                        </span>
                        <span
                          style={{
                            color: "var(--text-primary)",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            textAlign: "right",
                            wordBreak: "break-all",
                          }}
                        >
                          {value}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* ── Bio / Objective / Education / Languages / Interests ── */}
          <div className="col-12 col-lg-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {/* Bio */}
              {bio && (
                <div style={{ marginBottom: "2rem" }}>
                  <h3
                    style={{
                      color: "var(--text-primary)",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    Who Am I?
                  </h3>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      lineHeight: 1.9,
                      fontSize: "1rem",
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
                    marginBottom: "2rem",
                    padding: "1.25rem",
                    borderLeft: "4px solid var(--accent)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <FiTarget color="var(--accent)" size={18} />
                    <h5
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        fontSize: "1rem",
                      }}
                    >
                      Career Objective
                    </h5>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--text-secondary)",
                      lineHeight: 1.8,
                    }}
                  >
                    {objective}
                  </p>
                </div>
              )}

              {/* Education */}
              {education?.length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <FaGraduationCap color="var(--accent)" size={20} />
                    <h4
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                      }}
                    >
                      Education
                    </h4>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    {education.map((edu, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="card-custom"
                        style={{ padding: "1.25rem" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                          }}
                        >
                          <div>
                            <h6
                              style={{
                                color: "var(--text-primary)",
                                fontWeight: 700,
                                margin: "0 0 0.25rem",
                              }}
                            >
                              {edu.degree}
                            </h6>
                            <p
                              style={{
                                color: "var(--accent)",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                margin: "0 0 0.25rem",
                              }}
                            >
                              {edu.institution}
                            </p>
                            {edu.board && (
                              <p
                                style={{
                                  color: "var(--text-muted)",
                                  fontSize: "0.8rem",
                                  margin: 0,
                                }}
                              >
                                {edu.board}
                              </p>
                            )}
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span
                              className="badge-custom"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                marginBottom: "0.4rem",
                              }}
                            >
                              <FaCalendarAlt size={11} /> {edu.year}
                            </span>
                            {edu.percentage && (
                              <div
                                style={{
                                  color: "var(--success)",
                                  fontWeight: 700,
                                  fontSize: "0.85rem",
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
                              fontSize: "0.875rem",
                              marginTop: "0.75rem",
                              marginBottom: 0,
                            }}
                          >
                            {edu.description}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages + Interests */}
              <div className="row g-3">
                {personalInfo?.languages?.length > 0 && (
                  <div className="col-12 col-sm-6">
                    <div className="card-custom" style={{ height: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <FaLanguage color="var(--accent)" size={18} />
                        <h6
                          style={{
                            margin: 0,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}
                        >
                          Languages
                        </h6>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
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
                    <div className="card-custom" style={{ height: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <FaHeart color="var(--accent)" size={16} />
                        <h6
                          style={{
                            margin: 0,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}
                        >
                          Interests
                        </h6>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
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

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollToSection("contact")}
                className="btn-accent"
                style={{ marginTop: "2rem" }}
              >
                <FaBriefcase size={14} /> Let's Work Together
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
