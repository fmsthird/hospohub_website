import assert from "node:assert/strict";
import { after, test } from "node:test";
import fs from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { createServer } from "vite";
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
after(() => server.close());
const h = React.createElement;
const load = (file) => server.ssrLoadModule(`/src/${file}`);
const { AuthContext } = await load("hooks/useAuth.js");
const { HubContext } = await load("hooks/useHub.js");
const { StaffAuthContext } = await load("hooks/useStaffAuth.js");
const { createStaffSeed } = await load("data/staffMockData.js");
const { hasStaffPermission } = await load("data/staffRoles.js");
const { emptyHub } = await load("services/hubStore.js");
const { hubRoutes } = await load("routes/hubRoutes.js");
const { staffRoutes } = await load("routes/staffRoutes.js");
const { default: PublicLayout } = await load("layouts/PublicLayout.jsx");
const { default: StaffLayout } = await load("layouts/StaffLayout.jsx");
const { default: DashboardLayout } = await load("layouts/DashboardLayout.jsx");
const { default: Home } = await load("pages/Home.jsx");
const { default: Footer } = await load("components/Footer.jsx");
const staffData = createStaffSeed();
const customer = {
  id: "CUS-TEST",
  firstName: "Test",
  lastName: "Customer",
  email: "test@example.com",
};
function render(element, { path = '/', signedIn = false, staffId = 'STF-005' } = {}) {
    const staffUser = staffData.staffUsers.find(user => user.id === staffId);
    return renderToStaticMarkup(h(MemoryRouter, { initialEntries: [path] },
      h(AuthContext.Provider, { value: { user: signedIn ? customer : null, isAuthenticated: signedIn } },
        h(HubContext.Provider, { value: { data: emptyHub(), update: () => true, error: '' } },
          h(StaffAuthContext.Provider, { value: { staffUser, isStaffAuthenticated: true, data: staffData, hasPermission: permission => hasStaffPermission(staffUser, permission), dispatch: () => true, error: '' } }, element)))));
  }
  const links = (html) =>
  [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((match) =>
    match[1].replaceAll("&amp;", "&"),
  );

test("Food verification opens directly and from legacy bookmarks", async () => {
  const { default: Guide } = await load("pages/LicensingGuide.jsx");
  {
    for (const query of [
      "guide=food&tab=verification",
      "guide=verification",
      "type=verification",
    ]) {
      const html = render(h(Guide), {
        path: `/licensing-guide?${query}`,
      });
      for (const text of [
        "Food business registration",
        "Verification for food businesses",
        "Preparing for verification",
        "Separate verification charges",
        "corrective actions",
        "MPI verification guidance",
      ])
        assert.ok(html.includes(text), text);
      assert.doesNotMatch(
        html,
        /Verification requirements<\/button>|guide=verification/,
      );
    }
  }
  for (const query of [
    "guide=unknown&tab=unknown",
    "guide=alcohol&tab=verification",
    "guide=toString",
  ]) {
    const html = render(h(Guide), { path: `/licensing-guide?${query}` });
    assert.match(html, /About/);
    assert.doesNotMatch(html, /Verification for food businesses/);
  }
});

test("food requirement results include verification inside a single service card", async () => {
  const { default: Result } = await load("pages/RequirementsResult.jsx");
  for (const activities of [
    ["Prepare food"],
    ["Serve alcohol"],
    ["Prepare food", "Serve alcohol", "Outdoor dining"],
  ]) {
    const html = render(h(Result), {
      path: {
        pathname: "/requirements-result",
        state: { activities, businessType: "Restaurant" },
      },
    });
    const headings = [...html.matchAll(/<h3[^>]*>(.*?)<\/h3>/g)].map(
      (match) => match[1],
    );
    assert.equal(
      headings.filter((text) => text === "Food business registration").length,
      activities.includes("Prepare food") ? 1 : 0,
    );
    assert.ok(!headings.includes("Food verification"));
    assert.equal(
      links(html).includes("/licensing-guide?guide=food&tab=verification"),
      activities.includes("Prepare food"),
    );
  }
});
test("Home preserves the hero and adds concise journey, service and next-step sections", () => {
  const html = render(h(Home));
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  for (const text of [
    "Hospitality licensing",
    "A clearer path from business idea to approval",
    "Find the information that matches your business",
    "Ready to work out what your business may need?",
    "Tell us about your business",
    "Manage your progress",
    "National Programmes",
    "Host responsibility",
    "Pedestrian access",
    "Verification",
  ])
    assert.ok(html.includes(text), text);
  for (const path of [
    "/get-started",
    "/licensing-guide",
    "/resources",
    ...["food", "alcohol", "outdoor"].map(
      (guide) => `/licensing-guide?guide=${guide}`,
    ),
  ])
    assert.ok(links(html).includes(path), path);
  assert.doesNotMatch(html, /href="\/requirements/);
  assert.doesNotMatch(html, /guide=verification|Verification requirements/);
  assert.match(html, /lg:grid-cols-3/);
  assert.match(html, /sm:grid-cols-2 xl:grid-cols-4/);
});
test("homepage and footer account links follow the existing authenticated state", () => {
  for (const Component of [Home, Footer]) {
    const out = render(h(Component)),
      inside = render(h(Component), { signedIn: true });
    assert.ok(links(out).includes("/create-account"));
    assert.ok(links(inside).includes("/dashboard"));
    assert.ok(!links(inside).includes("/create-account"));
    assert.ok(!links(inside).includes("/login"));
  }
});
test("all footer links resolve to known App/customer/staff routes and valid guide values", () => {
  const source = fs.readFileSync(
    new URL("../src/App.jsx", import.meta.url),
    "utf8",
  );
  const known = new Set(
    [...source.matchAll(/path="([^"]+)"/g)].map((match) => match[1]),
  );
  hubRoutes.forEach((route) => known.add(route.path));
  known.add("/staff/login");
  for (const signedIn of [false, true]) {
    const html = render(h(Footer), { signedIn });
    assert.doesNotMatch(html, /href="#"|href="https?:/);
    for (const link of links(html)) {
      const url = new URL(link, "https://example.test");
      assert.ok(known.has(url.pathname), link);
      if (url.searchParams.has("guide"))
        assert.ok(
          ["food", "alcohol", "outdoor"].includes(
            url.searchParams.get("guide"),
          ),
        );
    }
    assert.equal(
      links(html).filter((path) => path.startsWith("/staff")).length,
      1,
    );
    assert.ok(links(html).includes("/privacy"));
    assert.ok(links(html).includes("/terms"));
    assert.ok(!links(html).includes("/accessibility"));
  }
});
test("all public pages share the footer and use the light interface", async () => {
  for (const [file, path, props] of [
    ["Home", "/"],
    ["GetStarted", "/get-started"],
    ["NewBusiness", "/get-started/new-business"],
    ["BuyingBusiness", "/get-started/buying-business"],
    ["ChangingBusiness", "/get-started/changing-business"],
    ["LicensingGuide", "/licensing-guide"],
    ["LearningCentre", "/learning-centre"],
    ["Resources", "/resources"],
    ["HelpSupport", "/help"],
    ["HelpAssistant", "/help/assistant"],
    ["CallbackRequest", "/help/callback"],
    ["HelpFaqs", "/help/faqs"],
    ["Login", "/login"],
    ["CreateAccount", "/create-account"],
    ["AccountInformation", "/privacy", { type: "privacy" }],
    ["AccountInformation", "/terms", { type: "terms" }],
    ["AccountInformation", "/forgot-password", { type: "recovery" }],
  ]) {
    const { default: Page } = await load(`pages/${file}.jsx`);
    {
      const html = render(h(PublicLayout, null, h(Page, props)), {
        path,
      });
      assert.equal(
        (html.match(/aria-label="Public footer"/g) || []).length,
        1,
        file,
      );
      assert.doesNotMatch(html, /aria-label="Theme"|dark:/);
    }
  }
});
test("all customer and staff pages render without theme controls or a public footer", async () => {
  for (const { path, component: Page, props } of hubRoutes) {
    {
      const url = path.replace(":id", "missing");
      const html = render(
        h(
          Routes,
          null,
          h(Route, { path, element: h(DashboardLayout, null, h(Page, props)) }),
        ),
        { path: url, signedIn: true },
      );
      assert.ok(html.length > 0, path);
      assert.doesNotMatch(html, /aria-label="Theme"|dark:/);
      assert.doesNotMatch(html, /aria-label="Public footer"/);
    }
  }
  for (const { path, component: Page } of staffRoutes) {
    {
      const routePath = "/staff" + (path ? "/" + path : "");
      const url = routePath.replace(":id", staffData.staffCases[0].id);
      const html = render(
        h(
          Routes,
          null,
          h(
            Route,
            { element: h(StaffLayout) },
            h(Route, { path: routePath, element: h(Page) }),
          ),
        ),
        { path: url },
      );
      assert.doesNotMatch(html, /aria-label="Theme"|dark:/);
      assert.doesNotMatch(html, /aria-label="Public footer"/);
    }
  }
});

test("staff sign-in uses the light interface without theme controls", async () => {
  const { default: StaffLogin } = await load("pages/StaffLogin.jsx");
  {
    const html = render(
      h(
        StaffAuthContext.Provider,
        { value: { isStaffAuthenticated: false } },
        h(StaffLogin),
      ),
      { path: "/staff/login" },
    );
    assert.match(html, /Sign in to Hospo Hub/);
    assert.doesNotMatch(html, /aria-label="Theme"|dark:/);
  }
});
test("responsive staff tables label the same records once and preserve restricted actions", async () => {
  const { default: Cases } = await load("components/staff/StaffCaseTable.jsx");
  const item = staffData.staffCases[0];
  const html = render(h(Cases, { cases: [item] }));
  assert.equal((html.match(/<table/g) || []).length, 1);
  assert.match(html, /staff-responsive-table/);
  for (const label of [
    "Case / Business",
    "Assigned officer",
    "Status",
    "Priority",
    "Next action",
  ])
    assert.ok(html.includes(`class="staff-cell-label">${label}</span>`), label);
  const officerHtml = render(
    h(
      Routes,
      null,
      h(
        Route,
        { element: h(StaffLayout) },
        h(Route, { path: "/staff", element: h("p", null, "Dashboard") }),
      ),
    ),
    { path: "/staff", staffId: "STF-001" },
  );
  assert.match(officerHtml, /aria-controls="staff-mobile-navigation"/);
  assert.match(officerHtml, /aria-controls="staff-global-search"/);
  assert.doesNotMatch(officerHtml, /href="\/staff\/users"/);
});
