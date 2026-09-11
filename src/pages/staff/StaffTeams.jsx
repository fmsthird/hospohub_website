import { Link, useSearchParams } from "react-router-dom";
import { useStaffAuth } from "../../hooks/useStaffAuth";
import {
  getStaffName,
  getCasesByOfficer,
  getOpenTasksForStaff,
  isTaskOverdue,
  workloadForTeam,
  isOpenCase,
} from "../../utils/staffDataHelpers";
import {
  PageHeading,
  Stats,
  Panel,
  Table,
  Cell,
  Badge,
  Empty,
} from "../../components/staff/StaffUI";
import StaffCaseTable from "../../components/staff/StaffCaseTable";
export default function StaffTeams() {
  const { data, hasPermission } = useStaffAuth();
  const [params] = useSearchParams();
  const memberId = params.get("member");
  return (
    <>
      <PageHeading title="Teams">
        View workload and assignments across licensing teams.
      </PageHeading>
      <Stats
        items={[
          { label: "Total staff", value: data.staffUsers.length },
          {
            label: "Available",
            value: data.staffUsers.filter(
              (user) =>
                user.status === "Active" && user.availability === "Available",
            ).length,
          },
          {
            label: "Assigned cases",
            value: data.staffCases.filter((item) => item.assignedOfficerId)
              .length,
          },
          {
            label: "Open tasks",
            value: data.staffTasks.filter((task) => task.status !== "Completed")
              .length,
          },
        ]}
      />
      <p className="mb-4 text-xs text-slate-500">
        Active cases exclude approved and declined decisions. Availability is a
        prototype profile value, not live presence. Team tasks follow the team
        of their related case.
      </p>
      <div className="grid gap-4">
        {data.staffTeams.map((team) => {
          const workload = workloadForTeam(data, team.id);
          return (
            <details
              key={`${team.id}-${memberId || ""}`}
              open={
                workload.members.some((member) => member.id === memberId) ||
                undefined
              }
              className="group overflow-hidden rounded-xl border border-[#dde8ef] bg-white shadow-sm"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                <div>
                  <h2 className="font-bold">{team.name}</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Lead: {getStaffName(data, team.leadId)} ·{" "}
                    {workload.members.length} members
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>
                    <strong className="block text-lg text-slate-800">
                      {workload.active}
                    </strong>
                    Active cases
                  </span>
                  <span>
                    <strong className="block text-lg text-slate-800">
                      {workload.openTasks}
                    </strong>
                    Open tasks
                  </span>
                  <span>
                    <strong className="block text-lg text-slate-800">
                      {workload.overdue}
                    </strong>
                    Overdue tasks
                  </span>
                  <span className="self-center font-semibold text-primary group-open:rotate-180">
                    ⌄
                  </span>
                </div>
              </summary>
              <div className="space-y-4 border-t bg-slate-50/50 p-4">
                <p className="text-sm text-slate-500">{team.description}</p>
                <Table
                  caption={`${team.name} staff workload`}
                  headers={[
                    "Staff member",
                    "Role",
                    "Assigned / Active cases",
                    "Open tasks",
                    "Overdue tasks",
                    "Availability",
                  ]}
                  empty={!workload.members.length && "No team members found."}
                >
                  {workload.members.map((member) => {
                    const tasks = getOpenTasksForStaff(data, member.id);
                    const cases = getCasesByOfficer(data, member.id);
                    return (
                      <tr
                        key={member.id}
                        className={member.id === memberId ? "bg-sky-50" : ""}
                      >
                        <Cell>
                          {hasPermission("users:manage") ? (
                            <Link
                              to={`/staff/users?user=${member.id}`}
                              className="font-semibold text-primary"
                            >
                              {getStaffName(data, member.id)}
                            </Link>
                          ) : (
                            <strong className="font-semibold">
                              {getStaffName(data, member.id)}
                            </strong>
                          )}
                          <span className="mt-1 block text-xs text-slate-500">
                            {member.id}
                          </span>
                        </Cell>
                        <Cell>{member.role}</Cell>
                        <Cell>
                          <Link
                            to={`/staff/cases?officer=${member.id}`}
                            className="font-semibold text-primary"
                          >
                            {cases.length} / {cases.filter(isOpenCase).length}
                          </Link>
                        </Cell>
                        <Cell>{tasks.length}</Cell>
                        <Cell>
                          {tasks.filter((task) => isTaskOverdue(task)).length}
                        </Cell>
                        <Cell>
                          <Badge>
                            {member.status === "Inactive"
                              ? "Inactive"
                              : member.availability}
                          </Badge>
                        </Cell>
                      </tr>
                    );
                  })}
                </Table>
                <Panel title="Team cases">
                  {workload.cases.length ? (
                    <>
                      <StaffCaseTable
                        compact
                        cases={workload.cases.slice(0, 5)}
                      />
                      <Link
                        to={`/staff/cases?team=${team.id}`}
                        className="mt-4 inline-block text-sm font-semibold text-primary"
                      >
                        View all {workload.cases.length} team cases →
                      </Link>
                      {hasPermission("cases:assign") && (
                        <p className="mt-2 text-xs text-slate-500">
                          Open a case to assign its team or officer. Use the
                          case Tasks tab to reassign related work.
                        </p>
                      )}
                    </>
                  ) : (
                    <Empty>No cases assigned to this team.</Empty>
                  )}
                </Panel>
              </div>
            </details>
          );
        })}
      </div>
    </>
  );
}
