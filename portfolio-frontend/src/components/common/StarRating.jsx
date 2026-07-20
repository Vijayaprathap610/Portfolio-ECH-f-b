import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const StarRating = ({ rating = 0, max = 5, size = 14, showCount = false }) => {
  const stars = Array.from({ length: max }, (_, i) => {
    if (i < Math.floor(rating)) return "full";
    if (i === Math.floor(rating) && rating % 1 >= 0.5) return "half";
    return "empty";
  });

  return (
    <span
      className="stars"
      aria-label={`Rating: ${rating} out of ${max} stars`}
      role="img"
      style={{ fontSize: size, gap: 2 }}
    >
      {stars.map((type, i) =>
        type === "full" ? (
          <FaStar key={i} />
        ) : type === "half" ? (
          <FaStarHalfAlt key={i} />
        ) : (
          <FaRegStar key={i} style={{ color: "var(--text-muted)" }} />
        ),
      )}
      {showCount && (
        <span
          style={{
            color: "var(--text-muted)",
            fontSize: "0.8em",
            marginLeft: 4,
          }}
        >
          ({rating.toFixed(1)})
        </span>
      )}
    </span>
  );
};

export default StarRating;
