const AdminPageHeader = ({ title, description, icon: Icon, badge, actions }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
    <div className="flex items-center gap-4 min-w-0">
      {Icon && (
        <div className="hidden sm:flex w-12 h-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary-500/15 to-accent-500/15 text-primary-400 border border-primary-500/15">
          <Icon size={22} />
        </div>
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-dark-50 truncate">{title}</h1>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-dark-400 mt-1">{description}</p>
        )}
      </div>
    </div>
    {actions && (
      <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>
    )}
  </div>
);

export default AdminPageHeader;
