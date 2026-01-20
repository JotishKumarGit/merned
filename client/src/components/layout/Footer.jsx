import React from "react";
import { useThemeStore } from "../../stores/themeStore";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Footer() {
  const { theme } = useThemeStore();

  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className={`py-4 mt-auto ${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container text-center">
        {/* Navigation Links */}
        <div className="mb-3">
          <Link to="/" className={`mx-2 text-decoration-none ${theme === "dark" ? "text-light" : "text-dark"}`}> Home</Link>
          <Link to="/products" className={`mx-2 text-decoration-none ${theme === "dark" ? "text-light" : "text-dark"}`}>Products</Link>
          <Link to="/cart" className={`mx-2 text-decoration-none ${theme === "dark" ? "text-light" : "text-dark"}`}>Cart</Link>
          <Link to="/contact" className={`mx-2 text-decoration-none ${theme === "dark" ? "text-light" : "text-dark"}`}> Contact</Link>
        </div>

        {/* Footer Text */}
        <p className="mb-1">
          © {currentYear} My E-Commerce Website. All rights reserved.
        </p>
        <p className="mb-0">
          Built with ❤️ using MERN Stack With Jk
        </p>
      </div>
    </motion.footer>
  );
}

export default Footer;
