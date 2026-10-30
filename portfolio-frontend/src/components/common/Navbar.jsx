import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon, FiMenu, FiX, FiCode, FiBriefcase } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { scrollToSection } from "../../utils/helpers";
import useScrollSpy from "../../hooks/useScrollSpy";

const NAV_LINKS = [
  { label: "Home", href: "home" },
  { label: "About", href: "about" },
  { label: "Skills", href: "skills" },
  { label: "Projects", href: "projects" },
  { label: "Experience", href: "experience" },
  { label: "Certifications", href: "certifications" },
  { label: "Testimonials", href: "testimonials" },
  { label: "Contact", href: "contact" },
];

const NAV_SECTION_IDS = NAV_LINKS.map((l) => l.href);

function Navbar() {
  const { toggleTheme, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useScrollSpy(NAV_SECTION_IDS, 100);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href) => {
    scrollToSection(href);
    setIsOpen(false);
  };

  const handleHireMe = () => {
    scrollToSection("contact");
    setIsOpen(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("select-contact-purpose", {
          detail: "Employment Opportunity",
        })
      );
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? "var(--bg-navbar)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "none",
          transition: "all 0.4s ease",
          padding: scrolled ? "0.75rem 0" : "1.25rem 0",
        }}
      >
        <div className="container-xl px-4">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <motion.button
              onClick={() => handleNavClick("home")}
              whileHover={{ scale: 1.05 }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: 0,
              }}
              aria-label="Go to home section"
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
                  boxShadow: "0 4px 12px rgba(var(--accent-rgb), 0.4)",
                }}
              >
                <FiCode color="white" size={18} />
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "1.15rem",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Elite<span style={{ color: "var(--accent)" }}>Code</span>Hub
              </span>
            </motion.button>

            {/* Desktop Navigation */}
            <nav
              className="d-none d-lg-flex align-items-center"
              style={{ gap: "0.25rem" }}
            >
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  style={{
                    background:
                      activeSection === link.href
                        ? "rgba(var(--accent-rgb), 0.1)"
                        : "transparent",
                    border: "none",
                    borderRadius: "var(--radius-full)",
                    padding: "0.45rem 0.9rem",
                    color:
                      activeSection === link.href
                        ? "var(--accent-light)"
                        : "var(--text-secondary)",
                    fontWeight: activeSection === link.href ? 700 : 500,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                    fontFamily: "var(--font-primary)",
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== link.href) {
                      e.target.style.color = "var(--text-primary)";
                      e.target.style.background = "rgba(255, 255, 255, 0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== link.href) {
                      e.target.style.color = "var(--text-secondary)";
                      e.target.style.background = "transparent";
                    }
                  }}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              {/* Hire Me CTA Button */}
              <button
                onClick={handleHireMe}
                className="btn-accent d-none d-sm-inline-flex"
                style={{
                  padding: "0.45rem 1.15rem",
                  fontSize: "0.825rem",
                  gap: "0.45rem",
                }}
                aria-label="Hire Me"
              >
                <FiBriefcase size={13} /> Hire Me
              </button>

              {/* Theme Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-full)",
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  transition: "all 0.2s ease",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isDark ? "sun" : "moon"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              {/* Hamburger */}
              <button
                className="d-lg-none"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--text-primary)",
                }}
              >
                {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 998,
                backdropFilter: "blur(4px)",
              }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "min(85vw, 320px)",
                background: "var(--bg-secondary)",
                zIndex: 999,
                padding: "5rem 2rem 2rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                borderLeft: "1px solid var(--border)",
              }}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNavClick(link.href)}
                  style={{
                    background:
                      activeSection === link.href
                        ? "rgba(var(--accent-rgb), 0.1)"
                        : "transparent",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    padding: "0.85rem 1.15rem",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: "var(--font-primary)",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    color:
                      activeSection === link.href
                        ? "var(--accent)"
                        : "var(--text-primary)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {link.label}
                </motion.button>
              ))}

              <div style={{ marginTop: "1.5rem" }}>
                <button
                  onClick={handleHireMe}
                  className="btn-accent"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <FiBriefcase size={14} /> Hire Me
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
