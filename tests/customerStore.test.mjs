import assert from "node:assert/strict";
import { test } from "node:test";
import { createPrototypeAuth } from "../src/services/authService.js";
import {
  CUSTOMER_STORE_KEY,
  CUSTOMER_SESSION_KEY,
  collections,
  seedCustomerStore,
  readCustomerStore,
  writeCustomerStore,
  customerWorkspace,
  updateCustomerWorkspace,
} from "../src/services/customerStore.js";
import {
  dashboardCounts,
  paymentFee,
  licenceReminders,
  vaultRecords,
} from "../src/services/customerSelectors.js";
import {
  createDraft,
  saveDraft,
  reviewTrainingLesson,
  simulatePayment,
} from "../src/services/customerActions.js";
import {
  emptyHub,
  submitForm,
  hubKey,
  requirementCategories,
} from "../src/services/hubStore.js";
import { assignedModules } from "../src/data/trainingModules.js";
import { FEE_DATA } from "../src/data/licensingFees.js";
const storage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    contents: () => [...values.values()].join(""),
  };
};
const workspace = (root, user = "CUS-001", business = "BUS-001") =>
  customerWorkspace(root, user, business);

test("Pauline has a coherent restaurant journey and all counts come from those records", () => {
  const data = workspace(seedCustomerStore());
  assert.equal(data.profile.businessName, "Harbour Table");
  assert.deepEqual(
    data.applications.map((app) => app.status),
    ["In review", "Action required"],
  );
  const alcohol = data.applications.find((app) => app.category === "alcohol");
  assert.equal(
    data.documents.find((doc) => doc.applicationId === alcohol.id).status,
    "Update required",
  );
  assert.match(
    data.messages.find((message) => message.applicationId === alcohol.id).body,
    /updated licensed-area floor plan/,
  );
  assert.equal(
    data.payments.find((payment) => payment.applicationId === alcohol.id)
      .status,
    "Payment required",
  );
  const counts = dashboardCounts(data, Date.parse("2026-09-11"));
  assert.deepEqual(counts, {
    activeApplications: 2,
    pendingReview: 1,
    activeLicences: 1,
    outstanding: FEE_DATA.alcohol.riskLevels.medium.application,
    unassessed: 0,
    unreadMessages: 1,
    unreadNotifications: 2,
    requiredTraining: 5,
  });
  assert.equal(data.training["food-basics"].progress, 100);
  assert.equal(data.training.host.status, "In progress");
  assert.equal(data.licences[0].expiryDate, null);
  assert.equal(licenceReminders(data).length, 0);
});

test("every seed relationship resolves within its customer and business", () => {
  const root = seedCustomerStore();
  for (const business of root.businesses) {
    const data = workspace(root, business.ownerId, business.id);
    for (const key of collections)
      for (const record of data[key]) {
        assert.equal(record.userId, business.ownerId);
        assert.equal(record.businessId, business.id);
        if (record.applicationId)
          assert.ok(
            data.applications.some((app) => app.id === record.applicationId),
          );
        if (record.formId)
          assert.ok(data.forms.some((form) => form.id === record.formId));
        if (record.licenceId)
          assert.ok(
            data.licences.some((licence) => licence.id === record.licenceId),
          );
        if (record.completionRecordId)
          assert.ok(
            data.completionRecords.some(
              (completion) => completion.id === record.completionRecordId,
            ),
          );
      }
    assert.doesNotThrow(() =>
      updateCustomerWorkspace(
        root,
        business.ownerId,
        business.id,
        (value) => value,
      ),
    );
  }
});

test("James sees his draft and food/outdoor training, never Pauline or alcohol records", () => {
  const data = workspace(seedCustomerStore(), "CUS-002", "BUS-002");
  assert.equal(data.profile.businessName, "City Corner Cafe");
  assert.equal(data.forms[0].status, "In progress");
  assert.equal(data.applications[0].status, "Draft");
  assert.ok(data.requirements.categories.includes("food"));
  assert.equal(assignedModules(requirementCategories(data)).length, 5);
  assert.ok(
    assignedModules(requirementCategories(data)).every(
      (module) => module.category !== "alcohol",
    ),
  );
  assert.doesNotMatch(
    JSON.stringify(data),
    /Pauline|Harbour Table|APP-2026-2001|APP-2026-2002/,
  );
});

test("Olivia switches businesses, persists selection and never brings licences into the other workspace", () => {
  const local = storage(),
    session = storage(),
    auth = createPrototypeAuth(local, session);
  auth.login({ email: "olivia.martin@example.com" });
  assert.equal(auth.getSnapshot().businesses.length, 2);
  let data = workspace(
    readCustomerStore(local),
    "CUS-003",
    auth.getSnapshot().currentBusiness.id,
  );
  assert.equal(data.licences.length, 1);
  assert.equal(licenceReminders(data)[0].dueDate, data.licences[0].expiryDate);
  auth.selectBusiness("BUS-004");
  data = workspace(
    readCustomerStore(local),
    "CUS-003",
    auth.getSnapshot().currentBusiness.id,
  );
  assert.equal(data.profile.businessName, "North Shore Events");
  assert.equal(data.licences.length, 0);
  assert.equal(licenceReminders(data).length, 0);
  assert.equal(
    createPrototypeAuth(local, session).getSnapshot().currentBusiness.id,
    "BUS-004",
  );
  assert.throws(() => auth.selectBusiness("BUS-001"), /not found/);
  auth.logout();
  auth.login({ email: "olivia.martin@example.com" });
  assert.equal(auth.getSnapshot().currentBusiness.id, "BUS-004");
});

test("new accounts are empty, registration preserves existing work and sessions store IDs only", () => {
  const local = storage(),
    session = storage(),
    auth = createPrototypeAuth(local, session);
  const before = readCustomerStore(local).workspaces;
  const user = auth.register({
    firstName: "New",
    lastName: "Customer",
    email: "new@example.com",
    password: "NeverSaveThis",
    confirmPassword: "NeverSaveThis",
    businessName: "New Cafe",
  });
  assert.equal(user.id, "CUS-004");
  const root = readCustomerStore(local);
  const data = workspace(root, user.id, user.preferredBusinessId);
  for (const key of collections) assert.equal(data[key].length, 0, key);
  assert.equal(data.requirements, null);
  assert.deepEqual(data.training, {});
  for (const [id, old] of Object.entries(before))
    assert.deepEqual(root.workspaces[id], old);
  assert.deepEqual(JSON.parse(session.getItem(CUSTOMER_SESSION_KEY)), {
    userId: user.id,
    selectedBusinessId: user.preferredBusinessId,
  });
  assert.doesNotMatch(
    local.contents() + session.contents(),
    /NeverSaveThis|password|confirmPassword/,
  );
});

test("registration without a business stays empty and profile can add a scoped business later", () => {
  const local = storage(),
    session = storage(),
    auth = createPrototypeAuth(local, session);
  const user = auth.register({
    firstName: "New",
    lastName: "Customer",
    email: "no-business@example.com",
  });
  assert.equal(auth.getSnapshot().currentBusiness, null);
  assert.deepEqual(
    workspace(readCustomerStore(local), user.id, null),
    emptyHub(),
  );
  assert.throws(
    () =>
      updateCustomerWorkspace(
        readCustomerStore(local),
        user.id,
        null,
        (data) => data,
      ),
    /Add or select/,
  );
  auth.updateProfile({
    ...user,
    phone: "0210000000",
    businessName: "Fresh Cafe",
    legalName: "Fresh Limited",
    address: "Sample address",
    activities: { food: true },
  });
  const updated = auth.getSnapshot();
  assert.equal(updated.currentBusiness.businessName, "Fresh Cafe");
  const data = workspace(
    readCustomerStore(local),
    user.id,
    updated.currentBusiness.id,
  );
  assert.equal(data.applications.length, 0);
  assert.equal(Object.keys(data.training).length, 3);
  assert.equal(auth.getUser().phone, "0210000000");
});

test("reads and writes reject foreign ownership, IDs and linked records", () => {
  const root = seedCustomerStore();
  assert.equal(workspace(root, "CUS-002", "BUS-001").applications.length, 0);
  assert.throws(
    () => updateCustomerWorkspace(root, "CUS-002", "BUS-001", (data) => data),
    /Add or select/,
  );
  const foreign = workspace(root, "CUS-002", "BUS-002").applications[0];
  assert.throws(
    () =>
      updateCustomerWorkspace(root, "CUS-001", "BUS-001", (data) => ({
        ...data,
        applications: [...data.applications, foreign],
      })),
    /another customer/,
  );
  assert.throws(
    () =>
      updateCustomerWorkspace(root, "CUS-001", "BUS-001", (data) => ({
        ...data,
        documents: [
          ...data.documents,
          { id: "new-doc", applicationId: foreign.id },
        ],
      })),
    /linked record/,
  );
  assert.throws(
    () =>
      updateCustomerWorkspace(root, "CUS-001", "BUS-001", (data) => ({
        ...data,
        applications: [
          ...data.applications,
          { ...foreign, userId: undefined, businessId: undefined },
        ],
      })),
    /another business/,
  );
});

test("a saved draft submits exactly once, retaining the existing application and real history", () => {
  let root = seedCustomerStore();
  const oldPauline = workspace(root);
  const mutate = (change) => {
    root = updateCustomerWorkspace(root, "CUS-002", "BUS-002", change);
  };
  mutate((data) =>
    saveDraft(
      data,
      { ...data.forms[0], description: "Completed outdoor seating plan." },
      "2026-09-12T09:00:00Z",
    ),
  );
  mutate((data) =>
    submitForm(
      data,
      data.forms[0],
      "2026-09-12T09:05:00Z",
      "must-not-be-created",
    ),
  );
  mutate((data) =>
    submitForm(data, data.forms[0], "2026-09-12T09:06:00Z", "also-not-created"),
  );
  const data = workspace(root, "CUS-002", "BUS-002");
  assert.equal(data.applications.length, 1);
  assert.equal(data.applications[0].id, "APP-2026-2003");
  assert.equal(data.applications[0].timeline.length, 2);
  assert.equal(data.applications[0].status, "Submitted");
  assert.equal(data.forms[0].applicationId, "APP-2026-2003");
  assert.equal(data.payments.length, 0);
  assert.deepEqual(workspace(root), oldPauline);
});

test("new drafts and uploads stay linked, without creating issued licences", () => {
  let root = seedCustomerStore();
  root = updateCustomerWorkspace(root, "CUS-002", "BUS-002", (data) =>
    createDraft(
      data,
      {
        id: "FORM-NEW",
        name: "Food registration",
        category: "food",
        status: "In progress",
        createdAt: "2026-09-11",
      },
      "APP-NEW",
    ),
  );
  root = updateCustomerWorkspace(root, "CUS-002", "BUS-002", (data) =>
    submitForm(
      data,
      data.forms.find((form) => form.id === "FORM-NEW"),
      "2026-09-11",
      "APP-NEW",
    ),
  );
  root = updateCustomerWorkspace(root, "CUS-002", "BUS-002", (data) => ({
    ...data,
    documents: [
      ...data.documents,
      {
        id: "DOC-NEW",
        name: "Example.pdf",
        applicationId: "APP-NEW",
        status: "Uploaded",
        hasFile: true,
      },
    ],
  }));
  const data = workspace(root, "CUS-002", "BUS-002");
  assert.equal(data.documents[0].businessId, "BUS-002");
  assert.equal(data.payments[0].applicationId, "APP-NEW");
  assert.equal(paymentFee(data.payments[0]).amount, FEE_DATA.food.levy.amount);
  assert.equal(data.licences.length, 0);
  assert.equal(vaultRecords(data).length, 0);
});

test("completing training creates one reusable record in training and vault only for that business", () => {
  let root = seedCustomerStore();
  const participant = root.customerUsers[0];
  root = updateCustomerWorkspace(root, participant.id, "BUS-001", (data) =>
    reviewTrainingLesson(data, "host", 2, participant, "2026-09-12T09:00:00Z"),
  );
  root = updateCustomerWorkspace(root, participant.id, "BUS-001", (data) =>
    reviewTrainingLesson(data, "host", 2, participant, "2026-09-12T10:00:00Z"),
  );
  const data = workspace(root);
  const record = data.completionRecords.find(
    (item) => item.moduleId === "host",
  );
  assert.equal(data.training.host.completedAt, "2026-09-12T09:00:00Z");
  assert.equal(data.training.host.completionRecordId, record.id);
  assert.equal(
    data.completionRecords.filter((item) => item.id === record.id).length,
    1,
  );
  assert.equal(
    vaultRecords(data).filter((item) => item.id === record.id).length,
    1,
  );
  assert.match(
    record.completionText,
    /not an official regulatory qualification/,
  );
  assert.equal(
    workspace(root, "CUS-002", "BUS-002").completionRecords.length,
    0,
  );
  assert.throws(
    () => reviewTrainingLesson(data, "outdoor-safety", 0, participant),
    /not assigned/,
  );
});

test("payment simulations, unread indicators and preferences persist without altering other businesses", () => {
  const local = storage();
  let root = readCustomerStore(local);
  root = updateCustomerWorkspace(root, "CUS-001", "BUS-001", (data) =>
    simulatePayment(data, "PAY-002", "2026-09-12T10:00:00Z"),
  );
  root = updateCustomerWorkspace(root, "CUS-001", "BUS-001", (data) => ({
    ...data,
    messages: data.messages.map((item) => ({ ...item, read: true })),
    preferences: { ...data.preferences, renewalReminders: false },
  }));
  writeCustomerStore(local, root);
  const data = workspace(readCustomerStore(local));
  assert.equal(dashboardCounts(data).outstanding, 0);
  assert.equal(dashboardCounts(data).unreadNotifications, 1);
  assert.equal(dashboardCounts(data).unreadMessages, 0);
  assert.equal(data.preferences.renewalReminders, false);
  assert.equal(
    workspace(root, "CUS-003", "BUS-003").preferences.renewalReminders,
    true,
  );
  assert.throws(() => simulatePayment(data, "PAY-002"), /not awaiting/);
});

test("unknown fees are excluded from totals and expiry reminders never guess dates", () => {
  const data = emptyHub();
  data.payments = [
    { id: "unknown", feeKey: "outdoor.rental", status: "Payment required" },
    {
      id: "assessment",
      feeKey: "food.registration",
      status: "Pending assessment",
    },
  ];
  assert.equal(paymentFee(data.payments[0]).amount, null);
  assert.equal(dashboardCounts(data).outstanding, 0);
  assert.equal(dashboardCounts(data).unassessed, 2);
  data.licences = [
    { id: "no-date", status: "Active", expiryDate: null },
    { id: "bad-date", status: "Active", expiryDate: "invalid" },
  ];
  assert.equal(licenceReminders(data).length, 0);
});

test("legacy accounts, workspaces and sessions migrate once without overwriting or clearing originals", () => {
  const local = storage(),
    session = storage();
  const oldUser = {
    id: "old-uuid",
    firstName: "Existing",
    lastName: "Customer",
    email: "existing@example.com",
    businessName: "Existing Cafe",
    password: "must-not-migrate",
  };
  local.setItem("hospoHub.prototype.profiles", JSON.stringify([oldUser]));
  session.setItem("hospoHub.prototype.session", JSON.stringify(oldUser));
  const old = emptyHub();
  old.documents = [{ id: "old-file", name: "Sample.pdf", hasFile: true }];
  old.requirements = { categories: ["food"] };
  local.setItem(hubKey(oldUser.id), JSON.stringify(old));
  const auth = createPrototypeAuth(local, session);
  assert.equal(auth.getUser().id, oldUser.id);
  const businessId = auth.getSnapshot().currentBusiness.id;
  const data = workspace(readCustomerStore(local), oldUser.id, businessId);
  assert.equal(data.documents[0].id, "old-file");
  assert.equal(data.documents[0].userId, oldUser.id);
  assert.equal(data.requirements.categories[0], "food");
  assert.equal(local.getItem(hubKey(oldUser.id)), JSON.stringify(old));
  assert.doesNotMatch(
    local.getItem(CUSTOMER_STORE_KEY),
    /must-not-migrate|password/,
  );
  auth.logout();
  assert.equal(auth.getUser(), null);
  assert.equal(session.getItem("hospoHub.prototype.session"), null);
  assert.equal(
    readCustomerStore(local).customerUsers.filter(
      (user) => user.id === oldUser.id,
    ).length,
    1,
  );
});

test("legacy data using a demo email takes precedence over fictional records", () => {
  const local = storage();
  local.setItem(
    "hospoHub.prototype.profiles",
    JSON.stringify([
      {
        id: "existing-pauline",
        email: "pauline@example.com",
        businessName: "Existing real prototype workspace",
      },
    ]),
  );
  const root = readCustomerStore(local);
  const user = root.customerUsers.find(
    (item) => item.email === "pauline@example.com",
  );
  assert.equal(user.id, "existing-pauline");
  assert.equal(
    workspace(root, user.id, user.preferredBusinessId).applications.length,
    0,
  );
});

test("corrupt current customer storage is preserved and never silently reseeded", () => {
  const local = storage();
  local.setItem(CUSTOMER_STORE_KEY, "{broken");
  assert.throws(() => readCustomerStore(local), /preserved/);
  assert.equal(local.getItem(CUSTOMER_STORE_KEY), "{broken");
});
