import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "../common/SectionHeader";
import SkeletonCard from "../common/SkeletonCard";
import useFetch from "../../hooks/useFetch";
import { getSkills } from "../../api/skillsApi";
import {
  FiCode,
  FiServer,
  FiDatabase,
  FiTool,
  FiUserCheck,
  FiCheck,
  FiLayers,
  FiPenTool,
} from "react-icons/fi";
import {
  SiFigma,
  SiSketch,
  SiPenpot,
  SiHtml5,
  SiJavascript,
  SiReact,
  SiBootstrap,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMongoose,
  SiGit,
  SiPostman,
  SiNpm,
  SiJsonwebtokens,
} from "react-icons/si";
import {
  FaCss3Alt,
  FaLightbulb,
  FaUsers,
  FaComments,
  FaClock,
  FaGithub,
} from "react-icons/fa";
import { TbBrandAdobeXd, TbBrandVscode, TbApi } from "react-icons/tb";
import { MdPalette } from "react-icons/md";

// Icon resolution for all skill categories
const TOOL_ICONS = {
  // Frontend Development
  "HTML5": SiHtml5,
  "HTML": SiHtml5,
  "CSS3": FaCss3Alt,
  "CSS": FaCss3Alt,
  "JavaScript": SiJavascript,
  "JavaScript ES6+": SiJavascript,
  "React": SiReact,
  "React.js": SiReact,
  "Bootstrap": SiBootstrap,
  "Bootstrap 5": SiBootstrap,

  // Backend Development
  "Node.js": SiNodedotjs,
  "NodeJS": SiNodedotjs,
  "Express.js": SiExpress,
  "Express": SiExpress,
  "RESTful APIs": TbApi,
  "JWT Auth": SiJsonwebtokens,

  // Database
  "MongoDB": SiMongodb,
  "Mongoose": SiMongoose,

  // Tools & DevOps
  "Git & GitHub": FaGithub,
  "Git": SiGit,
  "GitHub": FaGithub,
  "VS Code": TbBrandVscode,
  "Postman": SiPostman,
  "npm": SiNpm,

  // Soft Skills
  "Problem Solving": FaLightbulb,
  "Team Work": FaUsers,
  "Communication": FaComments,
  "Time Management": FaClock,

  // UI/UX Design
  "Figma": SiFigma,
  "Adobe XD": TbBrandAdobeXd,
  "Sketch": SiSketch,
  "Canva": MdPalette,
  "Penpot": SiPenpot,
};

const CATEGORY_CONFIG = {
  Frontend: {
    icon: FiCode,
    color: "var(--accent)",
    label: "Frontend Development",
    desc: "Interfaces, client architecture, state & animations",
  },
  Backend: {
    icon: FiServer,
    color: "#8b5cf6",
    label: "Backend Development",
    desc: "Scalable server runtimes, RESTful contracts & auth",
  },
  Database: {
    icon: FiDatabase,
    color: "#c5841c",
    label: "Database",
    desc: "Data models, indexing, aggregation & caching",
  },
  "UI/UX Design": {
    icon: FiPenTool,
    color: "#e11d48",
    label: "UI/UX Design",
    desc: "Wireframing, prototyping, design systems & user experience",
  },
  "Soft Skills": {
    icon: FiUserCheck,
    color: "#2c6b8a",
    label: "Soft Skills",
    desc: "Collaboration, agile workflows & technical leadership",
  },
  Tools: {
    icon: FiTool,
    color: "#a0522d",
    label: "DevOps & Tools",
    desc: "Toolchains, version control, testing & deployment",
  },
};

// Exact requested category order
const CATEGORY_ORDER = [
  "Frontend",
  "Backend",
  "Database",
  "UI/UX Design",
  "Soft Skills",
  "Tools",
];

const DEFAULT_UI_UX_TOOLS = [
  { name: "Figma", color: "#F24E1E" },
  { name: "Adobe XD", color: "#FF61F6" },
  { name: "Sketch", color: "#F7B500" },
  { name: "Canva", color: "#7B68EE" },
  { name: "Penpot", color: "#6366f1" },
];

function Skills() {
  const { data, loading, error } = useFetch(getSkills);
  const [activeCategory, setActiveCategory] = useState("All");

  const backendGrouped = data?.data?.grouped || {};

  // Seamlessly merge UI/UX tools ensuring Figma, Adobe XD, Sketch, Canva, Penpot are always present
  const mergedGrouped = { ...backendGrouped };
  if (!mergedGrouped["UI/UX Design"] || mergedGrouped["UI/UX Design"].length === 0) {
    mergedGrouped["UI/UX Design"] = DEFAULT_UI_UX_TOOLS;
  } else {
    // If backend has some, ensure any missing required tools are included
    const existingNames = new Set(mergedGrouped["UI/UX Design"].map((s) => s.name));
    DEFAULT_UI_UX_TOOLS.forEach((tool) => {
      if (!existingNames.has(tool.name)) {
        mergedGrouped["UI/UX Design"].push(tool);
      }
    });
  }

  // Available categories strictly matching the requested order
  const availableCategories = [
    "All",
    ...CATEGORY_ORDER.filter((c) => mergedGrouped[c]?.length),
  ];

  const displayGroups =
    activeCategory === "All"
      ? Object.fromEntries(
          CATEGORY_ORDER.filter((c) => mergedGrouped[c]?.length).map((c) => [
            c,
            mergedGrouped[c],
          ])
        )
      : mergedGrouped[activeCategory]
      ? { [activeCategory]: mergedGrouped[activeCategory] }
      : {};

  return (
    <section
      id="skills"
      className="section"
      style={{
        background: "var(--bg-primary)",
        position: "relative",
      }}
    >
      <div className="container-xl px-4">
        <SectionHeader
          title="Technical"
          highlight="Stack & Skills"
          subtitle="A comprehensive overview of modern technologies, libraries, and design tools I use in production."
        />

        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.55rem",
            justifyContent: "center",
            marginBottom: "2.75rem",
          }}
        >
          {availableCategories.map((cat) => {
            const isSelected = activeCategory === cat;
            const config = CATEGORY_CONFIG[cat];
            const Icon = config?.icon || FiLayers;
            const label = config?.label || cat;
            const count =
              cat === "All"
                ? Object.values(mergedGrouped).reduce(
                    (acc, arr) => acc + (arr?.length || 0),
                    0
                  )
                : mergedGrouped[cat]?.length || 0;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.45rem 1rem",
                  borderRadius: "var(--radius-full)",
                  border: isSelected
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border)",
                  background: isSelected
                    ? "rgba(var(--accent-rgb), 0.15)"
                    : "var(--bg-card)",
                  color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                  fontWeight: 600,
                  fontSize: "0.825rem",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                  boxShadow: isSelected ? "0 0 14px rgba(var(--accent-rgb), 0.2)" : "none",
                }}
              >
                <Icon
                  size={14}
                  color={isSelected ? "var(--accent-light)" : "var(--text-muted)"}
                />
                <span>{label}</span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    padding: "0.08rem 0.4rem",
                    borderRadius: "var(--radius-full)",
                    background: isSelected
                      ? "var(--accent)"
                      : "var(--bg-secondary)",
                    color: isSelected ? "#ffffff" : "var(--text-muted)",
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="row g-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-12 col-md-6">
                <SkeletonCard height={80} lines={4} />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            className="text-center"
            style={{
              color: "var(--danger)",
              padding: "3rem",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
            }}
          >
            <p style={{ margin: 0, fontWeight: 600 }}>{error}</p>
          </div>
        )}

        {/* Grouped Skills Grid */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="row g-4"
            >
              {Object.entries(displayGroups).map(([category, skills]) => {
                const config = CATEGORY_CONFIG[category] || {
                  icon: FiCode,
                  color: "var(--accent)",
                  label: category,
                  desc: "Core capabilities",
                };
                const CategoryIcon = config.icon;

                return (
                  <div key={category} className="col-12 col-lg-6">
                    <div
                      className="card-custom"
                      style={{
                        padding: "1.25rem 1.4rem",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-lg)",
                        transition: "all var(--transition-base)",
                      }}
                    >
                      {/* Category Header */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "1rem",
                          paddingBottom: "0.85rem",
                          borderBottom: "1px solid var(--divider)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "var(--radius-md)",
                              background: `rgba(${
                                category === "Frontend"
                                  ? "139, 26, 43"
                                  : category === "Backend"
                                  ? "139, 92, 246"
                                  : category === "Database"
                                  ? "197, 132, 28"
                                  : category === "UI/UX Design"
                                  ? "225, 29, 72"
                                  : category === "Soft Skills"
                                  ? "44, 107, 138"
                                  : "160, 82, 45"
                              }, 0.12)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: config.color,
                            }}
                          >
                            <CategoryIcon size={17} />
                          </div>
                          <div>
                            <h3
                              style={{
                                fontSize: "0.98rem",
                                fontWeight: 700,
                                margin: 0,
                                color: "var(--text-primary)",
                              }}
                            >
                              {config.label}
                            </h3>
                            <p
                              style={{
                                fontSize: "0.76rem",
                                color: "var(--text-muted)",
                                margin: 0,
                              }}
                            >
                              {config.desc}
                            </p>
                          </div>
                        </div>

                        <span
                          className="badge-custom"
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "0.2rem 0.55rem",
                          }}
                        >
                          {skills.length} skills
                        </span>
                      </div>

                      {/* Skill Chips Grid */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.45rem",
                          flex: 1,
                          alignContent: "flex-start",
                        }}
                      >
                        {skills.map((skill, index) => {
                          const accentColor = skill.color || config.color;
                          const SpecificIcon = TOOL_ICONS[skill.name];

                          return (
                            <motion.div
                              key={skill._id || skill.name}
                              initial={{ opacity: 0, scale: 0.92 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.02, duration: 0.18 }}
                              whileHover={{ y: -1.5 }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.45rem",
                                padding: "0.35rem 0.72rem",
                                borderRadius: "var(--radius-sm)",
                                background: "var(--bg-surface)",
                                border: "1px solid var(--border)",
                                color: "var(--text-primary)",
                                fontSize: "0.81rem",
                                fontWeight: 600,
                                transition: "all var(--transition-fast)",
                              }}
                            >
                              {SpecificIcon ? (
                                <SpecificIcon size={13} color={accentColor} />
                              ) : (
                                <span
                                  style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: accentColor,
                                    boxShadow: `0 0 6px ${accentColor}`,
                                  }}
                                />
                              )}
                              <span>{skill.name}</span>
                              <FiCheck
                                size={12}
                                style={{ color: "var(--text-muted)", opacity: 0.6 }}
                              />
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}

export default Skills;
