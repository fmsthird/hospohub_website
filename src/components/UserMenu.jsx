import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
export default function UserMenu({ mobile = false, onNavigate = () => {} }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
    "HH";
  return (
    <details
      className="relative"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.currentTarget.open = false;
          event.currentTarget.querySelector("summary")?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          event.currentTarget.open = false;
      }}
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg p-1.5 text-sm font-semibold text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7294aa] text-xs text-white"
          aria-hidden="true"
        >
          {initials}
        </span>
        <span className="max-w-36 truncate">
          {user.firstName} {user.lastName}
        </span>
        <FaChevronDown className="text-xs" />
      </summary>
      <div
        className={
          mobile
            ? "mt-2 grid gap-1 rounded-lg border bg-white p-2"
            : "absolute right-0 top-full z-50 mt-2 grid w-56 gap-1 rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
        }
      >
        {[
          [FaUser, "/profile", "My Profile"],
          [FaCog, "/settings", "Settings"],
          [FaQuestionCircle, "/help", "Help & Support"],
        ].map(([Icon, to, label]) => (
          <Link
            key={to}
            to={to}
            onClick={(event) => {
              event.currentTarget.closest("details").open = false;
              onNavigate();
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-700 hover:bg-blue-50"
          >
            <Icon className="text-[#66869a]" />
            {label}
          </Link>
        ))}
        <button
          className="mt-1 flex items-center gap-3 border-t px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-blue-50"
          onClick={() => {
            try {
              logout();
              onNavigate();
              navigate("/", { replace: true });
            } catch {
              setError("Unable to clear this session. Please try again.");
            }
          }}
        >
          <FaSignOutAlt />
          Sign out
        </button>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </details>
  );
}
