import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiPlus, FiAlertCircle, FiRefreshCw, FiHome, FiChevronRight } from "react-icons/fi";

import GlassCard from "../components/ui/GlassCard";
import Skeleton from "../components/ui/Skeleton";
import StatusBadge from "../components/ui/StatusBadge";
import AdminStats from "../components/admin/AdminStats";
import AdminPageHeader from "../components/admin/AdminPageHeader";
import StorageUsageCard from "../components/admin/StorageUsageCard";
import { useAuth } from "../contexts/AuthContext";
import * as projectService from "../services/projectService";
import * as skillService from "../services/skillService";
import * as messageService from "../services/messageService";

const formatRelativeDate = (dateString) => {
  const now = Date.now();
  const diff = now - new Date(dateString).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(dateString).toLocaleDateString();
};

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [projectsRes, skillsRes, messagesRes] = await Promise.all([
        projectService.getAdminProjects(),
        skillService.getSkills(),
        messageService.getMessages(),
      ]);
      setProjects(projectsRes.data?.data || []);
      setSkills(skillsRes.data?.data || []);
      setMessages(messagesRes.data?.data || []);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const recentProjects = useMemo(
    () =>
      [...projects]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5),
    [projects]
  );

  return (
    <>
      <Helmet>
        <title>Dashboard | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminPageHeader
        icon={FiHome}
        title="Dashboard"
        description={`Welcome back${user?.email ? `, ${user.email}` : ""}`}
        actions={
          !error && (
            <>
              <Link
                to="/admin/skills?action=new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dark-700 text-dark-200 font-medium text-sm hover:bg-dark-800/60 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                New Skill
              </Link>
              <Link
                to="/admin/projects?action=new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
              >
                <FiPlus className="w-4 h-4" />
                New Project
              </Link>
            </>
          )
        }
      />

      {/* Error State */}
      {!isLoading && error && (
        <GlassCard className="text-center py-12 mb-8">
          <FiAlertCircle className="mx-auto text-red-400 mb-4" size={40} />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            <FiRefreshCw size={14} />
            Retry
          </button>
        </GlassCard>
      )}

      {/* Stats Cards */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!isLoading && !error && (
        <div>
          <AdminStats projects={projects} skills={skills} messages={messages} />
        </div>
      )}

      {!isLoading && !error && <StorageUsageCard />}

      {/* Recent Projects */}
      {isLoading && (
        <GlassCard>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </GlassCard>
      )}

      {!isLoading && !error && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-50">
              Recent Projects
            </h2>
            <Link
              to="/admin/projects"
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              View All →
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-400 mb-4">No projects yet</p>
              <Link
                to="/admin/projects?action=new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Create First Project
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-dark-800/50">
              {recentProjects.map((project) => (
                <Link
                  key={project._id}
                  to={`/admin/projects/${project._id}`}
                  className="group flex items-center gap-4 py-3 px-2 -mx-2 rounded-lg hover:bg-dark-800/40 transition-colors"
                >
                  {project.image?.url ? (
                    <img
                      src={project.image.url}
                      alt={project.title}
                      className="w-8 h-8 rounded object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-dark-700 shrink-0" />
                  )}

                  <span className="text-sm font-medium text-dark-100 group-hover:text-primary-400 transition-colors truncate flex-1">
                    {project.title}
                  </span>

                  <StatusBadge status={project.status} />

                  <span className="hidden sm:inline text-xs text-dark-500 whitespace-nowrap">
                    {formatRelativeDate(project.updatedAt)}
                  </span>
                  <FiChevronRight className="w-4 h-4 text-dark-600 group-hover:text-primary-400 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </GlassCard>
      )}
    </>
  );
};

export default AdminDashboardPage;
