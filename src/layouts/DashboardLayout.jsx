import { useLayoutEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaBars, FaBell, FaTimes } from "react-icons/fa";
import { hubLinks } from "../data/hubNavigation";
import { useHub } from "../hooks/useHub";
import UserMenu from "../components/UserMenu";
import logo from "../assets/logo.svg";
export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { data, error } = useHub();
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  const unread = data.messages.filter((item) => !item.read).length;
  return (
    <div className="min-h-screen bg-[#f3f8fc] text-[#173346]">
      <header className="sticky top-0 z-40 flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-[#dce7ef] bg-white px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-right text-xs font-bold leading-tight">
            Auckland
            <br />
            Council
          </span>
          <img src={logo} alt="" className="h-10 w-10" />
          <span className="ml-1 border-l pl-3">
            <strong className="block text-base">Hospo Hub</strong>
            <span className="hidden text-[10px] text-slate-500 sm:block">
              Food | Alcohol | Outdoor Dining
            </span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2 sm:gap-5">
          <Link
            to="/messages"
            aria-label={`Messages, ${unread} unread`}
            className="relative rounded-lg p-3 text-[#66869a] hover:bg-blue-50"
          >
            <FaBell />
            {unread > 0 && (
              <span className="absolute right-0 top-0 rounded-full bg-primary px-1.5 text-[10px] text-white">
                {unread}
              </span>
            )}
          </Link>
          <UserMenu />
          <button
            aria-label="My Hub navigation"
            aria-expanded={open}
            aria-controls="hub-sidebar"
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-xl md:hidden"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1600px] flex-col md:flex-row">
        <aside
          id="hub-sidebar"
          className={`${open ? "block" : "hidden"} border-b border-[#dce7ef] bg-white p-4 md:sticky md:top-20 md:block md:h-[calc(100dvh-5rem)] md:w-56 md:shrink-0 md:overflow-y-auto md:border-b-0 md:border-r`}
        >
          <nav aria-label="My Hub" className="grid gap-1">
            {hubLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/dashboard"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold ${isActive || (to === "/documents" && pathname === "/document-upload") ? "bg-primary text-white" : "text-[#526d80] hover:bg-blue-50"}`
                }
              >
                <Icon className="shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main
          key={pathname}
          className="page-transition min-w-0 flex-1 p-4 sm:p-6 lg:p-8"
        >
          <p className="mb-5 rounded-lg border border-blue-100 bg-white/80 px-4 py-2 text-xs leading-5 text-slate-600">
            Prototype workspace • Saved in this browser. Submissions and
            payments are simulations; nothing is sent to council.
            {data.demo && " Sample records are loaded."}
          </p>
          {error && (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
