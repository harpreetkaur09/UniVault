import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import GradientText from "../ui/GradientText";
import ThemeToggle from "../ui/ThemeToggle";
import useScrollSpy from "../../hooks/useScrollSpy";
import { NAV_LINKS } from "../../utils/constants";

const sectionIds = NAV_LINKS.map((link) => link.href.replace("#", ""));

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeId = useScrollSpy(sectionIds);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const goToSection = useCallback(
    (e, href) => {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      if (isHome) {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(`/${href}`);
      }
    },
    [isHome, navigate]
  );

  const isScrolled = scrollY > 20 || !isHome;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 flex items-center transition-all duration-300 ${
        isScrolled ? "glass border-b border-dark-800/80" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-bold"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <GradientText>UniVault</GradientText>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              isHome && activeId === link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={isHome ? link.href : `/${link.href}`}
                onClick={(e) => goToSection(e, link.href)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary-400"
                    : "text-dark-400 hover:text-dark-100"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-primary-400 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        <div className="relative z-50 flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            className="lg:hidden relative z-50 w-10 h-10 flex items-center justify-center text-dark-300 hover:text-dark-100 transition-colors"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiX className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiMenu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-dark-950/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="flex flex-col items-center gap-6"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05 } },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {NAV_LINKS.map((link) => {
                const isActive =
                  isHome && activeId === link.href.replace("#", "");
                return (
                  <motion.a
                    key={link.href}
                    href={isHome ? link.href : `/${link.href}`}
                    onClick={(e) => goToSection(e, link.href)}
                    className={`text-2xl font-medium transition-colors ${
                      isActive
                        ? "text-primary-400"
                        : "text-dark-300 hover:text-dark-100"
                    }`}
                    variants={{
                      hidden: { opacity: 0, x: 50 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {link.label}
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
