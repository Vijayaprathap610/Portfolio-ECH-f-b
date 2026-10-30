import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getImageUrl, scrollToSection } from "../../utils/helpers";
import {
  FaBriefcase,
  FaDownload,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FiArrowDown, FiShield, FiCpu } from "react-icons/fi";

function Hero({ profile, projectsCount = 0, skillsCount = 0, experienceCount = 1 }) {
  const canvasRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Constellation particle background — Electric Indigo & Cyan accent
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1,
      opacity: Math.random() * 0.4 + 0.15,
      isCyan: Math.random() > 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.isCyan
          ? `rgba(6, 182, 212, ${p.opacity})`
          : `rgba(99, 102, 241, ${p.opacity})`;
        ctx.fill();
      });

      // Connecting lines with subtle electric tint
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Multi-stage animation state:
  // Stage 1: Entrance (slides down smoothly from navbar) -> 0ms to 1200ms
  // Stage 2: Left-and-right swing + Stage 3 vertical settling bounce -> 1200ms to 3600ms
  // Stage 4: Continuous 4-direction movement (Left, Right, Up, Down) -> 3600ms onwards
  const [animStage, setAnimStage] = useState("entrance");

  useEffect(() => {
    if (shouldReduceMotion) return;

    const timer1 = setTimeout(() => {
      setAnimStage("swing");
    }, 1200);

    const timer2 = setTimeout(() => {
      setAnimStage("continuous");
    }, 3600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [shouldReduceMotion]);

  const name = profile?.fullName || "VIJAYAPRATHAP K";
  const bio =
    profile?.bio ||
    "Specialized in architecting high-throughput React frontends, scalable Node.js microservices, and reliable MongoDB schemas with clean engineering practices.";
  const photo = profile?.profilePhoto ? getImageUrl(profile.profilePhoto) : null;
  const github = profile?.socialLinks?.github;
  const linkedin = profile?.socialLinks?.linkedin;
  const instagram = profile?.socialLinks?.instagram;
  const location = profile?.location || "India";
  const email = profile?.email || "";
  const resumeUrl = profile?.resumeUrl || "#";

  const handleHireMeClick = (purpose = "Employment Opportunity") => {
    scrollToSection("contact");
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("select-contact-purpose", { detail: purpose })
      );
    }
  };

  // Hanging ID Card Animation Variants (Hinged at top anchor)
  const hangingVariants = {
    initial: {
      y: -150,
      opacity: 0,
      rotate: -3.5,
    },
    entrance: {
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 16,
        stiffness: 85,
        mass: 1.1,
      },
    },
    swing: {
      opacity: 1,
      rotate: [0, -4, 3.5, -2.5, 2, -1, 0.5, 0],
      y: [0, 4, -2, 2, 0],
      transition: {
        duration: 2.4,
        ease: "easeInOut",
      },
    },
    continuous: {
      opacity: 1,
      x: [-3, 3, -3],
      y: [-3.5, 2.5, -3.5],
      rotate: [-1.4, 1.4, -1.4],
      transition: {
        x: {
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
        },
        y: {
          duration: 3.4,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotate: {
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: "var(--bg-primary)",
      }}
    >
      {/* Constellation Canvas in Electric Indigo & Cyan */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Atmospheric Ambient Glow — Distinctive Cosmic Violet/Cyan */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 720,
          height: 720,
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="container-xl px-4"
        style={{
          position: "relative",
          zIndex: 1,
          paddingTop: "90px",
          paddingBottom: "50px",
        }}
      >
        <div className="row align-items-center g-5">
          {/* Hero Typography & CTA */}
          <div className="col-12 col-lg-7 order-2 order-lg-1">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Engineering Status Pill — Distinctive Emerald Green */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  padding: "0.4rem 1rem",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  boxShadow: "0 0 16px rgba(16, 185, 129, 0.15)",
                  marginBottom: "1.35rem",
                }}
              >
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: "#10b981",
                    boxShadow: "0 0 10px #10b981, 0 0 4px #34d399",
                  }}
                />
                <span
                  style={{
                    color: "#10b981",
                    fontSize: "0.825rem",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}
                >
                  Available for Full-Time & Contract Opportunities
                </span>
              </div>

              {/* Headline with Brown / Warm Bronze Name */}
              <h1
                style={{
                  fontSize: "clamp(2.3rem, 5vw, 3.8rem)",
                  fontWeight: 900,
                  lineHeight: 1.15,
                  marginBottom: "1.25rem",
                  letterSpacing: "-0.03em",
                  color: "var(--text-primary)",
                }}
              >
                Hi, I'm{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #d97706 0%, #b45309 40%, #78350f 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontWeight: 900,
                  }}
                >
                  VIJAYAPRATHAP K
                </span>
                , a{" "}
                <span style={{ color: "var(--accent-light)" }}>
                  Full Stack MERN
                </span>{" "}
                Web Developer.
              </h1>

              {/* Bio / Description */}
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.85,
                  maxWidth: 620,
                  marginBottom: "1.75rem",
                }}
              >
                {bio}
              </p>

              {/* Location & Email Details */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1.25rem",
                  marginBottom: "2rem",
                }}
              >
                {location && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      color: "var(--text-muted)",
                      fontSize: "0.875rem",
                    }}
                  >
                    <FaMapMarkerAlt size={13} color="#0d9488" /> {location}
                  </span>
                )}
                {email && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      color: "var(--text-muted)",
                      fontSize: "0.875rem",
                    }}
                  >
                    <FaEnvelope size={13} color="#6366f1" /> {email}
                  </span>
                )}
              </div>

              {/* Action Buttons with Hire Me Flow — Dark Blue Button */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.9rem",
                  marginBottom: "2.25rem",
                }}
              >
                <button
                  onClick={() => handleHireMeClick("Employment Opportunity")}
                  className="btn-accent"
                  style={{
                    padding: "0.75rem 1.85rem",
                    fontSize: "0.95rem",
                    textDecoration: "none",
                  }}
                  aria-label="Hire VIJAYAPRATHAP K"
                >
                  <FaBriefcase size={14} /> Hire Me
                </button>
                {resumeUrl && resumeUrl !== "#" && (
                  <a
                    href={resumeUrl}
                    download
                    className="btn-outline-accent"
                    style={{
                      padding: "0.75rem 1.6rem",
                      fontSize: "0.95rem",
                      textDecoration: "none",
                    }}
                    aria-label="Download Curriculum Vitae"
                  >
                    <FaDownload size={13} /> Download Resume
                  </a>
                )}
              </div>

              {/* Social Channels */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {[
                  { icon: FaGithub, href: github, label: "GitHub" },
                  { icon: FaLinkedin, href: linkedin, label: "LinkedIn" },
                  { icon: FaInstagram, href: instagram, label: "Instagram" },
                ]
                  .filter((s) => s.href)
                  .map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "var(--radius-md)",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--text-secondary)",
                        transition: "all var(--transition-fast)",
                        textDecoration: "none",
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
            </motion.div>
          </div>

          {/* Suspended Lanyard Assembly & Portrait ID Card */}
          <div className="col-12 col-lg-5 order-1 order-lg-2 text-center">
            <div className="hanging-assembly-wrapper">
              {/* Lanyard Top Strap Anchored from the Navbar Edge */}
              <div className="lanyard-strap-top" />

              {/* The Entire Suspended Badge Assembly — Tag + Clasp + Card animates together */}
              <motion.div
                className="hanging-suspended-unit"
                variants={shouldReduceMotion ? {} : hangingVariants}
                initial={shouldReduceMotion ? false : "initial"}
                animate={shouldReduceMotion ? { y: 0, opacity: 1, rotate: 0 } : animStage}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transformOrigin: "top center",
                  width: "100%",
                }}
              >
                {/* Vertical Hanging Tag with Name VIJAYAPRATHAP K in Warm Bronze/Amber */}
                <div className="lanyard-name-tag">
                  <span className="lanyard-tag-label">STAFF PASS</span>
                  <span
                    className="lanyard-tag-name"
                    style={{
                      background:
                        "linear-gradient(135deg, #d97706 0%, #a0522d 50%, #78350f 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    VIJAYAPRATHAP K
                  </span>
                </div>

                {/* Metallic Swivel Clasp Connected to Card Punch Slot */}
                <div className="lanyard-clasp-assembly">
                  <div className="lanyard-swivel-ring" />
                  <div className="lanyard-metallic-clasp" />
                </div>

                {/* Portrait-Oriented Rectangular ID Card (Lightly Reduced Height: 418px) */}
                <div className="id-badge-portrait">
                  {/* Physical Punch Hole Slot Centered at Top */}
                  <div className="id-badge-punch-slot" />

                  {/* Badge Header Strip — Distinct Royal Navy & Sapphire Gradient */}
                  <div className="id-badge-portrait-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <FiShield size={15} color="#ffffff" />
                      <div>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: "0.78rem",
                            color: "#ffffff",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            display: "block",
                            lineHeight: 1.1,
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          Elite Code Hub
                        </span>
                        <span
                          style={{
                            fontSize: "0.6rem",
                            color: "rgba(255,255,255,0.85)",
                            letterSpacing: "0.08em",
                          }}
                        >
                          DEV IDENTITY
                        </span>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: "0.66rem",
                        fontWeight: 700,
                        color: "#ffffff",
                        background: "rgba(0,0,0,0.25)",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "var(--radius-full)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#10b981",
                          boxShadow: "0 0 6px #10b981",
                        }}
                      />
                      VERIFIED
                    </span>
                  </div>

                  {/* Badge Body */}
                  <div className="id-badge-portrait-body">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.85rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {/* Portrait Photo */}
                      <div className="id-badge-photo-portrait">
                        {photo ? (
                          <img
                            src={photo}
                            alt={name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              const raw = profile?.profilePhoto;
                              if (raw && !e.target.dataset.fallbackTried) {
                                e.target.dataset.fallbackTried = "true";
                                e.target.src = raw.startsWith('/') ? raw : `/${raw}`;
                              }
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              color: "var(--accent-light)",
                              fontSize: "1.5rem",
                            }}
                          >
                            VK
                          </div>
                        )}
                      </div>

                      {/* Employee Profile Information with Warm Bronze-Brown Name */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.66rem",
                            fontWeight: 700,
                            color: "#0d9488",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            marginBottom: "0.1rem",
                          }}
                        >
                          Full Stack Engineer
                        </span>
                        <h3
                          style={{
                            margin: "0 0 0.15rem",
                            fontWeight: 800,
                            fontSize: "1.08rem",
                            color: "#9c5421",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          VIJAYAPRATHAP K
                        </h3>
                        <p
                          style={{
                            margin: "0 0 0.25rem",
                            fontSize: "0.76rem",
                            color: "var(--text-secondary)",
                            fontWeight: 600,
                          }}
                        >
                          MERN Web Developer
                        </p>
                        <div
                          style={{
                            fontSize: "0.68rem",
                            fontFamily: "var(--font-mono)",
                            color: "var(--text-muted)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <FiCpu size={11} color="#6366f1" />
                          ECH-2026-DEV
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Database Metric Counters — Including Experience */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: "0.4rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {/* Projects Box */}
                      <div className="id-badge-stat-box">
                        <span
                          style={{
                            display: "block",
                            fontSize: "1.15rem",
                            fontWeight: 800,
                            color: "#38bdf8",
                            lineHeight: 1.15,
                          }}
                        >
                          {projectsCount > 0 ? projectsCount : "4"}
                        </span>
                        <span
                          style={{
                            fontSize: "0.65rem",
                            color: "var(--text-muted)",
                            fontWeight: 600,
                          }}
                        >
                          Projects
                        </span>
                      </div>

                      {/* Experience Box — Added as requested */}
                      <div className="id-badge-stat-box">
                        <span
                          style={{
                            display: "block",
                            fontSize: "1.15rem",
                            fontWeight: 800,
                            color: "#10b981",
                            lineHeight: 1.15,
                          }}
                        >
                          {experienceCount > 0 ? `${experienceCount} Yr` : "1 Yr"}
                        </span>
                        <span
                          style={{
                            fontSize: "0.65rem",
                            color: "var(--text-muted)",
                            fontWeight: 600,
                          }}
                        >
                          Experience
                        </span>
                      </div>

                      {/* Skills Box */}
                      <div className="id-badge-stat-box">
                        <span
                          style={{
                            display: "block",
                            fontSize: "1.15rem",
                            fontWeight: 800,
                            color: "#f59e0b",
                            lineHeight: 1.15,
                          }}
                        >
                          {skillsCount > 0 ? skillsCount : "24+"}
                        </span>
                        <span
                          style={{
                            fontSize: "0.65rem",
                            color: "var(--text-muted)",
                            fontWeight: 600,
                          }}
                        >
                          Skills
                        </span>
                      </div>
                    </div>

                    {/* Department & Experience Tag Information */}
                    <div
                      style={{
                        padding: "0.45rem 0.65rem",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        marginBottom: "0.65rem",
                        fontSize: "0.7rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <span>DEPT: MERN Stack</span>
                      <span
                        style={{
                          color: "#10b981",
                          fontWeight: 700,
                          background: "rgba(16, 185, 129, 0.12)",
                          padding: "0.1rem 0.45rem",
                          borderRadius: "var(--radius-full)",
                          fontSize: "0.66rem",
                        }}
                      >
                        EXP: Hands-on / 1 Yr
                      </span>
                    </div>

                    {/* Security Laser Barcode & Auth String */}
                    <div
                      style={{
                        marginTop: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.65rem",
                        paddingTop: "0.5rem",
                        borderTop: "1px solid var(--divider)",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div className="id-badge-barcode" />
                      </div>
                      <span
                        style={{
                          fontSize: "0.62rem",
                          fontFamily: "var(--font-mono)",
                          color: "var(--text-muted)",
                          letterSpacing: "0.08em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        AUTH-2026-MERN
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Explorer Arrow */}
        <div
          onClick={() => scrollToSection("about")}
          style={{
            position: "absolute",
            bottom: "0.75rem",
            left: "50%",
            transform: "translateX(-50%)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.3rem",
            color: "var(--text-muted)",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          <span>Explore</span>
          <FiArrowDown size={14} color="#0d9488" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
