import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCode, FiUser } from "react-icons/fi";
import GlassCard from "./GlassCard";
import TechBadge from "./TechBadge";

const GRADIENT_COMBOS = [
  "from-primary-900/50 to-accent-900/50",
  "from-accent-900/50 to-primary-900/50",
  "from-primary-800/40 to-dark-800",
  "from-accent-800/40 to-dark-800",
];

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
  });
};

const ProjectCard = ({ project, index = 0 }) => {
  const gradientClass = GRADIENT_COMBOS[index % GRADIENT_COMBOS.length];
  const techList = project.tech || [];
  const visibleTechs = techList.slice(0, 3);
  const remainingCount = techList.length - 3;
  const to = project.slug ? `/projects/${project.slug}` : "/#projects";

  return (
    <motion.div className="h-full" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
      <Link to={to} className="block h-full">
        <GlassCard hover padding="p-0" className="h-full flex flex-col overflow-hidden">
          <div className="relative overflow-hidden">
            {project.image?.url ? (
              <img
                src={project.image.url}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="aspect-video object-cover w-full"
              />
            ) : (
              <div
                className={`aspect-video w-full bg-linear-to-br ${gradientClass} flex items-center justify-center`}
              >
                <FiCode className="text-dark-500" size={40} />
              </div>
            )}

            {project.featured && (
              <span className="absolute top-3 right-3 bg-primary-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Featured
              </span>
            )}
          </div>

          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg font-semibold text-dark-50 mb-2 line-clamp-1 group-hover:text-primary-400">
              {project.title}
            </h3>

            {project.studentName && (
              <p className="flex items-center gap-1.5 text-xs text-dark-300 mb-2">
                <FiUser size={12} className="text-primary-400 shrink-0" />
                <span className="truncate">
                  {project.studentName}
                  {project.rollNumber ? ` · ${project.rollNumber}` : ""}
                </span>
              </p>
            )}

            <p className="text-dark-400 text-sm leading-relaxed line-clamp-2 mb-4">
              {project.description}
            </p>

            {visibleTechs.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {visibleTechs.map((tech) => (
                  <TechBadge key={tech} name={tech} size="sm" />
                ))}
                {remainingCount > 0 && (
                  <span className="inline-block px-2 py-0.5 text-[10px] text-dark-400 border border-dark-700 rounded-full font-mono">
                    +{remainingCount}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-dark-800">
              <span className="text-dark-500 text-xs">
                {formatDate(project.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-primary-400">
                View details
                <FiArrowRight />
              </span>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
