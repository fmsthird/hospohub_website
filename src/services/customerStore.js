// Local prototype repository. No customer data is shared with the staff repository.
import * as seed from "../data/customerMockData.js";
import {
  emptyHub,
  readHub,
  hubKey,
  requirementCategories,
} from "./hubStore.js";
import { assignedModules } from "../data/trainingModules.js";
export const CUSTOMER_STORE_KEY = "hospoHub.customer.workspace.v2";
export const CUSTOMER_SESSION_KEY = "hospoHub.customer.session.v2";
export const collections = [
  "applications",
  "forms",
  "documents",
  "vaultRecords",
  "licences",
  "payments",
  "messages",
  "notifications",
  "completionRecords",
  "reminders",
];
const clone = (value) => JSON.parse(JSON.stringify(value));
const clean = (value) =>
  JSON.parse(
    JSON.stringify(value, (key, item) =>
      /password|confirmPassword|accessToken|refreshToken/i.test(key)
        ? undefined
        : item,
    ),
  );
export const owns = (record, userId, businessId) =>
  record.userId === userId && record.businessId === businessId;
export function ownedBusinesses(root, userId) {
  const user = root.customerUsers.find((item) => item.id === userId);
  return root.businesses.filter(
    (item) => item.ownerId === userId && user?.businessIds.includes(item.id),
  );
}
export function nextId(records, prefix) {
  const number =
    records.reduce(
      (max, item) =>
        Math.max(
          max,
          Number(item.id.match(new RegExp(`^${prefix}-(\\d+)$`))?.[1]) || 0,
        ),
      0,
    ) + 1;
  return `${prefix}-${String(number).padStart(3, "0")}`;
}
function normalize(data, user, business) {
  const stamp = (record) => ({
    ...clean(record),
    userId: user.id,
    businessId: business.id,
  });
  const result = {
    ...emptyHub(),
    ...data,
    profile: { ...business, location: business.address },
  };
  for (const key of collections) result[key] = (data[key] || []).map(stamp);
  result.requirements = data.requirements
    ? stamp({
        ...data.requirements,
        id: data.requirements.id || `REQ-${business.id}`,
        business: {
          ...data.requirements.business,
          name: business.businessName,
        },
      })
    : null;
  result.training = Object.fromEntries(
    Object.entries(data.training || {}).map(([key, record]) => [
      key,
      stamp(record),
    ]),
  );
  for (const module of assignedModules(requirementCategories(result))) {
    result.training[module.id] ||= stamp({
      id: `CTR-${business.id}-${module.id}`,
      moduleId: module.id,
      reviewed: [],
      status: "Not started",
      progress: 0,
      completedAt: null,
    });
  }
  result.preferences = { ...emptyHub().preferences, ...data.preferences };
  return result;
}
export function seedCustomerStore() {
  const root = {
    version: 2,
    customerUsers: clone(seed.customerUsers),
    businesses: clone(seed.businesses),
    workspaces: {},
  };
  const mappings = {
    applications: "customerApplications",
    forms: "customerForms",
    documents: "customerDocuments",
    vaultRecords: "customerVaultRecords",
    licences: "customerLicences",
    payments: "customerPayments",
    messages: "customerMessages",
    notifications: "customerNotifications",
    completionRecords: "trainingCompletionRecords",
    reminders: "customerReminders",
  };
  for (const business of root.businesses) {
    const user = root.customerUsers.find(
      (item) => item.id === business.ownerId,
    );
    const matches = (record) => owns(record, user.id, business.id);
    const data = { ...emptyHub(), demo: true };
    for (const [field, name] of Object.entries(mappings))
      data[field] = clone(seed[name].filter(matches));
    data.applications = data.applications.map((app) => ({
      ...app,
      timeline: seed.applicationHistory.filter(
        (event) => matches(event) && event.applicationId === app.id,
      ),
    }));
    data.requirements = clone(seed.customerRequirements.find(matches) || null);
    data.training = Object.fromEntries(
      seed.customerTraining
        .filter(matches)
        .map((record) => [record.moduleId, clone(record)]),
    );
    root.workspaces[business.id] = normalize(data, user, business);
  }
  return root;
}
function migrateLegacy(storage, root) {
  let profiles;
  try {
    profiles = JSON.parse(storage.getItem("hospoHub.prototype.profiles")) || [];
  } catch {
    profiles = [];
  }
  if (!Array.isArray(profiles)) return root;
  for (const profile of profiles) {
    if (
      !profile ||
      typeof profile.id !== "string" ||
      typeof profile.email !== "string" ||
      root.customerUsers.some((user) => user.id === profile.id)
    )
      continue;
    // An existing account takes precedence over a fictional seed identity using the same email.
    const collision = root.customerUsers.find(
      (user) => user.email === profile.email.toLowerCase() && user.demo,
    );
    if (collision) {
      root.customerUsers = root.customerUsers.filter(
        (user) => user.id !== collision.id,
      );
      for (const business of root.businesses.filter(
        (item) => item.ownerId === collision.id,
      ))
        delete root.workspaces[business.id];
      root.businesses = root.businesses.filter(
        (item) => item.ownerId !== collision.id,
      );
    }
    const data = readHub(storage, profile.id);
    const hasBusiness =
      profile.businessName || storage.getItem(hubKey(profile.id));
    const businessId = hasBusiness ? nextId(root.businesses, "BUS") : null;
    const user = {
      id: profile.id,
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      email: profile.email.toLowerCase(),
      phone: "",
      status: "Active",
      businessIds: businessId ? [businessId] : [],
      preferredBusinessId: businessId,
      createdAt: null,
      lastActiveAt: null,
    };
    root.customerUsers.push(user);
    if (businessId) {
      const business = {
        id: businessId,
        ownerId: user.id,
        businessName:
          data.profile.businessName || profile.businessName || "My business",
        legalName: "",
        nzbn: "",
        address: data.profile.location || "",
        activities: {},
      };
      root.businesses.push(business);
      // Preserve legacy files and their IDs; classify completion records separately.
      for (const doc of data.documents.filter((item) => item.completionText)) {
        data.completionRecords.push({
          ...doc,
          moduleId: doc.id.replace(/^training-/, ""),
          completedAt: doc.uploadedDate,
        });
        data.vaultRecords.push({
          id: `VAULT-${doc.id}`,
          completionRecordId: doc.id,
          recordType: "Training completion record",
        });
      }
      data.documents = data.documents.filter((item) => !item.completionText);
      for (const doc of data.documents.filter(
        (item) => item.type === "Active licences" && item.status === "Active",
      )) {
        data.licences.push({
          ...doc,
          reference: doc.reference || doc.id,
          issuedDate: doc.uploadedDate || null,
        });
        data.vaultRecords.push({
          id: `VAULT-${doc.id}`,
          licenceId: doc.id,
          recordType: "Licence / registration",
        });
      }
      data.documents = data.documents.filter(
        (item) =>
          !(item.type === "Active licences" && item.status === "Active"),
      );
      data.payments = data.payments.map((item) => ({
        ...item,
        status:
          item.status === "Outstanding" ? "Payment required" : item.status,
      }));
      root.workspaces[businessId] = normalize(data, user, business);
    }
  }
  return root;
}
export function readCustomerStore(storage) {
  const raw = storage.getItem(CUSTOMER_STORE_KEY);
  if (raw !== null) {
    let root;
    try {
      root = JSON.parse(raw);
    } catch {
      throw new Error(
        "Customer data could not be read. Existing browser data has been preserved.",
      );
    }
    if (
      root?.version !== 2 ||
      !Array.isArray(root.customerUsers) ||
      !Array.isArray(root.businesses) ||
      !root.workspaces ||
      typeof root.workspaces !== "object"
    )
      throw new Error(
        "Customer data format is unavailable. Existing browser data has been preserved.",
      );
    return root;
  }
  const root = migrateLegacy(storage, seedCustomerStore());
  writeCustomerStore(storage, root);
  return root;
}
export function writeCustomerStore(storage, root) {
  storage.setItem(CUSTOMER_STORE_KEY, JSON.stringify(clean(root)));
}
export function customerWorkspace(root, userId, businessId) {
  const user = root.customerUsers.find(
    (item) => item.id === userId && item.status === "Active",
  );
  const business = ownedBusinesses(root, userId).find(
    (item) => item.id === businessId,
  );
  if (!user || !business) return emptyHub();
  const saved = root.workspaces[businessId] || emptyHub();
  const data = { ...saved };
  for (const key of collections)
    data[key] = (saved[key] || []).filter((item) =>
      owns(item, userId, businessId),
    );
  data.training = Object.fromEntries(
    Object.entries(saved.training || {}).filter(([, item]) =>
      owns(item, userId, businessId),
    ),
  );
  data.requirements =
    saved.requirements && owns(saved.requirements, userId, businessId)
      ? saved.requirements
      : null;
  return clone(normalize(data, user, business));
}
export function updateCustomerWorkspace(root, userId, businessId, change) {
  const user = root.customerUsers.find(
    (item) => item.id === userId && item.status === "Active",
  );
  const business = ownedBusinesses(root, userId).find(
    (item) => item.id === businessId,
  );
  if (!user || !business)
    throw new Error(
      "Add or select your business in My Profile before saving records.",
    );
  const next = change(customerWorkspace(root, userId, businessId));
  const records = [
    ...collections.flatMap((key) => next[key] || []),
    ...Object.values(next.training || {}),
    ...(next.requirements ? [next.requirements] : []),
  ];
  for (const record of records) {
    if (
      (record.userId && record.userId !== userId) ||
      (record.businessId && record.businessId !== businessId)
    )
      throw new Error("This record belongs to another customer or business.");
  }
  for (const key of collections) {
    const ids = (next[key] || []).map((item) => item.id);
    if (new Set(ids).size !== ids.length)
      throw new Error("Duplicate record IDs cannot be saved.");
    for (const [otherId, workspace] of Object.entries(root.workspaces)) {
      if (
        otherId !== businessId &&
        (workspace[key] || []).some((item) => ids.includes(item.id))
      )
        throw new Error("This record ID belongs to another business.");
    }
  }
  const has = (key, id) =>
    !id || (next[key] || []).some((item) => item.id === id);
  for (const record of records) {
    if (
      !has("applications", record.applicationId) ||
      !has("forms", record.formId) ||
      !has("payments", record.paymentId) ||
      !has("licences", record.licenceId) ||
      !has("completionRecords", record.completionRecordId)
    )
      throw new Error("The linked record was not found in this business.");
  }
  return {
    ...root,
    workspaces: {
      ...root.workspaces,
      [businessId]: normalize(next, user, business),
    },
  };
}
