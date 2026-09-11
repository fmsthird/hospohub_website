import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaFolderOpen, FaTasks } from "react-icons/fa";
import { useStaffAuth } from "../../hooks/useStaffAuth";
import { formatStaffDate } from "../../utils/staffDataHelpers";
import {
  PageHeading,
  Tabs,
  Button,
  Empty,
} from "../../components/staff/StaffUI";
export default function StaffNotifications() {
  const { data, staffUser, dispatch, hasPermission } = useStaffAuth();
  const [tab, setTab] = useState("All");
  const own = data.staffNotifications.filter(
    (item) => item.staffId === staffUser.id,
  );
  const unread = own.filter((item) => !item.read).length;
  const rows = own
    .filter(
      (item) =>
        tab === "All" ||
        (tab === "Unread" && !item.read) ||
        { Cases: "case", Tasks: "task", System: "system" }[tab] === item.type,
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return (
    <>
      <PageHeading
        title="Notifications"
        action={
          <Button
            secondary
            disabled={!unread}
            onClick={() => dispatch({ type: "notification:readAll" })}
          >
            Mark all read ({unread})
          </Button>
        }
      >
        Stay up to date with cases, tasks and staff activity.
      </PageHeading>
      <Tabs
        items={["All", "Unread", "Cases", "Tasks", "System"]}
        active={tab}
        onChange={setTab}
      />
      {rows.length ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {rows.map((item) => {
            const Icon =
              item.type === "task"
                ? FaTasks
                : item.type === "case"
                  ? FaFolderOpen
                  : FaBell;
            const task =
              item.type === "task"
                ? data.staffTasks.find((task) => task.id === item.relatedId)
                : null;
            const destination = task
              ? `/staff/cases/${task.caseId}?tab=Tasks#${task.id}`
              : item.type === "case" &&
                  data.staffCases.some((row) => row.id === item.relatedId)
                ? `/staff/cases/${item.relatedId}`
                : null;
            return (
              <article
                key={item.id}
                className={`flex gap-4 border-b p-5 last:border-0 ${item.read ? "" : "bg-sky-50/60"}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-primary">
                  <Icon />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold">
                      {!item.read && (
                        <span
                          className="mr-2 inline-block h-2 w-2 rounded-full bg-primary"
                          aria-label="Unread"
                        />
                      )}
                      {item.title}
                    </h2>
                    <time className="text-xs text-slate-500">
                      {formatStaffDate(item.createdAt, true)}
                    </time>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {item.message}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold">
                    {!item.read && (
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() =>
                          dispatch({ type: "notification:read", id: item.id })
                        }
                      >
                        Mark read
                      </button>
                    )}
                    {destination && hasPermission("cases:view") && (
                      <Link
                        className="text-primary hover:underline"
                        to={destination}
                      >
                        {task ? "View task" : "View case"} →
                      </Link>
                    )}
                    {item.read && (
                      <span className="text-slate-400">
                        Read
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <Empty>
          {tab === "Unread"
            ? "No unread notifications."
            : "No notifications in this view."}
        </Empty>
      )}
    </>
  );
}
