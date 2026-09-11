import assert from "node:assert/strict";
import { after, test } from "node:test";
import { createServer } from "vite";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { helpFaqs } from "../src/data/helpFaqs.js";
import { helpGlossary } from "../src/data/helpGlossary.js";
import { helpAssistantQuestions } from "../src/data/helpAssistantQuestions.js";
import { filterHelpTopics } from "../src/utils/helpSearch.js";
import { formatCallbackRequest } from "../src/utils/callbackRequest.js";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
after(() => server.close());
const { AuthContext } = await server.ssrLoadModule("/src/hooks/useAuth.js");
const { HubContext } = await server.ssrLoadModule("/src/hooks/useHub.js");
const pages = {};
for (const name of [
  "HelpSupport",
  "HelpAssistant",
  "CallbackRequest",
  "HelpFaqs",
])
  pages[name] = (await server.ssrLoadModule(`/src/pages/${name}.jsx`)).default;
const h = React.createElement;
const render = (name, signedIn = false) =>
  renderToStaticMarkup(
    h(
      MemoryRouter,
      null,
      h(
        AuthContext.Provider,
        {
          value: {
            isAuthenticated: signedIn,
            user: signedIn
              ? {
                  firstName: "Sample",
                  lastName: "Owner",
                  email: "sample@example.com",
                }
              : null,
          },
        },
        h(
          HubContext.Provider,
          { value: { data: { applications: [{ id: "PRIVATE-CASE-123" }] } } },
          h(pages[name]),
        ),
      ),
    ),
  );

test("landing retains three separate support destinations and a secondary resource link", () => {
  const html = render("HelpSupport");
  assert.equal((html.match(/<a\b/g) || []).length, 4);
  for (const path of [
    "/help/assistant",
    "/help/callback",
    "/help/faqs",
    "/resources",
  ])
    assert.ok(html.includes(`href="${path}"`));
  assert.doesNotMatch(html, /<form|<input|<details|<button/);
  assert.match(html, /lg:grid-cols-3/);
});
test("each support destination is public and has a back link", () => {
  for (const name of ["HelpAssistant", "CallbackRequest", "HelpFaqs"]) {
    for (const signedIn of [false, true]) {
      const html = render(name, signedIn);
      assert.match(html, /href="\/help"/);
      assert.match(html, /<h1/);
      assert.match(html, /Back to Help/);
    }
  }
  assert.doesNotMatch(render("HelpAssistant"), /<form|<details/);
  assert.doesNotMatch(
    render("CallbackRequest"),
    /<details|What licence do I need/,
  );
  assert.doesNotMatch(render("HelpFaqs"), /Preview request|<form/);
});
test("complete content was retained in shared data", () => {
  assert.ok(helpFaqs.length >= 125);
  assert.ok(helpGlossary.length >= 32);
  assert.equal(helpAssistantQuestions.length, 6);
  assert.deepEqual(
    [...new Set(helpFaqs.map((item) => item.category))],
    [
      "Getting Started",
      "Food Business",
      "Verification",
      "Alcohol Licensing",
      "Outdoor Dining",
      "Fees & Payments",
      "Applications",
      "Documents",
      "Learning Centre",
      "My Hub",
      "Help & Support",
    ],
  );
  assert.ok(helpFaqs.every((item) => item.answer.length > 50));
  assert.equal(
    new Set(helpFaqs.map((item) => item.question)).size,
    helpFaqs.length,
  );
});
test("search matches category, question, answer, glossary term and definition", () => {
  const faqs = helpFaqs.map((item) => ({
    category: item.category,
    title: item.question,
    text: item.answer,
  }));
  const glossary = helpGlossary.map((item) => ({
    category: item.category,
    title: item.term,
    text: item.definition,
  }));
  assert.ok(filterHelpTopics(faqs, "  GETTING STARTED  ").length >= 5);
  assert.ok(filterHelpTopics(faqs, "automatically approve").length);
  assert.ok(filterHelpTopics(faqs, "risk-based measure").length);
  assert.equal(
    filterHelpTopics(glossary, "Application reference")[0].title,
    "Application reference",
  );
  assert.ok(filterHelpTopics(glossary, "unique identifier").length);
  assert.equal(filterHelpTopics(faqs, "zzzz-not-a-topic").length, 0);
  assert.equal(filterHelpTopics(glossary, "").length, helpGlossary.length);
});
test("FAQ page starts with FAQ accordions, not mixed glossary results", () => {
  const html = render("HelpFaqs");
  assert.equal((html.match(/<details/g) || []).length, helpFaqs.length);
  assert.equal((html.match(/<summary/g) || []).length, helpFaqs.length);
  assert.match(html, /aria-pressed="true"[^>]*>FAQs/);
});
test("callback prefill and application suggestions are only exposed to authenticated users", () => {
  const visitor = render("CallbackRequest");
  assert.doesNotMatch(
    visitor,
    /sample@example.com|Sample Owner|PRIVATE-CASE-123/,
  );
  const account = render("CallbackRequest", true);
  for (const value of [
    "Sample Owner",
    "sample@example.com",
    "PRIVATE-CASE-123",
  ])
    assert.ok(account.includes(value));
  for (const value of [
    "Morning",
    "Afternoon",
    "No preference",
    "Verification",
    "Fees and payments",
  ])
    assert.ok(account.includes(value));
  assert.match(account, /Preview request/);
});
test("callback download includes all request fields and never claims submission", () => {
  const fields = {
    name: "Sample",
    phone: "021000000",
    email: "sample@example.com",
    reference: "HH-1",
    topic: "Verification",
    time: "Morning",
    message: "Please help with my records.",
  };
  const output = formatCallbackRequest(fields);
  assert.match(output, /has not been submitted to Auckland Council/);
  for (const [key, value] of Object.entries(fields))
    assert.ok(output.includes(`${key}: ${value}`));
  assert.ok(output.includes("\n"));
});
