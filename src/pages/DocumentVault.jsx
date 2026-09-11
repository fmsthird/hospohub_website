import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useHub } from "../hooks/useHub";
import { loadFile, downloadText } from "../services/documentStore";
import {
  ActionLink,
  DateText,
  Empty,
  PageHeading,
  Panel,
  Status,
} from "../components/HubUI";
import { Link } from "react-router-dom";
import { vaultRecords, licenceReminders } from "../services/customerSelectors";
export default function DocumentVault() {
  const { user } = useAuth();
  const { data } = useHub();
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);
  const [today] = useState(() => Date.now());
  const records = [
    ...vaultRecords(data),
    ...data.documents.map((item) => ({
      ...item,
      type: "Supporting documents",
    })),
  ];
  const reminders = licenceReminders(data);
  const open = async (record, download = false) => {
    if (record.completionText) {
      if (download) downloadText(`${record.name}.txt`, record.completionText);
      else setSelected(record);
      return;
    }
    if (!record.hasFile) {
      setSelected(record);
      return;
    }
    try {
      const file = await loadFile(user.id, record.id);
      if (!file) {
        setMessage(
          "The local file is no longer available. Add it again from the upload centre.",
        );
        return;
      }
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      if (download) link.download = record.name;
      else {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      setMessage("Unable to open this local file. Please try again.");
    }
  };
  const share = async (record) => {
    try {
      await navigator.clipboard.writeText(
        `Hospo Hub prototype record: ${record.name}\nReference: ${record.id}`,
      );
      setMessage(
        "Record reference copied. No file or public access link was shared.",
      );
    } catch {
      setMessage(
        `Record reference: ${record.id}. No public sharing link is available.`,
      );
    }
  };
  return (
    <>
      <PageHeading
        title="Document Vault"
        action={<ActionLink to="/document-upload">Add document</ActionLink>}
      >
        Final licences, registrations and training records are separate from
        supporting uploads. Sample metadata has no attached official file.
      </PageHeading>
      <p role="status" className="mb-4 text-sm text-primary">
        {message}
      </p>
      {data.preferences.reminders &&
        data.preferences.renewalReminders !== false && (
          <Panel title="Expiry & renewal reminders" className="mb-5">
            {reminders.length ? (
              reminders.map((item) => {
                const days = Math.ceil(
                  (Date.parse(item.dueDate) - today) / 86400000,
                );
                return (
                  <div key={item.id} className="mb-3 text-sm">
                    <strong>{item.title}</strong>:{" "}
                    {days < 0
                      ? "Recorded date has passed"
                      : `Expiry / review in ${days} days`}{" "}
                    • <DateText value={item.dueDate} />
                    {item.demo && " (sample)"}{" "}
                    <Link
                      to="/licensing-guide"
                      className="font-semibold text-primary"
                    >
                      Renewal information →
                    </Link>
                  </div>
                );
              })
            ) : (
              <Empty>No renewal date recorded.</Empty>
            )}
          </Panel>
        )}
      <div className="space-y-5">
        {[
          "Licences and registrations",
          "Training completion records",
          "Approved records",
          "Supporting documents",
        ].map((category) => (
          <Panel key={category} title={category}>
            {records
              .filter((item) => item.type === category)
              .map((record) => (
                <div
                  key={record.id}
                  className="flex flex-wrap items-start justify-between gap-4 border-t border-slate-100 py-4 first:border-0"
                >
                  <div className="min-w-0">
                    <h3 className="break-words font-semibold">{record.name}</h3>
                    <div className="my-2">
                      <Status>{record.status}</Status>
                      {record.demo && (
                        <span className="ml-2 text-xs text-slate-500">
                          Sample record
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-5 text-slate-500">
                      {record.documentType || record.type} • Added{" "}
                      <DateText value={record.uploadedDate} />
                      <br />
                      Related application:{" "}
                      {record.applicationId || "General record"}
                      <br />
                      Expiry / review: <DateText value={record.expiryDate} />
                    </p>
                    {record.reference && (
                      <p className="mt-2 text-xs text-slate-600">
                        Reference: {record.reference}
                      </p>
                    )}
                    {record.note && (
                      <p className="mt-2 max-w-xl text-xs leading-5 text-slate-600">
                        {record.note}
                      </p>
                    )}
                    {record.applicationId && (
                      <Link
                        to={`/my-applications/${record.applicationId}`}
                        className="mt-2 inline-block text-sm text-primary"
                      >
                        View application →
                      </Link>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm font-semibold text-primary">
                    <button onClick={() => open(record)}>View</button>
                    {(record.hasFile || record.completionText) && (
                      <button onClick={() => open(record, true)}>
                        Download
                      </button>
                    )}
                    <button onClick={() => share(record)}>
                      Copy reference
                    </button>
                  </div>
                </div>
              ))}
            {!records.some((item) => item.type === category) && (
              <Empty>No records in this category.</Empty>
            )}
          </Panel>
        ))}
      </div>
      {selected && (
        <Panel title={selected.name} className="mt-5">
          <p className="whitespace-pre-line text-sm leading-6">
            {selected.completionText ||
              "This is a sample metadata record. No actual licence or file is attached."}
          </p>
          <button
            className="mt-3 font-bold text-primary"
            onClick={() => setSelected(null)}
          >
            Close record
          </button>
        </Panel>
      )}
    </>
  );
}
