import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiBookOpen, FiPlus, FiFolder, FiAlertCircle, FiRefreshCw, FiChevronRight } from "react-icons/fi";

import GlassCard from "../components/ui/GlassCard";
import Skeleton from "../components/ui/Skeleton";
import StatusBadge from "../components/ui/StatusBadge";
import AdminPageHeader from "../components/admin/AdminPageHeader";
import * as projectService from "../services/projectService";

const Stat = ({ label, value }) => (
  <GlassCard>
    <p className="text-sm text-dark-400">{label}</p>
    <p className="mt-1 text-3xl font-bold text-dark-50">{value}</p>
  </GlassCard>
);

const TeacherDashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await projectService.getAdminProjects();
      setProjects(res.data?.data || []);
    } catch (err) {
      setError(err.message || "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(() => {
    const published = projects.filter((p) => p.status === "published").length;
    return { total: projects.length, published, drafts: projects.length - published };
  }, [projects]);

  const recent = useMemo(
    () =>
      [...projects]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5),
    [projects]
  );

  return (
    <>
      <Helmet>
        <title>Dashboard | Teacher</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminPageHeader
        icon={FiBookOpen}
        title="Teacher Dashboard"
        description="Add, view and edit projects."
        actions={
          <Link
            to="/teacher/projects?action=new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
          >
            <FiPlus className="w-4 h-4" />
            Add New Project
          </Link>
        }
      />

      {error ? (
        <GlassCard className="text-center py-12">
          <FiAlertCircle className="mx-auto text-red-400 mb-3" size={36} />
          <p className="text-dark-300 mb-4">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            <FiRefreshCw size={15} />
            Retry
          </button>
        </GlassCard>
      ) : isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Stat label="Total projects" value={stats.total} />
            <Stat label="Published" value={stats.published} />
            <Stat label="Drafts" value={stats.drafts} />
          </div>

          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-base font-semibold text-dark-50">
                <FiFolder size={17} className="text-primary-400" />
                Recently updated
              </h2>
              <Link
                to="/teacher/projects"
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                View all
              </Link>
            </div>

            {recent.length === 0 ? (
              <p className="text-sm text-dark-500 italic">No projects yet.</p>
            ) : (
              <ul className="divide-y divide-dark-800/60">
                {recent.map((project) => (
                  <li key={project._id}>
                    <Link
                      to={`/teacher/projects/${project._id}`}
                      className="flex items-center justify-between gap-3 py-3 group"
                    >
                      <span className="min-w-0 truncate text-dark-100 group-hover:text-primary-400 transition-colors">
                        {project.title}
                      </span>
                      <span className="flex items-center gap-3 shrink-0">
                        <StatusBadge status={project.status} />
                        <FiChevronRight size={15} className="text-dark-600" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </div>
      )}
    </>
  );
};

export default TeacherDashboardPage;
