import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => (
  <div
    style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      textAlign: "center",
    }}
  >
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        style={{
          fontSize: "6rem",
          fontWeight: 900,
          background: "linear-gradient(135deg, var(--accent), #a78bfa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
          marginBottom: "1rem",
        }}
      >
        404
      </div>
      <h1
        style={{
          color: "var(--text-primary)",
          fontWeight: 800,
          fontSize: "1.75rem",
          marginBottom: "0.75rem",
        }}
      >
        Page Not Found
      </h1>
      <p
        style={{
          color: "var(--text-muted)",
          marginBottom: "2rem",
          maxWidth: 400,
        }}
      >
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-accent" style={{ display: "inline-flex" }}>
        ← Back to Portfolio
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
