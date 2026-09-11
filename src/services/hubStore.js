export const emptyHub = () => ({
  requirements: null,
  forms: [],
  applications: [],
  documents: [],
  vaultRecords: [],
  licences: [],
  completionRecords: [],
  notifications: [],
  reminders: [],
  payments: [],
  messages: [],
  training: {},
  preferences: {
    reminders: true,
    emailNotifications: true,
    applicationUpdates: true,
    paymentReminders: true,
    renewalReminders: true,
    trainingReminders: true,
  },
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
      ...Object.keys(data.profile.activities || {}).filter(
        (key) => data.profile.activities[key],
      ),
      ...data.applications.map((item) => item.category),
    ]),
  ].filter((id) => ["food", "alcohol", "outdoor"].includes(id));
}
export function submitForm(data, form, now, id) {
  const existing = data.applications.find((item) => item.formId === form.id);
  if (existing && existing.status !== "Draft") return data;
  id = existing?.id || id;
  const application = {
    ...existing,
    id,
    formId: form.id,
    category: form.category,
    name: form.name,
    status: "Submitted",
    progress: 50,
    submittedDate: now,
    lastUpdated: now,
    nextStep: "Prototype submission saved. Nothing has been sent to council.",
    timeline: [
      ...(existing?.timeline || [
        { label: "Application started", date: form.createdAt },
      ]),
      { label: "Submitted in prototype", date: now },
    ],
  };
  return {
    ...data,
    forms: data.forms.map((item) =>
      item.id === form.id
        ? {
            ...form,
            applicationId: id,
            status: "Submitted",
            progress: 100,
            submittedAt: now,
            updatedAt: now,
          }
        : item,
    ),
    applications: [
      ...data.applications.filter((item) => item.id !== id),
      application,
    ],
    payments:
      form.category === "food"
        ? [
            ...data.payments,
            {
              id: `${id}-levy`,
              applicationId: id,
              feeKey: "food.levy",
              status: "Payment required",
              createdAt: now,
            },
          ]
        : data.payments,
  };
}
