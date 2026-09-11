import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useHub } from "../hooks/useHub";
import { storeFile, validateUploadFile } from "../services/documentStore";
import { ActionLink, PageHeading, Panel } from "../components/HubUI";
const documentTypes = [
  "Site plan",
  "Food Control Plan",
  "Menu",
  "Host responsibility policy",
  "Alcohol floor plan",
  "Outdoor dining plan",
  "Business documents",
  "Supporting certificates",
  "Licence",
  "Inspection document",
];
export default function DocumentUpload() {
  const { user } = useAuth();
  const { data, update } = useHub();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [file, setFile] = useState(null);
  const [type, setType] = useState("Site plan");
  const [applicationId, setApplicationId] = useState(
    data.applications.some((item) => item.id === params.get("application"))
      ? params.get("application")
      : "",
  );
  const [expiryDate, setExpiryDate] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const upload = async (event) => {
    event.preventDefault();
    if (busy) return;
    if (!validateUploadFile(file)) {
      setMessage("Choose a non-empty PDF, JPG or PNG file up to 10 MB.");
      return;
    }
    setBusy(true);
    const id = crypto.randomUUID();
    try {
      await storeFile(user.id, id, file);
      const record = {
        id,
        name: file.name,
        documentType: type,
        type: "Supporting documents",
        status: "Uploaded",
        uploadedDate: new Date().toISOString(),
        applicationId,
        expiryDate: expiryDate || null,
        size: file.size,
        hasFile: true,
      };
      if (
        update((state) => ({
          ...state,
          documents: [...state.documents, record],
        }))
      )
        navigate("/documents");
    } catch {
      setMessage(
        "The file could not be saved in this browser. Check storage availability and try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PageHeading
        title="Document upload centre"
        action={<ActionLink to="/documents">Document Vault</ActionLink>}
      >
        Files are saved locally in this browser, not uploaded to council. Use
        sample files only.
      </PageHeading>
      <Panel>
        <form onSubmit={upload} className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Document type
            <select
              className="mt-2 w-full rounded-lg border p-3"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              {documentTypes.map((label) => (
                <option key={label}>{label}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Related application (optional)
            <select
              className="mt-2 w-full rounded-lg border p-3"
              value={applicationId}
              onChange={(event) => setApplicationId(event.target.value)}
            >
              <option value="">General business record</option>
              {data.applications.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} — {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 p-6 text-sm font-semibold sm:col-span-2">
            Select a file
            <input
              required
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(event) => setFile(event.target.files[0] || null)}
              className="mt-3 block w-full max-w-full text-sm"
            />
            <span className="mt-2 block text-xs font-normal text-slate-500">
              PDF, JPG or PNG, up to 10 MB.
            </span>
          </label>
          <label className="text-sm font-semibold">
            Expiry / review date (optional)
            <input
              type="date"
              value={expiryDate}
              onChange={(event) => setExpiryDate(event.target.value)}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              disabled={busy}
              className="rounded-lg bg-primary px-4 py-3 font-bold text-white disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save document locally"}
            </button>
            <p
              role="status"
              className="mt-3 text-sm text-red-700"
            >
              {message}
            </p>
          </div>
        </form>
      </Panel>
    </>
  );
}
