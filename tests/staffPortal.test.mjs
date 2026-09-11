import assert from "node:assert/strict";
import { after, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { createServer } from "vite";
import { createPrototypeAuth } from "../src/services/authService.js";
import {
  createStaffAuth,
  STAFF_SESSION_KEY,
  staffDestination,
} from "../src/services/staffAuthService.js";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
after(() => server.close());
const { createStaffSeed, staffChargeAmount } = await server.ssrLoadModule(
  "/src/data/staffMockData.js",
);
const {
  applyStaffAction,
  readStaffData,
  writeStaffData,
  STAFF_DATA_KEY,
  nextStaffId,
} = await server.ssrLoadModule("/src/services/staffStore.js");
const { STAFF_ROLES, hasStaffPermission } = await server.ssrLoadModule(
  "/src/data/staffRoles.js",
);
const helpers = await server.ssrLoadModule("/src/utils/staffDataHelpers.js");
const { FEE_DATA } = await server.ssrLoadModule("/src/data/licensingFees.js");
const { StaffAuthContext } = await server.ssrLoadModule(
  "/src/hooks/useStaffAuth.js",
);
const { AuthContext } = await server.ssrLoadModule("/src/hooks/useAuth.js");
const { staffRoutes } = await server.ssrLoadModule(
  "/src/routes/staffRoutes.js",
);
const { default: Guard } = await server.ssrLoadModule(
  "/src/components/staff/StaffProtectedRoute.jsx",
);
const { default: Layout } = await server.ssrLoadModule(
  "/src/layouts/StaffLayout.jsx",
);
const { default: Login } = await server.ssrLoadModule(
  "/src/pages/StaffLogin.jsx",
);
const { StaffRouter } = await server.ssrLoadModule(
  "/src/pages/StaffPortal.jsx",
);
const { default: CustomerGuard } = await server.ssrLoadModule(
  "/src/components/ProtectedRoute.jsx",
);
const h = React.createElement;
const now = "2026-09-11T00:00:00Z";
const memory = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    dump: () => [...values],
  };
};
const admin = "STF-005";
const officer = "STF-001";
const newUser = {
  firstName: "Aroha",
  lastName: "Test",
  email: "aroha.test@council.example.nz",
  phone: "09 555 0111",
  role: "Licensing Officer",
  teamId: "TEAM-FOOD",
  status: "Active",
};

test("staff seed has one linked dataset, deterministic cases, and no secret fields", () => {
  const data = createStaffSeed();
  assert.equal(data.staffCases.length, 28);
  for (const item of data.staffCases) {
    assert.ok(data.staffTeams.some((team) => team.id === item.teamId));
    assert.ok(
      !item.assignedOfficerId ||
        data.staffUsers.some((user) => user.id === item.assignedOfficerId),
    );
    assert.ok(item.history.length > 0);
  }
  for (const task of data.staffTasks) {
    assert.ok(data.staffCases.some((item) => item.id === task.caseId));
    assert.ok(data.staffUsers.some((user) => user.id === task.assignedTo));
    assert.ok(data.staffUsers.some((user) => user.id === task.assignedBy));
  }
  for (const notification of data.staffNotifications) {
    assert.ok(data.staffUsers.some((user) => user.id === notification.staffId));
    assert.ok(
      !notification.relatedId ||
        [...data.staffCases, ...data.staffTasks].some(
          (item) => item.id === notification.relatedId,
        ),
    );
  }
  for (const content of data.staffContent)
    assert.ok(data.staffUsers.some((user) => user.id === content.updatedBy));
  assert.doesNotMatch(
    JSON.stringify(data),
    /password|passwordHash|passwordHint|securityAnswer/i,
  );
  assert.equal(
    staffChargeAmount(data.staffCases[0]),
    Math.round(
      (FEE_DATA.food.levy.amount + FEE_DATA.food.collectionFee.amount) * 100,
    ) / 100,
  );
  assert.equal(
    staffChargeAmount(data.staffCases[1]),
    FEE_DATA.alcohol.riskLevels.medium.application,
  );
});

test("prototype staff and customer sessions coexist, remember separately, and logout independently", () => {
  const local = memory(),
    session = memory();
  const data = createStaffSeed();
  const customer = createPrototypeAuth(local, session);
  const user = customer.register({
    firstName: "Customer",
    lastName: "Test",
    email: "customer@example.com",
    businessName: "Test Cafe",
  });
  const staff = createStaffAuth(local, session, () => data);
  assert.equal(staff.getUser(), null);
  assert.throws(
    () => staff.login({ email: user.email }),
    /active prototype staff/,
  );
  assert.throws(
    () => staff.login({ email: "noah.wilson@council.example.nz" }),
    /active prototype staff/,
  );
  staff.login({
    email: " JANE.SMITH@COUNCIL.EXAMPLE.NZ ",
    password: "NeverStoreThis",
    remember: true,
  });
  assert.deepEqual(JSON.parse(local.getItem(STAFF_SESSION_KEY)), {
    staffId: officer,
  });
  assert.equal(customer.getUser().id, user.id);
  assert.doesNotMatch(JSON.stringify(local.dump()), /NeverStoreThis|password/);
  staff.logout();
  assert.equal(staff.getUser(), null);
  assert.equal(customer.getUser().id, user.id);
  customer.logout();
  staff.login({ email: "emma.taylor@council.example.nz" });
  assert.equal(local.getItem(STAFF_SESSION_KEY), null);
  assert.equal(JSON.parse(session.getItem(STAFF_SESSION_KEY)).staffId, admin);
  assert.equal(customer.getUser(), null);
});

test("admin provisions, edits, deactivates and reactivates an identity while preserving historical ownership", () => {
  let data = createStaffSeed();
  const local = memory(),
    session = memory();
  data = applyStaffAction(
    data,
    admin,
    { type: "user:create", user: { ...newUser, password: "DoNotStore" } },
    now,
  );
  assert.equal(nextStaffId(data), "STF-008");
  const created = data.staffUsers.find((user) => user.email === newUser.email);
  assert.equal(created.id, "STF-007");
  assert.equal(created.password, undefined);
  data = applyStaffAction(
    data,
    admin,
    {
      type: "case:assign",
      id: "APP-2026-1042",
      teamId: "TEAM-FOOD",
      officerId: created.id,
    },
    now,
  );
  data = applyStaffAction(
    data,
    admin,
    {
      type: "user:update",
      id: created.id,
      user: { role: "Team Leader", phone: "09 555 0999" },
    },
    now,
  );
  const auth = createStaffAuth(local, session, () => data);
  auth.login({ email: created.email });
  assert.equal(auth.getUser().role, "Team Leader");
  data = applyStaffAction(
    data,
    admin,
    { type: "user:update", id: created.id, user: { status: "Inactive" } },
    now,
  );
  assert.equal(auth.getUser(), null);
  assert.equal(session.getItem(STAFF_SESSION_KEY), null);
  assert.equal(data.staffCases[0].assignedOfficerId, created.id);
  assert.throws(() => auth.login({ email: created.email }), /active prototype/);
  data = applyStaffAction(
    data,
    admin,
    { type: "user:update", id: created.id, user: { status: "Active" } },
    now,
  );
  assert.equal(auth.login({ email: created.email }).id, created.id);
  writeStaffData(local, data);
  assert.equal(readStaffData(local).staffUsers.length, 7);
  assert.doesNotMatch(local.getItem(STAFF_DATA_KEY), /password|DoNotStore/);
});

test("account validation rejects duplicates and protects the last active administrator", () => {
  const data = createStaffSeed();
  for (const user of [
    { ...newUser, email: "bad" },
    { ...newUser, email: data.staffUsers[0].email },
    { ...newUser, role: "Superuser" },
    { ...newUser, teamId: "missing" },
    { ...newUser, id: "STF-001" },
  ])
    assert.throws(() =>
      applyStaffAction(data, admin, { type: "user:create", user }, now),
    );
  assert.throws(
    () =>
      applyStaffAction(
        data,
        admin,
        { type: "user:update", id: admin, user: { role: "Licensing Officer" } },
        now,
      ),
    /at least one/,
  );
  assert.throws(
    () =>
      applyStaffAction(
        data,
        admin,
        { type: "user:update", id: admin, user: { status: "Inactive" } },
        now,
      ),
    /current account/,
  );
});

test("central role permissions guard actions, including assignment and user management", () => {
  const data = createStaffSeed();
  const jane = data.staffUsers.find((user) => user.id === officer);
  assert.equal(hasStaffPermission(jane, "cases:view"), true);
  assert.equal(hasStaffPermission(jane, "users:manage"), false);
  assert.equal(
    hasStaffPermission(
      { ...jane, role: "Analyst / Read-only" },
      "cases:update",
    ),
    false,
  );
  for (const action of [
    { type: "user:create", user: newUser },
    {
      type: "case:assign",
      id: data.staffCases[0].id,
      teamId: "TEAM-FOOD",
      officerId: officer,
    },
    { type: "task:assign", id: "TASK-001", assignedTo: officer },
    { type: "settings:save", systemName: "Disallowed" },
    { type: "content:save", item: data.staffContent[0] },
  ])
    assert.throws(
      () => applyStaffAction(data, officer, action, now),
      /role does not allow/,
    );
  assert.throws(
    () =>
      applyStaffAction(
        data,
        officer,
        { type: "task:complete", id: "TASK-002" },
        now,
      ),
    /assigned officer/,
  );
  assert.throws(
    () =>
      applyStaffAction(data, "STF-006", { type: "notification:readAll" }, now),
    /active staff/,
  );
  assert.throws(
    () =>
      applyStaffAction(
        data,
        admin,
        {
          type: "case:assign",
          id: data.staffCases[0].id,
          teamId: "TEAM-FOOD",
          officerId: "STF-006",
        },
        now,
      ),
    /active staff member/,
  );
  assert.throws(
    () =>
      applyStaffAction(
        data,
        admin,
        {
          type: "case:assign",
          id: data.staffCases[0].id,
          teamId: "TEAM-FOOD",
          officerId: "STF-002",
        },
        now,
      ),
    /selected team/,
  );
  const changed = applyStaffAction(
    data,
    officer,
    {
      type: "profile:update",
      id: officer,
      user: { firstName: "Janet", role: "Administrator" },
    },
    now,
  );
  assert.equal(changed.staffUsers[0].firstName, "Janet");
  assert.equal(changed.staffUsers[0].role, "Licensing Officer");
});

test("case changes update summaries, workloads, notifications, history and report outcomes together", () => {
  let data = createStaffSeed();
  const original = helpers.getCaseCounts(data, data.staffCases, "2026-09-11");
  data = applyStaffAction(
    data,
    admin,
    {
      type: "case:assign",
      id: "APP-2026-1044",
      teamId: "TEAM-FOOD",
      officerId: officer,
    },
    now,
  );
  assert.ok(
    helpers
      .getCasesByOfficer(data, officer)
      .some((item) => item.id === "APP-2026-1044"),
  );
  assert.ok(
    helpers
      .workloadForTeam(data, "TEAM-FOOD")
      .cases.some((item) => item.id === "APP-2026-1044"),
  );
  assert.equal(helpers.getUnreadNotifications(data, officer).length, 2);
  data = applyStaffAction(
    data,
    officer,
    {
      type: "case:status",
      id: "APP-2026-1044",
      status: "Approved",
      priority: "Normal",
      nextAction: "None",
    },
    now,
  );
  const counts = helpers.getCaseCounts(data, data.staffCases, "2026-09-11");
  assert.equal(counts.total, original.total);
  assert.equal(counts.Approved, original.Approved + 1);
  assert.equal(counts.Submitted, original.Submitted - 1);
  const filtered = helpers.filterStaffCases(
    data,
    { status: "Approved" },
    officer,
  );
  assert.equal(filtered.length, counts.Approved);
  assert.ok(helpers.averageProcessingDays(filtered) > 0);
  assert.equal(
    data.staffCases.find((item) => item.id === "APP-2026-1044").decidedAt,
    now,
  );
  const timeline = helpers.applicationsOverTime(
    data.staffCases,
    "2026-08-01",
    "2026-09-11",
  );
  assert.equal(
    timeline.reduce(
      (sum, row) =>
        sum + row.Food + row.Alcohol + row["Outdoor dining"] + row.Verification,
      0,
    ),
    data.staffCases.length,
  );
});

test("tasks complete and reassign consistently, notifications are scoped to their recipient", () => {
  let data = createStaffSeed();
  const count = helpers.getOpenTasksForStaff(data, officer).length;
  assert.deepEqual(
    helpers.getTaskCounts(
      data.staffTasks.filter((task) => task.assignedTo === officer),
      "2026-09-11",
    ),
    { open: 3, today: 1, overdue: 1, completed: 1 },
  );
  data = applyStaffAction(
    data,
    officer,
    { type: "task:complete", id: "TASK-005" },
    now,
  );
  assert.equal(helpers.getOpenTasksForStaff(data, officer).length, count - 1);
  assert.equal(
    helpers.getTaskCounts(
      data.staffTasks.filter((task) => task.assignedTo === officer),
      "2026-09-11",
    ).overdue,
    0,
  );
  assert.equal(
    data.staffTasks.find((task) => task.id === "TASK-005").completedAt,
    now,
  );
  data = applyStaffAction(
    data,
    admin,
    { type: "task:assign", id: "TASK-001", assignedTo: "STF-002" },
    now,
  );
  assert.equal(helpers.getOpenTasksForStaff(data, officer).length, count - 2);
  const notification = data.staffNotifications.find(
    (item) => item.relatedId === "TASK-001" && item.staffId === "STF-002",
  );
  assert.ok(notification);
  assert.throws(
    () =>
      applyStaffAction(
        data,
        officer,
        { type: "notification:read", id: notification.id },
        now,
      ),
    /not found/,
  );
  data = applyStaffAction(
    data,
    "STF-002",
    { type: "notification:read", id: notification.id },
    now,
  );
  assert.equal(
    data.staffNotifications.find((item) => item.id === notification.id).read,
    true,
  );
  assert.equal(helpers.getUnreadNotifications(data, officer).length, 1);
});

test("internal notes never enter applicant messages; requests and document reviews record real local events", () => {
  let data = createStaffSeed();
  data = applyStaffAction(
    data,
    officer,
    { type: "case:note", id: "APP-2026-1042", text: "Private review note" },
    now,
  );
  assert.equal(data.staffCases[0].notes[0].text, "Private review note");
  assert.equal(data.staffCases[0].messages.length, 0);
  data = applyStaffAction(
    data,
    officer,
    {
      type: "case:request",
      id: "APP-2026-1042",
      text: "Please clarify the site layout.",
    },
    now,
  );
  assert.equal(data.staffCases[0].status, "Action required");
  assert.equal(data.staffCases[0].messages[0].localOnly, true);
  assert.doesNotMatch(
    JSON.stringify(data.staffCases[0].messages),
    /Private review note/,
  );
  data = applyStaffAction(
    data,
    officer,
    {
      type: "document:review",
      caseId: "APP-2026-1042",
      id: "DOC-STAFF-001",
      status: "Accepted",
    },
    now,
  );
  assert.equal(data.staffCases[0].documents[0].reviewStatus, "Accepted");
  assert.equal(data.staffCases[0].history.length, 4);
});

test("content saves, scoped preferences and admin settings persist without changing the customer store", () => {
  let data = createStaffSeed();
  data = applyStaffAction(
    data,
    "STF-004",
    {
      type: "content:save",
      item: {
        ...data.staffContent[2],
        body: "Edited guidance draft",
        status: "Published",
      },
    },
    now,
  );
  assert.equal(data.staffContent[2].body, "Edited guidance draft");
  assert.equal(data.staffContent[2].updatedBy, "STF-004");
  data = applyStaffAction(
    data,
    officer,
    { type: "preferences:save", preferences: { taskDue: true } },
    now,
  );
  assert.equal(data.preferences[officer].taskDue, true);
  assert.equal(data.preferences[admin], undefined);
  data = applyStaffAction(
    data,
    admin,
    {
      type: "settings:save",
      systemName: "Demo Staff",
      assignments: data.settings.assignments,
    },
    now,
  );
  const local = memory();
  local.setItem("hospoHub.workspace.v1.customer", "keep");
  writeStaffData(local, data);
  assert.equal(readStaffData(local).settings.systemName, "Demo Staff");
  assert.equal(local.getItem("hospoHub.workspace.v1.customer"), "keep");
  local.setItem(STAFF_DATA_KEY, "invalid");
  assert.throws(() => readStaffData(local), /cannot be read/);
});

test("search, empty reports, NZ dates, exact filters and safe CSV are derived from records", () => {
  const data = createStaffSeed();
  assert.equal(
    helpers.filterStaffCases(data, { q: "HARBOUR KITCHEN" }, officer).length,
    1,
  );
  assert.equal(
    helpers.filterStaffCases(
      data,
      {
        q: "James Lee",
        officer: "me",
        category: "Food",
        from: "2026-09-10",
        to: "2026-09-10",
      },
      officer,
    ).length,
    1,
  );
  assert.ok(
    helpers
      .filterStaffCases(data, { officer: "unassigned" }, officer)
      .every((item) => item.assignedOfficerId === null),
  );
  assert.equal(
    helpers.filterStaffCases(data, { from: "2027-01-01" }, officer).length,
    0,
  );
  assert.equal(helpers.averageProcessingDays([]), null);
  assert.equal(helpers.dateKey("2026-09-10T13:00:00Z"), "2026-09-11");
  assert.match(
    helpers.staffCsv(
      [{ name: '=danger,"x"' }],
      [{ label: "Name", value: (row) => row.name }],
    ),
    /'=danger,""x""/,
  );
});

function render(
  element,
  path,
  staffUser = null,
  data = createStaffSeed(),
  customer = false,
) {
  return renderToStaticMarkup(
    h(
      MemoryRouter,
      { initialEntries: [path] },
      h(
        AuthContext.Provider,
        {
          value: {
            isAuthenticated: customer,
            user: customer ? { id: "customer", firstName: "Customer" } : null,
          },
        },
        h(
          StaffAuthContext.Provider,
          {
            value: {
              data,
              error: "",
              staffUser,
              isStaffAuthenticated: !!staffUser,
              hasPermission: (permission) =>
                hasStaffPermission(staffUser, permission),
              dispatch: () => true,
            },
          },
          element,
        ),
      ),
    ),
  );
}
function pageRoute(route) {
  return h(
    Routes,
    null,
    h(
      Route,
      { element: h(Guard, null, h(Layout)) },
      h(Route, {
        path: `/staff${route.path ? "/" + route.path : ""}`,
        element: h(Guard, { permission: route.permission }, h(route.component)),
      }),
    ),
  );
}
test("every real staff route renders for admin and remains protected from visitors and customer sessions", () => {
  const data = createStaffSeed();
  const emma = data.staffUsers.find((user) => user.id === admin);
  for (const route of staffRoutes) {
    const path = `/staff${route.path ? "/" + route.path.replace(":id", "APP-2026-1042") : ""}`;
    const tree = pageRoute(route);
    assert.equal(render(tree, path), "", path);
    assert.equal(render(tree, path, null, data, true), "", path);
    const output = render(tree, path, emma, data);
    assert.match(output, /Staff navigation/, path);
    assert.match(output, /Sign out/, path);
    assert.doesNotMatch(output, /Access restricted/, path);
    assert.ok(output.includes("<h1"), path);
  }
  assert.equal(
    render(
      h(CustomerGuard, null, h("p", null, "Customer private data")),
      "/documents",
      emma,
      data,
    ),
    "",
  );
});

test("officer and every configured role see only allowed navigation, routes and actions", () => {
  const data = createStaffSeed();
  const jane = data.staffUsers.find((user) => user.id === officer);
  const officerDashboard = render(
    pageRoute(staffRoutes[0]),
    "/staff",
    jane,
    data,
  );
  assert.doesNotMatch(
    officerDashboard,
    /href="\/staff\/(users|content|reports)"/,
  );
  assert.match(officerDashboard, /Staff notifications, 1 unread/);
  for (const role of Object.keys(STAFF_ROLES)) {
    const user = { ...jane, role };
    for (const route of staffRoutes) {
      const output = render(
        pageRoute(route),
        `/staff${route.path ? "/" + route.path.replace(":id", "APP-2026-1042") : ""}`,
        user,
        data,
      );
      assert.equal(
        output.includes("Access restricted"),
        !hasStaffPermission(user, route.permission),
        `${role}: ${route.path}`,
      );
    }
  }
  const detail = render(
    pageRoute(staffRoutes.find((route) => route.path === "cases/:id")),
    "/staff/cases/APP-2026-1042",
    jane,
    data,
  );
  assert.match(detail, /Add internal note/);
  assert.doesNotMatch(detail, />Assign<\/button>/);
});

test("case tabs render populated, missing and empty states without exposing internal notes in messages", () => {
  let data = createStaffSeed();
  data = applyStaffAction(
    data,
    officer,
    {
      type: "case:note",
      id: "APP-2026-1042",
      text: "CONFIDENTIAL_INTERNAL_TEST",
    },
    now,
  );
  const emma = data.staffUsers.find((user) => user.id === admin);
  const route = pageRoute(
    staffRoutes.find((route) => route.path === "cases/:id"),
  );
  for (const tab of [
    "Overview",
    "Application",
    "Documents",
    "Messages",
    "Tasks",
    "Payments",
    "History",
  ]) {
    const output = render(
      route,
      `/staff/cases/APP-2026-1042?tab=${tab}`,
      emma,
      data,
    );
    assert.match(output, /Harbour Kitchen/);
    if (tab === "Messages")
      assert.doesNotMatch(output, /CONFIDENTIAL_INTERNAL_TEST/);
    if (tab === "Overview") assert.match(output, /CONFIDENTIAL_INTERNAL_TEST/);
  }
  assert.match(
    render(route, "/staff/cases/APP-2026-1043?tab=Documents", emma, data),
    /file unavailable/,
  );
  assert.match(
    render(route, "/staff/cases/missing", emma, data),
    /Case not found/,
  );
  const empty = {
    ...data,
    staffCases: [],
    staffTasks: [],
    staffNotifications: [],
    staffContent: [],
  };
  for (const staffRoute of staffRoutes.filter(
    (item) => !["cases/:id", "users"].includes(item.path),
  ))
    assert.doesNotThrow(() =>
      render(
        pageRoute(staffRoute),
        `/staff${staffRoute.path ? "/" + staffRoute.path : ""}`,
        emma,
        empty,
      ),
    );
});

test("login is separate, shows fictional identities, and has no public staff signup", () => {
  const output = render(h(Login), "/staff/login");
  assert.match(output, /Prototype staff login/);
  assert.match(output, /Jane Smith/);
  assert.match(output, /Emma Taylor/);
  assert.doesNotMatch(
    output,
    /Create Staff Account|Create staff account|create-account|Staff navigation/,
  );
  for (const path of [
    "/staff",
    "/staff/cases/APP-2026-1042?tab=Tasks",
    "/staff/reports",
  ])
    assert.equal(staffDestination(path), path);
  for (const path of [
    "https://example.com",
    "//example.com",
    "/login",
    "/staff/login",
    "/staff/../users",
    "/staff\\example.com",
  ])
    assert.equal(staffDestination(path), "/staff");
  assert.equal(
    staffDestination({ pathname: "/staff/cases", search: "?status=Approved" }),
    "/staff/cases?status=Approved",
  );
});

test("actual nested staff router handles its index, login, details and unknown paths", () => {
  const data = createStaffSeed();
  const emma = data.staffUsers.find((user) => user.id === admin);
  const tree = h(
    Routes,
    null,
    h(Route, { path: "/staff/*", element: h(StaffRouter) }),
  );
  assert.match(render(tree, "/staff", emma, data), /Welcome back, Emma/);
  assert.match(
    render(tree, "/staff/cases/APP-2026-1042?tab=Application", emma, data),
    /Submitted application/,
  );
  assert.match(
    render(tree, "/staff/login", null, data),
    /Prototype staff login/,
  );
  assert.equal(render(tree, "/staff/users", null, data, true), "");
  assert.match(
    render(tree, "/staff/unknown", emma, data),
    /Staff page not found/,
  );
  for (const tab of [
    "Profile",
    "Notifications",
    "Teams & Assignments",
    "Workflow",
    "Content",
    "System",
  ]) {
    assert.doesNotThrow(
      () =>
        render(
          tree,
          `/staff/settings?tab=${encodeURIComponent(tab)}`,
          emma,
          data,
        ),
      tab,
    );
  }
});
