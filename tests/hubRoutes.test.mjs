import assert from "node:assert/strict";
import { after, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { createServer } from "vite";
import { emptyHub, demoHub } from "../src/services/hubStore.js";
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
function render(element, path, authenticated, data = emptyHub()) {
  return renderToStaticMarkup(
    h(
      MemoryRouter,
      { initialEntries: [path] },
      h(
        AuthContext.Provider,
        {
          value: {
            user: authenticated ? user : null,
            isAuthenticated: authenticated,
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
