import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "../common/SectionHeader";
import SkeletonCard from "../common/SkeletonCard";
import useFetch from "../../hooks/useFetch";
import { getSkills } from "../../api/skillsApi";

const CATEGORY_COLORS = {
  Frontend: "#6c63ff",
  Backend: "#10b981",
  Database: "#f59e0b",
  Tools: "#3b82f6",
  "Soft Skills": "#ec4899",
};

const CATEGORY_ORDER = [
  "Frontend",
  "Backend",
  "Database",
  "Tools",
  "Soft Skills",
];

const SkillBar = ({ skill, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      style={{ marginBottom: "1.25rem" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: skill.color || "var(--accent)",
              display: "inline-block",
              boxShadow: `0 0 6px ${skill.color || "var(--accent)"}`,
            }}
          />
          <span
            style={{
              color: "var(--text-primary)",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            {skill.name}
          </span>
        </div>
        <span
          style={{
            color: skill.color || "var(--accent)",
            fontWeight: 700,
            fontSize: "0.85rem",
            fontFamily: "var(--font-mono)",
          }}
        >
          {skill.percentage}%
        </span>
      </div>
      <div
        style={{
          height: 8,
          background: "var(--bg-secondary)",
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
        }}
        role="progressbar"
        aria-valuenow={skill.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name}: ${skill.percentage}%`}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.percentage}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: index * 0.06 + 0.3,
            ease: "easeOut",
          }}
          style={{
            height: "100%",
            borderRadius: "var(--radius-full)",
            background: `linear-gradient(90deg, ${skill.color || "var(--accent)"}, ${skill.color || "var(--accent)"}aa)`,
            boxShadow: `0 0 10px ${skill.color || "var(--accent)"}44`,
          }}
        />
      </div>
    </motion.div>
  );
};

function Skills() {
  const { data, loading, error } = useFetch(getSkills);
  const [activeCategory, setActiveCategory] = useState("All");

  const grouped = data?.data?.grouped || {};
  const availableCategories = [
    "All",
    ...CATEGORY_ORDER.filter((c) => grouped[c]?.length),
  ];

  const displayGroups =
    activeCategory === "All"
      ? Object.fromEntries(
          CATEGORY_ORDER.filter((c) => grouped[c]).map((c) => [c, grouped[c]]),
        )
      : { [activeCategory]: grouped[activeCategory] || [] };

  return (
    <section
      id="skills"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="container-xl px-4">
        <SectionHeader
          title="My"
          highlight="Skills"
          subtitle="Technologies and tools I work with, rated by proficiency."
        />

        {/* Category Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            justifyContent: "center",
            marginBottom: "3rem",
          }}
        >
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: "var(--radius-full)",
                border: `1.5px solid ${activeCategory === cat ? CATEGORY_COLORS[cat] || "var(--accent)" : "var(--border)"}`,
                background:
                  activeCategory === cat
                    ? `${CATEGORY_COLORS[cat] || "var(--accent)"}18`
                    : "transparent",
                color:
                  activeCategory === cat
                    ? CATEGORY_COLORS[cat] || "var(--accent)"
                    : "var(--text-muted)",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "var(--font-primary)",
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {loading && (
          <div className="row g-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-12 col-md-6">
                <SkeletonCard height={40} lines={5} />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div
            className="text-center"
            style={{ color: "var(--danger)", padding: "2rem" }}
          >
            <p>Failed to load skills. Please try again later.</p>
          </div>
        )}

        {!loading && !error && (
          <div className="row g-4">
            {Object.entries(displayGroups).map(([category, skills]) => (
              <div key={category} className="col-12 col-md-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="card-custom"
                  style={{ padding: "1.75rem", height: "100%" }}
                >
                  {/* Category Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: 28,
                        borderRadius: "var(--radius-full)",
                        background:
                          CATEGORY_COLORS[category] || "var(--accent)",
                      }}
                    />
                    <h4
                      style={{
                        margin: 0,
                        fontWeight: 800,
                        fontSize: "1.05rem",
                        color: "var(--text-primary)",
                      }}
                    >
                      {category}
                    </h4>
                    <span
                      style={{
                        marginLeft: "auto",
                        background: `${CATEGORY_COLORS[category] || "var(--accent)"}18`,
                        color: CATEGORY_COLORS[category] || "var(--accent)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "var(--radius-full)",
                      }}
                    >
                      {skills.length} {skills.length === 1 ? "skill" : "skills"}
                    </span>
                  </div>

                  {/* Skill Bars */}
                  {skills.map((skill, i) => (
                    <SkillBar key={skill._id} skill={skill} index={i} />
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {!loading && !error && data?.data?.skills?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{ marginTop: "3rem" }}
          >
            <div className="row g-3 justify-content-center">
              {CATEGORY_ORDER.filter((c) => grouped[c]).map((cat) => (
                <div key={cat} className="col-6 col-sm-4 col-md-2">
                  <div
                    className="card-custom"
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => setActiveCategory(cat)}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 900,
                        color: CATEGORY_COLORS[cat],
                      }}
                    >
                      {grouped[cat].length}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        marginTop: 2,
                      }}
                    >
                      {cat}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default Skills;
