import { createStaffSeed } from "../data/staffMockData.js";
import {
  STAFF_ROLES,
  CASE_STATUSES,
  PRIORITIES,
  CONTENT_SECTIONS,
  CONTENT_STATUSES,
  TASK_TYPES,
  hasStaffPermission,
} from "../data/staffRoles.js";
export const STAFF_DATA_KEY = "hospoHub.staff.workspace.v1";
const userFields = [
  "id",
  "firstName",
  "lastName",
  "email",
  "role",
  "teamId",
  "status",
  "phone",
  "lastActive",
  "availability",
];
export function safeStaffUser(value) {
  const user = Object.fromEntries(
    userFields.map((key) => [
      key,
      typeof value[key] === "string" ? value[key] : "",
    ]),
  );
  return {
    ...user,
    permissions: user.status === "Active" ? STAFF_ROLES[user.role] || [] : [],
  };
}
export function readStaffData(storage) {
  const raw = storage.getItem(STAFF_DATA_KEY);
  if (!raw) return createStaffSeed();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(
      "The saved staff workspace cannot be read. Restore a valid workspace or clear only the staff workspace in your browser settings.",
    );
  }
  if (
    data?.version !== 1 ||
    [
      "staffUsers",
      "staffTeams",
      "staffCases",
      "staffTasks",
      "staffNotifications",
      "staffContent",
    ].some((key) => !Array.isArray(data[key]))
  )
    throw new Error("The saved staff workspace has an unsupported format.");
  return {
    ...data,
    staffUsers: data.staffUsers.map(safeStaffUser),
    preferences: data.preferences || {},
    settings: data.settings || createStaffSeed().settings,
  };
}
export function writeStaffData(storage, data) {
  storage.setItem(
    STAFF_DATA_KEY,
    JSON.stringify({ ...data, staffUsers: data.staffUsers.map(safeStaffUser) }),
  );
}
export function nextStaffId(data) {
  return `STF-${String(Math.max(0, ...data.staffUsers.map((user) => Number(user.id.match(/^STF-(\d+)$/)?.[1]) || 0)) + 1).padStart(3, "0")}`;
}
function requireValue(value, message) {
  if (!value) throw new Error(message);
}
function requiredText(value, label, max = 10000) {
  requireValue(
    typeof value === "string" &&
      value.trim().length > 0 &&
      value.trim().length <= max,
    `${label} is required (maximum ${max} characters).`,
  );
  return value.trim();
}
export function validateStaffUser(data, input, existingId) {
  const result = safeStaffUser(input);
  result.id = existingId || input.id?.trim() || nextStaffId(data);
  result.firstName = requiredText(input.firstName, "First name", 80);
  result.lastName = requiredText(input.lastName, "Last name", 80);
  result.email = requiredText(input.email, "Council email", 254).toLowerCase();
  requireValue(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email),
    "Enter a valid council email.",
  );
  requireValue(
    /^STF-\d{3,}$/.test(result.id),
    "Staff ID must use STF- followed by at least three digits.",
  );
  requireValue(
    !data.staffUsers.some(
      (user) =>
        user.id !== existingId &&
        (user.id === result.id || user.email.toLowerCase() === result.email),
    ),
    "This staff ID or email is already in use.",
  );
  requireValue(
    Object.hasOwn(STAFF_ROLES, result.role),
    "Choose a valid staff role.",
  );
  requireValue(
    data.staffTeams.some((team) => team.id === result.teamId),
    "Choose a valid team.",
  );
  requireValue(
    ["Active", "Inactive"].includes(result.status),
    "Choose Active or Inactive.",
  );
  requireValue(
    !result.phone || /^[+\d\s()-]{5,30}$/.test(result.phone),
    "Enter a valid phone number or leave it blank.",
  );
  return safeStaffUser({
    ...result,
    availability:
      result.status === "Active"
        ? input.availability || "Available"
        : "Unavailable",
  });
}
// All UI writes pass through these permission checks and relationship validation.
// This remains a browser prototype, not a secure authorisation boundary.
export function applyStaffAction(
  data,
  staffId,
  action,
  now = new Date().toISOString(),
) {
  const user = data.staffUsers.find((item) => item.id === staffId);
  requireValue(
    user?.status === "Active",
    "Sign in with an active staff account.",
  );
  const allow = (permission) =>
    requireValue(
      hasStaffPermission(user, permission),
      "Your staff role does not allow this action.",
    );
  const next = structuredClone(data);
  const eventId = (prefix) => `${prefix}-${crypto.randomUUID()}`;
  const findCase = (id) => {
    const item = next.staffCases.find((row) => row.id === id);
    requireValue(item, "Case not found.");
    return item;
  };
  const activeOfficer = (id) => {
    const officer = next.staffUsers.find((item) => item.id === id);
    requireValue(
      officer?.status === "Active" &&
        hasStaffPermission(officer, "cases:update"),
      "Choose an active staff member who can work on cases.",
    );
    return officer;
  };
  const history = (item, title) => {
    item.updatedAt = now;
    item.history.push({ id: eventId("EVT"), title, at: now, staffId });
  };
  const notify = (recipient, type, title, message, relatedId) => {
    if (recipient)
      next.staffNotifications.unshift({
        id: eventId("NOT"),
        staffId: recipient,
        type,
        title,
        message,
        relatedId,
        read: false,
        createdAt: now,
      });
  };
  switch (action.type) {
    case "user:create": {
      allow("users:manage");
      // Prototype staff account only.
      // Production staff provisioning must use the council identity/authentication service.
      const record = validateStaffUser(next, action.user);
      next.staffUsers.push(record);
      break;
    }
    case "user:update":
    case "profile:update": {
      const existing = next.staffUsers.find((item) => item.id === action.id);
      requireValue(existing, "Staff user not found.");
      const profileOnly = action.type === "profile:update";
      if (profileOnly)
        requireValue(
          action.id === staffId,
          "You can only edit your own profile.",
        );
      else allow("users:manage");
      const input = profileOnly
        ? {
            ...existing,
            ...Object.fromEntries(
              ["firstName", "lastName", "email", "phone"].map((key) => [
                key,
                action.user[key] ?? existing[key],
              ]),
            ),
          }
        : { ...existing, ...action.user };
      const record = validateStaffUser(next, input, existing.id);
      if (record.status === "Active" && existing.status === "Inactive")
        record.availability = "Available";
      requireValue(
        record.id !== staffId || record.status === "Active",
        "You cannot deactivate your current account.",
      );
      requireValue(
        existing.role !== "Administrator" ||
          (record.role === "Administrator" && record.status === "Active") ||
          next.staffUsers.some(
            (item) =>
              item.id !== existing.id &&
              item.role === "Administrator" &&
              item.status === "Active",
          ),
        "Keep at least one active administrator.",
      );
      next.staffUsers = next.staffUsers.map((item) =>
        item.id === record.id ? record : item,
      );
      break;
    }
    case "case:assign": {
      allow("cases:assign");
      const item = findCase(action.id);
      requireValue(
        next.staffTeams.some((team) => team.id === action.teamId),
        "Choose a valid team.",
      );
      const officer = action.officerId ? activeOfficer(action.officerId) : null;
      requireValue(
        !officer || officer.teamId === action.teamId,
        "Choose an officer from the selected team.",
      );
      item.teamId = action.teamId;
      item.assignedOfficerId = officer?.id || null;
      history(
        item,
        `Assigned to ${officer ? `${officer.firstName} ${officer.lastName}` : "team queue"}`,
      );
      notify(
        officer?.id,
        "case",
        "Case assigned",
        `${item.businessName} has been assigned to you.`,
        item.id,
      );
      break;
    }
    case "case:status": {
      allow("cases:update");
      const item = findCase(action.id);
      requireValue(
        CASE_STATUSES.includes(action.status) &&
          PRIORITIES.includes(action.priority),
        "Choose a valid status and priority.",
      );
      const previous = item.status;
      item.status = action.status;
      item.priority = action.priority;
      item.nextAction = requiredText(action.nextAction, "Next action", 300);
      if (!["Approved", "Declined"].includes(item.status))
        item.decidedAt = null;
      else if (previous !== item.status || !item.decidedAt)
        item.decidedAt = now;
      history(
        item,
        `Status: ${previous} → ${item.status}; priority: ${item.priority}; next action: ${item.nextAction}`,
      );
      notify(
        item.assignedOfficerId,
        "case",
        "Case updated",
        `${item.id}: ${item.status}.`,
        item.id,
      );
      break;
    }
    case "case:note":
    case "case:message":
    case "case:request": {
      allow("cases:update");
      const item = findCase(action.id);
      const text = requiredText(
        action.text,
        action.type === "case:note" ? "Internal note" : "Message",
      );
      if (action.type === "case:note") {
        item.notes.push({ id: eventId("NOTE"), text, at: now, staffId });
        history(item, "Internal note added (staff only)");
      } else {
        item.messages.push({
          id: eventId("MSG"),
          text,
          at: now,
          staffId,
          sender: "Council staff",
          localOnly: true,
        });
        if (action.type === "case:request") {
          item.status = "Action required";
          item.decidedAt = null;
          item.nextAction = "Await requested applicant information";
        }
        history(
          item,
          action.type === "case:request"
            ? "Information request saved locally (not sent)"
            : "Applicant message saved locally (not sent)",
        );
      }
      break;
    }
    case "document:review": {
      allow("cases:update");
      const item = findCase(action.caseId);
      const document = item.documents.find((doc) => doc.id === action.id);
      requireValue(document, "Document not found.");
      requireValue(
        ["Awaiting review", "Accepted", "Needs information"].includes(
          action.status,
        ),
        "Choose a review status.",
      );
      document.reviewStatus = action.status;
      history(item, `Document review: ${document.name} — ${action.status}`);
      break;
    }
    case "task:complete":
    case "task:assign": {
      const task = next.staffTasks.find((item) => item.id === action.id);
      requireValue(task, "Task not found.");
      if (action.type === "task:complete") {
        allow("tasks:update");
        requireValue(
          task.assignedTo === staffId ||
            hasStaffPermission(user, "tasks:assign"),
          "Only the assigned officer or an authorised manager can complete this task.",
        );
        if (task.status === "Completed") return data;
        task.status = "Completed";
        task.completedAt = now;
        history(findCase(task.caseId), `Task completed: ${task.title}`);
      } else {
        allow("tasks:assign");
        const officer = activeOfficer(action.assignedTo);
        requireValue(
          hasStaffPermission(officer, "tasks:update"),
          "This staff member cannot manage tasks.",
        );
        task.assignedTo = officer.id;
        task.assignedBy = staffId;
        history(
          findCase(task.caseId),
          `Task reassigned: ${task.title} to ${officer.firstName} ${officer.lastName}`,
        );
        notify(officer.id, "task", "Task assigned", task.title, task.id);
      }
      break;
    }
    case "task:create": {
      allow("tasks:assign");
      const item = findCase(action.caseId);
      const officer = activeOfficer(action.assignedTo);
      requireValue(
        TASK_TYPES.includes(action.taskType) &&
          PRIORITIES.includes(action.priority),
        "Choose a task type and priority.",
      );
      requireValue(
        /^\d{4}-\d{2}-\d{2}$/.test(action.dueDate) &&
          Number.isFinite(Date.parse(action.dueDate)),
        "Enter a due date.",
      );
      const task = {
        id: eventId("TASK"),
        title: requiredText(action.title, "Task title", 180),
        caseId: item.id,
        assignedTo: officer.id,
        assignedBy: staffId,
        type: action.taskType,
        priority: action.priority,
        status: "Open",
        dueDate: action.dueDate,
      };
      next.staffTasks.push(task);
      history(item, `Task created: ${task.title}`);
      notify(officer.id, "task", "Task assigned", task.title, task.id);
      break;
    }
    case "notification:read": {
      const notification = next.staffNotifications.find(
        (item) => item.id === action.id && item.staffId === staffId,
      );
      requireValue(notification, "Notification not found.");
      notification.read = true;
      break;
    }
    case "notification:readAll": {
      next.staffNotifications.forEach((item) => {
        if (item.staffId === staffId) item.read = true;
      });
      break;
    }
    case "content:save": {
      allow("content:update");
      const item = action.item;
      requireValue(
        CONTENT_SECTIONS.includes(item.section) &&
          CONTENT_STATUSES.includes(item.status),
        "Choose a valid section and status.",
      );
      if (["Published", "Scheduled"].includes(item.status))
        allow("content:publish");
      const existing = item.id
        ? next.staffContent.find((row) => row.id === item.id)
        : null;
      requireValue(!item.id || existing, "Content not found.");
      const record = {
        id: existing?.id || eventId("CONTENT"),
        title: requiredText(item.title, "Title", 180),
        section: item.section,
        category: requiredText(item.category, "Category", 80),
        summary: requiredText(item.summary, "Summary", 600),
        body: requiredText(item.body, "Body", 50000),
        status: item.status,
        updatedAt: now,
        updatedBy: staffId,
      };
      if (record.status === "Scheduled") {
        requireValue(
          new Date(item.publishAt).getTime() > new Date(now).getTime(),
          "Choose a future publication date.",
        );
        record.publishAt = item.publishAt;
      }
      if (existing)
        next.staffContent = next.staffContent.map((row) =>
          row.id === record.id ? record : row,
        );
      else next.staffContent.unshift(record);
      break;
    }
    case "preferences:save": {
      const keys = [
        "newCase",
        "information",
        "taskDue",
        "taskOverdue",
        "caseStatus",
        "messages",
      ];
      next.preferences[staffId] = Object.fromEntries(
        keys.map((key) => [key, action.preferences[key] === true]),
      );
      break;
    }
    case "settings:save": {
      allow("settings:manage");
      if (action.assignments) {
        const categories = [
          "Food",
          "Alcohol",
          "Outdoor dining",
          "Verification",
        ];
        requireValue(
          categories.every((category) =>
            next.staffTeams.some(
              (team) => team.id === action.assignments[category],
            ),
          ),
          "Select a team for every application type.",
        );
        next.settings.assignments = Object.fromEntries(
          categories.map((category) => [
            category,
            action.assignments[category],
          ]),
        );
      }
      if (typeof action.contentReview === "boolean")
        next.settings.contentReview = action.contentReview;
      if (action.systemName !== undefined)
        next.settings.systemName = requiredText(
          action.systemName,
          "Portal name",
          80,
        );
      break;
    }
    default:
      throw new Error("Unknown staff action.");
  }
  next.staffUsers = next.staffUsers.map(safeStaffUser);
  return next;
}
