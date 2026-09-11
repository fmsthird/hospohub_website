import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useStaffAuth } from "../../hooks/useStaffAuth";
export default function StaffUserMenu() {
  const { staffUser, staffLogout } = useStaffAuth();
  const navigate = useNavigate();
  const ref = useRef(null);
  const close = () => {
    if (ref.current) ref.current.open = false;
  };
  return (
    <details
      ref={ref}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          close();
          ref.current.querySelector("summary").focus();
        }
      }}
    >
      <summary
        className="flex cursor-pointer list-none items-center gap-2 rounded-lg p-1.5 hover:bg-slate-50 [&::-webkit-details-marker]:hidden"
        aria-label="Staff profile menu"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6b8ca4] text-sm font-bold text-white">
          {staffUser.firstName[0]}
          {staffUser.lastName[0]}
        </span>
        <span className="hidden text-left sm:block">
          <strong className="block text-sm">
            {staffUser.firstName} {staffUser.lastName}
          </strong>
          <span className="block text-xs text-slate-500">{staffUser.role}</span>
        </span>
        <FaChevronDown className="text-xs text-slate-500" />
      </summary>
      <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
        <p className="border-b px-3 py-2 text-xs text-slate-500 sm:hidden">
          {staffUser.firstName} {staffUser.lastName} · {staffUser.role}
        </p>
        {[
          ["My Profile", "/staff/settings?tab=Profile", FaUser],
          ["Staff Settings", "/staff/settings", FaCog],
          ["Help & Support", "/help", FaQuestionCircle],
        ].map(([label, to, Icon]) => (
          <Link
            key={to}
            to={to}
            onClick={close}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-slate-50"
          >
            <Icon className="text-slate-500" />
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => {
            staffLogout();
            navigate("/staff/login", { replace: true });
          }}
          className="mt-1 flex w-full items-center gap-3 border-t px-3 py-3 text-left text-sm hover:bg-slate-50"
        >
          <FaSignOutAlt className="text-slate-500" />
          Sign out
        </button>
      </div>
    </details>
  );
}
