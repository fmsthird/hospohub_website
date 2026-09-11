import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useHub } from "../hooks/useHub";
import { PageHeading, Panel } from "../components/HubUI";
export default function HubSettings({ profile = false }) {
  const { user, currentBusiness, updateProfile } = useAuth();
  const { data, update } = useHub();
  const [values, setValues] = useState(() => ({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    businessName: "",
    legalName: "",
    nzbn: "",
    address: "",
    businessType: "",
    stage: "",
    activities: {},
    ...currentBusiness,
  }));
  const [message, setMessage] = useState("");
  const [failure, setFailure] = useState("");
  const fields = [
    ["firstName", "First name"],
    ["lastName", "Last name"],
    ["email", "Email address"],
    ["phone", "Phone"],
    ["businessName", "Business name"],
    ["legalName", "Legal business name"],
    ["nzbn", "NZBN (sample only)"],
    ["address", "Business address"],
    ["businessType", "Business type"],
    ["stage", "Business stage"],
  ];
  return (
    <>
      <PageHeading title={profile ? "My Profile" : "Settings"}>
        Manage your customer details, selected business and prototype
        preferences.
      </PageHeading>
      {profile ? (
        <Panel title="Customer and business profile">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              try {
                updateProfile(values);
                setMessage("Profile saved.");
                setFailure("");
              } catch (error) {
                setFailure(error.message);
                setMessage("");
              }
            }}
            className="space-y-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map(([key, label]) => (
                <label key={key} className="text-sm font-semibold">
                  {label}
                  <input
                    type={
                      key === "email"
                        ? "email"
                        : key === "phone"
                          ? "tel"
                          : "text"
                    }
                    required={
                      ["firstName", "lastName", "email"].includes(key) ||
                      (key === "businessName" && Boolean(currentBusiness))
                    }
                    value={values[key]}
                    onChange={(event) =>
                      setValues((previous) => ({
                        ...previous,
                        [key]: event.target.value,
                      }))
                    }
                    className="mt-2 block w-full rounded-lg border p-3 font-normal"
                  />
                </label>
              ))}
            </div>
            <fieldset>
              <legend className="mb-3 text-sm font-bold">
                Business activities
              </legend>
              <div className="flex flex-wrap gap-5">
                {[
                  ["food", "Food"],
                  ["alcohol", "Alcohol"],
                  ["outdoor", "Outdoor dining"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(values.activities?.[key])}
                      onChange={(event) =>
                        setValues((previous) => ({
                          ...previous,
                          activities: {
                            ...previous.activities,
                            [key]: event.target.checked,
                          },
                        }))
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            {!currentBusiness && (
              <p className="text-sm text-slate-600">
                Enter a business name to create your empty business workspace.
              </p>
            )}
            <button className="rounded-lg bg-primary px-4 py-3 font-semibold text-white">
              Save profile
            </button>
          </form>
        </Panel>
      ) : (
        <Panel title="Notification and reminder preferences">
          <div className="space-y-4">
            {[
              ["emailNotifications", "Email notifications"],
              ["applicationUpdates", "Application updates"],
              ["paymentReminders", "Payment reminders"],
              ["renewalReminders", "Licence renewal reminders"],
              ["trainingReminders", "Training reminders"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={data.preferences[key] !== false}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    if (
                      update((state) => ({
                        ...state,
                        preferences: {
                          ...state.preferences,
                          [key]: checked,
                          ...(key === "renewalReminders"
                            ? { reminders: checked }
                            : {}),
                        },
                      }))
                    )
                      setMessage("Preferences saved for this business.");
                  }}
                />
                {label}
              </label>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-500">
            Preferences are saved for the selected business in this browser.
            Renewal reminders use recorded licence expiry dates. Email and push
            delivery require a future backend connection.
          </p>
        </Panel>
      )}
      {failure && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {failure}
        </p>
      )}
      <p role="status" className="mt-4 text-sm text-primary">
        {message}
      </p>
    </>
  );
}
