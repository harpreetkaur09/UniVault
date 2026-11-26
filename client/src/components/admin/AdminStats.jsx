import { Link } from "react-router-dom";
import { FiFolder, FiCheckCircle, FiEdit, FiCode, FiMail, FiArrowUpRight } from "react-icons/fi";

import GlassCard from "../ui/GlassCard";

const STATS_CONFIG = [
  {
    key: "totalProjects",
    label: "Total Projects",
    to: "/admin/projects",
    icon: FiFolder,
    iconColor: "text-primary-400",
    iconBg: "bg-primary-500/10",
  },
  {
    key: "published",
    label: "Published",
    to: "/admin/projects",
    icon: FiCheckCircle,
    iconColor: "text-success-500",
    iconBg: "bg-success-500/10",
  },
  {
    key: "drafts",
    label: "Drafts",
    to: "/admin/projects",
    icon: FiEdit,
    iconColor: "text-warning-500",
    iconBg: "bg-warning-500/10",
  },
  {
    key: "totalSkills",
    label: "Total Skills",
    to: "/admin/skills",
    icon: FiCode,
    iconColor: "text-accent-400",
    iconBg: "bg-accent-500/10",
  },
  {
    key: "unreadMessages",
    label: "Unread Messages",
    to: "/admin/messages",
    icon: FiMail,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-400/10",
  },
];

const AdminStats = ({ projects = [], skills = [], messages = [] }) => {
  const statsValues = {
    totalProjects: projects.length,
    published: projects.filter((p) => p.status === "published").length,
    drafts: projects.filter((p) => p.status === "draft").length,
    totalSkills: skills.length,
    unreadMessages: messages.filter((m) => !m.isRead).length,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {STATS_CONFIG.map(({ key, label, to, icon: Icon, iconColor, iconBg }) => (
        <Link key={key} to={to} className="group block">
          <GlassCard
            padding="p-5"
            hover
            className="h-full relative"
          >
            <FiArrowUpRight
              className="absolute top-4 right-4 w-4 h-4 text-dark-600 opacity-0 group-hover:opacity-100 group-hover:text-primary-400 transition-opacity"
              aria-hidden="true"
            />
            <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <p className="text-3xl font-bold text-dark-50 tabular-nums">{statsValues[key]}</p>
            <p className="text-sm text-dark-400 mt-1">{label}</p>
          </GlassCard>
        </Link>
      ))}
    </div>
  );
};

export default AdminStats;
