import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaHeart,
  FaCode,
} from "react-icons/fa";
import { scrollToSection } from "../../utils/helpers";

const QUICK_LINKS = [
  "home",
  "about",
  "skills",
  "projects",
  "experience",
  "contact",
];

function Footer({ profile }) {
  const year = new Date().getFullYear();

  const socials = [
    { icon: FaGithub, href: profile?.socialLinks?.github, label: "GitHub" },
    {
      icon: FaLinkedin,
      href: profile?.socialLinks?.linkedin,
      label: "LinkedIn",
    },
    {
      icon: FaInstagram,
      href: profile?.socialLinks?.instagram,
      label: "Instagram",
    },
  ].filter((s) => s.href);
  return (
    <footer
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        paddingTop: "3rem",
        paddingBottom: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Gradient top line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, var(--accent), #a78bfa, #60a5fa)",
        }}
      />

      <div className="container-xl px-4">
        <div className="row g-4 mb-4">
          {/* Brand */}
          <div className="col-12 col-md-4">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-md)",
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaCode color="white" size={16} />
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  color: "var(--text-primary)",
                }}
              >
                Elite<span style={{ color: "var(--accent)" }}>Code</span>Hub
              </span>
            </div>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              I provide high-quality web development services. I specialize in
              creating high-performance websites that operate at high speeds,
              tailored to client needs, with excellent scalability and a proper
              architecture with the MERN stack.
            </p>

            {/* Social Links */}
            {socials.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginTop: "1.25rem",
                }}
              >
                {socials.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ y: -3 }}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "var(--radius-md)",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-muted)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--accent)";
                      e.currentTarget.style.borderColor = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--text-muted)";
                      e.currentTarget.style.borderColor = "var(--border)";
                    }}
                  >
                    <Icon size={16} />
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-4">
            <h6
              style={{
                color: "var(--text-primary)",
                fontWeight: 700,
                marginBottom: "1rem",
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Quick Links
            </h6>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {QUICK_LINKS.map((id) => (
                <li key={id} style={{ marginBottom: "0.5rem" }}>
                  <button
                    onClick={() => scrollToSection(id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      fontSize: "0.9rem",
                      padding: "0.15rem 0",
                      transition: "color 0.2s ease",
                      fontFamily: "var(--font-primary)",
                      textTransform: "capitalize",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = "var(--accent)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = "var(--text-muted)")
                    }
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-6 col-md-4">
            <h6
              style={{
                color: "var(--text-primary)",
                fontWeight: 700,
                marginBottom: "1rem",
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Legal
            </h6>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {["Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item} style={{ marginBottom: "0.5rem" }}>
                  <a
                    href="#"
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.9rem",
                      transition: "color 0.2s ease",
                    }}
                    onClick={(e) => e.preventDefault()}
                    onMouseEnter={(e) =>
                      (e.target.style.color = "var(--accent)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = "var(--text-muted)")
                    }
                  >
                    {item}
                  </a>
                </li>
              ))}
              {/* Hidden admin access */}
              <li style={{ marginTop: "1rem" }}>
                <a
                  href="/admin/login"
                  style={{
                    color: "transparent",
                    fontSize: "8px",
                    userSelect: "none",
                  }}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  .
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.25rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              margin: 0,
            }}
          >
            © {year}{" "}
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>
              {profile?.fullName || "EliteCodeHub"}
            </span>{" "}
            · Built with{" "}
            <FaHeart
              style={{ color: "var(--danger)", verticalAlign: "middle" }}
              size={12}
            />{" "}
            using the MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
