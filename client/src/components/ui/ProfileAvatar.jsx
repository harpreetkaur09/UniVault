import { useState } from "react";
import { FiUser } from "react-icons/fi";
import { useSettings } from "../../contexts/SettingsContext";

const ProfileAvatar = ({ className = "" }) => {
  const { settings, initials, isLoading } = useSettings();
  const [hasError, setHasError] = useState(false);

  if (isLoading) {
    return <div className={`skeleton ${className}`} aria-hidden="true" />;
  }

  if (!settings.profileImageUrl || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-primary-600 select-none ${className}`}
        role="img"
        aria-label="Profile placeholder"
      >
        {initials ? (
          <span className="text-white font-bold text-7xl sm:text-8xl lg:text-9xl leading-none">
            {initials}
          </span>
        ) : (
          <FiUser className="text-white w-1/3 h-1/3" />
        )}
      </div>
    );
  }

  return (
    <img
      src={settings.profileImageUrl}
      alt={settings.name ? `${settings.name} profile` : "Profile"}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

export default ProfileAvatar;
