import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useHub } from "../hooks/useHub";
import { submitForm, requirementCategories } from "../services/hubStore";
import { createDraft, saveDraft } from "../services/customerActions";
import {
  ActionLink,
  DateText,
  Empty,
  PageHeading,
  Panel,
  Status,
} from "../components/HubUI";
const names = {
  food: "Food Business Registration",
  alcohol: "Alcohol Licence Application",
  outdoor: "Outdoor Dining Application",
};

function FormEditor({ form }) {
  const { update } = useHub();
  const navigate = useNavigate();
  const [values, setValues] = useState(form);
  const [message, setMessage] = useState("");
  const [declaration, setDeclaration] = useState(false);
  const locked = form.status === "Submitted";
  const save = (submit) => {
    if (
      submit &&
      (!values.businessName.trim() ||
        !values.address.trim() ||
        !values.description.trim() ||
        !declaration)
    ) {
      setMessage(
        "Enter the business name, address and description, then confirm the declaration.",
      );
      return;
    }
    const now = new Date().toISOString();
    const updated = { ...values, updatedAt: now };
    const id =
      form.applicationId ||
      `HH-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const success = update((data) =>
      submit
        ? submitForm(data, updated, now, id)
        : saveDraft(data, updated, now),
    );
    if (success && submit) navigate(`/my-applications/${id}`);
    else if (success) setMessage("Draft saved. You can continue it later.");
  };
  return (
    <Panel title={form.name}>
      <p className="mb-5 text-sm text-slate-600">
        Prototype digital form. This is not an official council application
        form.
      </p>
      {form.applicationId && (
        <Link
          to={`/my-applications/${form.applicationId}`}
          className="mb-4 block text-sm font-bold text-primary"
        >
          View related application →
        </Link>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          save(true);
        }}
        className="space-y-4"
      >
        <fieldset disabled={locked} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["businessName", "Business name"],
              ["address", "Business address"],
            ].map(([key, label]) => (
              <label key={key} className="text-sm font-semibold">
                {label}
                <input
                  required
                  value={values[key]}
                  onChange={(event) =>
                    setValues({ ...values, [key]: event.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal focus:outline-primary"
                />
              </label>
            ))}
          </div>
          <label className="text-sm font-semibold">
            Describe your proposed operation
            <textarea
              required
              rows={4}
              value={values.description}
              onChange={(event) =>
                setValues({ ...values, description: event.target.value })
              }
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal focus:outline-primary"
            />
          </label>
          {!locked && (
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={declaration}
                onChange={(event) => setDeclaration(event.target.checked)}
                className="mt-1"
              />
              I confirm this is sample information for a prototype submission.
            </label>
          )}
        </fieldset>
        {!locked && (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => save(false)}
              className="rounded-lg border border-primary px-4 py-2.5 font-semibold text-primary"
            >
              Save draft
            </button>
            <button className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-white">
              Submit in prototype
            </button>
          </div>
        )}
        <p role="status" className="text-sm text-primary">
          {message}
        </p>
      </form>
    </Panel>
  );
}
export default function DigitalForms() {
  const { data, update } = useHub();
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(
    () => requirementCategories(data)[0] || "food",
  );
  if (id) {
    const form = data.forms.find((item) => item.id === id);
    return (
      <>
        <PageHeading
          title="Digital form"
          action={<ActionLink to="/forms">All forms</ActionLink>}
        />
        {form ? (
          <FormEditor key={id} form={form} />
        ) : (
          <Empty>Form not found.</Empty>
        )}
      </>
    );
  }
  const create = () => {
    const now = new Date().toISOString();
    const formId = crypto.randomUUID();
    const form = {
      id: formId,
      name: names[category],
      category,
      status: "In progress",
      progress: 0,
      businessName:
        data.profile.businessName ||
        data.requirements?.business?.name ||
        user.businessName ||
        "",
      address:
        data.profile.location || data.requirements?.business?.location || "",
      description: "",
      createdAt: now,
      updatedAt: now,
    };
    if (
      update((state) =>
        createDraft(
          state,
          form,
          `HH-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        ),
      )
    )
      navigate(`/forms/${formId}`);
  };
  return (
    <>
      <PageHeading title="Digital Forms">
        Prepare and save drafts. Submitted forms become cases in My
        Applications.
      </PageHeading>
      <Panel title="Start a form">
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm font-semibold">
            Form type
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 block max-w-full rounded-lg border border-slate-300 p-3"
            >
              {Object.entries(names).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={create}
            className="rounded-lg bg-primary px-4 py-3 font-semibold text-white"
          >
            Create draft
          </button>
        </div>
      </Panel>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {["In progress", "Submitted"].map((status) => (
          <Panel
            key={status}
            title={status === "In progress" ? "In Progress" : "Submitted"}
          >
            {data.forms
              .filter((item) =>
                status === "In progress"
                  ? item.status !== "Submitted"
                  : item.status === status,
              )
              .map((form) => (
                <div key={form.id} className="mb-4 rounded-lg border p-4">
                  <h3 className="font-bold">{form.name}</h3>
                  <div className="my-2">
                    <Status>{form.status}</Status>
                  </div>
                  <p className="text-xs text-slate-500">
                    Last saved: <DateText value={form.updatedAt} />
                  </p>
                  <Link
                    to={`/forms/${form.id}`}
                    className="mt-3 inline-block text-sm font-bold text-primary"
                  >
                    {status === "In progress" ? "Continue" : "View"} →
                  </Link>
                  {form.applicationId && (
                    <Link
                      to={`/my-applications/${form.applicationId}`}
                      className="ml-4 text-sm text-primary"
                    >
                      Application →
                    </Link>
                  )}
                </div>
              ))}
            {!data.forms.some((item) =>
              status === "In progress"
                ? item.status !== "Submitted"
                : item.status === status,
            ) && (
              <Empty>
                No {status === "In progress" ? "in-progress" : "submitted"}{" "}
                forms.
              </Empty>
            )}
          </Panel>
        ))}
      </div>
    </>
  );
}
