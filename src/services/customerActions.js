import { assignedModules } from "../data/trainingModules.js";
import { requirementCategories } from "./hubStore.js";
export function reviewTrainingLesson(
  data,
  moduleId,
  index,
  participant,
  now = new Date().toISOString(),
) {
  const module = assignedModules(requirementCategories(data)).find(
    (item) => item.id === moduleId,
  );
  if (
    !module ||
    !Number.isInteger(index) ||
    index < 0 ||
    index >= module.lessons.length
  )
    throw new Error("Training activity not assigned to this business.");
  const current = data.training[moduleId] || { reviewed: [] };
  if (current.reviewed.includes(index)) return data;
  const reviewed = [...current.reviewed, index].sort();
  const complete = reviewed.length === module.lessons.length;
  const completionRecordId =
    current.completionRecordId || `CERT-${data.profile.id}-${moduleId}`;
  const completionText = `Hospo Hub training completion record\n${module.title}\nParticipant: ${participant.firstName} ${participant.lastName}\nBusiness: ${data.profile.businessName}\nCompleted: ${now.slice(0, 10)}\nSelf-reported review of prototype learning activities. This is not an official regulatory qualification or certificate.`;
  return {
    ...data,
    training: {
      ...data.training,
      [moduleId]: {
        ...current,
        moduleId,
        reviewed,
        progress: Math.round((reviewed.length / module.lessons.length) * 100),
        status: complete ? "Completed" : "In progress",
        completedAt: complete ? now : null,
        ...(complete ? { completionRecordId } : {}),
      },
    },
    completionRecords: complete
      ? [
          ...data.completionRecords.filter(
            (item) => item.id !== completionRecordId,
          ),
          {
            id: completionRecordId,
            moduleId,
            name: module.title,
            completedAt: now,
            completionText,
            downloadable: true,
          },
        ]
      : data.completionRecords,
    vaultRecords: complete
      ? [
          ...data.vaultRecords.filter(
            (item) => item.completionRecordId !== completionRecordId,
          ),
          {
            id: `VAULT-${completionRecordId}`,
            completionRecordId,
            recordType: "Training completion record",
          },
        ]
      : data.vaultRecords,
  };
}
export function createDraft(data, form, applicationId) {
  if (data.forms.some((item) => item.id === form.id)) return data;
  return {
    ...data,
    forms: [...data.forms, { ...form, applicationId }],
    applications: [
      ...data.applications,
      {
        id: applicationId,
        formId: form.id,
        requirementId: data.requirements?.id || null,
        name: form.name,
        category: form.category,
        status: "Draft",
        progress: 0,
        submittedDate: null,
        lastUpdated: form.createdAt,
        nextStep: "Complete and submit your digital form.",
        timeline: [{ label: "Draft started", date: form.createdAt }],
      },
    ],
  };
}
export function saveDraft(data, form, now) {
  const saved = data.forms.find((item) => item.id === form.id);
  if (!saved || saved.status === "Submitted")
    throw new Error("This draft is no longer editable.");
  const progress = Math.round(
    (["businessName", "address", "description"].filter((key) =>
      String(form[key] || "").trim(),
    ).length /
      4) *
      100,
  );
  return {
    ...data,
    forms: data.forms.map((item) =>
      item.id === form.id
        ? { ...form, progress, status: "In progress", updatedAt: now }
        : item,
    ),
    applications: data.applications.map((item) =>
      item.formId === form.id && item.status === "Draft"
        ? { ...item, lastUpdated: now, progress }
        : item,
    ),
  };
}
export function simulatePayment(data, id, now = new Date().toISOString()) {
  const payment = data.payments.find((item) => item.id === id);
  if (!payment || !["Payment required", "Outstanding"].includes(payment.status))
    throw new Error("This payment is not awaiting payment.");
  return {
    ...data,
    payments: data.payments.map((item) =>
      item.id === id ? { ...item, status: "Paid", paidAt: now } : item,
    ),
    notifications: data.notifications.map((item) =>
      item.paymentId === id ? { ...item, read: true, resolvedAt: now } : item,
    ),
  };
}
