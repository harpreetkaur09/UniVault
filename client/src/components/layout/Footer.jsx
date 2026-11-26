import { Link } from "react-router-dom";
import { useSettings } from "../../contexts/SettingsContext";
import { NAV_LINKS } from "../../utils/constants";
import siteConfig from "../../config/siteConfig";

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="relative bg-dark-900/70 border-t border-dark-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
          <div>
            <p className="font-semibold text-dark-100 mb-1">{siteConfig.siteName}</p>
            <p className="text-dark-500 text-sm">
              College site to keep student details and project work together.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-dark-500 mb-3">
              Pages
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={`/${link.href}`}
                  className="text-sm text-dark-400 hover:text-primary-400"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-dark-500 text-sm">
              &copy; {new Date().getFullYear()} {settings.name || siteConfig.siteName}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
