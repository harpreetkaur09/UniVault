import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiUser } from "react-icons/fi";
import GlassCard from "./GlassCard";
import TechBadge from "./TechBadge";

const getProjectInitials = (title) =>
  title
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "P";

const FeaturedProjectCard = ({ project, index }) => {
  const isEven = index % 2 === 0;
  const to = project.slug ? `/projects/${project.slug}` : "/#projects";

  return (
    <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
      <GlassCard hover padding="p-0" className="overflow-hidden">
        <div className="lg:grid lg:grid-cols-2 items-stretch">
          <Link
            to={to}
            className={`relative overflow-hidden block bg-dark-900 ${!isEven ? "lg:order-2" : ""}`}
          >
            {project.image?.url ? (
              <img
                src={project.image.url}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="aspect-video lg:aspect-auto lg:h-full lg:min-h-[280px] object-cover w-full"
              />
            ) : (
              <div className="aspect-video lg:min-h-[280px] w-full h-full bg-linear-to-br from-primary-900/50 to-accent-900/50 flex items-center justify-center">
                <span className="text-4xl font-bold text-dark-300">
                  {getProjectInitials(project.title)}
                </span>
              </div>
            )}
          </Link>

          <div className="p-6 lg:p-8 flex flex-col">
            <Link to={to}>
              <h3 className="text-2xl font-bold text-dark-50 mb-3 hover:text-primary-400 transition-colors">
                {project.title}
              </h3>
            </Link>

            {project.studentName && (
              <p className="flex items-center gap-2 text-sm text-dark-300 mb-3">
                <FiUser size={14} className="text-primary-400 shrink-0" />
                <span>
                  {project.studentName}
                  {project.rollNumber ? ` · Roll ${project.rollNumber}` : ""}
                </span>
              </p>
            )}

            <p className="text-dark-300 leading-relaxed mb-4 line-clamp-4">
              {project.description}
            </p>

            {project.tech?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech) => (
                  <TechBadge key={tech} name={tech} />
                ))}
              </div>
            )}

            <Link
              to={to}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-sm px-4 py-2 rounded-lg mt-auto w-fit"
            >
              View details
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default FeaturedProjectCard;
