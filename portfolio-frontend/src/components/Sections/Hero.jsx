import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getImageUrl, scrollToSection } from "../../utils/helpers";
import {
  FaBriefcase,
  FaDownload,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaInstagram,
} from "react-icons/fa";
import { FiArrowDown } from "react-icons/fi";

function Hero({ profile }) {
  const canvasRef = useRef(null);

  // Animated particle background
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

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.1,
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
        ctx.fillStyle = `rgba(108, 99, 255, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connecting lines
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(108, 99, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
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

  const name = profile?.fullName || "VIJAYAPRATHAP K";
  const title = profile?.title || "Full Stack MERN Developer";
  const bio =
    profile?.bio?.substring(0, 180) +
      (profile?.bio?.length > 180 ? "..." : "") || "";
  const photo = profile?.profilePhoto
    ? getImageUrl(profile.profilePhoto)
    : null;
  const github = profile?.socialLinks?.github;
  const linkedin = profile?.socialLinks?.linkedin;
  const instagram = profile?.socialLinks?.instagram;
  const location = profile?.location || "India";
  const email = profile?.email || "";
  const resumeUrl = profile?.resumeUrl || "#";

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
      {/* Particle Canvas */}
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

      {/* Radial Gradient Blob */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="container-xl px-4"
        style={{ position: "relative", zIndex: 1, paddingTop: "80px" }}
      >
        <div className="row align-items-center g-5">
          {/* Text Side */}
          <div className="col-12 col-lg-7 order-2 order-lg-1">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 1rem",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  marginBottom: "1.5rem",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#10b981",
                    display: "inline-block",
                    boxShadow: "0 0 8px #10b981",
                    animation: "pulse 2s infinite",
                  }}
                />
                <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.5} }`}</style>
                <span
                  style={{
                    color: "#10b981",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Available for opportunities
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 4rem)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.03em",
                }}
              >
                Hi, I'm <span className="gradient-text">{name}</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ marginBottom: "1.25rem" }}
              >
                <span
                  style={{
                    fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                    fontWeight: 600,
                    color: "var(--accent)",
                    fontFamily: "var(--font-mono)",
                    background: "rgba(var(--accent-rgb), 0.08)",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "var(--radius-sm)",
                    borderLeft: "3px solid var(--accent)",
                  }}
                >
                  {title}
                </span>
              </motion.div>

              {bio && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    fontSize: "1rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                    maxWidth: 560,
                    marginBottom: "1.5rem",
                  }}
                >
                  {bio}
                </motion.p>
              )}

              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginBottom: "2rem",
                }}
              >
                {location && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      color: "var(--text-muted)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <FaMapMarkerAlt size={13} color="var(--accent)" />{" "}
                    {location}
                  </span>
                )}
                {email && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      color: "var(--text-muted)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <FaEnvelope size={13} color="var(--accent)" /> {email}
                  </span>
                )}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginBottom: "2rem",
                }}
              >
                <button
                  onClick={() => scrollToSection("contact")}
                  className="btn-accent"
                  style={{ fontSize: "0.95rem" }}
                >
                  <FaBriefcase size={14} />
                  Hire Me
                </button>
                {resumeUrl && resumeUrl !== "#" && (
                  <a
                    href={resumeUrl}
                    download
                    className="btn-outline-accent"
                    style={{ fontSize: "0.95rem" }}
                    aria-label="Download my resume"
                  >
                    <FaDownload size={14} />
                    Download CV
                  </a>
                )}
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{ display: "flex", gap: "0.75rem" }}
              >
                {[
                  { icon: FaGithub, href: github, label: "GitHub Profile" },
                  {
                    icon: FaLinkedin,
                    href: linkedin,
                    label: "LinkedIn Profile",
                  },
                  { icon: FaInstagram, href: instagram, label: "Instagram Profile" },
                ]
                  .filter((s) => s.href)
                  .map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "var(--radius-md)",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--text-secondary)",
                        fontSize: 18,
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--accent)";
                        e.currentTarget.style.color = "white";
                        e.currentTarget.style.borderColor = "var(--accent)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--bg-card)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                        e.currentTarget.style.borderColor = "var(--border)";
                      }}
                    >
                      <Icon />
                    </motion.a>
                  ))}
              </motion.div>
            </motion.div>
          </div>

          {/* ID Card Side */}
          <div className="col-12 col-lg-5 order-1 order-lg-2 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              style={{ display: "inline-block", perspective: 1000 }}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 24,
                  padding: 0,
                  width: "min(340px, 90vw)",
                  overflow: "hidden",
                  boxShadow:
                    "0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(var(--accent-rgb),0.2)",
                  position: "relative",
                }}
              >
                {/* Card Header */}
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                    padding: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.7rem",
                        margin: 0,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      Developer ID Card
                    </p>
                    <p
                      style={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: "1rem",
                        margin: 0,
                      }}
                    >
                      EliteCodeHub
                    </p>
                  </div>
                  <FaGithub color="rgba(255,255,255,0.5)" size={28} />
                </div>

                {/* Photo */}
                <div
                  style={{
                    padding: "1.5rem 1.5rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 16,
                      border: "3px solid var(--accent)",
                      overflow: "hidden",
                      flexShrink: 0,
                      background:
                        "linear-gradient(135deg, var(--accent), #a78bfa)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt={name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        loading="eager"
                      />
                    ) : (
                      <span
                        style={{
                          color: "white",
                          fontWeight: 900,
                          fontSize: "2rem",
                        }}
                      >
                        {name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <h4
                      style={{
                        color: "var(--text-primary)",
                        fontWeight: 800,
                        fontSize: "1.05rem",
                        margin: "0 0 0.25rem",
                      }}
                    >
                      {name}
                    </h4>
                    <p
                      style={{
                        color: "var(--accent)",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        margin: 0,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {title}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 0,
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  {[
                    { label: "Projects", value: "5+" },
                    { label: "Skills", value: "15+" },
                    { label: "Experience", value: "3M" },
                  ].map((stat, i) => (
                    <div
                      key={stat.label}
                      style={{
                        padding: "1rem 0.5rem",
                        textAlign: "center",
                        borderRight: i < 2 ? "1px solid var(--border)" : "none",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: 900,
                          color: "var(--accent)",
                        }}
                      >
                        {stat.value}
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--text-muted)",
                          marginTop: 2,
                        }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Chips */}
                <div style={{ padding: "1rem 1.5rem 1.5rem" }}>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-muted)",
                      marginBottom: "0.6rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Tech Stack
                  </p>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}
                  >
                    {[
                      "React",
                      "Node.js",
                      "Express",
                      "MongoDB",
                      "JavaScript",
                    ].map((t) => (
                      <span
                        key={t}
                        className="badge-custom"
                        style={{ fontSize: "0.72rem" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="scroll-indicator"
          style={{ cursor: "pointer" }}
          onClick={() => scrollToSection("about")}
          role="button"
          aria-label="Scroll to About section"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && scrollToSection("about")}
        >
          <span
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Scroll Down
          </span>
          <FiArrowDown size={18} color="var(--accent)" />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
