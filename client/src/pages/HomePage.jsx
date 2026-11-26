import { Helmet } from "react-helmet-async";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Projects from "../components/sections/Projects";
import Skills from "../components/sections/Skills";
import Contact from "../components/sections/Contact";
import siteConfig from "../config/siteConfig";
import { useSettings } from "../contexts/SettingsContext";

const HomePage = () => {
  const { settings } = useSettings();

  const title = settings.name
    ? `${settings.name} | ${siteConfig.siteName}`
    : siteConfig.siteName;
  const description = settings.tagline || siteConfig.description;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </>
  );
};

export default HomePage;
