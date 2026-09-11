import { Link } from "react-router-dom";
import {
  FaFolderOpen,
  FaUtensils,
  FaWineGlassAlt,
  FaUmbrellaBeach,
  FaClipboardCheck,
} from "react-icons/fa";
import { useStaffAuth } from "../../hooks/useStaffAuth";
import {
  getCaseCounts,
  getOpenTasksForStaff,
  formatStaffDate,
  reportRange,
  applicationsOverTime,
} from "../../utils/staffDataHelpers";
import {
  PageHeading,
  Stats,
  Panel,
  Badge,
  Empty,
} from "../../components/staff/StaffUI";
import StaffCaseTable from "../../components/staff/StaffCaseTable";
import { ReceivedChart, StatusChart } from "../../components/staff/StaffCharts";
export default function StaffDashboard() {
  const { data, staffUser, hasPermission } = useStaffAuth();
  const counts = getCaseCounts(data);
  const range = reportRange("30");
  const tasks = getOpenTasksForStaff(data, staffUser.id)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);
  return (
    <>
      <PageHeading
        title={`Welcome back, ${staffUser.firstName}`}
        action={
          <span className="text-sm text-slate-500">
            {formatStaffDate(new Date())}
          </span>
        }
      >
        Here’s what’s happening with hospitality licensing today.
      </PageHeading>
      <Stats
        items={[
          ["Total applications", counts.total, "", FaFolderOpen],
          ["Food applications", counts.Food, "Food", FaUtensils],
          ["Alcohol applications", counts.Alcohol, "Alcohol", FaWineGlassAlt],
          [
            "Outdoor dining",
            counts["Outdoor dining"],
            "Outdoor dining",
            FaUmbrellaBeach,
          ],
          [
            "Verification",
            counts.Verification,
            "Verification",
            FaClipboardCheck,
          ],
        ].map(([label, value, category, icon]) => ({
          label,
          value,
          icon,
          to: hasPermission("cases:view")
            ? `/staff/cases${category ? `?category=${encodeURIComponent(category)}` : ""}`
            : undefined,
        }))}
      />
      <div className="mb-6 grid gap-5 xl:grid-cols-[2fr_1fr]">
        <ReceivedChart
          rows={applicationsOverTime(data.staffCases, range.from, range.to)}
        />
        <StatusChart cases={data.staffCases} />
      </div>
      <div className="grid gap-5 2xl:grid-cols-[2fr_1fr]">
        {hasPermission("cases:view") && (
          <section className="min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold">Recent cases</h2>
              <Link
                to="/staff/cases"
                className="text-sm font-semibold text-primary"
              >
                View all →
              </Link>
            </div>
            <StaffCaseTable
              compact
              cases={[...data.staffCases]
                .sort(
                  (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
                )
                .slice(0, 4)}
            />
          </section>
        )}
        <Panel
          title={
            hasPermission("tasks:view")
              ? "My upcoming and urgent tasks"
              : "Quick links"
          }
        >
          {hasPermission("tasks:view") ? (
            tasks.length ? (
              <ul className="divide-y">
                {tasks.map((task) => (
                  <li key={task.id} className="py-3 first:pt-0">
                    <Link
                      className="text-sm font-semibold text-primary hover:underline"
                      to={`/staff/cases/${task.caseId}?tab=Tasks`}
                    >
                      {task.title}
                    </Link>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-500">
                        Due {formatStaffDate(task.dueDate)}
                      </span>
                      <Badge>{task.priority}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No tasks assigned.</Empty>
            )
          ) : (
            <div className="space-y-3">
              {hasPermission("content:view") && (
                <Link
                  to="/staff/content"
                  className="block text-sm font-semibold text-primary"
                >
                  Manage guidance and content →
                </Link>
              )}
              {hasPermission("reports:view") && (
                <Link
                  to="/staff/reports"
                  className="block text-sm font-semibold text-primary"
                >
                  Explore application reports →
                </Link>
              )}
              <Link
                to="/staff/notifications"
                className="block text-sm font-semibold text-primary"
              >
                View notifications →
              </Link>
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
