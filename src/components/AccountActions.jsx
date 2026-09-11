import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import UserMenu from "./UserMenu";
export default function AccountActions({
  mobile = false,
  onNavigate = () => {},
}) {
  const { isAuthenticated } = useAuth();
  const primary = `inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-secondary ${mobile ? "w-full" : ""}`;
  return (
    <div
      className={
        mobile
          ? "grid w-full gap-3 border-t border-gray-200 pt-4"
          : "ml-4 flex shrink-0 items-center gap-3"
      }
    >
      {isAuthenticated ? (
        <>
          <Link to="/dashboard" onClick={onNavigate} className={primary}>
            My Hub
          </Link>
          <UserMenu mobile={mobile} onNavigate={onNavigate} />
        </>
      ) : (
        <>
          <Link
            to="/login"
            onClick={onNavigate}
            className={`inline-flex min-h-11 items-center justify-center rounded-lg px-3 py-2.5 text-sm font-semibold text-primary hover:bg-blue-50 ${mobile ? "w-full border border-primary" : ""}`}
          >
            Sign in
          </Link>
          <Link to="/create-account" onClick={onNavigate} className={primary}>
            Create account
          </Link>
        </>
      )}
    </div>
  );
}
