import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useStaffAuth } from "../../hooks/useStaffAuth";
import { STAFF_ROLES } from "../../data/staffRoles";
import { nextStaffId } from "../../services/staffStore";
import {
  getStaffName,
  getTeamById,
  getCasesByOfficer,
  getOpenTasksForStaff,
  isTaskOverdue,
  formatStaffDate,
} from "../../utils/staffDataHelpers";
import {
  PageHeading,
  Stats,
  Panel,
  Table,
  Cell,
  Badge,
  Button,
  Field,
  Select,
  Dialog,
  Notice,
} from "../../components/staff/StaffUI";
function StaffUserEditor({ user, onClose, onSaved }) {
  const { data, dispatch } = useStaffAuth();
  const isNew = !data.staffUsers.some((item) => item.id === user.id);
  const [draft, setDraft] = useState(user);
  const [confirm, setConfirm] = useState(false);
  const set = (key, value) => setDraft({ ...draft, [key]: value });
  const save = () => {
    if (
      dispatch(
        isNew
          ? { type: "user:create", user: draft }
          : { type: "user:update", id: user.id, user: draft },
      )
    ) {
      onSaved(
        isNew
          ? "Prototype staff account created. This account exists in the local prototype only."
          : "Staff account updated in the local prototype.",
      );
      onClose();
    }
  };
  return (
    <Dialog
      title={
        confirm
          ? "Confirm deactivation"
          : isNew
            ? "Add staff user"
            : "Edit staff user"
      }
      onClose={onClose}
    >
      {confirm ? (
        <>
          <p className="text-sm leading-6">
            Deactivate {user.firstName} {user.lastName}? They will no longer be
            able to sign in to this prototype. Historical case and task
            ownership will remain.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button secondary onClick={() => setConfirm(false)}>
              Back
            </Button>
            <Button onClick={save}>Confirm deactivation</Button>
          </div>
        </>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (
              !isNew &&
              user.status === "Active" &&
              draft.status === "Inactive"
            )
              setConfirm(true);
            else save();
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
            label="Council email"
            required
            type="email"
            maxLength={254}
            value={draft.email}
            onChange={(event) => set("email", event.target.value)}
          />
          <Field
            label="Staff ID"
            required
            pattern="STF-[0-9]{3,}"
            readOnly={!isNew}
            value={draft.id}
            onChange={(event) => set("id", event.target.value)}
            hint={
              isNew
                ? "Next available ID is filled in automatically."
                : "Staff ID preserves historical ownership and cannot be changed."
            }
          />
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
          <Field
            label="Phone"
            type="tel"
            value={draft.phone}
            onChange={(event) => set("phone", event.target.value)}
          />
          <Select
            label="Account status"
            value={draft.status}
            onChange={(value) => set("status", value)}
            options={["Active", "Inactive"]}
          />
          <p className="rounded-lg bg-sky-50 p-3 text-xs leading-5 text-sky-900">
            Prototype staff record only. No password, invitation email or real
            council access is created.
          </p>
          <div className="flex justify-end gap-2">
            <Button secondary onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isNew ? "Create staff account" : "Save changes"}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
export default function StaffUsers() {
  const { data, dispatch } = useStaffAuth();
  const [params, setParams] = useSearchParams();
  const selected = data.staffUsers.find(
    (user) => user.id === params.get("user"),
  );
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [editor, setEditor] = useState(null);
  const [toggle, setToggle] = useState(null);
  const [notice, setNotice] = useState("");
  const rows = data.staffUsers.filter(
    (user) =>
      (!role || user.role === role) &&
      (!status || user.status === status) &&
      [user.id, user.firstName, user.lastName, user.email].some((value) =>
        value.toLowerCase().includes(query.trim().toLowerCase()),
      ),
  );
  const newUser = () =>
    setEditor({
      id: nextStaffId(data),
      firstName: "",
      lastName: "",
      email: "",
      role: "Licensing Officer",
      teamId: "TEAM-FOOD",
      phone: "",
      status: "Active",
    });
  return (
    <>
      <PageHeading
        title="Users"
        action={<Button onClick={newUser}>+ Add staff user</Button>}
      >
        Manage authorised council staff access, roles and teams.
      </PageHeading>
      {notice && <Notice>{notice}</Notice>}
      <Stats
        items={[
          { label: "Total staff", value: data.staffUsers.length },
          {
            label: "Active",
            value: data.staffUsers.filter((user) => user.status === "Active")
              .length,
          },
          {
            label: "Inactive",
            value: data.staffUsers.filter((user) => user.status === "Inactive")
              .length,
          },
          {
            label: "Administrators",
            value: data.staffUsers.filter(
              (user) => user.role === "Administrator",
            ).length,
          },
        ]}
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Field
          label="Search staff"
          type="search"
          placeholder="Name, email or staff ID"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select
          label="Role"
          value={role}
          onChange={setRole}
          options={Object.keys(STAFF_ROLES)}
          all="All roles"
        />
        <Select
          label="Status"
          value={status}
          onChange={setStatus}
          options={["Active", "Inactive"]}
          all="All statuses"
        />
      </div>
      <Table
        caption="Staff accounts"
        headers={[
          "Staff member / ID",
          "Email",
          "Role",
          "Team",
          "Status",
          "Last active",
          "Assigned cases",
          "Open tasks",
          "Actions",
        ]}
        empty={!rows.length && "No staff users found."}
      >
        {rows.map((user) => (
          <tr key={user.id} className="hover:bg-slate-50">
            <Cell>
              <button
                type="button"
                className="text-left font-semibold text-primary"
                onClick={() => setParams({ user: user.id })}
              >
                {getStaffName(data, user.id)}
              </button>
              <span className="mt-1 block text-xs text-slate-500">
                {user.id}
              </span>
            </Cell>
            <Cell className="break-all">{user.email}</Cell>
            <Cell>{user.role}</Cell>
            <Cell>{getTeamById(data, user.teamId)?.name}</Cell>
            <Cell>
              <Badge>{user.status}</Badge>
            </Cell>
            <Cell>{formatStaffDate(user.lastActive)}</Cell>
            <Cell>
              <Link
                className="font-semibold text-primary"
                to={`/staff/cases?officer=${user.id}`}
              >
                {getCasesByOfficer(data, user.id).length}
              </Link>
            </Cell>
            <Cell>{getOpenTasksForStaff(data, user.id).length}</Cell>
            <Cell>
              <div className="flex min-w-28 flex-wrap gap-3 text-xs font-semibold text-primary">
                <button
                  type="button"
                  onClick={() => setParams({ user: user.id })}
                >
                  View
                </button>
                <button type="button" onClick={() => setEditor(user)}>
                  Edit
                </button>
                <button type="button" onClick={() => setToggle(user)}>
                  {user.status === "Active" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </Cell>
          </tr>
        ))}
      </Table>
      {selected && (
        <div className="mt-5">
          <Panel title={`${getStaffName(data, selected.id)} — staff details`}>
            <div className="mb-4 flex justify-end gap-2">
              <Button secondary onClick={() => setEditor(selected)}>
                Edit staff user
              </Button>
              <Button secondary onClick={() => setParams({})}>
                Close details
              </Button>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <section>
                <h3 className="mb-2 font-semibold">Profile</h3>
                <dl className="space-y-2 text-sm">
                  {[
                    ["Staff ID", selected.id],
                    ["Name", getStaffName(data, selected.id)],
                    ["Email", selected.email],
                    ["Phone", selected.phone || "Not recorded"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs text-slate-500">{label}</dt>
                      <dd className="break-words">{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
              <section>
                <h3 className="mb-2 font-semibold">Access</h3>
                <p className="text-sm">
                  {selected.role}
                  <br />
                  {getTeamById(data, selected.teamId)?.name}
                </p>
                <div className="mt-2">
                  <Badge>{selected.status}</Badge>
                </div>
                <h4 className="mb-1 mt-4 text-xs font-semibold">Permissions</h4>
                <p className="break-words text-xs leading-5 text-slate-500">
                  {selected.status === "Inactive"
                    ? "No access while inactive."
                    : selected.role === "Administrator"
                      ? "All staff areas and actions."
                      : (STAFF_ROLES[selected.role] || []).join(", ")}
                </p>
              </section>
              <section>
                <h3 className="mb-2 font-semibold">Workload</h3>
                <Link
                  className="block text-sm font-semibold text-primary"
                  to={`/staff/cases?officer=${selected.id}`}
                >
                  {getCasesByOfficer(data, selected.id).length} assigned cases →
                </Link>
                <p className="mt-2 text-sm">
                  {getOpenTasksForStaff(data, selected.id).length} open tasks
                </p>
                <p className="mt-2 text-sm">
                  {
                    getOpenTasksForStaff(data, selected.id).filter((task) =>
                      isTaskOverdue(task),
                    ).length
                  }{" "}
                  overdue tasks
                </p>
              </section>
            </div>
          </Panel>
        </div>
      )}
      {editor && (
        <StaffUserEditor
          user={editor}
          onClose={() => setEditor(null)}
          onSaved={setNotice}
        />
      )}
      {toggle && (
        <Dialog
          title={`${toggle.status === "Active" ? "Deactivate" : "Activate"} staff account`}
          onClose={() => setToggle(null)}
        >
          <p className="text-sm leading-6">
            {toggle.status === "Active" ? "Deactivate" : "Activate"}{" "}
            {getStaffName(data, toggle.id)}?{" "}
            {toggle.status === "Active"
              ? "Staff sign-in will be blocked. Historical case and task ownership will remain."
              : "This will allow this fictional identity to sign in to the local prototype."}
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button secondary onClick={() => setToggle(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (
                  dispatch({
                    type: "user:update",
                    id: toggle.id,
                    user: {
                      status:
                        toggle.status === "Active" ? "Inactive" : "Active",
                      availability:
                        toggle.status === "Active"
                          ? "Unavailable"
                          : "Available",
                    },
                  })
                ) {
                  setNotice("Staff account status updated.");
                  setToggle(null);
                }
              }}
            >
              Confirm{" "}
              {toggle.status === "Active" ? "deactivation" : "activation"}
            </Button>
          </div>
        </Dialog>
      )}
    </>
  );
}
