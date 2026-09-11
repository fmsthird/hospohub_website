import { Link, useParams } from "react-router-dom";
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
          <ApplicationTable applications={data.applications} detailed />
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
          <ActionLink to={`/document-upload?application=${application.id}`}>
            Add supporting document
          </ActionLink>
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
