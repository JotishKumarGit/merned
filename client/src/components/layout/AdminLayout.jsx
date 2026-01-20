// src/components/layout/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import AdminSidebar from "../admin/AdminSidebar";
import AdminTopbar from "../admin/AdminTopbar";
import { useThemeStore } from "../../stores/themeStore";
import AOS from "aos";
import "aos/dist/aos.css";


function AdminLayout({ children }) {
  const { theme } = useThemeStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const marginLeft = !isMobile ? "240px" : "0";

  return (
    <div className={`min-vh-100 text-start ${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"}`}>
      {/* Optional: Backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50" style={{ zIndex: 998 }} onClick={() => setSidebarOpen(false)} />
      )}
      <AdminSidebar isOpen={!isMobile || sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="d-flex flex-column" style={{ marginLeft }}>
        <AdminTopbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-grow-1 p-3 mt-5" data-aos="fade-up">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
