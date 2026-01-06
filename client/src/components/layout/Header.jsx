// src/components/layout/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useCartStore } from "../../stores/cartStore";
import { useThemeStore } from "../../stores/themeStore";
import { useEffect, useState } from "react";
import { CiDark } from "react-icons/ci";
import { MdOutlineLightMode } from "react-icons/md";

function Header() {
  const { user, logout } = useAuthStore();
  const { cartCount } = useCartStore();
  const { theme, toggleTheme } = useThemeStore();

  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // Apply theme to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/?keyword=${encodeURIComponent(searchText)}`);
    }
  };

  return (
    <>
      {/* 🔹 Topbar */}
      <div className="bg-light border-bottom small py-1 px-3 d-flex justify-content-between align-items-center">
        <span>📧 jotishk649@gmail.com | 📞 +91 7827710029</span>
        <span><Link to="/help" className="text-decoration-none text-muted"> Help </Link></span>
      </div>

      {/* 🔹 Main Navbar */}
      <nav
        className={`navbar navbar-expand-lg shadow-sm py-3 ${theme === "dark" ? "navbar-dark bg-dark" : "navbar-light bg-white"} px-3`}
      >
        <div className="container-fluid">
          {/* Brand */}
          <Link className="navbar-brand fw-bold text-primary fs-4" to="/">ShopEase</Link>

          {/* Toggler for mobile */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {/* 🔹 Right Side (Search + Cart + Theme + Auth) */}
            <div className="d-flex align-items-center ms-auto">
              {/* Search bar */}
              <form className="d-flex me-3" style={{ maxWidth: "300px" }} onSubmit={handleSearch}>
                <input
                  className="form-control rounded-start-pill" type="search" placeholder="Search products..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                <button className="btn btn-primary rounded-end-pill" type="submit">🔍</button>
              </form>

              {/* Cart */}
              <Link className="nav-link position-relative me-3" to="/cart">
                🛒
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {/* {cartItems?.length || 0} */}
                  {cartCount()}
                </span>
              </Link>

              {/* Theme Toggle */}
              <button className="btn btn-outline-secondary btn-sm me-3" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <CiDark size={28} />
                ) : (
                  <MdOutlineLightMode size={28} />
                )}
              </button>

              {/* Auth Buttons */}
              {!user ? (
                <>
                  <Link className="btn btn-outline-primary me-2" to="/login">
                    Login
                  </Link>
                  <Link className="btn btn-primary" to="/register">
                    Register
                  </Link>
                </>
              ) : (
                <li className="nav-item dropdown list-unstyled">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" >
                    <img
                      src={user?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                      alt="avatar" width="30" height="30" className="rounded-circle" />
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {user.role === "user" && (
                      <li>
                        <Link className="dropdown-item" to="/user/dashboard/">User Dashboard</Link>
                      </li>
                    )}
                    {user?.role === "admin" && (
                      <li>
                        <Link className="dropdown-item" to="/admin/dashboard">Admin Panel</Link>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={logout}>Logout</button>
                    </li>
                  </ul>
                </li>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
