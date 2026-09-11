// Prototype UI permissions. Production APIs must enforce authorisation independently.
export const STAFF_ROLES = {
  Administrator: ["admin:all"],
  "Team Leader": [
    "cases:view",
    "cases:update",
    "cases:assign",
    "tasks:view",
    "tasks:update",
    "tasks:assign",
    "teams:view",
    "reports:view",
  ],
  "Licensing Officer": [
    "cases:view",
    "cases:update",
    "tasks:view",
    "tasks:update",
    "teams:view",
  ],
  Verifier: ["cases:view", "cases:update", "tasks:view", "tasks:update"],
  "Content Manager": ["content:view", "content:update", "content:publish"],
  "Analyst / Read-only": ["cases:view", "reports:view"],
};
export const CASE_CATEGORIES = [
  "Food",
  "Alcohol",
  "Outdoor dining",
  "Verification",
];
export const CASE_STATUSES = [
  "Submitted",
  "In review",
  "Action required",
  "Approved",
  "Declined",
];
export const PRIORITIES = ["Normal", "High", "Urgent"];
export const TASK_TYPES = [
  "Review",
  "Document review",
  "Follow-up",
  "Payment",
  "Callback",
  "Other",
];
export const CONTENT_SECTIONS = [
  "Licensing Guide",
  "Get Started",
  "Learning Centre",
  "Help & FAQs",
  "Resources",
  "Announcements",
];
export const CONTENT_STATUSES = ["Published", "Draft", "Scheduled", "Archived"];
export function hasStaffPermission(user, permission) {
  if (!user || user.status !== "Active") return false;
  const permissions = STAFF_ROLES[user.role] || [];
  return (
    !permission ||
    permissions.includes("admin:all") ||
    permissions.includes(permission)
  );
}
