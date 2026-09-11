import { useState } from "react";
import { useStaffAuth } from "../../hooks/useStaffAuth";
import {
  dateKey,
  getTaskCounts,
  isTaskOverdue,
} from "../../utils/staffDataHelpers";
import { PRIORITIES, TASK_TYPES } from "../../data/staffRoles";
import {
  PageHeading,
  Stats,
  Tabs,
  Select,
} from "../../components/staff/StaffUI";
import StaffTaskTable from "../../components/staff/StaffTaskTable";
export default function StaffTasks() {
  const { data, staffUser } = useStaffAuth();
  const [tab, setTab] = useState("All");
  const [priority, setPriority] = useState("");
  const [type, setType] = useState("");
  const tasks = data.staffTasks.filter(
    (task) => task.assignedTo === staffUser.id,
  );
  const today = dateKey();
  const counts = getTaskCounts(tasks, today);
  const shown = tasks
    .filter(
      (task) =>
        (!priority || task.priority === priority) &&
        (!type || task.type === type) &&
        (tab === "All" ||
          (tab === "Completed" && task.status === "Completed") ||
          (task.status !== "Completed" &&
            ((tab === "Today" && task.dueDate === today) ||
              (tab === "Upcoming" && task.dueDate > today) ||
              (tab === "Overdue" && isTaskOverdue(task, today))))),
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  return (
    <>
      <PageHeading title="My Tasks">
        Manage your assigned work and upcoming deadlines.
      </PageHeading>
      <Stats
        items={[
          { label: "Open", value: counts.open },
          {
            label: "Due today",
            value: counts.today,
            onClick: () => setTab("Today"),
          },
          {
            label: "Overdue",
            value: counts.overdue,
            onClick: () => setTab("Overdue"),
          },
          { label: "Completed this week", value: counts.completed },
        ]}
      />
      <Tabs
        items={["All", "Today", "Upcoming", "Overdue", "Completed"]}
        active={tab}
        onChange={setTab}
      />
      <div className="mb-5 grid gap-3 sm:max-w-xl sm:grid-cols-2">
        <Select
          label="Priority"
          value={priority}
          onChange={setPriority}
          options={PRIORITIES}
          all="All priorities"
        />
        <Select
          label="Task type"
          value={type}
          onChange={setType}
          options={TASK_TYPES}
          all="All types"
        />
      </div>
      <StaffTaskTable tasks={shown} />
    </>
  );
}
