import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeading from "../ui/SectionHeading";
import GlassCard from "../ui/GlassCard";
import ProfileAvatar from "../ui/ProfileAvatar";
import { fadeInLeft, fadeInRight } from "../../utils/animations";
import { useSettings } from "../../contexts/SettingsContext";

const About = () => {
  const { settings } = useSettings();
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const isLeftInView = useInView(leftRef, { once: true, margin: "-80px" });
  const isRightInView = useInView(rightRef, { once: true, margin: "-80px" });

  return (
    <SectionWrapper id="about">
      <SectionHeading
        title="University Info"
        subtitle="Information displayed for the university."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <motion.div
          ref={leftRef}
          variants={fadeInLeft}
          initial="hidden"
          animate={isLeftInView ? "visible" : "hidden"}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative w-full max-w-sm">
            <div className="absolute top-3 left-3 w-full h-full rounded-2xl border border-primary-500/25" />
            <ProfileAvatar className="relative z-10 rounded-2xl aspect-square object-cover w-full border border-dark-700" />
          </div>
        </motion.div>

        <motion.div
          ref={rightRef}
          variants={fadeInRight}
          initial="hidden"
          animate={isRightInView ? "visible" : "hidden"}
          className="lg:col-span-7"
        >
          <GlassCard padding="p-6 sm:p-8">
            <p className="text-xs uppercase tracking-wider text-primary-400 mb-4">
              About
            </p>
            <div className="space-y-4 text-dark-300 leading-relaxed">
              {settings.bio.length > 0 ? (
                settings.bio.map((paragraph, index) => <p key={index}>{paragraph}</p>)
              ) : (
                <p className="text-dark-500">
                  Details will show here once they are added from the admin panel.
                </p>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default About;
