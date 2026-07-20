const SkeletonCard = ({ height = 200, lines = 3 }) => (
  <div
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "1.5rem",
      overflow: "hidden",
    }}
  >
    <div
      className="skeleton"
      style={{
        height: height,
        borderRadius: "var(--radius-md)",
        marginBottom: "1rem",
      }}
    />
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="skeleton"
        style={{
          height: 14,
          borderRadius: "var(--radius-full)",
          marginBottom: "0.6rem",
          width: i === lines - 1 ? "60%" : "100%",
        }}
      />
    ))}
  </div>
);

export default SkeletonCard;
