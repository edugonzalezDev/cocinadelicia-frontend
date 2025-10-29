// src/components/shared/Header.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useUiStore } from "@/store/useUiStore";
import { useAuth } from "@/context/auth";

const linkBase =
  "px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-200/30 hover:text-primary-800 transition-colors";
const linkActive = "bg-primary-200/50 text-primary-900";

export default function Header() {
  const { menuOpen, toggleMenu, closeMenu } = useUiStore();
  const navigate = useNavigate();
  const { isAuthenticated, user, roles, login, logout } = useAuth();

  const navLinkClass = ({ isActive }) => `${linkBase} ${isActive ? linkActive : "text-color-text"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
            aria-label="Cocina DeLicia - Home"
          >
            <div className="bg-color-primary-500 grid h-8 w-8 place-items-center rounded-xl font-bold text-white">
              CD
            </div>
            <span className="font-title font-semibold tracking-wide">Cocina DeLicia</span>
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
            Inicio
          </NavLink>
          <NavLink to="/chef" className={navLinkClass} onClick={closeMenu}>
            Chef
          </NavLink>
          <NavLink to="/admin" className={navLinkClass} onClick={closeMenu}>
            Admin
          </NavLink>
          {!isAuthenticated ? (
            <button
              onClick={login}
              className="bg-color-primary-500 hover:bg-color-primary-600 ml-2 rounded-md px-4 py-2 text-sm font-semibold text-white"
            >
              Ingresar
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-gray-600 lg:inline">
                {user?.name || user?.email} {roles?.length ? `· ${roles.join(",")}` : ""}
              </span>
              <button
                onClick={logout}
                className="ml-1 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Salir
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 md:hidden"
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Panel */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
              Inicio
            </NavLink>
            <NavLink to="/chef" className={navLinkClass} onClick={closeMenu}>
              Chef
            </NavLink>
            <NavLink to="/admin" className={navLinkClass} onClick={closeMenu}>
              Admin
            </NavLink>

            {!isAuthenticated ? (
              <button
                onClick={() => {
                  closeMenu();
                  login();
                }}
                className="bg-color-primary-500 hover:bg-color-primary-600 mt-2 rounded-md px-4 py-2 text-sm font-semibold text-white"
              >
                Ingresar
              </button>
            ) : (
              <button
                onClick={() => {
                  closeMenu();
                  logout();
                }}
                className="mt-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Salir
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
