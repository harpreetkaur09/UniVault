import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowDown, FiMail, FiChevronDown, FiMapPin, FiUser } from "react-icons/fi";
import GradientText from "../ui/GradientText";
import GlassCard from "../ui/GlassCard";
import Skeleton from "../ui/Skeleton";
import siteConfig from "../../config/siteConfig";
import { fadeInUp, staggerContainer } from "../../utils/animations";
import { useSettings } from "../../contexts/SettingsContext";

const Hero = () => {
  const { settings, isLoading } = useSettings();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id) => {
    const element = document.querySelector(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            {isLoading ? (
              <div className="space-y-4 mb-8">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-14 w-full max-w-md" />
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-5 w-full max-w-xl" />
              </div>
            ) : (
              <>
                {settings.greeting && (
                  <motion.p
                    className="text-primary-400 text-sm sm:text-base font-mono tracking-wider mb-4"
                    variants={fadeInUp}
                  >
                    {settings.greeting}
                  </motion.p>
                )}

                <motion.h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
                  variants={fadeInUp}
                >
                  <GradientText>{settings.name || siteConfig.siteName}</GradientText>
                </motion.h1>

                {settings.role && (
                  <motion.p
                    className="text-lg sm:text-xl text-dark-300 mb-5"
                    variants={fadeInUp}
                  >
                    {settings.role}
                  </motion.p>
                )}

                <motion.p
                  className="text-dark-400 max-w-xl text-base sm:text-lg leading-relaxed mb-8"
                  variants={fadeInUp}
                >
                  {settings.tagline || siteConfig.description}
                </motion.p>
              </>
            )}

            <motion.div className="flex flex-wrap gap-3" variants={fadeInUp}>
              <button
                type="button"
                onClick={() => handleScrollTo("#projects")}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-medium"
              >
                <FiArrowDown />
                View projects
              </button>
              <button
                type="button"
                onClick={() => handleScrollTo("#contact")}
                className="flex items-center gap-2 border border-dark-600 hover:border-primary-500 text-dark-200 px-6 py-3 rounded-xl font-medium"
              >
                <FiMail />
                Contact
              </button>
            </motion.div>
          </div>

          <motion.div className="lg:col-span-5" variants={fadeInUp}>
            <GlassCard padding="p-6 sm:p-8">
              <p className="text-xs uppercase tracking-wider text-primary-400 mb-4">
                University Info
              </p>
              <ul className="space-y-4 text-sm">
                {settings.name && (
                  <li className="flex items-start gap-3">
                    <FiUser className="text-primary-400 mt-0.5 shrink-0" />
                    <span className="text-dark-300">{settings.name}</span>
                  </li>
                )}
                {settings.location && (
                  <li className="flex items-start gap-3">
                    <FiMapPin className="text-primary-400 mt-0.5 shrink-0" />
                    <span className="text-dark-300">{settings.location}</span>
                  </li>
                )}
                {settings.email && (
                  <li className="flex items-start gap-3">
                    <FiMail className="text-primary-400 mt-0.5 shrink-0" />
                    <span className="text-dark-300 break-all">{settings.email}</span>
                  </li>
                )}
              </ul>
              <p className="text-dark-500 text-xs mt-6 pt-4 border-t border-dark-800">
                Information displayed for the university.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block"
        animate={{
          y: [0, 8, 0],
          opacity: showScrollIndicator ? 1 : 0,
        }}
        transition={{
          y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.3 },
        }}
      >
        <FiChevronDown className="text-dark-500 text-2xl" />
      </motion.div>
    </section>
  );
};

export default Hero;
