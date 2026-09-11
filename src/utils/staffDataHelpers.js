import { CASE_CATEGORIES, CASE_STATUSES } from "../data/staffRoles.js";
const nzCalendar = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Pacific/Auckland",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
export const getUserById = (data, id) =>
  data.staffUsers.find((user) => user.id === id);
export const getTeamById = (data, id) =>
  data.staffTeams.find((team) => team.id === id);
export const getStaffName = (data, id) => {
  const user = getUserById(data, id);
  return user ? `${user.firstName} ${user.lastName}` : "Unassigned";
};
export const getCasesByOfficer = (data, id) =>
  data.staffCases.filter((item) => item.assignedOfficerId === id);
export const getCasesByTeam = (data, id) =>
  data.staffCases.filter((item) => item.teamId === id);
export const getOpenTasksForStaff = (data, id) =>
  data.staffTasks.filter(
    (item) => item.assignedTo === id && item.status !== "Completed",
  );
export const getUnreadNotifications = (data, id) =>
  data.staffNotifications.filter((item) => item.staffId === id && !item.read);
export const isOpenCase = (item) =>
  !["Approved", "Declined"].includes(item.status);
// NZ calendar dates make due-today consistent regardless of the browser's time zone.
export function dateKey(value = new Date()) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return nzCalendar.format(date);
}
export function formatStaffDate(value, includeTime = false) {
  if (!value || Number.isNaN(new Date(value).getTime())) return "Not recorded";
  return new Intl.DateTimeFormat("en-NZ", {
    timeZone: "Pacific/Auckland",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(new Date(value));
}
export const isTaskOverdue = (task, today = dateKey()) =>
  task.status !== "Completed" && !!task.dueDate && task.dueDate < today;
export const isCaseOverdue = (item, data, today = dateKey()) =>
  isOpenCase(item) &&
  ((item.dueDate && item.dueDate < today) ||
    data.staffTasks.some(
      (task) => task.caseId === item.id && isTaskOverdue(task, today),
    ));
export function getCaseCounts(
  data,
  cases = data.staffCases,
  today = dateKey(),
) {
  return {
    total: cases.length,
    ...Object.fromEntries(
      [...CASE_CATEGORIES, ...CASE_STATUSES].map((key) => [
        key,
        cases.filter((item) => item.category === key || item.status === key)
          .length,
      ]),
    ),
    overdue: cases.filter((item) => isCaseOverdue(item, data, today)).length,
    open: cases.filter(isOpenCase).length,
  };
}
export function getTaskCounts(tasks, today = dateKey()) {
  const monday = new Date(`${today}T12:00:00Z`);
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
  const weekStart = monday.toISOString().slice(0, 10);
  return {
    open: tasks.filter((item) => item.status !== "Completed").length,
    today: tasks.filter(
      (item) => item.status !== "Completed" && item.dueDate === today,
    ).length,
    overdue: tasks.filter((item) => isTaskOverdue(item, today)).length,
    completed: tasks.filter(
      (item) =>
        item.status === "Completed" &&
        item.completedAt &&
        dateKey(item.completedAt) >= weekStart &&
        dateKey(item.completedAt) <= today,
    ).length,
  };
}
export function filterStaffCases(
  data,
  filters = {},
  staffId,
  today = dateKey(),
) {
  const query = (filters.q || "").trim().toLowerCase();
  return data.staffCases
    .filter((item) => {
      const submitted = dateKey(item.submittedAt);
      return (
        (!query ||
          [
            item.id,
            item.businessName,
            item.applicantName,
            item.applicantEmail,
            getStaffName(data, item.assignedOfficerId),
          ].some((value) => value?.toLowerCase().includes(query))) &&
        (!filters.category || item.category === filters.category) &&
        (!filters.status || item.status === filters.status) &&
        (!filters.priority || item.priority === filters.priority) &&
        (!filters.team || item.teamId === filters.team) &&
        (!filters.officer ||
          item.assignedOfficerId ===
            (filters.officer === "me"
              ? staffId
              : filters.officer === "unassigned"
                ? null
                : filters.officer)) &&
        (!filters.from || submitted >= filters.from) &&
        (!filters.to || submitted <= filters.to) &&
        (!filters.overdue || isCaseOverdue(item, data, today))
      );
    })
    .sort((a, b) =>
      filters.sort === "oldest"
        ? new Date(a.submittedAt) - new Date(b.submittedAt)
        : filters.sort === "priority"
          ? ["Urgent", "High", "Normal"].indexOf(a.priority) -
            ["Urgent", "High", "Normal"].indexOf(b.priority)
          : new Date(b.submittedAt) - new Date(a.submittedAt),
    );
}
export function groupCases(cases, field, labels) {
  const keys = labels || [...new Set(cases.map((item) => item[field]))];
  return keys.map((name) => ({
    name: name || "Unassigned",
    value: cases.filter((item) => item[field] === name).length,
  }));
}
export function applicationsOverTime(cases, from, to) {
  const rows = [];
  const cursor = new Date(`${from}T12:00:00Z`);
  const end = new Date(`${to}T12:00:00Z`);
  if (
    !Number.isFinite(cursor.getTime()) ||
    !Number.isFinite(end.getTime()) ||
    cursor > end
  )
    return [];
  // Group long/custom ranges by month to keep charts useful and bounded.
  const monthly = (end - cursor) / 86400000 > 92;
  if (monthly) cursor.setUTCDate(1);
  for (let i = 0; cursor <= end && i < 370; i++) {
    const key = cursor.toISOString().slice(0, monthly ? 7 : 10);
    const matching = cases.filter(
      (item) =>
        dateKey(item.submittedAt).startsWith(key) &&
        dateKey(item.submittedAt) >= from &&
        dateKey(item.submittedAt) <= to,
    );
    rows.push({
      date: key,
      ...Object.fromEntries(
        CASE_CATEGORIES.map((category) => [
          category,
          matching.filter((item) => item.category === category).length,
        ]),
      ),
    });
    if (monthly) cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    else cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return rows;
}
export function reportRange(period, today = dateKey()) {
  const start = new Date(`${today}T12:00:00Z`);
  if (period === "year") {
    start.setUTCMonth(0, 1);
  } else if (period === "3months") start.setUTCMonth(start.getUTCMonth() - 3);
  else start.setUTCDate(start.getUTCDate() - (period === "7" ? 6 : 29));
  return { from: start.toISOString().slice(0, 10), to: today };
}
export function averageProcessingDays(cases) {
  const durations = cases
    .filter((item) => !isOpenCase(item) && item.decidedAt)
    .map(
      (item) =>
        (new Date(item.decidedAt) - new Date(item.submittedAt)) / 86400000,
    )
    .filter((value) => Number.isFinite(value) && value >= 0);
  return durations.length
    ? durations.reduce((sum, value) => sum + value, 0) / durations.length
    : null;
}
export function workloadForTeam(data, teamId, today = dateKey()) {
  const cases = getCasesByTeam(data, teamId);
  const members = data.staffUsers.filter((item) => item.teamId === teamId);
  // Tasks belong to the team of their related case, even when an officer helps another team.
  const tasks = data.staffTasks.filter((task) =>
    cases.some((item) => item.id === task.caseId),
  );
  return {
    members,
    cases,
    active: cases.filter(isOpenCase).length,
    openTasks: tasks.filter((item) => item.status !== "Completed").length,
    overdue: tasks.filter((item) => isTaskOverdue(item, today)).length,
  };
}
export function staffCsv(rows, columns) {
  const quote = (value) => {
    const text = String(value ?? "");
    return `"${(/^[=+@\-\t\r]/.test(text) ? "'" + text : text).replaceAll('"', '""')}"`;
  };
  return [
    columns.map((column) => quote(column.label)).join(","),
    ...rows.map((row) =>
      columns.map((column) => quote(column.value(row))).join(","),
    ),
  ].join("\r\n");
}
