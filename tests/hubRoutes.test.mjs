import assert from "node:assert/strict";
import { after, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { createServer } from "vite";
import { emptyHub } from "../src/services/hubStore.js";
import {
  seedCustomerStore,
  customerWorkspace,
} from "../src/services/customerStore.js";
const demoHub = () =>
  customerWorkspace(seedCustomerStore(), "CUS-001", "BUS-001");
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
after(() => server.close());
const { AuthContext } = await server.ssrLoadModule("/src/hooks/useAuth.js");
const { HubContext } = await server.ssrLoadModule("/src/hooks/useHub.js");
const { hubRoutes } = await server.ssrLoadModule("/src/routes/hubRoutes.js");
const { default: ProtectedRoute } = await server.ssrLoadModule(
  "/src/components/ProtectedRoute.jsx",
);
const { default: DashboardLayout } = await server.ssrLoadModule(
  "/src/layouts/DashboardLayout.jsx",
);
const h = React.createElement;
const user = {
  id: "test",
  firstName: "Test",
  lastName: "User",
  email: "sample@example.com",
  businessName: "Test Cafe",
};
function render(
  element,
  path,
  authenticated,
  data = emptyHub(),
  customer = user,
  businesses = [],
) {
  return renderToStaticMarkup(
    h(
      MemoryRouter,
      { initialEntries: [path] },
      h(
        AuthContext.Provider,
        {
          value: {
            user: authenticated ? customer : null,
            isAuthenticated: authenticated,
            businesses,
            currentBusiness:
              businesses.find((item) => item.id === data.profile.id) || null,
          },
        },
        h(
          HubContext.Provider,
          { value: { data, update: () => true, error: "" } },
          element,
        ),
      ),
    ),
  );
}
test("every real My Hub route blocks visitors and renders for signed-in users", () => {
  for (const { path, component: Page, props } of hubRoutes) {
    const route = h(
      Routes,
      null,
      h(Route, {
        path,
        element: h(
          ProtectedRoute,
          null,
          h(DashboardLayout, null, h(Page, props)),
        ),
      }),
    );
    const url = path.replace(":id", "missing");
    assert.equal(render(route, url, false), "", path);
    const output = render(route, url, true);
    assert.match(output, /My Hub navigation/, path);
    assert.match(output, /Sign out/, path);
    assert.doesNotMatch(output, /href="\/login"/, path);
    assert.doesNotThrow(() => render(route, url, true, demoHub()), path);
  }
});

test("customer routes render each owned business and foreign detail URLs show not found", () => {
  const root = seedCustomerStore();
  for (const customer of root.customerUsers) {
    const businesses = root.businesses.filter(
      (item) => item.ownerId === customer.id,
    );
    for (const business of businesses) {
      const data = customerWorkspace(root, customer.id, business.id);
      for (const { path, component: Page, props } of hubRoutes.filter(
        (route) => !route.path.includes(":id"),
      )) {
        const html = render(
          h(DashboardLayout, null, h(Page, props)),
          path,
          true,
          data,
          customer,
          businesses,
        );
        assert.match(html, new RegExp(customer.firstName), path);
        assert.match(html, new RegExp(business.businessName), path);
        if (customer.id !== "CUS-001")
          assert.doesNotMatch(
            html,
            /Pauline|Harbour Table|APP-2026-2001|APP-2026-2002/,
            path,
          );
        if (business.id === "BUS-004")
          assert.doesNotMatch(html, /ALC-2026-020|15 Nov 2026/, path);
        if (path === "/dashboard" && customer.id === "CUS-001")
          assert.match(html, /816\.50/);
        if (path === "/documents" && business.id === "BUS-003")
          assert.match(html, /ALC-2026-020/);
      }
      for (const routePath of ["/my-applications/:id", "/forms/:id"]) {
        const { component: Page } = hubRoutes.find(
          (route) => route.path === routePath,
        );
        const route = h(
          Routes,
          null,
          h(Route, { path: routePath, element: h(Page) }),
        );
        const foreignId = routePath.startsWith("/forms")
          ? "FORM-001"
          : "APP-2026-2001";
        const url = routePath.replace(":id", foreignId);
        const html = render(route, url, true, data, customer, businesses);
        if (customer.id !== "CUS-001") assert.match(html, /not found/);
        else assert.match(html, /Food Business Registration/);
      }
    }
  }
});
test("public informational pages render without authentication", async () => {
  for (const [name, path] of [
    ["Home", "/"],
    ["GetStarted", "/get-started"],
    ["NewBusiness", "/get-started/new-business"],
    ["BuyingBusiness", "/get-started/buying-business"],
    ["ChangingBusiness", "/get-started/changing-business"],
    ["LicensingGuide", "/licensing-guide"],
    ["LearningCentre", "/learning-centre"],
    ["Resources", "/resources"],
    ["HelpSupport", "/help"],
  ]) {
    const { default: Page } = await server.ssrLoadModule(
      `/src/pages/${name}.jsx`,
    );
    const html = render(h(Page), path, false);
    assert.ok(html.includes("<h1"), name);
    assert.doesNotMatch(html, /Prototype workspace/, name);
  }
});
test("verification query shows the new public guide", async () => {
  const { default: Page } = await server.ssrLoadModule(
    "/src/pages/LicensingGuide.jsx",
  );
  assert.match(
    render(h(Page), "/licensing-guide?guide=verification", false),
    /Be ready to show how your business keeps food safe/,
  );
});
test("public Learning Centre shows no personal progress; signed-in users get the training link", async () => {
  const { default: Page } = await server.ssrLoadModule(
    "/src/pages/LearningCentre.jsx",
  );
  const publicHtml = render(h(Page), "/learning-centre", false);
  assert.doesNotMatch(publicHtml, /<progress|href="\/training"/);
  assert.match(render(h(Page), "/learning-centre", true), /href="\/training"/);
});
