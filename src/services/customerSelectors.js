import { FEE_DATA } from "../data/licensingFees.js";
import { formatNZD } from "../utils/formatNZD.js";
import { assignedModules } from "../data/trainingModules.js";
import { requirementCategories } from "./hubStore.js";
export function paymentFee(payment) {
  const value = String(payment.feeKey || "")
    .split(".")
    .reduce((item, key) => item?.[key], FEE_DATA);
  const amount = typeof value === "number" ? value : value?.amount;
  return {
    amount: Number.isFinite(amount) ? amount : null,
    label: payment.description || value?.label || "Fee pending assessment",
    display: Number.isFinite(amount)
      ? formatNZD(amount)
      : value?.display || "To be assessed",
  };
}
export const paymentRequired = (payment) =>
  ["Payment required", "Outstanding"].includes(payment.status);
export function activeLicences(data, today = Date.now()) {
  return (data.licences || []).filter(
    (item) =>
      item.status === "Active" &&
      (!item.expiryDate ||
        Date.parse(`${item.expiryDate.slice(0, 10)}T23:59:59Z`) >= today),
  );
}
export function licenceReminders(data) {
  return (data.licences || [])
    .filter(
      (item) =>
        item.status === "Active" &&
        item.expiryDate &&
        Number.isFinite(Date.parse(item.expiryDate)),
    )
    .map((item) => ({
      id: `renewal-${item.id}`,
      licenceId: item.id,
      title: `${item.name} renewal`,
      dueDate: item.expiryDate,
    }));
}
export function dashboardCounts(data, today) {
  return {
    activeApplications: data.applications.filter(
      (item) => !["Approved", "Declined"].includes(item.status),
    ).length,
    pendingReview: data.applications.filter((item) =>
      ["Submitted", "In review"].includes(item.status),
    ).length,
    activeLicences: activeLicences(data, today).length,
    outstanding: data.payments
      .filter(paymentRequired)
      .reduce((total, item) => total + (paymentFee(item).amount || 0), 0),
    unassessed: data.payments.filter(
      (item) =>
        item.status === "Pending assessment" ||
        (paymentRequired(item) && paymentFee(item).amount === null),
    ).length,
    unreadMessages: data.messages.filter((item) => !item.read).length,
    unreadNotifications: (data.notifications || []).filter((item) => !item.read)
      .length,
    requiredTraining: assignedModules(requirementCategories(data)).filter(
      (module) => !data.training[module.id]?.completedAt,
    ).length,
  };
}
export function vaultRecords(data) {
  return (data.vaultRecords || []).flatMap((record) => {
    const source = record.licenceId
      ? data.licences.find((item) => item.id === record.licenceId)
      : record.completionRecordId
        ? data.completionRecords.find(
            (item) => item.id === record.completionRecordId,
          )
        : record;
    return source
      ? [
          {
            ...record,
            ...source,
            vaultId: record.id,
            type: record.licenceId
              ? "Licences and registrations"
              : record.completionRecordId
                ? "Training completion records"
                : "Approved records",
            status: source.status || "Completed",
            uploadedDate: source.issuedDate || source.completedAt,
            hasFile: Boolean(source.hasFile),
          },
        ]
      : [];
  });
}
