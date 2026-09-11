import { useState } from "react";
import { useStaffAuth } from "../../hooks/useStaffAuth";
import {
  filterStaffCases,
  reportRange,
  getCaseCounts,
  averageProcessingDays,
  applicationsOverTime,
  groupCases,
  staffCsv,
  getStaffName,
} from "../../utils/staffDataHelpers";
import { CASE_CATEGORIES } from "../../data/staffRoles";
import { downloadText } from "../../services/documentStore";
import {
  PageHeading,
  Select,
  Stats,
  Button,
  Empty,
} from "../../components/staff/StaffUI";
import StaffCaseFilters from "../../components/staff/StaffCaseFilters";
import {
  ReceivedChart,
  StatusChart,
  CountChart,
} from "../../components/staff/StaffCharts";
export default function StaffReports() {
  const { data, staffUser } = useStaffAuth();
  const [period, setPeriod] = useState("30");
  const [filters, setFilters] = useState(() => reportRange("30"));
  const cases = filterStaffCases(data, filters, staffUser.id);
  const counts = getCaseCounts(data, cases);
  const average = averageProcessingDays(cases);
  const range = {
    from:
      filters.from ||
      [...data.staffCases]
        .map((item) => item.submittedAt.slice(0, 10))
        .sort()[0] ||
      reportRange("30").from,
    to: filters.to || reportRange("30").to,
  };
  const exportReport = () =>
    downloadText(
      "hospo-hub-prototype-report.csv",
      staffCsv(cases, [
        { label: "Reference", value: (item) => item.id },
        { label: "Business", value: (item) => item.businessName },
        { label: "Category", value: (item) => item.category },
        { label: "Status", value: (item) => item.status },
        {
          label: "Team",
          value: (item) =>
            data.staffTeams.find((team) => team.id === item.teamId)?.name,
        },
        {
          label: "Officer",
          value: (item) => getStaffName(data, item.assignedOfficerId),
        },
        { label: "Submitted", value: (item) => item.submittedAt },
        { label: "Decision", value: (item) => item.decidedAt },
        {
          label: "Open tasks",
          value: (item) =>
            data.staffTasks.filter(
              (task) => task.caseId === item.id && task.status !== "Completed",
            ).length,
        },
      ]),
    );
  return (
    <>
      <PageHeading
        title="Reports"
        action={
          <Button secondary disabled={!cases.length} onClick={exportReport}>
            Export prototype CSV
          </Button>
        }
      >
        Monitor application volumes, processing performance and outcomes.
      </PageHeading>
      <div className="mb-4 max-w-xs">
        <Select
          label="Reporting period"
          value={period}
          onChange={(value) => {
            setPeriod(value);
            if (value !== "custom")
              setFilters({ ...filters, ...reportRange(value) });
          }}
          options={[
            { value: "7", label: "Last 7 days" },
            { value: "30", label: "Last 30 days" },
            { value: "3months", label: "Last 3 months" },
            { value: "year", label: "This year" },
            { value: "custom", label: "Custom" },
          ]}
        />
      </div>
      <StaffCaseFilters
        reports
        filters={filters}
        onChange={(next) => {
          if (next.from !== filters.from || next.to !== filters.to)
            setPeriod("custom");
          setFilters(next);
        }}
      />
      <Stats
        items={[
          { label: "Total applications", value: counts.total },
          { label: "Approved", value: counts.Approved },
          { label: "Declined", value: counts.Declined },
          {
            label: "Average processing",
            value:
              average === null ? "Not recorded" : `${average.toFixed(1)} days`,
          },
          { label: "Open cases", value: counts.open },
          { label: "Overdue cases", value: counts.overdue },
        ]}
      />
      <p className="mb-5 text-xs leading-5 text-slate-500">
        All charts use the same filtered applications, by submission date.
        Processing time is elapsed calendar days from submission to a recorded
        decision; records without a decision date are excluded. These are
        prototype reports, not official council performance figures.
      </p>
      {!cases.length ? (
        <Empty>No report data. Adjust your date range or filters.</Empty>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          <ReceivedChart
            title="Applications over time"
            period={`${range.from} to ${range.to}`}
            rows={applicationsOverTime(cases, range.from, range.to)}
          />
          <CountChart
            title="Applications by type"
            rows={groupCases(cases, "category", CASE_CATEGORIES)}
          />
          <StatusChart cases={cases} title="Applications by status" />
          <CountChart
            title="Cases by team"
            rows={data.staffTeams.map((team) => ({
              name: team.name,
              value: cases.filter((item) => item.teamId === team.id).length,
            }))}
          />
          <CountChart
            title="Officer workload — open cases"
            rows={[
              ...data.staffUsers.map((user) => ({
                name: `${user.firstName} ${user.lastName}`,
                value: cases.filter(
                  (item) =>
                    item.assignedOfficerId === user.id &&
                    !["Approved", "Declined"].includes(item.status),
                ).length,
              })),
              {
                name: "Unassigned",
                value: cases.filter(
                  (item) =>
                    !item.assignedOfficerId &&
                    !["Approved", "Declined"].includes(item.status),
                ).length,
              },
            ]}
          />
          <CountChart
            title="Approval vs declined"
            rows={groupCases(cases, "status", ["Approved", "Declined"])}
          />
        </div>
      )}
    </>
  );
}
