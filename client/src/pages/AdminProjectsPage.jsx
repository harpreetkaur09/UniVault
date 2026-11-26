import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { FiPlus, FiFolder } from "react-icons/fi";

import AdminPageHeader from "../components/admin/AdminPageHeader";
import ProjectTable from "../components/admin/ProjectTable";
import ProjectForm from "../components/admin/ProjectForm";
import { useAuth } from "../contexts/AuthContext";
import * as projectService from "../services/projectService";

const AdminProjectsPage = () => {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await projectService.getAdminProjects();
      setProjects(res.data?.data || []);
    } catch (error) {
      toast.error("Failed to load projects");
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setEditingProject(null);
      setIsFormOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleAddNew = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleToggleFeatured = async (project) => {
    try {
      await projectService.updateProject(project._id, {
        featured: !project.featured,
      });
      toast.success("Featured status updated");
      fetchProjects();
    } catch (error) {
      toast.error(error.message || "Failed to update featured status");
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await projectService.deleteProject(projectId);
      toast.success("Project deleted");
      fetchProjects();
    } catch (error) {
      toast.error(error.message || "Failed to delete project");
    }
  };

  return (
    <>
      <Helmet>
        <title>Projects | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminPageHeader
        icon={FiFolder}
        title="Manage Projects"
        description={`${projects.length} project${projects.length === 1 ? "" : "s"} · click a project to view its full details`}
        actions={
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
          >
            <FiPlus className="w-4 h-4" />
            Add New Project
          </button>
        }
      />

      <ProjectTable
        projects={projects}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canDelete={isAdmin}
        basePath={isAdmin ? "/admin/projects" : "/teacher/projects"}
        onToggleFeatured={handleToggleFeatured}
        onAddNew={handleAddNew}
      />

      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProject(null);
        }}
        editingProject={editingProject}
        onSuccess={fetchProjects}
      />
    </>
  );
};

export default AdminProjectsPage;
