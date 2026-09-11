import StaffDashboard from "../pages/staff/StaffDashboard";
import StaffCases from "../pages/staff/StaffCases";
import StaffCaseDetail from "../pages/staff/StaffCaseDetail";
import StaffTasks from "../pages/staff/StaffTasks";
import StaffTeams from "../pages/staff/StaffTeams";
import StaffReports from "../pages/staff/StaffReports";
import StaffContent from "../pages/staff/StaffContent";
import StaffNotifications from "../pages/staff/StaffNotifications";
import StaffUsers from "../pages/staff/StaffUsers";
import StaffSettings from "../pages/staff/StaffSettings";
export const staffRoutes = [
  { path: "", component: StaffDashboard },
  { path: "cases", component: StaffCases, permission: "cases:view" },
  { path: "cases/:id", component: StaffCaseDetail, permission: "cases:view" },
  { path: "tasks", component: StaffTasks, permission: "tasks:view" },
  { path: "teams", component: StaffTeams, permission: "teams:view" },
  { path: "reports", component: StaffReports, permission: "reports:view" },
  { path: "content", component: StaffContent, permission: "content:view" },
  { path: "notifications", component: StaffNotifications },
  { path: "users", component: StaffUsers, permission: "users:manage" },
  { path: "settings", component: StaffSettings },
];
