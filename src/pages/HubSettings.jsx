import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useHub } from "../hooks/useHub";
import { demoHub } from "../services/hubStore";
import { PageHeading, Panel } from "../components/HubUI";
export default function HubSettings({ profile = false }) {
  const { user } = useAuth();
  const { data, update } = useHub();
  const [business, setBusiness] = useState(
    data.profile.businessName ?? user.businessName ?? "",
  );
  const [location, setLocation] = useState(data.profile.location || "");
  const [message, setMessage] = useState("");
  const canLoadDemo =
    !data.applications.length &&
    !data.documents.length &&
    !data.forms.length &&
    !data.requirements;
  return (
    <>
      <PageHeading title={profile ? "My Profile" : "Settings"}>
        Manage your business information and browser workspace preferences.
      </PageHeading>
      {profile ? (
        <Panel title="Business profile">
          <p className="mb-4 text-sm text-slate-600">
            {user.firstName} {user.lastName}
            <br />
            {user.email}
          </p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (
                update((state) => ({
                  ...state,
                  profile: {
                    businessName: business.trim(),
                    location: location.trim(),
                  },
                }))
              )
                setMessage("Business profile saved.");
            }}
            className="max-w-lg space-y-4"
          >
            <label className="block text-sm font-semibold">
              Business name
              <input
                value={business}
                onChange={(event) => setBusiness(event.target.value)}
                className="mt-2 w-full rounded-lg border p-3"
              />
            </label>
            <label className="block text-sm font-semibold">
              Business address
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="mt-2 w-full rounded-lg border p-3"
              />
            </label>
            <button className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-white">
              Save business information
            </button>
          </form>
        </Panel>
      ) : (
        <div className="space-y-5">
          <Panel title="Reminders">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={Boolean(data.preferences.reminders)}
                onChange={(event) =>
                  update((state) => ({
                    ...state,
                    preferences: {
                      ...state.preferences,
                      reminders: event.target.checked,
                    },
                  }))
                }
                className="mt-1"
              />
              Show expiry and renewal reminders in Document Vault
            </label>
            <p className="mt-3 text-xs text-slate-500">
              Reminders appear in this browser only. No email or push
              notifications are sent.
            </p>
          </Panel>
          <Panel title="Explore sample data">
            <p className="mb-4 text-sm leading-6 text-slate-600">
              Load the project’s existing sample applications, council message
              and document records to explore the dashboard. Sample records are
              labelled and have no attached licence files.
            </p>
            <button
              disabled={!canLoadDemo}
              onClick={() => {
                if (
                  update((state) => ({
                    ...demoHub(),
                    profile: state.profile,
                    preferences: state.preferences,
                  }))
                )
                  setMessage(
                    "Sample workspace loaded. Open Dashboard to explore.",
                  );
              }}
              className="rounded-lg border border-primary px-4 py-2.5 font-semibold text-primary disabled:opacity-50"
            >
              Load sample workspace
            </button>
            {!canLoadDemo && (
              <p className="mt-3 text-xs text-slate-500">
                Sample loading is available only in an empty workspace so it
                cannot overwrite your records.
              </p>
            )}
          </Panel>
        </div>
      )}
      <p role="status" className="mt-4 text-sm text-primary">
        {message}
      </p>
    </>
  );
}
