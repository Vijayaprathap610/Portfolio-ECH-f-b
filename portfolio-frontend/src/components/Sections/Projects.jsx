import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaGithub,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { FiLayers, FiMaximize2, FiX, FiCheckCircle } from "react-icons/fi";
import { getImageUrl } from "../../utils/helpers";
import SectionHeader from "../common/SectionHeader";
import SkeletonCard from "../common/SkeletonCard";
import { getProjects, getProjectCategories } from "../../api/projectsApi";
import useDebounce from "../../hooks/useDebounce";

const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest First" },
  { value: "createdAt", label: "Oldest First" },
  { value: "title", label: "A → Z" },
  { value: "-title", label: "Z → A" },
];

const ImageCarousel = ({ images, title }) => {
  const [current, setCurrent] = useState(0);
  const [failed, setFailed] = useState({});

  const imgList = Array.isArray(images) ? images : images ? [images] : [];

  if (!imgList.length) {
    return (
      <div
        style={{
          aspectRatio: "16/9",
          background: "linear-gradient(135deg, var(--bg-surface), var(--bg-secondary))",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <FiLayers size={32} color="var(--accent-light)" style={{ opacity: 0.6 }} />
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
          {title}
        </span>
      </div>
    );
  }

  const rawItem = imgList[current];
  const rawUrl = typeof rawItem === "string" ? rawItem : rawItem?.url || rawItem?.path || "";
  const isFailed = failed[current];

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        aspectRatio: "16/9",
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <AnimatePresence mode="wait">
        {isFailed ? (
          <div
            key={`placeholder-${current}`}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
              background: "linear-gradient(135deg, var(--bg-surface), var(--bg-secondary))",
              padding: "1rem",
              textAlign: "center",
            }}
          >
            <FiLayers size={32} color="var(--accent-light)" />
            <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 700 }}>
              {title}
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              Full Stack Application
            </span>
          </div>
        ) : (
          <motion.img
            key={current}
            src={getImageUrl(rawUrl)}
            alt={`${title} preview ${current + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
            onError={(e) => {
              if (!e.target.dataset.triedAlternate && rawUrl) {
                e.target.dataset.triedAlternate = "true";
                if (rawUrl.startsWith("/uploads")) {
                  e.target.src = e.target.src.includes("localhost")
                    ? `https://portfolio-ech-f-b.onrender.com${rawUrl}`
                    : rawUrl;
                  return;
                }
              }
              setFailed((prev) => ({ ...prev, [current]: true }));
            }}
          />
        )}
      </AnimatePresence>

      {imgList.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrent((p) => (p - 1 + imgList.length) % imgList.length);
            }}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(9, 13, 22, 0.75)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50%",
              width: 32,
              height: 32,
              cursor: "pointer",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              backdropFilter: "blur(4px)",
            }}
            aria-label="Previous image"
          >
            <FaChevronLeft size={11} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrent((p) => (p + 1) % imgList.length);
            }}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(9, 13, 22, 0.75)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50%",
              width: 32,
              height: 32,
              cursor: "pointer",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              backdropFilter: "blur(4px)",
            }}
            aria-label="Next image"
          >
            <FaChevronRight size={11} />
          </button>
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 5,
              zIndex: 2,
            }}
          >
            {imgList.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === current ? 16 : 6,
                  height: 5,
                  borderRadius: 3,
                  background: i === current ? "var(--accent-light)" : "rgba(255,255,255,0.4)",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 680,
            maxHeight: "85vh",
            overflowY: "auto",
            background: "var(--bg-card)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-xl)",
            padding: "2rem",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-secondary)",
            }}
          >
            <FiX size={18} />
          </button>

          {/* Modal Header */}
          <div style={{ marginBottom: "1.25rem", paddingRight: "2.5rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span className="badge-custom">{project.category}</span>
              {project.status && (
                <span
                  className="badge-custom"
                  style={{
                    color: project.status === "Completed" ? "var(--success)" : "var(--warning)",
                    background: project.status === "Completed" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                    border: "none",
                  }}
                >
                  {project.status}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
              {project.title}
            </h2>
          </div>

          {/* Modal Carousel */}
          {project.images?.length > 0 && (
            <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "1.5rem" }}>
              <ImageCarousel images={project.images} title={project.title} />
            </div>
          )}

          {/* Description */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Project Overview
            </h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
              {project.description}
            </p>
          </div>

          {/* Key Features */}
          {project.features?.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
                Key Technical Features
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {project.features.map((feat, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    <FiCheckCircle size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: "0.2rem" }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies */}
          {project.technologies?.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
                Technologies Used
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      padding: "0.3rem 0.75rem",
                      borderRadius: "var(--radius-full)",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions in Modal */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid var(--divider)", paddingTop: "1.25rem" }}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent"
                style={{ padding: "0.65rem 1.4rem" }}
              >
                <FaExternalLinkAlt size={13} /> Live Deployment
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-accent"
                style={{ padding: "0.65rem 1.4rem" }}
              >
                <FaGithub size={15} /> Source Code
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ProjectCard = ({ project, index, onOpenModal }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="card-custom"
      style={{
        padding: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "480px",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <ImageCarousel images={project.images} title={project.title} />

      <div
        style={{
          padding: "1.5rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Category & Status */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          <span className="badge-custom" style={{ fontSize: "0.75rem" }}>
            {project.category}
          </span>
          {project.status && (
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: project.status === "Completed" ? "var(--success)" : "var(--warning)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: project.status === "Completed" ? "var(--success)" : "var(--warning)",
                }}
              />
              {project.status}
            </span>
          )}
        </div>

        {/* Title */}
        <h4
          style={{
            color: "var(--text-primary)",
            fontWeight: 800,
            fontSize: "1.15rem",
            marginBottom: "0.6rem",
            lineHeight: 1.35,
          }}
        >
          {project.title}
        </h4>

        {/* Clamped description */}
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            marginBottom: "1rem",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "4.2rem",
          }}
        >
          {project.description}
        </p>

        {/* View Full Description Button */}
        <div style={{ marginBottom: "1rem" }}>
          <button
            onClick={() => onOpenModal(project)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "var(--accent-light)",
              fontSize: "0.825rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <FiMaximize2 size={13} /> View Full Description
          </button>
        </div>

        {/* Tech Stack Pills (Fixed max 1 row visible with +N overflow) */}
        {project.technologies?.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.35rem",
              marginBottom: "1.25rem",
              maxHeight: "34px",
              overflow: "hidden",
            }}
          >
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                style={{
                  padding: "0.2rem 0.6rem",
                  borderRadius: "var(--radius-full)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-muted)",
                  fontSize: "0.725rem",
                  fontWeight: 600,
                  border: "1px solid var(--border)",
                  whiteSpace: "nowrap",
                }}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span
                style={{
                  padding: "0.2rem 0.5rem",
                  borderRadius: "var(--radius-full)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-muted)",
                  fontSize: "0.725rem",
                  fontWeight: 600,
                  border: "1px solid var(--border)",
                }}
              >
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Uniform Action Buttons */}
        <div
          style={{
            marginTop: "auto",
            display: "grid",
            gridTemplateColumns: project.liveUrl && project.githubUrl ? "1fr 1fr" : "1fr",
            gap: "0.6rem",
          }}
        >
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent"
              style={{
                padding: "0.55rem 0.75rem",
                fontSize: "0.825rem",
                justifyContent: "center",
                textAlign: "center",
              }}
              aria-label={`View live demo of ${project.title}`}
            >
              <FaExternalLinkAlt size={12} /> Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-accent"
              style={{
                padding: "0.55rem 0.75rem",
                fontSize: "0.825rem",
                justifyContent: "center",
                textAlign: "center",
              }}
              aria-label={`View GitHub repository for ${project.title}`}
            >
              <FaGithub size={13} /> Repository
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["All"]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const debouncedSearch = useDebounce(search, 400);
  const LIMIT = 6;

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, sort };
      if (category !== "All") params.category = category;
      if (debouncedSearch) params.search = debouncedSearch;
      const res = await getProjects(params);
      setProjects(res.data.data);
      setMeta(res.data.meta);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [page, category, sort, debouncedSearch]);

  useEffect(() => {
    getProjectCategories()
      .then((res) => {
        if (res.data.data?.length) setCategories(["All", ...res.data.data]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <section
      id="projects"
      className="section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="container-xl px-4">
        <SectionHeader
          title="Featured"
          highlight="Projects"
          subtitle="Real-world fullstack applications, robust APIs, and interactive web products."
        />

        {/* Filter Controls Bar */}
        <div
          className="card-custom"
          style={{
            padding: "1rem 1.25rem",
            marginBottom: "2.5rem",
            background: "var(--bg-card)",
          }}
        >
          <div className="row g-3 align-items-center">
            {/* Search */}
            <div className="col-12 col-md-5">
              <div style={{ position: "relative" }}>
                <FaSearch
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                  size={14}
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                  placeholder="Search projects by tech, title or keyword..."
                  className="form-control-custom"
                  style={{
                    paddingLeft: "2.5rem",
                    paddingRight: search ? "2.5rem" : "1rem",
                  }}
                  aria-label="Search projects"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                    }}
                    aria-label="Clear search"
                  >
                    <FaTimes size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="col-12 col-sm-6 col-md-4">
              <select
                value={category}
                onChange={(e) => {
                  setPage(1);
                  setCategory(e.target.value);
                }}
                className="form-control-custom"
                style={{ cursor: "pointer" }}
                aria-label="Filter by category"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    Category: {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="col-12 col-sm-6 col-md-3">
              <select
                value={sort}
                onChange={(e) => {
                  setPage(1);
                  setSort(e.target.value);
                }}
                className="form-control-custom"
                style={{ cursor: "pointer" }}
                aria-label="Sort projects"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    Sort: {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="row g-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="col-12 col-md-6 col-lg-4">
                  <SkeletonCard height={200} lines={4} />
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "var(--bg-card)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔎</div>
              <h4 style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                No projects found
              </h4>
              <p style={{ color: "var(--text-muted)", maxWidth: 400, margin: "0 auto 1.5rem" }}>
                We couldn't find any projects matching your criteria. Try resetting the filters.
              </p>
              <button
                onClick={() => {
                  setPage(1);
                  setSearch("");
                  setCategory("All");
                }}
                className="btn-accent"
              >
                Reset Search Filters
              </button>
            </motion.div>
          ) : (
            <div className="row g-4 align-items-stretch">
              {projects.map((project, i) => (
                <div key={project._id} className="col-12 col-md-6 col-lg-4">
                  <ProjectCard
                    project={project}
                    index={i}
                    onOpenModal={setSelectedProject}
                  />
                </div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
              marginTop: "3rem",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!meta.hasPrevPage}
              style={{
                padding: "0.55rem 1.1rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: meta.hasPrevPage ? "var(--text-primary)" : "var(--text-muted)",
                cursor: meta.hasPrevPage ? "pointer" : "not-allowed",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              ← Prev
            </button>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "var(--radius-md)",
                  border: `1px solid ${page === p ? "var(--accent)" : "var(--border)"}`,
                  background: page === p ? "var(--accent)" : "var(--bg-card)",
                  color: page === p ? "#ffffff" : "var(--text-primary)",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={!meta.hasNextPage}
              style={{
                padding: "0.55rem 1.1rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: meta.hasNextPage ? "var(--text-primary)" : "var(--text-muted)",
                cursor: meta.hasNextPage ? "pointer" : "not-allowed",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              Next →
            </button>
          </div>
        )}

        {/* Modal for Full Description */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
}

export default Projects;
