import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ScrollProgressBar from "../ui/ScrollProgressBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "../ui/ScrollToTop";

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash;
      const t = setTimeout(() => {
        document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgressBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default MainLayout;
