// src/components/Navbar.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  Leaf,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  ShoppingCart,
  ChevronDown,
  BadgeCheck,
  BarChart3,
  Package,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import { getMe } from "../api/authapi";
import CompleteProfile from "../components/Profile/CompleteProfile";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, setUser } = useContext(AuthContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [openProfilePopup, setOpenProfilePopup] = useState(false);

  const closeTimer = useRef(null);

  /* ---------------------- AUTO FETCH USER ---------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const res = await getMe();
        if (res?.user) {
          setUser(res.user);
          localStorage.setItem("user", JSON.stringify(res.user));
        }
      } catch (err) {
        console.log("Navbar getMe error:", err);
      }
    })();
  }, []);

  /* ---------------------- NAV ITEMS ---------------------- */
/* ---------------------- NAV ITEMS ---------------------- */
const GUEST = [
  { name: "Home", href: "/", icon: <Leaf size={16} /> },
  { name: "Products", href: "/products", icon: <Package size={16} /> },
  { name: "About", href: "/about", icon: <BadgeCheck size={16} /> },
];

const USER = [
  { name: "Home", href: "/", icon: <Leaf size={16} /> },
  { name: "Products", href: "/products", icon: <Package size={16} /> },
  { name: "Orders", href: "/orders", icon: <Package size={16} /> },
  { name: "Subscription", href: "/subscription", icon: <BadgeCheck size={16} /> },
  { name: "ML Tools", href: "/ml-tools", icon: <BarChart3 size={16} /> },
  { name: "About", href: "/about", icon: <BadgeCheck size={16} /> },
  { name: "Dashboard", href: "/dashboard/user", icon: <User size={16} /> },
];

const ADMIN = [
  { name: "Admin Dashboard", href: "/dashboard/admin" },
  { name: "Users", href: "products", icon: <Package size={16} /> },
  // { name: "Analytics", href: "/admin/analytics" },
  { name: "About", href: "/about",icon: <BadgeCheck size={16} /> },
];


  const NAV = !user ? GUEST : user.role === "admin" ? ADMIN : USER;

  /* ---------------------- ACTIVE CHECK ---------------------- */
  const isActive = (path) => location.pathname === path;

  const activeDot = (
    <span className="absolute left-[-7px] top-1/2 -translate-y-1/2 h-2 w-2 bg-emerald-600 rounded-full"></span>
  );

  /* ---------------------- LOGOUT ---------------------- */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ---------------------- DROPDOWN CONTROL ---------------------- */
  const openAccountDropdown = () => {
    clearTimeout(closeTimer.current);
    setAccountOpen(true);
  };

  const closeAccountDropdown = () => {
    closeTimer.current = setTimeout(() => setAccountOpen(false), 400);
  };

  return (
    <>
      <nav className="w-full bg-white/90 backdrop-blur-md shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-1 text-2xl font-bold cursor-pointer">
            <Leaf className="w-6 h-6 text-emerald-600" />
            <span className="text-gray-900">Plant</span>
            <span className="text-emerald-700">ify</span>
          </Link>

          {/* DESKTOP NAV */}
          <ul className="hidden lg:flex items-center gap-10 text-gray-700 font-medium">
            {NAV.map((item) => (
              <li key={item.name} className="relative pl-3">
                {isActive(item.href) && activeDot}

                <Link
                  to={item.href}
                  className={`flex items-center gap-2 transition ${
                    isActive(item.href)
                      ? "text-emerald-600 font-semibold"
                      : "hover:text-emerald-600"
                  }`}
                >
                  {item.icon} {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* DESKTOP ACCOUNT */}
          <div className="hidden lg:flex items-center gap-6">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700"
                >
                  <LogIn size={16} className="mr-2" /> Login
                </Link>

                <Link
                  to="/signup"
                  className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  <UserPlus size={16} className="mr-2" /> Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* CART ICON
                <ShoppingCart
                  className="w-6 h-6 cursor-pointer hover:text-emerald-600"
                  onClick={() => navigate("/cart")}
                /> */}

                {/* ACCOUNT DROPDOWN */}
                <div
                  className="relative"
                  onMouseEnter={openAccountDropdown}
                  onMouseLeave={closeAccountDropdown}
                >
                  <button className="flex items-center gap-2 hover:text-emerald-600">
                    <User size={18} /> {user?.name} <ChevronDown size={16} />
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-lg p-4 w-56 space-y-3 animate-fadeIn">
                      <button
                        onClick={() => setOpenProfilePopup(true)}
                        className="w-full text-left hover:text-emerald-600"
                      >
                        Profile Settings
                      </button>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-500 hover:text-red-600"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white shadow-xl p-6 space-y-6 animate-fadeIn">
            <ul className="space-y-4 text-lg">
              {NAV.map((item) => (
                <li key={item.name} className="relative pl-3">
                  {isActive(item.href) && activeDot}

                  <Link
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`${isActive(item.href) ? "text-emerald-600 font-semibold" : ""}`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* AUTH MOBILE */}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full px-4 py-3 bg-red-500 text-white rounded-lg"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-3 bg-gray-100 rounded-lg text-center">
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="block px-4 py-3 bg-emerald-600 text-white rounded-lg text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* POPUP OUTSIDE NAV */}
      {openProfilePopup && (
        <CompleteProfile open={openProfilePopup} onClose={() => setOpenProfilePopup(false)} />
      )}
    </>
  );
}
