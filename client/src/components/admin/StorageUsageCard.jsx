import { useEffect, useState } from "react";
import { FiHardDrive } from "react-icons/fi";

import GlassCard from "../ui/GlassCard";
import * as mediaService from "../../services/mediaService";

const formatBytes = (bytes) => {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

const StorageUsageCard = () => {
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    mediaService
      .getMediaUsage()
      .then((res) => {
        if (!cancelled) setUsage(res.data?.data || null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!usage) return null;

  const percent = Math.min(100, usage.usedPercent || 0);
  const barColor =
    percent >= 90 ? "bg-error-500" : percent >= 70 ? "bg-warning-500" : "bg-primary-500";

  return (
    <GlassCard className="mb-8">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
          <FiHardDrive className="w-5 h-5 text-primary-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-semibold text-dark-50">Image storage</h2>
            <span className="text-xs text-dark-400 whitespace-nowrap">
              {formatBytes(usage.totalBytes)} of {formatBytes(usage.limitBytes)} limit
            </span>
          </div>
          <div
            className="mt-2 h-2 rounded-full bg-dark-800 overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(percent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Image storage used"
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${Math.max(percent, usage.count ? 1 : 0)}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-dark-500">
            {usage.count} image{usage.count === 1 ? "" : "s"} stored
            {percent >= 90 && ". Almost full, delete unused images to free space"}
          </p>
        </div>
      </div>
    </GlassCard>
  );
};

export default StorageUsageCard;
