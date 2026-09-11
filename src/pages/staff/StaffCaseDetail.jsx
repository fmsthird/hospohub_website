import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useStaffAuth } from "../../hooks/useStaffAuth";
import {
  formatStaffDate,
  getStaffName,
  getTeamById,
} from "../../utils/staffDataHelpers";
import { staffChargeAmount } from "../../data/staffMockData";
import { FEE_DATA } from "../../data/licensingFees";
import { formatNZD } from "../../utils/formatNZD";
import { downloadText } from "../../services/documentStore";
import {
  PageHeading,
  Panel,
  Badge,
  Tabs,
  Button,
  Empty,
  Table,
  Cell,
  Dialog,
  Field,
  inputClass,
  Select,
} from "../../components/staff/StaffUI";
import StaffCaseActions from "../../components/staff/StaffCaseActions";
import StaffTaskTable from "../../components/staff/StaffTaskTable";
const tabs = [
  "Overview",
  "Application",
  "Documents",
  "Messages",
  "Tasks",
  "Payments",
  "History",
];
function History({ events, data }) {
  return events.length ? (
    <ol className="ml-2 space-y-5 border-l border-slate-200">
      {[...events]
        .sort((a, b) => new Date(b.at) - new Date(a.at))
        .map((event) => (
          <li key={event.id} className="relative pl-5">
            <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-sky-500 ring-4 ring-white" />
            <p className="text-sm font-semibold">{event.title}</p>
            <p className="mt-1 text-xs text-slate-500">
              {formatStaffDate(event.at, true)}
              {event.staffId && ` · ${getStaffName(data, event.staffId)}`}
            </p>
          </li>
        ))}
    </ol>
  ) : (
    <Empty>No history recorded.</Empty>
  );
}
export default function StaffCaseDetail() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const tab = tabs.includes(params.get("tab")) ? params.get("tab") : "Overview";
  const { data, hasPermission, dispatch } = useStaffAuth();
  const item = data.staffCases.find((row) => row.id === id);
  const [action, setAction] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  if (!item)
    return (
      <Panel title="Case not found">
        <p className="mb-4 text-sm text-slate-500">
          This reference is not in the local staff workspace.
        </p>
        <Link to="/staff/cases" className="font-semibold text-primary">
          Back to cases
        </Link>
      </Panel>
    );
  const amount = staffChargeAmount(item);
  const summary = [
    ["Applicant", item.applicantName],
    ["Business", item.businessName],
    ["Contact", item.applicantEmail],
    ["Application type", item.type],
    ["Submission date", formatStaffDate(item.submittedAt)],
    ["Assigned officer", getStaffName(data, item.assignedOfficerId)],
    ["Team", getTeamById(data, item.teamId)?.name],
    ["Status", item.status],
    ["Priority", item.priority],
    ["Next action", item.nextAction],
  ];
  return (
    <>
      <Link
        to="/staff/cases"
        className="mb-4 inline-block text-sm font-semibold text-primary"
      >
        ← Back to cases
      </Link>
      <PageHeading
        title={item.businessName}
        action={
          <div className="flex gap-2">
            <Badge>{item.status}</Badge>
            <Badge>{item.priority}</Badge>
          </div>
        }
      >
        {item.id} · {item.type} · Assigned to{" "}
        {getStaffName(data, item.assignedOfficerId)}
      </PageHeading>
      <div className="mb-6 flex flex-wrap gap-2">
        {hasPermission("cases:assign") && (
          <Button onClick={() => setAction("assign")}>Assign</Button>
        )}
        {hasPermission("cases:update") && (
          <>
            <Button secondary onClick={() => setAction("request")}>
              Request information
            </Button>
            <Button secondary onClick={() => setAction("note")}>
              Add internal note
            </Button>
            <Button secondary onClick={() => setAction("status")}>
              Change status
            </Button>
          </>
        )}
      </div>
      <Tabs
        items={tabs}
        active={tab}
        onChange={(value) => setParams({ tab: value }, { replace: true })}
        label="Case sections"
      />
      {tab === "Overview" && (
        <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
          <div className="space-y-5">
            <Panel title="Case overview">
              <dl className="grid gap-5 sm:grid-cols-2">
                {summary.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs text-slate-500">{label}</dt>
                    <dd className="mt-1 break-words text-sm font-medium">
                      {label === "Assigned officer" &&
                      item.assignedOfficerId &&
                      hasPermission("teams:view") ? (
                        <Link
                          className="text-primary hover:underline"
                          to={`/staff/teams?member=${item.assignedOfficerId}`}
                        >
                          {value}
                        </Link>
                      ) : (
                        value || "Not recorded"
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>
            <Panel title="Internal notes — visible to staff only">
              {item.notes.length ? (
                <ul className="space-y-4">
                  {item.notes.map((note) => (
                    <li key={note.id} className="rounded-lg bg-amber-50 p-4">
                      <p className="whitespace-pre-wrap break-words text-sm">
                        {note.text}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {getStaffName(data, note.staffId)} ·{" "}
                        {formatStaffDate(note.at, true)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty>No internal notes yet.</Empty>
              )}
            </Panel>
          </div>
          <Panel title="Recorded timeline">
            <History events={item.history} data={data} />
          </Panel>
        </div>
      )}
      {tab === "Application" && (
        <Panel title="Submitted application">
          <p className="mb-5 text-xs text-slate-500">
            Fictional development form data.
          </p>
          <dl className="grid gap-5 sm:grid-cols-2">
            {Object.entries(item.application)
              .filter(([, value]) => typeof value === "string")
              .map(([key, value]) => (
                <div key={key}>
                  <dt className="text-xs capitalize text-slate-500">
                    {key.replace(/([A-Z])/g, " $1")}
                  </dt>
                  <dd className="mt-1 break-words text-sm">{value}</dd>
                </div>
              ))}
          </dl>
          <h3 className="mb-2 mt-6 font-semibold">Requirements</h3>
          <ul className="list-inside list-disc text-sm text-slate-600">
            {item.application.requirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
          <h3 className="mb-3 mt-6 font-semibold">Answers</h3>
          {item.application.answers.map((answer) => (
            <div
              key={answer.question}
              className="mb-2 rounded-lg bg-slate-50 p-4 text-sm"
            >
              <strong>{answer.question}</strong>
              <p className="mt-1 text-slate-600">{answer.answer}</p>
            </div>
          ))}
        </Panel>
      )}
      {tab === "Documents" && (
        <>
          <p className="mb-4 text-sm text-slate-500">
            Text samples can be viewed and downloaded. Metadata-only files have
            no document attached.
          </p>
          <Table
            caption="Case documents"
            headers={[
              "File name",
              "Document type",
              "Uploaded",
              "Review status",
              "Actions",
            ]}
            empty={
              !item.documents.length && "No documents recorded for this case."
            }
          >
            {item.documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50">
                <Cell className="min-w-40">{doc.name}</Cell>
                <Cell>{doc.type}</Cell>
                <Cell>{formatStaffDate(doc.uploadedAt)}</Cell>
                <Cell>
                  {hasPermission("cases:update") ? (
                    <Select
                      label={`Review ${doc.name}`}
                      value={doc.reviewStatus}
                      onChange={(status) =>
                        dispatch({
                          type: "document:review",
                          id: doc.id,
                          caseId: item.id,
                          status,
                        })
                      }
                      options={[
                        "Awaiting review",
                        "Accepted",
                        "Needs information",
                      ]}
                    />
                  ) : (
                    <Badge>{doc.reviewStatus}</Badge>
                  )}
                </Cell>
                <Cell>
                  {doc.text ? (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="font-semibold text-primary"
                        onClick={() => setPreview(doc)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="font-semibold text-primary"
                        onClick={() => downloadText(doc.name, doc.text)}
                      >
                        Download
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">
                      Metadata only — file unavailable
                    </span>
                  )}
                </Cell>
              </tr>
            ))}
          </Table>
        </>
      )}
      {tab === "Messages" && (
        <Panel title="Applicant communication">
          <p className="mb-5 text-xs text-slate-500">
            Sample thread and local drafts. No messages are sent from this
            prototype.
          </p>
          <div className="space-y-4">
            {item.messages.length ? (
              item.messages.map((entry) => (
                <article
                  key={entry.id}
                  className={`max-w-3xl rounded-xl p-4 ${entry.sender === "Council staff" ? "ml-auto border border-sky-100 bg-sky-50" : "border border-slate-200 bg-slate-50"}`}
                >
                  <div className="mb-2 flex flex-wrap justify-between gap-2 text-xs">
                    <strong>
                      {entry.sender}
                      {entry.staffId &&
                        ` · ${getStaffName(data, entry.staffId)}`}
                    </strong>
                    <time>{formatStaffDate(entry.at, true)}</time>
                  </div>
                  <p className="whitespace-pre-wrap break-words text-sm">
                    {entry.text}
                  </p>
                  {entry.localOnly && (
                    <p className="mt-2 text-xs font-semibold text-sky-700">
                      Saved locally · not sent
                    </p>
                  )}
                </article>
              ))
            ) : (
              <Empty>No applicant messages recorded.</Empty>
            )}
          </div>
          {hasPermission("cases:update") && (
            <form
              className="mt-6 space-y-3 border-t pt-5"
              onSubmit={(event) => {
                event.preventDefault();
                if (
                  dispatch({ type: "case:message", id: item.id, text: message })
                )
                  setMessage("");
              }}
            >
              <Field label="Message to applicant">
                <textarea
                  required
                  maxLength={10000}
                  rows={4}
                  className={inputClass}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </Field>
              <Button type="submit">Save local message</Button>
            </form>
          )}
        </Panel>
      )}
      {tab === "Tasks" && (
        <>
          {hasPermission("tasks:assign") && (
            <div className="mb-4">
              <Button onClick={() => setAction("task")}>Add task</Button>
            </div>
          )}
          <StaffTaskTable
            tasks={data.staffTasks.filter((task) => task.caseId === item.id)}
          />
        </>
      )}
      {tab === "Payments" && (
        <Panel title="Charges and payment status">
          <Table
            caption="Case charges"
            headers={["Charge", "Amount (NZD)", "Status", "Date"]}
          >
            <tr>
              <Cell>
                {item.feeKey === "food.levyAndCollection"
                  ? "Food Business Levy + maximum collection fee (illustrative)"
                  : item.feeKey === "alcohol.medium.application"
                    ? "Medium-risk application fee (illustrative)"
                    : "Assessment charge"}
              </Cell>
              <Cell>
                {amount === null ? "Not assessed" : formatNZD(amount)}
              </Cell>
              <Cell>
                <Badge>{item.feeStatus}</Badge>
              </Cell>
              <Cell>{formatStaffDate(item.paymentAt)}</Cell>
            </tr>
          </Table>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            {item.category === "Food"
              ? FEE_DATA.food.note
              : item.category === "Alcohol"
                ? FEE_DATA.alcohol.note
                : item.category === "Outdoor dining"
                  ? FEE_DATA.outdoor.note
                  : FEE_DATA.food.verification.display}{" "}
            Payment statuses are sample records. No payment transaction or
            receipt is created here.
          </p>
          <Link
            to="/licensing-guide"
            className="mt-3 inline-block text-sm font-semibold text-primary"
          >
            View public fee guidance →
          </Link>
        </Panel>
      )}
      {tab === "History" && (
        <Panel title="Case history">
          <History events={item.history} data={data} />
        </Panel>
      )}
      {action && (
        <StaffCaseActions
          key={`${item.id}-${action}`}
          item={item}
          action={action}
          onClose={() => setAction(null)}
        />
      )}
      {preview && (
        <Dialog title={preview.name} onClose={() => setPreview(null)}>
          <p className="whitespace-pre-wrap text-sm leading-6">
            {preview.text}
          </p>
          <Button
            className="mt-5"
            onClick={() => downloadText(preview.name, preview.text)}
          >
            Download text sample
          </Button>
        </Dialog>
      )}
    </>
  );
}
