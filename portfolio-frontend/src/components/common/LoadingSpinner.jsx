import { motion } from "framer-motion";

const LoadingSpinner = ({ size = 40, message = "Loading..." }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem",
      gap: "1rem",
    }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      style={{
        width: size,
        height: size,
        border: "3px solid var(--border)",
        borderTopColor: "var(--accent)",
        borderRadius: "50%",
      }}
    />
    {message && (
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
        {message}
      </p>
    )}
  </div>
);

export default LoadingSpinner;
