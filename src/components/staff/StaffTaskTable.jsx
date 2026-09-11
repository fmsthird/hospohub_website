import { useState } from "react";
import { Link } from "react-router-dom";
import { useStaffAuth } from "../../hooks/useStaffAuth";
import {
  getStaffName,
  formatStaffDate,
  isTaskOverdue,
} from "../../utils/staffDataHelpers";
import { hasStaffPermission } from "../../data/staffRoles";
import { Table, Cell, Badge, Button, Select, Dialog } from "./StaffUI";
export default function StaffTaskTable({ tasks }) {
  const { data, staffUser, hasPermission, dispatch } = useStaffAuth();
  const [selected, setSelected] = useState(null);
  const [assignedTo, setAssignedTo] = useState("");
  return (
    <>
      <Table
        caption="Assigned staff tasks"
        headers={[
          "Task",
          "Related case / Business",
          "Type",
          "Priority",
          "Due",
          "Status",
          "Assigned staff / By",
          "Actions",
        ]}
        empty={!tasks.length && "No tasks found for this view."}
      >
        {tasks.map((task) => (
          <tr
            key={task.id}
            id={task.id}
            className="scroll-mt-32 hover:bg-slate-50 target:bg-sky-50"
          >
            <Cell className="min-w-40">
              <strong className="font-semibold">{task.title}</strong>
              <span className="mt-1 block text-xs text-slate-400">
                {task.id}
              </span>
            </Cell>
            <Cell>
              <Link
                className="whitespace-nowrap font-semibold text-primary hover:underline"
                to={`/staff/cases/${task.caseId}?tab=Tasks`}
              >
                {task.caseId}
              </Link>
              <span className="mt-1 block text-xs text-slate-500">
                {
                  data.staffCases.find((item) => item.id === task.caseId)
                    ?.businessName
                }
              </span>
            </Cell>
            <Cell>{task.type}</Cell>
            <Cell>
              <Badge>{task.priority}</Badge>
            </Cell>
            <Cell className="whitespace-nowrap">
              {formatStaffDate(task.dueDate)}
              {isTaskOverdue(task) && (
                <span className="mt-1 block text-xs font-semibold text-red-700">
                  Overdue
                </span>
              )}
            </Cell>
            <Cell>
              <Badge>{task.status}</Badge>
            </Cell>
            <Cell>
              <span className="block">
                {getStaffName(data, task.assignedTo)}
              </span>
              <span className="text-xs text-slate-500">
                By {getStaffName(data, task.assignedBy)}
              </span>
            </Cell>
            <Cell>
              <div className="flex min-w-28 flex-col items-start gap-2">
                <Link
                  className="font-semibold text-primary hover:underline"
                  to={`/staff/cases/${task.caseId}?tab=Tasks`}
                >
                  Open case
                </Link>
                {task.status !== "Completed" &&
                  hasPermission("tasks:update") &&
                  (task.assignedTo === staffUser.id ||
                    hasPermission("tasks:assign")) && (
                    <button
                      type="button"
                      className="text-left font-semibold text-emerald-700 hover:underline"
                      onClick={() =>
                        dispatch({ type: "task:complete", id: task.id })
                      }
                    >
                      Mark complete
                    </button>
                  )}
                {hasPermission("tasks:assign") &&
                  task.status !== "Completed" && (
                    <button
                      type="button"
                      className="text-left text-primary hover:underline"
                      onClick={() => {
                        setAssignedTo(task.assignedTo);
                        setSelected(task);
                      }}
                    >
                      Reassign
                    </button>
                  )}
              </div>
            </Cell>
          </tr>
        ))}
      </Table>
      {selected && (
        <Dialog title="Reassign task" onClose={() => setSelected(null)}>
          <p className="mb-4 text-sm text-slate-500">
            {selected.title}
          </p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (
                dispatch({ type: "task:assign", id: selected.id, assignedTo })
              )
                setSelected(null);
            }}
          >
            <Select
              label="Assign to staff"
              value={assignedTo}
              onChange={setAssignedTo}
              options={data.staffUsers
                .filter(
                  (user) =>
                    hasStaffPermission(user, "tasks:update") &&
                    hasStaffPermission(user, "cases:update"),
                )
                .map((user) => ({
                  value: user.id,
                  label: `${user.firstName} ${user.lastName}`,
                }))}
            />
            <div className="mt-5 flex justify-end gap-2">
              <Button secondary onClick={() => setSelected(null)}>
                Cancel
              </Button>
              <Button type="submit">Save assignment</Button>
            </div>
          </form>
        </Dialog>
      )}
    </>
  );
}
