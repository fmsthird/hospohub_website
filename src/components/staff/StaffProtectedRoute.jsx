import { Navigate, useLocation, Link } from "react-router-dom";
import { useStaffAuth } from "../../hooks/useStaffAuth";
import { Panel } from "./StaffUI";
export default function StaffProtectedRoute({ permission, children }) {
  const { isStaffAuthenticated, hasPermission } = useStaffAuth();
  const location = useLocation();
  if (!isStaffAuthenticated)
    return <Navigate to="/staff/login" replace state={{ from: location }} />;
  if (!hasPermission(permission))
    return (
      <div className="p-6">
        <Panel title="Access restricted">
          <p className="mb-4 text-sm text-slate-600">
            Your staff role does not have access to this area. Contact a staff
            administrator if your access needs to change.
          </p>
          <Link
            to="/staff"
            className="font-semibold text-primary"
          >
            Return to staff dashboard
          </Link>
        </Panel>
      </div>
    );
  return children;
}
