import { useSearchParams } from "react-router-dom";
import { useStaffAuth } from "../../hooks/useStaffAuth";
import {
  getCaseCounts,
  filterStaffCases,
  staffCsv,
  getStaffName,
  formatStaffDate,
} from "../../utils/staffDataHelpers";
import { downloadText } from "../../services/documentStore";
import { PageHeading, Stats, Button } from "../../components/staff/StaffUI";
import StaffCaseFilters from "../../components/staff/StaffCaseFilters";
import StaffCaseTable from "../../components/staff/StaffCaseTable";
export default function StaffCases() {
  const { data, staffUser } = useStaffAuth();
  const [params, setParams] = useSearchParams();
  const filters = Object.fromEntries(params);
  const setFilters = (next) =>
    setParams(
      Object.fromEntries(Object.entries(next).filter(([, value]) => value)),
      { replace: true },
    );
  const counts = getCaseCounts(data);
  const cases = filterStaffCases(data, filters, staffUser.id);
  const exportCases = () =>
    downloadText(
      "hospo-hub-prototype-cases.csv",
      staffCsv(cases, [
        { label: "Reference", value: (row) => row.id },
        { label: "Business", value: (row) => row.businessName },
        { label: "Applicant", value: (row) => row.applicantName },
        { label: "Type", value: (row) => row.type },
        { label: "Status", value: (row) => row.status },
        {
          label: "Officer",
          value: (row) => getStaffName(data, row.assignedOfficerId),
        },
        {
          label: "Submitted",
          value: (row) => formatStaffDate(row.submittedAt),
        },
      ]),
    );
  return (
    <>
      <PageHeading
        title="Cases"
        action={
          <Button secondary onClick={exportCases} disabled={!cases.length}>
            Export CSV
          </Button>
        }
      >
        Review and manage hospitality licensing applications.
      </PageHeading>
      <Stats
        items={[
          {
            label: "All cases",
            value: counts.total,
            onClick: () => setFilters({}),
          },
          ...["Submitted", "In review", "Action required"].map((status) => ({
            label: status === "Submitted" ? "New / Submitted" : status,
            value: counts[status],
            onClick: () => setFilters({ status }),
          })),
          {
            label: "Overdue",
            value: counts.overdue,
            onClick: () => setFilters({ overdue: "1" }),
          },
          {
            label: "Approved",
            value: counts.Approved,
            onClick: () => setFilters({ status: "Approved" }),
          },
        ]}
      />
      <StaffCaseFilters filters={filters} onChange={setFilters} />
      <p className="mb-3 text-xs text-slate-500" role="status">
        {cases.length} matching cases · overdue means an open case has a past
        due date or an overdue task.
      </p>
      <StaffCaseTable cases={cases} />
    </>
  );
}
