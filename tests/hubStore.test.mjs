import assert from "node:assert/strict";
import { test } from "node:test";
import {
  emptyHub,
  readHub,
  writeHub,
  submitForm,
  requirementCategories,
} from "../src/services/hubStore.js";
import {
  seedCustomerStore,
  customerWorkspace,
} from "../src/services/customerStore.js";
import { assignedModules } from "../src/data/trainingModules.js";
import { validateUploadFile } from "../src/services/documentStore.js";
import { authDestination } from "../src/utils/authValidation.js";
const storage = () => {
  const entries = new Map();
  return {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, value),
  };
};

test("saved workspace belongs to one profile and persists across reloads", () => {
  const local = storage();
  const state = emptyHub();
  state.requirements = { categories: ["food"] };
  writeHub(local, "alice", state);
  assert.deepEqual(readHub(local, "alice").requirements.categories, ["food"]);
  assert.equal(readHub(local, "bob").requirements, null);
  assert.equal(readHub(local, null).requirements, null);
  assert.throws(() => writeHub(local, null, state), /Sign in/);
});
test("submission moves a draft into the tracker once without changing unrelated records", () => {
  const state = emptyHub();
  const form = {
    id: "form1",
    category: "food",
    name: "Food Registration",
    status: "Draft",
    createdAt: "2026-09-11",
  };
  state.forms.push(form);
  const result = submitForm(state, form, "2026-09-12", "HH-1");
  assert.equal(state.forms[0].status, "Draft");
  assert.equal(result.forms[0].status, "Submitted");
  assert.equal(result.applications[0].formId, form.id);
  assert.equal(result.payments[0].feeKey, "food.levy");
  assert.equal(result.applications[0].timeline.length, 2);
  assert.deepEqual(submitForm(result, form, "2026-09-13", "HH-2"), result);
});
test("unknown alcohol risk and outdoor charges do not become invented invoices", () => {
  for (const category of ["alcohol", "outdoor"]) {
    const state = emptyHub();
    const form = { id: category, category, name: category, status: "Draft" };
    state.forms.push(form);
    assert.equal(
      submitForm(state, form, "2026-09-11", `HH-${category}`).payments.length,
      0,
    );
  }
});
test("training assignment follows saved categories and existing applications", () => {
  const state = emptyHub();
  state.requirements = { categories: ["food", "food"] };
  state.applications = [{ category: "outdoor" }];
  const modules = assignedModules(requirementCategories(state));
  assert.equal(modules.length, 5);
  assert.ok(modules.every((item) => item.category !== "alcohol"));
  assert.equal(assignedModules([]).length, 0);
  assert.equal(assignedModules(["food", "alcohol", "outdoor"]).length, 8);
});
test("sample records are explicitly marked and scoped to Pauline's business", () => {
  const state = customerWorkspace(seedCustomerStore(), "CUS-001", "BUS-001");
  assert.equal(state.demo, true);
  assert.equal(state.applications.length, 2);
  assert.ok(state.applications.every((item) => item.demo));
  assert.equal(state.licences[0].expiryDate, null);
  assert.equal(state.payments.length, 2);
});
test("local upload validation rejects oversized, empty and unsupported files", () => {
  assert.equal(
    validateUploadFile({ type: "application/pdf", size: 100 }),
    true,
  );
  for (const file of [
    null,
    { type: "text/html", size: 50 },
    { type: "image/png", size: 0 },
    { type: "image/jpeg", size: 11 * 1024 * 1024 },
  ])
    assert.equal(validateUploadFile(file), false);
});
test("all added destinations and case routes survive login without allowing external redirects", () => {
  for (const path of [
    "/forms",
    "/payments",
    "/training",
    "/profile",
    "/settings",
    "/forms/form-123",
    "/my-applications/HH-1",
  ])
    assert.equal(authDestination(path), path);
  for (const path of [
    "//evil.example",
    "/staff/settings",
    "/forms/../../staff",
  ])
    assert.equal(authDestination(path), "/dashboard");
});
