import { useLayoutEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  Outlet,
} from "react-router-dom";
import {
  FaBars,
  FaSearch,
  FaBell,
  FaHome,
  FaFolderOpen,
  FaTasks,
  FaUsers,
  FaChartBar,
  FaFileAlt,
  FaUserShield,
  FaCog,
} from "react-icons/fa";
import { useStaffAuth } from "../hooks/useStaffAuth";
import {
  getOpenTasksForStaff,
  getUnreadNotifications,
} from "../utils/staffDataHelpers";
import StaffUserMenu from "../components/staff/StaffUserMenu";
import { Dialog } from "../components/staff/StaffUI";
import logo from "../assets/logo.svg";
const links = [
  ["/staff", "Dashboard", FaHome],
  ["/staff/cases", "Cases", FaFolderOpen, "cases:view"],
  ["/staff/tasks", "My Tasks", FaTasks, "tasks:view"],
  ["/staff/teams", "Teams", FaUsers, "teams:view"],
  ["/staff/reports", "Reports", FaChartBar, "reports:view"],
  ["/staff/content", "Content Management", FaFileAlt, "content:view"],
  ["/staff/notifications", "Notifications", FaBell],
  ["/staff/users", "Users", FaUserShield, "users:manage"],
  ["/staff/settings", "Settings", FaCog],
];
export default function StaffLayout() {
  const { staffUser, hasPermission, data, error } = useStaffAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  const unread = getUnreadNotifications(data, staffUser.id).length;
  const taskCount = getOpenTasksForStaff(data, staffUser.id).length;
  const navigation = (
    <nav aria-label="Staff navigation" className="space-y-1">
      {links
        .filter(([, , , permission]) => hasPermission(permission))
        .map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/staff"}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-[#008fc9] text-white shadow-sm" : "text-slate-200 hover:bg-white/10 hover:text-white"}`
            }
          >
            <Icon className="shrink-0 text-base" />
            <span>{label}</span>
            {((to === "/staff/tasks" && taskCount > 0) ||
              (to === "/staff/notifications" && unread > 0)) && (
              <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {to === "/staff/tasks" ? taskCount : unread}
              </span>
            )}
          </NavLink>
        ))}
    </nav>
  );
  return (
    <div className="min-h-screen bg-[#f3f8fc] text-[#173346] lg:pl-60">
      <a
        href="#staff-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:p-3"
      >
        Skip to staff content
      </a>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 overflow-y-auto bg-[#063B5A] px-4 py-6 lg:flex lg:flex-col">
        <Link
          to="/staff"
          className="mb-8 flex items-center gap-3 px-2 text-white"
        >
          <img src={logo} className="h-10 w-10" alt="" />
          <span>
            <strong className="block text-lg">Hospo Hub</strong>
            <span className="text-xs text-sky-200">STAFF PORTAL</span>
          </span>
        </Link>
        {navigation}
        <div className="mt-auto pt-8 text-xs leading-5 text-slate-300">
          <p className="border-t border-white/15 pt-4">Auckland Council</p>
          <p>{data.settings.systemName}</p>
          <Link to="/" className="mt-3 inline-block text-sky-200 underline">
            View public website
          </Link>
        </div>
      </aside>
      <header className="sticky top-0 z-30 flex min-h-20 flex-wrap items-center gap-3 border-b border-[#dde8ef] bg-white px-4 py-3 sm:px-6">
        <button
          type="button"
          aria-label="Open staff navigation"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-lg lg:hidden"
        >
          <FaBars />
        </button>
        <Link to="/staff" className="font-bold lg:hidden">
          Hospo Hub
        </Link>
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            navigate(
              `/staff/${hasPermission("cases:view") ? "cases" : "content"}?q=${encodeURIComponent(query.trim())}`,
            );
          }}
          className="order-last flex w-full items-center rounded-lg border border-slate-200 bg-slate-50 lg:order-none lg:max-w-xl lg:flex-1"
        >
          <FaSearch className="ml-3 shrink-0 text-slate-400" />
          <input
            aria-label="Search applications, businesses, or people"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              hasPermission("cases:view")
                ? "Search applications, businesses, or people..."
                : "Search staff content..."
            }
            className="min-w-0 flex-1 rounded-lg bg-transparent px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-300"
          />
          <button
            type="submit"
            className="rounded-r-lg px-3 py-2.5 text-sm font-semibold text-primary hover:bg-sky-50"
          >
            Search
          </button>
        </form>
        <div className="ml-auto flex items-center gap-2 sm:gap-5">
          <Link
            to="/staff/notifications"
            aria-label={`Staff notifications, ${unread} unread`}
            className="relative rounded-lg p-3 text-slate-500 hover:bg-slate-50"
          >
            <FaBell />
            {unread > 0 && (
              <span className="absolute right-0 top-0 rounded-full bg-primary px-1.5 text-[10px] font-semibold text-white">
                {unread}
              </span>
            )}
          </Link>
          <StaffUserMenu />
        </div>
      </header>
      {open && (
        <Dialog title="Staff navigation" onClose={() => setOpen(false)}>
          <div className="rounded-xl bg-[#063B5A] p-3">{navigation}</div>
        </Dialog>
      )}
      <main
        id="staff-main"
        className="mx-auto max-w-[1700px] p-4 sm:p-6 lg:p-8"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            Staff portal /{" "}
            {links.find(
              ([to]) => to !== "/staff" && pathname.startsWith(to),
            )?.[1] || "Dashboard"}
          </span>
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sky-800">
            Local prototype · fictional records
          </span>
        </div>
        {error && (
          <p
            role="alert"
            className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </p>
        )}
        <div key={pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
