import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import aucklandLogo from "../assets/logo.svg";
import AccountActions from './AccountActions';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Get Started", path: "/get-started" },
    { name: "Licensing Guide", path: "/licensing-guide" },
    ...(isAuthenticated ? [{ name: 'Requirements', path: '/requirements' }] : []),

    { name: "Learning Centre", path: "/learning-centre" },

    { name: "Resources", path: "/resources" },
    { name: "Help", path: "/help" },
  ];

  const isActive = (path) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1500px] flex-nowrap items-center px-4 py-3 lg:px-8">

        {/* LOGO */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex items-center gap-2">
            <div className="flex flex-col text-right leading-[0.9]">
              <span className="text-xs font-bold text-gray-900 sm:text-sm">
                Auckland
              </span>

              <span className="text-xs font-bold text-gray-900 sm:text-sm">
                Council
              </span>
            </div>

            <img
              src={aucklandLogo}
              alt="Auckland Council"
              className="h-11 w-11 object-contain"
            />
          </div>

          <div className="mx-2 hidden h-10 w-px bg-gray-300 sm:block" />

          <div className="hidden flex-col sm:flex">
            <span className="whitespace-nowrap text-lg font-bold text-gray-900">
              Hospo Hub
            </span>

            <span className="text-[11px] text-gray-500">
              Food | Alcohol | Outdoor Dining
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav aria-label="Main navigation" className={`ml-6 hidden min-w-0 flex-1 flex-nowrap items-center gap-4 ${isAuthenticated ? '2xl:flex' : 'xl:flex'}`}>
          {menuLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative whitespace-nowrap py-4 text-sm font-semibold transition-colors ${
                isActive(item.path)
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              {item.name}

              {isActive(item.path) && (
                <span className="absolute bottom-0 left-0 h-[3px] w-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        <div className={`ml-auto hidden shrink-0 ${isAuthenticated ? '2xl:block' : 'xl:block'}`}>
          <AccountActions onNavigate={() => setOpen(false)} />
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className={`ml-auto p-2 text-xl text-primary ${isAuthenticated ? '2xl:hidden' : 'xl:hidden'}`}
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div id="mobile-navigation" className={`max-h-[calc(100dvh-80px)] overflow-y-auto border-t bg-white px-4 py-4 shadow-lg ${isAuthenticated ? '2xl:hidden' : 'xl:hidden'}`}>
          <nav className="flex flex-col gap-1">
            {menuLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`rounded-md px-4 py-3 text-sm font-semibold ${
                  isActive(item.path)
                    ? "bg-blue-50 text-primary"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="mt-4"><AccountActions mobile onNavigate={() => setOpen(false)} /></div>
        </div>
      )}
    </header>
  );
}
