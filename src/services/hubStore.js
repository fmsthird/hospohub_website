import { initialData } from "../data/mockDatabase.js";

export const emptyHub = () => ({
  requirements: null,
  forms: [],
  applications: [],
  documents: [],
  payments: [],
  messages: [],
  training: {},
  preferences: { reminders: true },
  profile: {},
  demo: false,
});
export const hubKey = (userId) => `hospoHub.workspace.v1.${userId}`;
export function readHub(storage, userId) {
  if (!userId) return emptyHub();
  try {
    const saved = JSON.parse(storage.getItem(hubKey(userId)));
    if (!saved || typeof saved !== "object" || Array.isArray(saved))
      return emptyHub();
    const result = { ...emptyHub(), ...saved };
    for (const field of [
      "forms",
      "applications",
      "documents",
      "payments",
      "messages",
    ])
      if (!Array.isArray(result[field])) result[field] = [];
    for (const field of ["training", "preferences", "profile"])
      if (
        !result[field] ||
        typeof result[field] !== "object" ||
        Array.isArray(result[field])
      )
        result[field] = emptyHub()[field];
    if (result.requirements && !Array.isArray(result.requirements.categories))
      result.requirements = null;
    return result;
  } catch {
    return emptyHub();
  }
}
export function writeHub(storage, userId, data) {
  if (!userId) throw new Error("Sign in before saving to My Hub.");
  storage.setItem(hubKey(userId), JSON.stringify(data));
}
export function requirementCategories(data) {
  return [
    ...new Set([
      ...(data.requirements?.categories || []),
      ...data.applications.map((item) => item.category),
    ]),
  ].filter((id) => ["food", "alcohol", "outdoor"].includes(id));
}
export function submitForm(data, form, now, id) {
  if (data.applications.some((item) => item.formId === form.id)) return data;
  const application = {
    id,
    formId: form.id,
    category: form.category,
    name: form.name,
    status: "Submitted",
    submittedDate: now,
    lastUpdated: now,
    nextStep: "Prototype submission saved. Nothing has been sent to council.",
    timeline: [
      { label: "Application started", date: form.createdAt },
      { label: "Submitted in prototype", date: now },
    ],
  };
  return {
    ...data,
    forms: data.forms.map((item) =>
      item.id === form.id
        ? { ...form, status: "Submitted", updatedAt: now }
        : item,
    ),
    applications: [...data.applications, application],
    payments:
      form.category === "food"
        ? [
            ...data.payments,
            {
              id: `${id}-levy`,
              applicationId: id,
              feeKey: "food.levy",
              status: "Outstanding",
              createdAt: now,
            },
          ]
        : data.payments,
  };
}
export function demoHub() {
  const data = emptyHub();
  const iso = (value) => {
    const time = Date.parse(value);
    return Number.isNaN(time) ? null : new Date(time).toISOString();
  };
  data.demo = true;
  data.requirements = {
    categories: ["food", "alcohol", "outdoor"],
    business: { name: "Sample hospitality business" },
    savedAt: new Date().toISOString(),
  };
  data.applications = initialData.applications.map((item, index) => ({
    id: item.id,
    name: item.type,
    category: ["food", "alcohol", "outdoor"][index],
    status:
      item.status === "Under Review"
        ? "In review"
        : item.status === "Action Required"
          ? "Action required"
          : item.status,
    submittedDate: iso(item.submittedDate),
    lastUpdated: iso(item.lastUpdate),
    nextStep: item.nextStep,
    demo: true,
    timeline: [
      { label: "Submitted (sample)", date: iso(item.submittedDate) },
      { label: item.status, date: iso(item.lastUpdate) },
    ],
  }));
  data.documents = initialData.documents.map((item) => ({
    id: `sample-${item.id}`,
    name: item.name,
    type:
      item.type === "Licence" ? "Active licences" : "Uploaded business records",
    status: item.status,
    expiryDate: iso(item.expiryDate),
    demo: true,
  }));
  data.messages = initialData.messages.map((item) => ({
    ...item,
    id: `sample-${item.id}`,
    date: iso(item.date),
    applicationId: data.applications[1]?.id,
    body: "Sample council update: please provide the updated site plan for review. This message is demonstration data.",
    demo: true,
  }));
  return data;
}
