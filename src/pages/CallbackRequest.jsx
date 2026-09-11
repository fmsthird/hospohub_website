import { useState } from "react";
import {
  FaPhoneAlt,
  FaArrowRight,
  FaFileDownload,
  FaCheckCircle,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useHub } from "../hooks/useHub";
import { downloadText } from "../services/documentStore";
import { formatCallbackRequest } from "../utils/callbackRequest";
import { Panel } from "../components/HubUI";
import HelpPageFrame from "../components/HelpPageFrame";

export default function CallbackRequest() {
  const { user, isAuthenticated } = useAuth();
  const { data } = useHub();

  const [preview, setPreview] = useState(null);

  const [callback, setCallback] = useState({
    name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
    phone: "",
    email: user?.email || "",
    reference: "",
    topic: "Food registration",
    time: "",
    message: "",
  });

  /* =======================================================
     CALLBACK INPUT
     ======================================================= */

  const updateCallback = (key, value) => {
    setPreview(null);

    setCallback((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /* =======================================================
     CALLBACK PREVIEW
     ======================================================= */

  const handleCallbackSubmit = (event) => {
    event.preventDefault();

    setPreview({
      ...callback,
    });
  };

  /* =======================================================
     CALLBACK DOWNLOAD
     ======================================================= */

  const handleDownload = () => {
    if (!preview) return;

    const content = formatCallbackRequest(preview);

    downloadText("hospo-hub-callback-request.txt", content);
  };

  return (
    <HelpPageFrame
      title="Book a specialist callback"
      description="Tell us what you need help with and prepare your callback request."
    >
      <section id="callback" className="mb-8 scroll-mt-28">
        <Panel title="Book a specialist callback">
          <div className="mb-6 flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <FaPhoneAlt className="mt-1 shrink-0 text-emerald-600" />

            <div>
              <p className="text-sm font-bold text-gray-900">
                Prepare your request
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                This is a prototype request form. You can preview and download
                the information you enter, but no booking is automatically
                submitted.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCallbackSubmit}
            className="grid gap-5 sm:grid-cols-2"
          >
            <label className="text-sm font-semibold text-gray-800">
              Name
              <input
                type="text"
                required
                value={callback.name}
                onChange={(event) => updateCallback("name", event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-semibold text-gray-800">
              Phone
              <input
                type="tel"
                required
                value={callback.phone}
                onChange={(event) =>
                  updateCallback("phone", event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-semibold text-gray-800">
              Email
              <input
                type="email"
                required
                value={callback.email}
                onChange={(event) =>
                  updateCallback("email", event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="text-sm font-semibold text-gray-800">
              Application reference
              <span className="ml-1 font-normal text-gray-400">
                (optional)
              </span>
              <input
                type="text"
                value={callback.reference}
                list={isAuthenticated ? "application-references" : undefined}
                onChange={(event) =>
                  updateCallback("reference", event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
              />
            </label>

            {isAuthenticated && (
              <datalist id="application-references">
                {data?.applications?.map((item) => (
                  <option key={item.id} value={item.id} />
                ))}
              </datalist>
            )}

            <label className="text-sm font-semibold text-gray-800">
              Topic
              <select
                required
                value={callback.topic}
                onChange={(event) =>
                  updateCallback("topic", event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
              >
                <option value="Food registration">
                  Food registration (including verification)
                </option>
                <option>Alcohol licensing</option>
                <option>Outdoor dining</option>
                <option>Application status</option>
                <option>Documents</option>
                <option>Fees and payments</option>
                <option>Other</option>
              </select>
            </label>

            <label className="text-sm font-semibold text-gray-800">
              Preferred contact time
              <select
                required
                value={callback.time}
                onChange={(event) => updateCallback("time", event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select preferred time</option>

                <option value="Morning">Morning</option>

                <option value="Afternoon">Afternoon</option>

                <option value="No preference">No preference</option>
              </select>
            </label>

            <label className="text-sm font-semibold text-gray-800 sm:col-span-2">
              What do you need help with?
              <textarea
                required
                value={callback.message}
                onChange={(event) =>
                  updateCallback("message", event.target.value)
                }
                rows={4}
                className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white p-3 font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary"
              >
                Preview request
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </form>

          {preview && (
            <div
              role="status"
              className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5"
            >
              <div className="flex gap-3">
                <FaCheckCircle className="mt-1 shrink-0 text-green-600" />

                <div>
                  <p className="font-bold text-gray-900">
                    Request prepared — not submitted
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    {preview.topic}
                    {" • "}
                    {preview.name}
                    {" • "}
                    {preview.time}
                  </p>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                  >
                    <FaFileDownload />
                    Download request
                  </button>
                </div>
              </div>
            </div>
          )}
        </Panel>
      </section>
    </HelpPageFrame>
  );
}
