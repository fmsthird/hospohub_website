import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStaffAuth } from "../../hooks/useStaffAuth";
import { CONTENT_SECTIONS, CONTENT_STATUSES } from "../../data/staffRoles";
import { getStaffName, formatStaffDate } from "../../utils/staffDataHelpers";
import {
  PageHeading,
  Table,
  Cell,
  Badge,
  Button,
  Field,
  Select,
  Dialog,
  inputClass,
  Notice,
} from "../../components/staff/StaffUI";
function ContentPreview({ item }) {
  return (
    <article>
      <p className="text-xs font-semibold text-primary">
        {item.section} · {item.category}
      </p>
      <h3 className="mt-3 text-2xl font-bold">{item.title || "Untitled"}</h3>
      <p className="mt-3 text-sm font-medium text-slate-600">{item.summary}</p>
      <div className="mt-5 whitespace-pre-wrap break-words text-sm leading-7">
        {item.body}
      </div>
      <p className="mt-5 border-t pt-3 text-xs text-slate-500">
        Prototype preview. This does not change the public website.
      </p>
    </article>
  );
}
function ContentEditor({ item, onClose, onSaved }) {
  const { dispatch, hasPermission } = useStaffAuth();
  const [draft, setDraft] = useState(item);
  const [preview, setPreview] = useState(false);
  const set = (key, value) => setDraft({ ...draft, [key]: value });
  const save = (status = draft.status) => {
    if (dispatch({ type: "content:save", item: { ...draft, status } })) {
      onSaved(
        `Content saved as ${status.toLowerCase()} in the local prototype.`,
      );
      onClose();
    }
  };
  return (
    <Dialog title={item.id ? "Edit content" : "New content"} onClose={onClose}>
      {preview ? (
        <>
          <ContentPreview item={draft} />
          <Button secondary className="mt-5" onClick={() => setPreview(false)}>
            Back to editor
          </Button>
        </>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <Field
            label="Title"
            required
            maxLength={180}
            value={draft.title}
            onChange={(event) => set("title", event.target.value)}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Select
              label="Section"
              value={draft.section}
              onChange={(value) => set("section", value)}
              options={CONTENT_SECTIONS}
            />
            <Field
              label="Category"
              required
              maxLength={80}
              value={draft.category}
              onChange={(event) => set("category", event.target.value)}
            />
          </div>
          <Field label="Summary">
            <textarea
              rows={2}
              required
              maxLength={600}
              className={inputClass}
              value={draft.summary}
              onChange={(event) => set("summary", event.target.value)}
            />
          </Field>
          <Field label="Body">
            <textarea
              rows={7}
              required
              maxLength={50000}
              className={inputClass}
              value={draft.body}
              onChange={(event) => set("body", event.target.value)}
            />
          </Field>
          <Select
            label="Status"
            value={draft.status}
            onChange={(value) => set("status", value)}
            options={CONTENT_STATUSES.filter(
              (status) =>
                hasPermission("content:publish") ||
                !["Published", "Scheduled"].includes(status),
            )}
          />
          {draft.status === "Scheduled" && (
            <Field
              label="Planned publication date"
              hint="Saved as a local plan; no automatic publishing service is connected."
              required
              type="datetime-local"
              value={draft.publishAt?.slice(0, 16) || ""}
              onChange={(event) => set("publishAt", event.target.value)}
            />
          )}
          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button secondary onClick={() => save("Draft")}>
              Save draft
            </Button>
            <Button secondary onClick={() => setPreview(true)}>
              Preview
            </Button>
            {hasPermission("content:publish") && (
              <Button onClick={() => save("Published")}>Publish locally</Button>
            )}
            <Button type="submit" secondary>
              Save status
            </Button>
          </div>
          <p className="text-xs text-slate-500">
            Publishing and scheduling affect this prototype record only.
          </p>
        </form>
      )}
    </Dialog>
  );
}
export default function StaffContent() {
  const { data, hasPermission, dispatch } = useStaffAuth();
  const [params, setParams] = useSearchParams();
  const [section, setSection] = useState("");
  const [status, setStatus] = useState("");
  const [editor, setEditor] = useState(null);
  const [preview, setPreview] = useState(null);
  const [notice, setNotice] = useState("");
  const query = params.get("q") || "";
  const rows = data.staffContent.filter(
    (item) =>
      (!section || item.section === section) &&
      (!status || item.status === status) &&
      [item.title, item.section, item.category, item.summary].some((value) =>
        value.toLowerCase().includes(query.trim().toLowerCase()),
      ),
  );
  const saveStatus = (item, status) => {
    if (dispatch({ type: "content:save", item: { ...item, status } }))
      setNotice(`“${item.title}” marked ${status.toLowerCase()} locally.`);
  };
  return (
    <>
      <PageHeading
        title="Content Management"
        action={
          hasPermission("content:update") && (
            <Button
              onClick={() =>
                setEditor({
                  title: "",
                  section: "Licensing Guide",
                  category: "Guidance",
                  summary: "",
                  body: "",
                  status: "Draft",
                })
              }
            >
              + New content
            </Button>
          )
        }
      >
        Manage Hospo Hub guidance and public information.
      </PageHeading>
      <p className="mb-5 text-sm text-slate-500">
        Local editorial workspace. Published and scheduled records here do not
        update the public website.
      </p>
      {notice && <Notice>{notice}</Notice>}
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Field
          label="Search content"
          type="search"
          value={query}
          onChange={(event) =>
            setParams({ q: event.target.value }, { replace: true })
          }
        />
        <Select
          label="Section"
          value={section}
          onChange={setSection}
          options={CONTENT_SECTIONS}
          all="All sections"
        />
        <Select
          label="Status"
          value={status}
          onChange={setStatus}
          options={CONTENT_STATUSES}
          all="All statuses"
        />
      </div>
      <Table
        caption="Staff content records"
        headers={[
          "Content",
          "Section",
          "Status",
          "Last updated",
          "Updated by",
          "Actions",
        ]}
        empty={
          !rows.length &&
          "No content found. Adjust your filters or create a draft."
        }
      >
        {rows.map((item) => (
          <tr key={item.id} className="hover:bg-slate-50">
            <Cell className="min-w-48">
              <strong className="font-semibold">{item.title}</strong>
              <span className="mt-1 block text-xs text-slate-500">
                {item.category}
              </span>
            </Cell>
            <Cell>{item.section}</Cell>
            <Cell>
              <Badge>{item.status}</Badge>
              {item.publishAt && (
                <span className="mt-2 block text-xs text-slate-500">
                  Planned {formatStaffDate(item.publishAt, true)}
                </span>
              )}
            </Cell>
            <Cell>{formatStaffDate(item.updatedAt)}</Cell>
            <Cell>{getStaffName(data, item.updatedBy)}</Cell>
            <Cell>
              <div className="flex min-w-40 flex-wrap gap-3 text-xs font-semibold text-primary">
                {hasPermission("content:update") && (
                  <button type="button" onClick={() => setEditor(item)}>
                    Edit
                  </button>
                )}
                <button type="button" onClick={() => setPreview(item)}>
                  Preview
                </button>
                {hasPermission("content:publish") &&
                  item.status !== "Published" && (
                    <button
                      type="button"
                      onClick={() => saveStatus(item, "Published")}
                    >
                      Publish
                    </button>
                  )}
                {hasPermission("content:update") &&
                  item.status !== "Archived" && (
                    <button
                      type="button"
                      onClick={() => saveStatus(item, "Archived")}
                    >
                      Archive
                    </button>
                  )}
              </div>
            </Cell>
          </tr>
        ))}
      </Table>
      {editor && (
        <ContentEditor
          item={editor}
          onClose={() => setEditor(null)}
          onSaved={setNotice}
        />
      )}
      {preview && (
        <Dialog title="Content preview" onClose={() => setPreview(null)}>
          <ContentPreview item={preview} />
        </Dialog>
      )}
    </>
  );
}
