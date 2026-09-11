import assert from "node:assert/strict";
import { after, test } from "node:test";
import { readFile } from "node:fs/promises";
import { createServer } from "vite";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { helpFaqs } from "../src/data/helpFaqs.js";
import { helpGlossary } from "../src/data/helpGlossary.js";
import { HELP_CATEGORIES, HELP_SERVICES } from "../src/data/helpCategories.js";
import {
  resources,
  resourcesById,
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
} from "../src/data/resources.js";
import { NATIONAL_PROGRAMME_REFERENCES } from "../src/data/nationalProgrammes.js";
import {
  filterHelpTopics,
  readContentFilters,
  contentFilterParams,
} from "../src/utils/helpSearch.js";

const topics = [
  ...helpFaqs.map((item) => ({ ...item, contentType: "faqs" })),
  ...helpGlossary.map((item) => ({ ...item, contentType: "glossary" })),
];
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
after(() => server.close());
const { default: HelpFaqs } = await server.ssrLoadModule(
  "/src/pages/HelpFaqs.jsx",
);
const { default: Resources } = await server.ssrLoadModule(
  "/src/pages/Resources.jsx",
);
const h = React.createElement;
const render = (Page, url) =>
  renderToStaticMarkup(h(MemoryRouter, { initialEntries: [url] }, h(Page)));
const filtered = (query) => {
  const filters = readContentFilters(new URLSearchParams(query));
  return filterHelpTopics(topics, filters.search, filters);
};

test("verification keeps its FAQ IDs, resources and definitions under Food", () => {
  const moved = helpFaqs.filter((item) => item.id.startsWith("verification-"));
  assert.equal(moved.length, 11);
  assert.equal(helpFaqs.length, 125);
  assert.equal(helpGlossary.length, 32);
  assert.equal(resources.length, 57);
  for (const item of moved) {
    assert.equal(item.category, "Food Business");
    assert.equal(item.service, "Food");
    assert.equal(
      item.relatedLinks[0].to,
      "/licensing-guide?guide=food&tab=verification",
    );
  }
  for (const id of [
    "verification-guide",
    "verification-preparation",
    "verification-records",
    "verification-corrective-actions",
    "food-verification",
  ])
    assert.equal(resourcesById[id].category, "Food");
  for (const term of ["Verification", "Verifier", "Corrective action"])
    assert.equal(
      helpGlossary.find((item) => item.term === term).category,
      "Food Business",
    );
  for (const categories of [
    HELP_CATEGORIES,
    HELP_SERVICES,
    RESOURCE_CATEGORIES,
  ])
    assert.ok(!categories.includes("Verification"));
  assert.ok(
    filterHelpTopics(helpFaqs, "verification", {
      category: "Food Business",
      service: "Food",
    }).length >= 11,
  );
  assert.ok(
    filterHelpTopics(resources, "verification", { category: "Food" }).length >=
      5,
  );
});

test("legacy verification filters keep finding food guidance", () => {
  for (const kind of ["help", "resources"]) {
    const filters = readContentFilters(
      new URLSearchParams("category=Verification"),
      kind,
    );
    assert.equal(filters.category, kind === "help" ? "Food Business" : "Food");
    assert.equal(filters.search, "verification");
    assert.ok(
      filterHelpTopics(
        kind === "help" ? topics : resources,
        filters.search,
        filters,
      ).length > 0,
    );
  }
  assert.equal(
    readContentFilters(new URLSearchParams("service=Verification")).service,
    "Food",
  );
  assert.equal(
    readContentFilters(
      new URLSearchParams("category=verification&search=corrective"),
    ).search,
    "corrective",
  );
});

test("all requested knowledge categories have complete answers, stable IDs and valid resource references", () => {
  const minimums = [9, 23, 15, 12, 13, 14, 10, 10, 10, 9];
  HELP_CATEGORIES.forEach((category, index) =>
    assert.ok(
      helpFaqs.filter((item) => item.category === category).length >=
        minimums[index],
      category,
    ),
  );
  assert.equal(new Set(topics.map((item) => item.id)).size, topics.length);
  for (const item of topics) {
    assert.ok(HELP_CATEGORIES.includes(item.category));
    assert.ok(HELP_SERVICES.includes(item.service));
    assert.ok((item.answer || item.definition).length > 80, item.id);
    assert.ok(
      item.keywords.length &&
        item.relatedLinks.length &&
        item.relatedResourceIds.length,
      item.id,
    );
    for (const id of item.relatedResourceIds)
      assert.ok(resourcesById[id], `${item.id}: ${id}`);
  }
  assert.equal(
    new Set(helpGlossary.map((item) => item.term)).size,
    helpGlossary.length,
  );
  for (const term of [
    "Food Act",
    "Manager's certificate",
    "Corrective action",
    "Levy",
    "Application fee",
    "Document Vault",
    "Applicant",
    "Template Food Control Plan",
  ])
    assert.ok(
      helpGlossary.some((item) => item.term === term),
      term,
    );
});

test("FAQ search covers requested topics and all active filters combine", () => {
  for (const search of ["food", "verification", "fees", "documents"])
    assert.ok(filtered(`search=${search}`).length, search);
  for (const category of ["alcohol", "applications"])
    assert.ok(filtered(`category=${category}`).length, category);
  const matches = filtered("search=licence&category=alcohol&type=FAQ");
  assert.ok(matches.length);
  assert.ok(
    matches.every(
      (item) =>
        item.category === "Alcohol Licensing" && item.contentType === "faqs",
    ),
  );
  assert.equal(
    filtered("search=licence&category=alcohol&type=FAQ&service=Food").length,
    0,
  );
  assert.equal(filtered("search=zzzzz-no-match").length, 0);
  assert.equal(filtered("").length, helpFaqs.length);
  assert.equal(
    filtered("type=all").length,
    helpFaqs.length + helpGlossary.length,
  );
  assert.ok(
    filtered("search=NP2&type=glossary").some(
      (item) => item.term === "National Programme",
    ),
  );
  assert.ok(
    filtered("search=unique+identifier&type=glossary").some(
      (item) => item.term === "Application reference",
    ),
  );
});

test("query parameters restore category aliases, type, service, search and glossary letters", () => {
  const values = readContentFilters(
    new URLSearchParams(
      "category=alcohol&type=glossary&search=licence&service=Alcohol&letter=o",
    ),
  );
  assert.equal(values.category, "Alcohol Licensing");
  assert.equal(values.type, "glossary");
  assert.equal(values.letter, "O");
  assert.deepEqual(readContentFilters(contentFilterParams(values)), values);
  const terms = filterHelpTopics(topics, values.search, values);
  assert.deepEqual(
    terms.map((item) => item.term),
    ["Off-licence", "On-licence"],
  );
  assert.equal(
    readContentFilters(new URLSearchParams("type=faqs&letter=A")).letter,
    "",
  );
  assert.equal(
    readContentFilters(new URLSearchParams("type=nonsense&category=nonsense"))
      .type,
    "faqs",
  );
  const resourceValues = readContentFilters(
    new URLSearchParams(
      "category=outdoor&type=official-information&search=space",
    ),
    "resources",
  );
  assert.equal(resourceValues.category, "Outdoor Dining");
  assert.deepEqual(
    readContentFilters(
      contentFilterParams(resourceValues, "resources"),
      "resources",
    ),
    resourceValues,
  );
});

test("FAQ rendering reflects combined filters, calculated counts, glossary and empty state", () => {
  const query = "search=licence&category=alcohol&type=FAQ";
  const matches = filtered(query);
  const html = render(HelpFaqs, `/help/faqs?${query}`);
  assert.equal((html.match(/<details/g) || []).length, matches.length);
  assert.ok(html.includes(`${matches.length} topics`));
  assert.match(html, /Related information/);
  assert.match(html, /Related resources/);
  assert.match(html, /href="\/licensing-guide\?guide=alcohol"/);
  const empty = render(HelpFaqs, "/help/faqs?search=zzzzz-no-match");
  assert.match(empty, /No matching help topics/);
  assert.match(empty, /Clear filters/);
  assert.match(empty, /Browse Resources/);
  assert.doesNotMatch(render(HelpFaqs, "/help/faqs"), /Clear filters/);
  const glossary = render(HelpFaqs, "/help/faqs?type=glossary&letter=O");
  assert.equal(
    (glossary.match(/<details/g) || []).length,
    filtered("type=glossary&letter=O").length,
  );
  assert.match(glossary, /Browse terms A–Z/);
  assert.match(glossary, /disabled=""/);
});

test("resource filters cover categories, tags, resource types and combinations", () => {
  for (const category of RESOURCE_CATEGORIES)
    assert.ok(
      resources.some((item) => item.category === category),
      category,
    );
  for (const type of RESOURCE_TYPES)
    assert.ok(
      resources.some((item) => item.type === type),
      type,
    );
  for (const search of ["site plan", "verification", "NP1"])
    assert.ok(filterHelpTopics(resources, search).length, search);
  for (const category of ["Food", "Alcohol", "Outdoor Dining"]) {
    const matches = filterHelpTopics(resources, "", { category });
    assert.ok(
      matches.length && matches.every((item) => item.category === category),
    );
  }
  const training = filterHelpTopics(resources, "", { type: "Training" });
  assert.ok(
    training.length &&
      training.every((item) => item.type === "Training" && item.internal),
  );
  const official = filterHelpTopics(resources, "", {
    type: "Official information",
    category: "Food",
  });
  assert.ok(official.length && official.every((item) => !item.internal));
  assert.equal(
    filterHelpTopics(resources, "site plan", {
      category: "Alcohol",
      type: "Training",
    }).length,
    0,
  );
});

test("all internal library links resolve to existing public routes and FAQ links have results", () => {
  const routes = new Set([
    "/",
    "/get-started",
    "/get-started/new-business",
    "/get-started/buying-business",
    "/get-started/changing-business",
    "/licensing-guide",
    "/learning-centre",
    "/help",
    "/help/assistant",
    "/help/callback",
    "/help/faqs",
    "/resources",
    "/login",
  ]);
  assert.equal(
    new Set(resources.map((item) => item.id)).size,
    resources.length,
  );
  for (const item of [
    ...resources.filter((item) => item.internal),
    ...topics.flatMap((item) => item.relatedLinks),
  ]) {
    const url = new URL(item.to, "http://hospo.local");
    assert.ok(routes.has(url.pathname), item.to);
    if (url.pathname === "/help/faqs")
      assert.ok(
        filtered(url.searchParams).length,
        `Empty FAQ destination: ${item.to}`,
      );
    if (url.searchParams.has("guide"))
      assert.ok(
        ["food", "alcohol", "outdoor"].includes(url.searchParams.get("guide")),
      );
  }
  for (let index = 0; index < 3; index++)
    assert.equal(
      resourcesById[`national-programme-${index + 1}`].href,
      NATIONAL_PROGRAMME_REFERENCES[index].href,
    );
});

test("external resources use known official hosts and safe new-tab links; personal documents remain private", async () => {
  const html = render(Resources, "/resources");
  const external = resources.filter((item) => !item.internal);
  const hosts = new Set([
    "www.mpi.govt.nz",
    "www.aucklandcouncil.govt.nz",
    "www.worksafe.govt.nz",
    "www.business.govt.nz",
  ]);
  for (const item of external) {
    const url = new URL(item.href);
    assert.equal(url.protocol, "https:");
    assert.ok(hosts.has(url.hostname), item.href);
  }
  const externalTags = html.match(/<a\b[^>]*href="https:[^>]+>/g) || [];
  assert.equal(externalTags.length, external.length);
  assert.ok(
    externalTags.every(
      (tag) =>
        tag.includes('target="_blank"') &&
        tag.includes('rel="noopener noreferrer"'),
    ),
  );
  assert.doesNotMatch(html, /href="\/(documents|forms|training|staff)["/?]/);
  assert.match(html, /Official source/);
  assert.match(html, /Hospo Hub/);
  const pageSource = await readFile(
    new URL("../src/pages/Resources.jsx", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(pageSource, /<a\s/);
});

test("resource result count, empty state and responsive grid render without authentication", () => {
  const filters = readContentFilters(
    new URLSearchParams("category=food&type=official-information"),
    "resources",
  );
  const matches = filterHelpTopics(resources, "", filters);
  const html = render(
    Resources,
    "/resources?category=food&type=official-information",
  );
  assert.equal((html.match(/<article/g) || []).length, matches.length);
  assert.ok(html.includes(`${matches.length} resources`));
  assert.match(html, /sm:grid-cols-2 lg:grid-cols-3/);
  assert.match(
    render(Resources, "/resources?search=zzzzz-no-match"),
    /No resources found/,
  );
  assert.doesNotMatch(render(Resources, "/resources"), /Clear filters/);
  for (const to of [
    "/get-started",
    "/licensing-guide",
    "/learning-centre",
    "/help/faqs",
  ])
    assert.ok(html.includes(`href="${to}"`));
});
