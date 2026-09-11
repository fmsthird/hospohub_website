import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useStaffAuth } from "../../hooks/useStaffAuth";
import {
  STAFF_ROLES,
  CASE_STATUSES,
  CASE_CATEGORIES,
} from "../../data/staffRoles";
import { getTeamById } from "../../utils/staffDataHelpers";
import {
  PageHeading,
  Panel,
  Tabs,
  Field,
  Select,
  Button,
  Badge,
  Notice,
} from "../../components/staff/StaffUI";
function ProfileSettings() {
  const { staffUser, data, hasPermission, dispatch } = useStaffAuth();
  const [draft, setDraft] = useState(staffUser);
  const [saved, setSaved] = useState(false);
  const set = (key, value) => {
    setDraft({ ...draft, [key]: value });
    setSaved(false);
  };
  return (
    <Panel title="Staff profile">
      {saved && <Notice>Profile saved in this browser.</Notice>}
      <form
        className="max-w-2xl space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(
            dispatch({
              type: hasPermission("users:manage")
                ? "user:update"
                : "profile:update",
              id: staffUser.id,
              user: draft,
            }),
          );
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="First name"
            required
            maxLength={80}
            value={draft.firstName}
            onChange={(event) => set("firstName", event.target.value)}
          />
          <Field
            label="Last name"
            required
            maxLength={80}
            value={draft.lastName}
            onChange={(event) => set("lastName", event.target.value)}
          />
        </div>
        <Field
          label="Email"
          required
          type="email"
          value={draft.email}
          onChange={(event) => set("email", event.target.value)}
        />
        <Field
          label="Phone"
          type="tel"
          value={draft.phone}
          onChange={(event) => set("phone", event.target.value)}
        />
        {hasPermission("users:manage") ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Role"
              value={draft.role}
              onChange={(value) => set("role", value)}
              options={Object.keys(STAFF_ROLES)}
            />
            <Select
              label="Team"
              value={draft.teamId}
              onChange={(value) => set("teamId", value)}
              options={data.staffTeams.map((team) => ({
                value: team.id,
                label: team.name,
              }))}
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Role" readOnly value={draft.role} />
            <Field
              label="Team"
              readOnly
              value={getTeamById(data, draft.teamId)?.name || ""}
            />
          </div>
        )}
        <Button type="submit">Save profile</Button>
      </form>
    </Panel>
  );
}
function NotificationSettings() {
  const { staffUser, data, dispatch } = useStaffAuth();
  const options = {
    newCase: "New case assigned",
    information: "Information received",
    taskDue: "Task due",
    taskOverdue: "Task overdue",
    caseStatus: "Case status change",
    messages: "Applicant messages",
  };
  const [preferences, setPreferences] = useState(
    data.preferences[staffUser.id] ||
      Object.fromEntries(Object.keys(options).map((key) => [key, true])),
  );
  const [saved, setSaved] = useState(false);
  return (
    <Panel title="Notification preferences">
      <p className="mb-5 text-sm text-slate-500">
        Preferences are saved locally for future integration. This prototype
        does not send email or run notification scheduling.
      </p>
      {saved && <Notice>Notification preferences saved.</Notice>}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(dispatch({ type: "preferences:save", preferences }));
        }}
        className="max-w-xl space-y-3"
      >
        {Object.entries(options).map(([key, label]) => (
          <label
            key={key}
            className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 text-sm"
          >
            <span>{label}</span>
            <input
              type="checkbox"
              className="h-5 w-5 accent-sky-600"
              checked={preferences[key] === true}
              onChange={(event) => {
                setPreferences({ ...preferences, [key]: event.target.checked });
                setSaved(false);
              }}
            />
          </label>
        ))}
        <Button type="submit">Save preferences</Button>
      </form>
    </Panel>
  );
}
function AdminSettings({ tab }) {
  const { data, dispatch } = useStaffAuth();
  const [assignments, setAssignments] = useState(data.settings.assignments);
  const [review, setReview] = useState(data.settings.contentReview);
  const [systemName, setSystemName] = useState(data.settings.systemName);
  const [saved, setSaved] = useState(false);
  return (
    <Panel title={tab}>
      {saved && <Notice>Prototype configuration saved.</Notice>}
      {tab === "Teams & Assignments" && (
        <form
          className="max-w-xl space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(dispatch({ type: "settings:save", assignments }));
          }}
        >
          <p className="text-sm text-slate-500">
            Default routing configuration for future applications. Saving does
            not reassign existing cases; use each case’s Assign action.
          </p>
          {CASE_CATEGORIES.map((category) => (
            <Select
              key={category}
              label={category}
              value={assignments[category]}
              onChange={(value) => {
                setAssignments({ ...assignments, [category]: value });
                setSaved(false);
              }}
              options={data.staffTeams.map((team) => ({
                value: team.id,
                label: team.name,
              }))}
            />
          ))}
          <Button type="submit">Save team defaults</Button>
        </form>
      )}
      {tab === "Content" && (
        <form
          className="max-w-xl space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(
              dispatch({ type: "settings:save", contentReview: review }),
            );
          }}
        >
          <p className="text-sm text-slate-500">
            Editorial preference for the future publishing integration. Public
            pages are managed separately from this local content workspace.
          </p>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={review}
              onChange={(event) => {
                setReview(event.target.checked);
                setSaved(false);
              }}
            />
            Request editorial review before public publication
          </label>
          <Button type="submit">Save content preference</Button>
          <Link
            className="ml-4 inline-block text-sm font-semibold text-primary"
            to="/staff/content"
          >
            Manage content →
          </Link>
        </form>
      )}
      {tab === "System" && (
        <form
          className="max-w-xl space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(dispatch({ type: "settings:save", systemName }));
          }}
        >
          <Field
            label="Staff portal display name"
            required
            maxLength={80}
            value={systemName}
            onChange={(event) => {
              setSystemName(event.target.value);
              setSaved(false);
            }}
          />
          <dl className="space-y-2 rounded-lg bg-slate-50 p-4 text-sm">
            <div>
              <dt className="font-semibold">Authentication</dt>
              <dd>Local prototype identity selection</dd>
            </div>
            <div>
              <dt className="font-semibold">Storage</dt>
              <dd>This browser · staff workspace version 1</dd>
            </div>
            <div>
              <dt className="font-semibold">Council integration</dt>
              <dd>Not connected</dd>
            </div>
          </dl>
          <Button type="submit">Save display name</Button>
        </form>
      )}
    </Panel>
  );
}
export default function StaffSettings() {
  const { hasPermission, staffUser } = useStaffAuth();
  const [params, setParams] = useSearchParams();
  const tabs = [
    "Profile",
    "Notifications",
    ...(hasPermission("settings:manage")
      ? ["Teams & Assignments", "Workflow", "Content", "System"]
      : hasPermission("cases:view")
        ? ["Workflow"]
        : []),
  ];
  const tab = tabs.includes(params.get("tab")) ? params.get("tab") : "Profile";
  return (
    <>
      <PageHeading title="Settings">
        Configure your staff profile and Hospo Hub administration preferences.
      </PageHeading>
      <Tabs
        items={tabs}
        active={tab}
        onChange={(value) => setParams({ tab: value }, { replace: true })}
      />
      {tab === "Profile" && <ProfileSettings key={staffUser.id} />}
      {tab === "Notifications" && <NotificationSettings />}
      {tab === "Workflow" && (
        <Panel title="Application workflow">
          <p className="mb-5 text-sm text-slate-500">
            These fixed statuses keep cases, filters and reporting consistent.
            Change a case’s status from its detail page when your role allows
            it.
          </p>
          <div className="flex flex-wrap gap-3">
            {CASE_STATUSES.map((status) => (
              <Badge key={status}>{status}</Badge>
            ))}
          </div>
        </Panel>
      )}
      {["Teams & Assignments", "Content", "System"].includes(tab) && (
        <AdminSettings key={tab} tab={tab} />
      )}
    </>
  );
}
