import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiEdit2,
  FiTrash2,
  FiStar,
  FiExternalLink,
  FiGithub,
  FiCode,
  FiCopy,
  FiEye,
  FiEyeOff,
  FiCalendar,
  FiClock,
  FiHash,
  FiLink,
  FiLayers,
  FiAlertCircle,
  FiFolder,
  FiUser,
  FiMail,
} from "react-icons/fi";

import GlassCard from "../components/ui/GlassCard";
import StatusBadge from "../components/ui/StatusBadge";
import TechBadge from "../components/ui/TechBadge";
import ConfirmModal from "../components/ui/ConfirmModal";
import Skeleton from "../components/ui/Skeleton";
import ProjectForm from "../components/admin/ProjectForm";
import { useAuth } from "../contexts/AuthContext";
import * as projectService from "../services/projectService";
import { fadeInUp } from "../utils/animations";

const formatDateTime = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const stripProtocol = (url) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

const InfoRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b border-dark-800/60 last:border-0">
    <span className="flex items-center gap-2 text-sm text-dark-400 shrink-0">
      <Icon size={15} />
      {label}
    </span>
    <span className="text-sm text-dark-100 text-right min-w-0">{children}</span>
  </div>
);

const SectionCard = ({ title, icon: Icon, children }) => (
  <GlassCard>
    <h2 className="flex items-center gap-2 text-base font-semibold text-dark-50 mb-4">
      <Icon size={17} className="text-primary-400" />
      {title}
    </h2>
    {children}
  </GlassCard>
);

const DetailsSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-5 w-40" />
    <Skeleton className="h-80 w-full rounded-2xl" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton className="h-64 lg:col-span-2 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  </div>
);

const AdminProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const basePath = isAdmin ? "/admin/projects" : "/teacher/projects";

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageBroken, setImageBroken] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      setError("");
      const res = await projectService.getAdminProjects();
      setProjects(res.data?.data || []);
    } catch (err) {
      setError(err.message || "Failed to load project");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setImageBroken(false);
    fetchProjects();
  }, [fetchProjects, id]);

  const index = useMemo(() => projects.findIndex((p) => p._id === id), [projects, id]);
  const project = index >= 0 ? projects[index] : null;
  const prevProject = index > 0 ? projects[index - 1] : null;
  const nextProject = index >= 0 && index < projects.length - 1 ? projects[index + 1] : null;

  const publicPath = project ? `/projects/${project.slug}` : "";
  const isPublished = project?.status === "published";

  const update = async (payload, successMessage) => {
    setIsBusy(true);
    try {
      await projectService.updateProject(project._id, payload);
      toast.success(successMessage);
      await fetchProjects();
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setIsBusy(false);
    }
  };

  const handleToggleFeatured = () =>
    update(
      { featured: !project.featured },
      project.featured ? "Removed from featured" : "Marked as featured"
    );

  const handleToggleStatus = () =>
    update(
      { status: isPublished ? "draft" : "published" },
      isPublished ? "Project moved to drafts" : "Project published"
    );

  const handleDelete = async () => {
    setIsBusy(true);
    try {
      await projectService.deleteProject(project._id);
      toast.success("Project deleted");
      navigate(basePath, { replace: true });
    } catch (err) {
      toast.error(err.message || "Failed to delete project");
      setIsBusy(false);
      setIsDeleteOpen(false);
    }
  };

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Could not copy");
    }
  };

  if (isLoading) return <DetailsSkeleton />;

  if (error || !project) {
    return (
      <GlassCard className="max-w-md mx-auto text-center py-14 mt-8">
        <FiAlertCircle className="mx-auto text-red-400 mb-4" size={40} />
        <h1 className="text-xl font-semibold text-dark-50 mb-2">Project not found</h1>
        <p className="text-sm text-dark-400 mb-6">
          {error || "It may have been deleted or the link is incorrect."}
        </p>
        <Link
          to={basePath}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <FiArrowLeft size={15} />
          Back to projects
        </Link>
      </GlassCard>
    );
  }

  const btnBase =
    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const btnGhost = `${btnBase} border border-dark-700 text-dark-200 hover:bg-dark-800/60`;

  return (
    <>
      <Helmet>
        <title>{project.title} | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <Link
          to={basePath}
          className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-primary-400 transition-colors mb-6"
        >
          <FiArrowLeft size={15} />
          Back to projects
        </Link>

        {/* Hero */}
        <GlassCard padding="p-0" className="overflow-hidden">
          <div className="relative h-56 sm:h-72 bg-dark-800">
            {project.image?.url && !imageBroken ? (
              <img
                src={project.image.url}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={() => setImageBroken(true)}
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-primary-500/20 via-accent-500/10 to-dark-800 flex items-center justify-center">
                <FiCode size={56} className="text-dark-500" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-dark-950/70 backdrop-blur-md">
                <StatusBadge status={project.status} size="md" />
              </span>
              {project.featured && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/90 text-black text-xs font-semibold px-3 py-1.5">
                  <FiStar size={12} className="fill-current" />
                  Featured
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-dark-50 break-words">
                  {project.title}
                </h1>
                <p className="mt-1 text-sm font-mono text-dark-500 break-all">
                  /projects/{project.slug}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(true)}
                  className={`${btnBase} bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20`}
                >
                  <FiEdit2 size={15} />
                  Edit
                </button>
                <button type="button" onClick={handleToggleStatus} disabled={isBusy} className={btnGhost}>
                  {isPublished ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  {isPublished ? "Unpublish" : "Publish"}
                </button>
                <button type="button" onClick={handleToggleFeatured} disabled={isBusy} className={btnGhost}>
                  <FiStar size={15} className={project.featured ? "fill-yellow-400 text-yellow-400" : ""} />
                  {project.featured ? "Unfeature" : "Feature"}
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsDeleteOpen(true)}
                    disabled={isBusy}
                    className={`${btnBase} border border-error-500/30 text-error-500 hover:bg-error-500/10`}
                  >
                    <FiTrash2 size={15} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <SectionCard title="Description" icon={FiFolder}>
              {project.description ? (
                <p className="text-dark-300 leading-relaxed whitespace-pre-wrap break-words">
                  {project.description}
                </p>
              ) : (
                <p className="text-sm text-dark-500 italic">No description added yet.</p>
              )}
            </SectionCard>

            <SectionCard title={`Tech stack${project.tech?.length ? ` (${project.tech.length})` : ""}`} icon={FiLayers}>
              {project.tech?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <TechBadge key={tech} name={tech} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-dark-500 italic">No technologies listed.</p>
              )}
            </SectionCard>

            <SectionCard title="Links" icon={FiLink}>
              {project.liveUrl || project.githubUrl ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-3 rounded-xl border border-dark-700 hover:border-primary-500/50 hover:bg-primary-500/5 transition-colors min-w-0"
                    >
                      <span className="flex w-9 h-9 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-primary-400">
                        <FiExternalLink size={16} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs text-dark-500">Live demo</span>
                        <span className="block text-sm text-dark-100 truncate">{stripProtocol(project.liveUrl)}</span>
                      </span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-3 rounded-xl border border-dark-700 hover:border-primary-500/50 hover:bg-primary-500/5 transition-colors min-w-0"
                    >
                      <span className="flex w-9 h-9 shrink-0 items-center justify-center rounded-lg bg-accent-500/10 text-accent-400">
                        <FiGithub size={16} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs text-dark-500">Source code</span>
                        <span className="block text-sm text-dark-100 truncate">{stripProtocol(project.githubUrl)}</span>
                      </span>
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-sm text-dark-500 italic">No links added.</p>
              )}
            </SectionCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <GlassCard>
              <h2 className="text-base font-semibold text-dark-50 mb-2">Student</h2>
              <InfoRow icon={FiUser} label="Name">
                {project.studentName || "—"}
              </InfoRow>
              <InfoRow icon={FiHash} label="Roll number">
                <span className="font-mono">{project.rollNumber || "—"}</span>
              </InfoRow>
              <InfoRow icon={FiMail} label="Email">
                {project.studentEmail ? (
                  <a
                    href={`mailto:${project.studentEmail}`}
                    className="text-primary-400 hover:underline break-all"
                  >
                    {project.studentEmail}
                  </a>
                ) : (
                  "—"
                )}
              </InfoRow>
            </GlassCard>

            <GlassCard>
              <h2 className="text-base font-semibold text-dark-50 mb-2">Project info</h2>
              <InfoRow icon={FiEye} label="Status">
                <StatusBadge status={project.status} />
              </InfoRow>
              <InfoRow icon={FiStar} label="Featured">
                {project.featured ? "Yes" : "No"}
              </InfoRow>
              <InfoRow icon={FiLayers} label="Display order">
                <span className="font-mono">{project.order ?? 0}</span>
              </InfoRow>
              <InfoRow icon={FiCalendar} label="Created">
                {formatDateTime(project.createdAt)}
              </InfoRow>
              <InfoRow icon={FiClock} label="Updated">
                {formatDateTime(project.updatedAt)}
              </InfoRow>
              <InfoRow icon={FiHash} label="ID">
                <button
                  type="button"
                  onClick={() => copy(project._id, "ID")}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-dark-300 hover:text-primary-400 transition-colors"
                  title="Copy ID"
                >
                  {project._id.slice(-8)}
                  <FiCopy size={12} />
                </button>
              </InfoRow>
            </GlassCard>

            <GlassCard>
              <h2 className="text-base font-semibold text-dark-50 mb-3">Public page</h2>
              {isPublished ? (
                <>
                  <p className="text-xs font-mono text-dark-400 break-all mb-4">
                    {window.location.origin}
                    {publicPath}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to={publicPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${btnBase} flex-1 justify-center bg-primary-500/10 text-primary-400 hover:bg-primary-500/20`}
                    >
                      <FiExternalLink size={15} />
                      Open
                    </Link>
                    <button
                      type="button"
                      onClick={() => copy(`${window.location.origin}${publicPath}`, "Link")}
                      className={btnGhost}
                      aria-label="Copy public link"
                    >
                      <FiCopy size={15} />
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-dark-400">
                  This project is a draft and isn’t visible to visitors. Publish it to make the
                  public page available.
                </p>
              )}
            </GlassCard>

            {(prevProject || nextProject) && (
              <div className="grid grid-cols-2 gap-3">
                {prevProject ? (
                  <Link
                    to={`${basePath}/${prevProject._id}`}
                    className="group p-3 rounded-xl border border-dark-800 hover:border-primary-500/40 transition-colors min-w-0"
                  >
                    <span className="flex items-center gap-1 text-xs text-dark-500">
                      <FiArrowLeft size={12} /> Previous
                    </span>
                    <span className="block mt-1 text-sm text-dark-200 group-hover:text-primary-400 truncate">
                      {prevProject.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {nextProject ? (
                  <Link
                    to={`${basePath}/${nextProject._id}`}
                    className="group p-3 rounded-xl border border-dark-800 hover:border-primary-500/40 transition-colors min-w-0 text-right"
                  >
                    <span className="flex items-center justify-end gap-1 text-xs text-dark-500">
                      Next <FiArrowRight size={12} />
                    </span>
                    <span className="block mt-1 text-sm text-dark-200 group-hover:text-primary-400 truncate">
                      {nextProject.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingProject={project}
        onSuccess={fetchProjects}
      />

      {isAdmin && (
        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Delete Project"
          message={`Are you sure you want to delete '${project.title}'? This action cannot be undone.`}
          confirmText="Delete"
          confirmColor="red"
          isLoading={isBusy}
        />
      )}
    </>
  );
};

export default AdminProjectDetailsPage;
