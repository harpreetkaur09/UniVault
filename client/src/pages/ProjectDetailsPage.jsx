import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiCalendar,
  FiCode,
  FiExternalLink,
  FiGithub,
  FiAlertCircle,
} from "react-icons/fi";

import GlassCard from "../components/ui/GlassCard";
import GradientText from "../components/ui/GradientText";
import Spinner from "../components/ui/Spinner";
import TechBadge from "../components/ui/TechBadge";
import ProjectCard from "../components/ui/ProjectCard";
import { getProjectBySlug, getProjects } from "../services/projectService";
import { fadeInUp } from "../utils/animations";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ProjectDetailsPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [others, setOthers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await getProjectBySlug(slug);
        const data = res.data?.data;
        if (!cancelled) setProject(data);

        try {
          const listRes = await getProjects();
          const list = listRes.data?.data || [];
          if (!cancelled) {
            setOthers(
              list.filter((p) => p.slug !== slug && p._id !== data?._id).slice(0, 3)
            );
          }
        } catch {
          if (!cancelled) setOthers([]);
        }
      } catch (err) {
        if (!cancelled) {
          setProject(null);
          setError(err.message || "Project not found");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 pt-24">
        <Helmet>
          <title>Project not found | uniVault</title>
        </Helmet>
        <GlassCard className="max-w-md w-full text-center py-12">
          <FiAlertCircle className="mx-auto text-red-400 mb-4" size={40} />
          <h1 className="text-xl font-semibold text-dark-50 mb-2">
            Project not found
          </h1>
          <p className="text-dark-400 text-sm mb-6">
            {error || "This project is not available."}
          </p>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-sm px-5 py-2.5 rounded-lg"
          >
            <FiArrowLeft />
            Back to projects
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.title} | uniVault</title>
        <meta name="description" content={project.description?.slice(0, 150)} />
      </Helmet>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-primary-400 mb-8"
          >
            <FiArrowLeft />
            All projects
          </Link>

          <GlassCard padding="p-0" className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative bg-dark-900 min-h-[240px] lg:min-h-[420px]">
                {project.image?.url ? (
                  <img
                    src={project.image.url}
                    alt={project.title}
                    className="w-full h-full object-cover min-h-[240px] lg:absolute lg:inset-0 lg:min-h-full"
                  />
                ) : (
                  <div className="w-full h-full min-h-[240px] lg:min-h-[420px] bg-linear-to-br from-primary-900/40 to-dark-800 flex items-center justify-center">
                    <FiCode className="text-dark-500" size={56} />
                  </div>
                )}
                {project.featured && (
                  <span className="absolute top-4 left-4 bg-primary-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Featured
                  </span>
                )}
              </div>

              <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
                <p className="text-primary-400 text-xs font-mono uppercase tracking-wider mb-2">
                  Project details
                </p>
                <GradientText as="h1" className="text-3xl sm:text-4xl font-bold mb-4">
                  {project.title}
                </GradientText>

                <div className="flex flex-wrap gap-4 text-sm text-dark-400 mb-6">
                  {project.createdAt && (
                    <span className="inline-flex items-center gap-1.5">
                      <FiCalendar />
                      {formatDate(project.createdAt)}
                    </span>
                  )}
                  {project.tech?.length > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <FiCode />
                      {project.tech.length} tech
                    </span>
                  )}
                </div>

                <p className="text-dark-300 leading-relaxed whitespace-pre-wrap mb-6 flex-1">
                  {project.description}
                </p>

                {project.tech?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech.map((tech) => (
                      <TechBadge key={tech} name={tech} />
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-auto">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-sm px-4 py-2.5 rounded-lg"
                    >
                      <FiExternalLink size={16} />
                      Live link
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-dark-600 hover:border-primary-500 text-dark-200 text-sm px-4 py-2.5 rounded-lg"
                    >
                      <FiGithub size={16} />
                      Code link
                    </a>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>

          {others.length > 0 && (
            <div className="mt-16">
              <h2 className="text-lg font-semibold text-dark-100 mb-6">
                Other uploaded projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {others.map((item, index) => (
                  <ProjectCard key={item._id} project={item} index={index} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ProjectDetailsPage;
