import { AnimatePresence, motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`relative w-10 h-10 shrink-0 flex items-center justify-center rounded-lg text-dark-300 hover:text-primary-400 hover:bg-dark-800/50 transition-colors ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex"
        >
          {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
