import { useState, useEffect, useCallback, useMemo } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShield,
  FiHome,
  FiFolder,
  FiCode,
  FiMessageSquare,
  FiSettings,
  FiExternalLink,
  FiLogOut,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiPlus,
  FiBell,
  FiChevronRight,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import ThemeToggle from "../ui/ThemeToggle";
import * as messageService from "../../services/messageService";

const NAV_GROUPS = [
  {
    label: "Overview",
    links: [{ to: "/admin", label: "Dashboard", icon: FiHome, end: true }],
  },
  {
    label: "Content",
    links: [
      { to: "/admin/projects", label: "Projects", icon: FiFolder },
      { to: "/admin/skills", label: "Skills", icon: FiCode },
      { to: "/admin/settings", label: "Details", icon: FiSettings },
    ],
  },
  {
    label: "Inbox",
    links: [{ to: "/admin/messages", label: "Messages", icon: FiMessageSquare }],
  },
];

const SEGMENT_LABELS = {
  projects: "Projects",
  skills: "Skills",
  messages: "Messages",
  settings: "Details",
};

const navLinkClasses = ({ isActive }) =>
  `group relative flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-primary-500/10 text-primary-400"
      : "text-dark-400 hover:text-dark-100 hover:bg-dark-800/60"
  }`;

const Brand = () => (
  <Link to="/admin" className="flex items-center gap-3 min-w-0">
    <span className="flex w-10 h-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25">
      <FiShield size={20} />
    </span>
    <span className="min-w-0 leading-tight">
      <span className="block text-base font-bold text-dark-50">UniVault</span>
      <span className="block text-[11px] font-medium uppercase tracking-widest text-dark-500">
        Admin Console
      </span>
    </span>
  </Link>
);

const SidebarContent = ({ onClose, unreadCount = 0 }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const initial = (user?.name || user?.email || "A").trim().charAt(0).toUpperCase();

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-dark-800 shrink-0">
        <Brand />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800/60 transition-colors"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-dark-500">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.links.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={navLinkClasses}
                  onClick={onClose}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary-500" />
                      )}
                      <Icon size={18} className="shrink-0" />
                      <span className="flex-1">{label}</span>
                      {label === "Messages" && unreadCount > 0 && (
                        <span className="bg-primary-500 text-white text-[11px] font-bold min-w-5 h-5 flex items-center justify-center rounded-full px-1.5">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-dark-800 space-y-1 shrink-0">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium text-dark-400 hover:text-dark-100 hover:bg-dark-800/60 transition-colors"
        >
          <FiExternalLink size={18} />
          <span>View site</span>
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium text-dark-400 hover:text-dark-100 hover:bg-dark-800/60 transition-colors w-full"
        >
          {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          <span>{isDark ? "Light theme" : "Dark theme"}</span>
        </button>

        <div className="mt-2 flex items-center gap-3 rounded-xl bg-dark-800/50 border border-dark-800 p-3">
          <span className="flex w-9 h-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-accent-500 text-white text-sm font-bold">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-dark-100 truncate">
              {user?.name || user?.email || "Admin"}
            </p>
            <p className="text-xs text-dark-500 capitalize">
              {user?.role || "admin"}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="p-2 rounded-lg text-dark-400 hover:text-error-500 hover:bg-dark-700/50 transition-colors"
            aria-label="Logout"
            title="Logout"
          >
            <FiLogOut size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Breadcrumbs = ({ pathname }) => {
  const crumbs = useMemo(() => {
    const parts = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);
    const list = [{ label: "Dashboard", to: "/admin" }];
    parts.forEach((part, i) => {
      const to = `/admin/${parts.slice(0, i + 1).join("/")}`;
      list.push({ label: SEGMENT_LABELS[part] || "Details", to });
    });
    return list;
  }, [pathname]);

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.to} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <FiChevronRight size={14} className="text-dark-600 shrink-0" />}
            {isLast ? (
              <span className="font-medium text-dark-100 truncate">{crumb.label}</span>
            ) : (
              <Link to={crumb.to} className="text-dark-400 hover:text-primary-400 transition-colors">
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await messageService.getMessages();
      const messages = res.data?.data || [];
      setUnreadCount(messages.filter((m) => !m.isRead).length);
    } catch {
      // the unread badge just won't show
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount, location.pathname]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsMobileOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <div className="min-h-screen bg-dark-950 relative">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 right-0 w-[520px] h-[520px] rounded-full bg-primary-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-accent-500/5 blur-3xl" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-dark-900 border-r border-dark-800 z-30">
        <SidebarContent unreadCount={unreadCount} />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeMobile}
            />
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-dark-900 border-r border-dark-800 z-50 lg:hidden"
            >
              <SidebarContent onClose={closeMobile} unreadCount={unreadCount} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="lg:ml-64 min-h-screen flex flex-col relative">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 flex items-center gap-3 px-4 sm:px-6 lg:px-8 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800/60 transition-colors"
            aria-label="Open menu"
          >
            <FiMenu size={22} />
          </button>
          <div className="lg:hidden">
            <Brand />
          </div>

          <Breadcrumbs pathname={location.pathname} />

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              to="/admin/messages"
              className="relative w-10 h-10 flex items-center justify-center rounded-lg text-dark-300 hover:text-primary-400 hover:bg-dark-800/50 transition-colors"
              aria-label={`Messages${unreadCount ? `, ${unreadCount} unread` : ""}`}
              title="Messages"
            >
              <FiBell size={19} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500 ring-2 ring-dark-950" />
              )}
            </Link>
            <ThemeToggle />
            <Link
              to="/admin/projects?action=new"
              className="hidden sm:inline-flex items-center gap-2 ml-1 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
            >
              <FiPlus size={16} />
              New Project
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1">
          <div className="p-5 sm:p-6 lg:p-8 max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
