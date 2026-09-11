import { Routes, Route, Link } from "react-router-dom";
import { StaffAuthProvider } from "../context/StaffAuthContext";
import StaffProtectedRoute from "../components/staff/StaffProtectedRoute";
import StaffLayout from "../layouts/StaffLayout";
import StaffLogin from "./StaffLogin";
import { staffRoutes } from "../routes/staffRoutes";
export function StaffRouter() {
  return (
    <Routes>
      <Route path="login" element={<StaffLogin />} />
      <Route
        element={
          <StaffProtectedRoute>
            <StaffLayout />
          </StaffProtectedRoute>
        }
      >
        {staffRoutes.map(({ path, component: Page, permission }) => (
          <Route
            key={path}
            path={path}
            element={
              <StaffProtectedRoute permission={permission}>
                <Page />
              </StaffProtectedRoute>
            }
          />
        ))}
        <Route
          path="*"
          element={
            <div>
              <h1 className="text-2xl font-bold">Staff page not found</h1>
              <Link
                to="/staff"
                className="mt-4 inline-block font-semibold text-primary"
              >
                Return to dashboard
              </Link>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
export default function StaffPortal() {
  return (
    <StaffAuthProvider>
      <StaffRouter />
    </StaffAuthProvider>
  );
}
