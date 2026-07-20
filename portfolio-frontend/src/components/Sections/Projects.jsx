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
import { getImageUrl, truncate } from "../../utils/helpers";
import SectionHeader from "../common/SectionHeader";
import SkeletonCard from "../common/SkeletonCard";
import { getProjects, getProjectCategories } from "../../api/projectsApi";
import useDebounce from "../../hooks/useDebounce";
import { MdCategory } from "react-icons/md";

const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest First" },
  { value: "createdAt", label: "Oldest First" },
  { value: "title", label: "A → Z" },
  { value: "-title", label: "Z → A" },
];

const ImageCarousel = ({ images, title }) => {
  const [current, setCurrent] = useState(0);
  if (!images?.length)
    return (
      <div
        style={{
          aspectRatio: "16/9",
          background: "linear-gradient(135deg, var(--accent), #a78bfa)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FaExternalLinkAlt size={32} color="rgba(255,255,255,0.4)" />
      </div>
    );
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        aspectRatio: "16/9",
        background: "var(--bg-secondary)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={getImageUrl(images[current]?.url)}
          alt={`${title} screenshot ${current + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </AnimatePresence>
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrent((p) => (p - 1 + images.length) % images.length)
            }
            style={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.6)",
              border: "none",
              borderRadius: "50%",
              width: 30,
              height: 30,
              cursor: "pointer",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
            aria-label="Previous image"
          >
            <FaChevronLeft size={12} />
          </button>
          <button
            onClick={() => setCurrent((p) => (p + 1) % images.length)}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.6)",
              border: "none",
              borderRadius: "50%",
              width: 30,
              height: 30,
              cursor: "pointer",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
            aria-label="Next image"
          >
            <FaChevronRight size={12} />
          </button>
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 4,
              zIndex: 2,
            }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === current ? "white" : "rgba(255,255,255,0.4)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  padding: 0,
                }}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ProjectCard = ({ project, index }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className="card-custom"
      style={{
        padding: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ImageCarousel images={project.images} title={project.title} />

      <div
        style={{
          padding: "1.25rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Category + Status */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <span className="badge-custom" style={{ fontSize: "0.72rem" }}>
            {project.category}
          </span>
          {project.status && (
            <span
              className="badge-custom"
              style={{
                fontSize: "0.72rem",
                background:
                  project.status === "Completed"
                    ? "rgba(16,185,129,0.1)"
                    : "rgba(245,158,11,0.1)",
                color:
                  project.status === "Completed"
                    ? "var(--success)"
                    : "var(--warning)",
                borderColor: "transparent",
              }}
            >
              {project.status}
            </span>
          )}
        </div>

        <h5
          style={{
            color: "var(--text-primary)",
            fontWeight: 800,
            marginBottom: "0.5rem",
            fontSize: "1.05rem",
          }}
        >
          {project.title}
        </h5>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            lineHeight: 1.7,
            marginBottom: "1rem",
          }}
        >
          {expanded ? project.description : truncate(project.description, 120)}
        </p>

        {/* Features */}
        {expanded && project.features?.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <p
              style={{
                color: "var(--text-secondary)",
                fontWeight: 600,
                fontSize: "0.8rem",
                marginBottom: "0.4rem",
              }}
            >
              Features:
            </p>
            <ul
              style={{
                paddingLeft: "1.25rem",
                margin: 0,
                color: "var(--text-muted)",
                fontSize: "0.8rem",
              }}
            >
              {project.features.map((f, i) => (
                <li key={i} style={{ marginBottom: "0.2rem" }}>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack */}
        {project.technologies?.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.35rem",
              marginBottom: "1rem",
            }}
          >
            {project.technologies.map((tech) => (
              <span
                key={tech}
                style={{
                  padding: "0.2rem 0.6rem",
                  borderRadius: "var(--radius-full)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-muted)",
                  fontSize: "0.72rem",
                  border: "1px solid var(--border)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent"
              style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
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
              style={{ padding: "0.45rem 1rem", fontSize: "0.8rem" }}
              aria-label={`View GitHub repository for ${project.title}`}
            >
              <FaGithub size={12} /> GitHub
            </a>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--accent)",
              fontSize: "0.8rem",
              fontWeight: 600,
              marginLeft: "auto",
              fontFamily: "var(--font-primary)",
            }}
          >
            {expanded ? "Show Less ↑" : "View More ↓"}
          </button>
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
    (async () => {
      await fetchProjects();
    })();
  }, [fetchProjects]);
  return (
    <section
      id="projects"
      className="section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="container-xl px-4">
        <SectionHeader
          title="My"
          highlight="Projects"
          subtitle="A showcase of what I've built using the MERN stack."
        />

        {/* Controls */}
        <div className="row g-3 mb-4 align-items-center">
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
                placeholder="Search projects..."
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
            <div style={{ position: "relative" }}>
              <MdCategory
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
                size={16}
              />
              <select
                value={category}
                onChange={(e) => {
                  setPage(1);
                  setCategory(e.target.value);
                }}
                className="form-control-custom"
                style={{
                  paddingLeft: "2.5rem",
                  cursor: "pointer",
                  appearance: "none",
                }}
                aria-label="Filter by category"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
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
              style={{ cursor: "pointer", appearance: "none" }}
              aria-label="Sort projects"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" className="row g-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-4">
                  <SkeletonCard height={180} lines={4} />
                </div>
              ))}
            </motion.div>
          ) : projects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", padding: "4rem 2rem" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
              <h4 style={{ color: "var(--text-primary)" }}>
                No projects found
              </h4>
              <p style={{ color: "var(--text-muted)" }}>
                Try adjusting your search or filters.
              </p>
              <button
                onClick={() => {
                  setPage(1);
                  setSearch("");
                  setCategory("All");
                }}
                className="btn-outline-accent"
                style={{ marginTop: "1rem" }}
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div key="projects" className="row g-4">
              {projects.map((project, i) => (
                <div key={project._id} className="col-12 col-sm-6 col-lg-4">
                  <ProjectCard project={project} index={i} />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--border)",
                background: "transparent",
                color: meta.hasPrevPage
                  ? "var(--text-primary)"
                  : "var(--text-muted)",
                cursor: meta.hasPrevPage ? "pointer" : "not-allowed",
                fontFamily: "var(--font-primary)",
              }}
              aria-label="Previous page"
            >
              ← Prev
            </button>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-md)",
                    border: `1.5px solid ${page === p ? "var(--accent)" : "var(--border)"}`,
                    background: page === p ? "var(--accent)" : "transparent",
                    color: page === p ? "white" : "var(--text-primary)",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontFamily: "var(--font-primary)",
                  }}
                  aria-label={`Page ${p}`}
                  aria-current={page === p ? "page" : undefined}
                >
                  {p}
                </button>
              ),
            )}
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={!meta.hasNextPage}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--border)",
                background: "transparent",
                color: meta.hasNextPage
                  ? "var(--text-primary)"
                  : "var(--text-muted)",
                cursor: meta.hasNextPage ? "pointer" : "not-allowed",
                fontFamily: "var(--font-primary)",
              }}
              aria-label="Next page"
            >
              Next →
            </button>
          </motion.div>
        )}

        {meta && (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              marginTop: "1rem",
            }}
          >
            Showing {projects.length} of {meta.total} project
            {meta.total !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </section>
  );
}

export default Projects;
