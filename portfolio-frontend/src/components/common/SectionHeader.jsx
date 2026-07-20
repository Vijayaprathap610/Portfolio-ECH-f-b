import { motion } from "framer-motion";

const SectionHeader = ({ title, highlight, subtitle, centered = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    style={{ textAlign: centered ? "center" : "left", marginBottom: "3rem" }}
  >
    <h2 className="section-title">
      {title} {highlight && <span>{highlight}</span>}
    </h2>
    <div
      className="section-divider"
      style={{ margin: centered ? "1rem auto 1.5rem" : "1rem 0 1.5rem" }}
    />
    {subtitle && (
      <p className="section-subtitle" style={{ margin: 0 }}>
        {subtitle}
      </p>
    )}
  </motion.div>
);

export default SectionHeader;
