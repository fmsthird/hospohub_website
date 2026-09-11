import { Link } from "react-router-dom";
import { useStaffAuth } from "../../hooks/useStaffAuth";
import { getStaffName, formatStaffDate } from "../../utils/staffDataHelpers";
import { Table, Cell, Badge } from "./StaffUI";
export default function StaffCaseTable({ cases, compact = false }) {
  const { data, hasPermission } = useStaffAuth();
  return (
    <Table
      caption="Staff cases"
      headers={
        compact
          ? ["Case / Business", "Type", "Status", "Action"]
          : [
              "Case / Business",
              "Applicant",
              "Application type",
              "Assigned officer",
              "Submitted",
              "Status",
              "Priority",
              "Next action",
              "Action",
            ]
      }
      empty={!cases.length && "No cases found. Try adjusting your filters."}
    >
      {cases.map((item) => (
        <tr
          key={item.id}
          className="hover:bg-slate-50"
        >
          <Cell>
            <Link
              to={`/staff/cases/${item.id}`}
              className="whitespace-nowrap font-semibold text-primary hover:underline"
            >
              {item.id}
            </Link>
            <span className="mt-1 block min-w-36 text-slate-600">
              {item.businessName}
            </span>
          </Cell>
          {!compact && <Cell>{item.applicantName}</Cell>}
          <Cell>{item.type}</Cell>
          {!compact && (
            <>
              <Cell>
                {item.assignedOfficerId && hasPermission("teams:view") ? (
                  <Link
                    className="hover:text-primary hover:underline"
                    to={`/staff/teams?member=${item.assignedOfficerId}`}
                  >
                    {getStaffName(data, item.assignedOfficerId)}
                  </Link>
                ) : (
                  getStaffName(data, item.assignedOfficerId)
                )}
              </Cell>
              <Cell className="whitespace-nowrap text-slate-500">
                {formatStaffDate(item.submittedAt)}
              </Cell>
            </>
          )}
          <Cell>
            <Badge>{item.status}</Badge>
          </Cell>
          {!compact && (
            <>
              <Cell>
                <Badge>{item.priority}</Badge>
              </Cell>
              <Cell className="min-w-40 text-slate-500">
                {item.nextAction}
              </Cell>
            </>
          )}
          <Cell>
            <Link
              className="font-semibold text-primary hover:underline"
              to={`/staff/cases/${item.id}`}
              aria-label={`View ${item.id}`}
            >
              View
            </Link>
          </Cell>
        </tr>
      ))}
    </Table>
  );
}
