import { useState } from "react";
import { useStaffAuth } from "../../hooks/useStaffAuth";
import {
  hasStaffPermission,
  CASE_STATUSES,
  PRIORITIES,
  TASK_TYPES,
} from "../../data/staffRoles";
import { Dialog, Field, Select, Button, inputClass } from "./StaffUI";
import { dateKey } from "../../utils/staffDataHelpers";
export default function StaffCaseActions({ item, action, onClose }) {
  const { data, dispatch } = useStaffAuth();
  const [teamId, setTeamId] = useState(item.teamId);
  const [officerId, setOfficerId] = useState(item.assignedOfficerId || "");
  const [status, setStatus] = useState(item.status);
  const [priority, setPriority] = useState(item.priority);
  const [nextAction, setNextAction] = useState(item.nextAction);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState("Review");
  const [dueDate, setDueDate] = useState(dateKey());
  const labels = {
    assign: "Assign case",
    status: "Change status",
    note: "Add internal note",
    request: "Request information",
    task: "Create task",
  };
  const submit = (event) => {
    event.preventDefault();
    const payload =
      action === "assign"
        ? { type: "case:assign", id: item.id, teamId, officerId }
        : action === "status"
          ? { type: "case:status", id: item.id, status, priority, nextAction }
          : action === "task"
            ? {
                type: "task:create",
                caseId: item.id,
                assignedTo: officerId,
                title,
                taskType,
                priority,
                dueDate,
              }
            : { type: `case:${action}`, id: item.id, text };
    if (dispatch(payload)) onClose();
  };
  return (
    <Dialog title={labels[action]} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {action === "assign" && (
          <>
            <Select
              label="Team"
              value={teamId}
              onChange={(value) => {
                setTeamId(value);
                setOfficerId("");
              }}
              options={data.staffTeams.map((team) => ({
                value: team.id,
                label: team.name,
              }))}
            />
            <Select
              label="Assigned officer"
              value={officerId}
              onChange={setOfficerId}
              all="Unassigned — team queue"
              options={data.staffUsers
                .filter(
                  (user) =>
                    user.teamId === teamId &&
                    hasStaffPermission(user, "cases:update"),
                )
                .map((user) => ({
                  value: user.id,
                  label: `${user.firstName} ${user.lastName}`,
                }))}
            />
            <p className="text-xs text-slate-500">
              Existing tasks keep their assigned staff. Reassign tasks
              individually if needed.
            </p>
          </>
        )}
        {action === "status" && (
          <>
            <Select
              label="Status"
              value={status}
              onChange={setStatus}
              options={CASE_STATUSES}
            />
            <Select
              label="Priority"
              value={priority}
              onChange={setPriority}
              options={PRIORITIES}
            />
            <Field
              label="Next action"
              required
              maxLength={300}
              value={nextAction}
              onChange={(event) => setNextAction(event.target.value)}
            />
          </>
        )}
        {["note", "request"].includes(action) && (
          <>
            <p className="rounded-lg bg-sky-50 p-3 text-sm text-sky-900">
              {action === "note"
                ? "Internal note · Visible to staff only. This will not appear in the applicant message thread."
                : "The information request is saved locally and changes this case to Action required. It is not sent to the applicant."}
            </p>
            <Field
              label={
                action === "note" ? "Internal note" : "Information requested"
              }
            >
              <textarea
                required
                rows={5}
                maxLength={10000}
                value={text}
                onChange={(event) => setText(event.target.value)}
                className={inputClass}
              />
            </Field>
          </>
        )}
        {action === "task" && (
          <>
            <Field
              label="Task title"
              required
              maxLength={180}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <Select
              label="Assign to staff"
              required
              value={officerId}
              onChange={setOfficerId}
              all="Select staff"
              options={data.staffUsers
                .filter(
                  (user) =>
                    hasStaffPermission(user, "cases:update") &&
                    hasStaffPermission(user, "tasks:update"),
                )
                .map((user) => ({
                  value: user.id,
                  label: `${user.firstName} ${user.lastName}`,
                }))}
            />
            <Select
              label="Task type"
              value={taskType}
              onChange={setTaskType}
              options={TASK_TYPES}
            />
            <Select
              label="Priority"
              value={priority}
              onChange={setPriority}
              options={PRIORITIES}
            />
            <Field
              label="Due date"
              type="date"
              required
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </>
        )}
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button secondary onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {action === "request"
              ? "Save local request"
              : action === "task"
                ? "Create task"
                : "Save changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
