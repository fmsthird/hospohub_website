import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { paymentFee } from "../services/customerSelectors";
import { useHub } from "../hooks/useHub";
import {
  ActionLink,
  DateText,
  Empty,
  PageHeading,
  Panel,
  Status,
} from "../components/HubUI";
import ApplicationTable from "../components/ApplicationTable";
export default function MyApplications() {
  const { data } = useHub();
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const filtered = data.applications
    .filter(
      (item) =>
        (status === "All" || item.status === status) &&
        (type === "All" || item.category === type) &&
        `${item.id} ${item.name} ${item.applicationType || ""}`
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
    )
    .sort((a, b) => Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated));
  if (!id)
    return (
      <>
        <PageHeading
          title="My Applications"
          action={<ActionLink to="/forms">Open digital forms</ActionLink>}
        >
          Track submitted cases and their next steps. Draft forms are in Digital
          Forms.
        </PageHeading>
        <Panel>
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <label className="text-sm font-semibold">
              Search applications
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="mt-2 block w-full rounded-lg border p-3 font-normal"
                placeholder="Name or reference"
              />
            </label>
            <label className="text-sm font-semibold">
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="mt-2 block w-full rounded-lg border p-3 font-normal"
              >
                {[
                  "All",
                  "Draft",
                  "Submitted",
                  "In review",
                  "Action required",
                  "Approved",
                  "Declined",
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Application type
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="mt-2 block w-full rounded-lg border p-3 font-normal"
              >
                {[
                  ["All", "All types"],
                  ["food", "Food"],
                  ["alcohol", "Alcohol"],
                  ["outdoor", "Outdoor dining"],
                ].map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ApplicationTable applications={filtered} detailed />
        </Panel>
      </>
    );
  const application = data.applications.find((item) => item.id === id);
  if (!application)
    return (
      <Empty>
        Application not found in your workspace.{" "}
        <Link to="/my-applications" className="text-primary">
          Back to applications
        </Link>
      </Empty>
    );
  return (
    <>
      <PageHeading title={application.name}>
        {application.id}
        {application.demo && " • Sample record"}
      </PageHeading>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Application status">
          <Status>{application.status}</Status>
          <dl className="mt-5 space-y-3 text-sm">
            <div>
              Type: <span className="capitalize">{application.category}</span>
            </div>
            <div>
              Submitted: <DateText value={application.submittedDate} />
            </div>
            <div>
              Last updated: <DateText value={application.lastUpdated} />
            </div>
          </dl>
          <h3 className="mt-6 font-bold">Next action</h3>
          <p className="my-3 text-sm leading-6 text-slate-600">
            {application.nextStep}
          </p>
          {application.formId && (
            <Link
              to={`/forms/${application.formId}`}
              className="mb-4 block text-sm font-bold text-primary"
            >
              {application.status === "Draft"
                ? "Continue form"
                : "View submitted form"}{" "}
              →
            </Link>
          )}
          {Number.isFinite(application.progress) && (
            <div className="mb-4 flex items-center gap-3">
              <progress
                aria-label="Application progress"
                value={application.progress}
                max={100}
                className="h-2 w-full accent-primary"
              />
              <span className="text-xs">{application.progress}%</span>
            </div>
          )}
          <ActionLink to={`/document-upload?application=${application.id}`}>
            Add supporting document
          </ActionLink>
        </Panel>
        <Panel title="Supporting documents">
          {data.documents
            .filter((item) => item.applicationId === id)
            .map((item) => (
              <div key={item.id} className="mb-3 text-sm">
                <Link
                  to="/documents"
                  className="mr-3 text-primary"
                >
                  {item.name} →
                </Link>
                <Status>{item.status}</Status>
              </div>
            ))}
          {!data.documents.some((item) => item.applicationId === id) && (
            <Empty>No supporting documents recorded.</Empty>
          )}
        </Panel>
        <Panel title="Related payments">
          {data.payments
            .filter((item) => item.applicationId === id)
            .map((item) => (
              <div key={item.id} className="mb-3 text-sm">
                <Link
                  to="/payments"
                  className="block text-primary"
                >
                  {paymentFee(item).label} • {paymentFee(item).display} →
                </Link>
                <div className="mt-2">
                  <Status>{item.status}</Status>
                </div>
              </div>
            ))}
          {!data.payments.some((item) => item.applicationId === id) && (
            <Empty>No payment records for this application.</Empty>
          )}
        </Panel>
        <Panel title="Status timeline">
          <ol className="space-y-5 border-l-2 border-blue-100 pl-5">
            {application.timeline.map((event, index) => (
              <li key={index}>
                <p className="text-sm font-bold">{event.label}</p>
                <p className="mt-1 text-xs text-slate-500">
                  <DateText value={event.date} />
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs text-slate-500">
            Review, requests for information and decisions appear only when
            recorded. Prototype submissions do not receive council decisions.
          </p>
        </Panel>
        <Panel title="Related messages">
          {data.messages
            .filter((item) => item.applicationId === id)
            .map((item) => (
              <Link
                key={item.id}
                to="/messages"
                className="mb-3 block text-sm text-primary"
              >
                {item.subject} →
              </Link>
            ))}
          {!data.messages.some((item) => item.applicationId === id) && (
            <Empty>No updates recorded.</Empty>
          )}
        </Panel>
      </div>
    </>
  );
}
