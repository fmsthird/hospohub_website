import { useStaffAuth } from "../../hooks/useStaffAuth";
import {
  CASE_CATEGORIES,
  CASE_STATUSES,
  PRIORITIES,
} from "../../data/staffRoles";
import { useState } from "react";
import { Field, Select, Button, Dialog } from "./StaffUI";
function FilterFields({
  filters,
  onChange,
  reports = false,
  hideSearch = false,
}) {
  const { data } = useStaffAuth();
  const set = (key, value) => onChange({ ...filters, [key]: value });
  return (
    <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {!reports && !hideSearch && (
          <Field
            label="Search cases"
            placeholder="Reference, business, applicant or officer"
            type="search"
            value={filters.q || ""}
            onChange={(event) => set("q", event.target.value)}
          />
        )}
        <Select
          label="Application type"
          value={filters.category || ""}
          onChange={(value) => set("category", value)}
          options={CASE_CATEGORIES}
          all="All types"
        />
        <Select
          label="Status"
          value={filters.status || ""}
          onChange={(value) => set("status", value)}
          options={CASE_STATUSES}
          all="All statuses"
        />
        <Select
          label="Assigned officer"
          value={filters.officer || ""}
          onChange={(value) => set("officer", value)}
          options={[
            { value: "me", label: "Assigned to me" },
            { value: "unassigned", label: "Unassigned" },
            ...data.staffUsers.map((user) => ({
              value: user.id,
              label: `${user.firstName} ${user.lastName}${user.status === "Inactive" ? " (inactive)" : ""}`,
            })),
          ]}
          all="All officers"
        />
        <Select
          label="Team"
          value={filters.team || ""}
          onChange={(value) => set("team", value)}
          options={data.staffTeams.map((team) => ({
            value: team.id,
            label: team.name,
          }))}
          all="All teams"
        />
        {!reports && (
          <Select
            label="Priority"
            value={filters.priority || ""}
            onChange={(value) => set("priority", value)}
            options={PRIORITIES}
            all="All priorities"
          />
        )}
        <Field
          label="Submitted from"
          type="date"
          max={filters.to || undefined}
          value={filters.from || ""}
          onChange={(event) => set("from", event.target.value)}
        />
        <Field
          label="Submitted to"
          type="date"
          min={filters.from || undefined}
          value={filters.to || ""}
          onChange={(event) => set("to", event.target.value)}
        />
      </div>
      {!reports && (
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <Select
            label="Sort"
            value={filters.sort || "newest"}
            onChange={(value) => set("sort", value)}
            options={[
              { value: "newest", label: "Newest first" },
              { value: "oldest", label: "Oldest first" },
              { value: "priority", label: "Highest priority first" },
            ]}
          />
          <label className="flex min-h-10 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!filters.overdue}
              onChange={(event) =>
                set("overdue", event.target.checked ? "1" : "")
              }
            />
            Overdue only
          </label>
          <Button secondary onClick={() => onChange({})}>
            Clear filters
          </Button>
        </div>
      )}
      {filters.from && filters.to && filters.from > filters.to && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          The start date must be on or before the end date.
        </p>
      )}
    </div>
  );
}

export default function StaffCaseFilters({
  filters,
  onChange,
  reports = false,
}) {
  const [draft, setDraft] = useState(null);
  const invalid = draft?.from && draft?.to && draft.from > draft.to;
  const count = Object.entries(filters).filter(
    ([key, value]) => !["q", "sort"].includes(key) && value,
  ).length;
  return (
    <>
      <div className="hidden lg:block">
        <FilterFields filters={filters} onChange={onChange} reports={reports} />
      </div>
      <div className="mb-5 space-y-3 lg:hidden">
        {!reports && (
          <Field
            label="Search cases"
            type="search"
            placeholder="Reference, business or person"
            value={filters.q || ""}
            onChange={(event) =>
              onChange({ ...filters, q: event.target.value })
            }
          />
        )}
        <Button
          secondary
          aria-haspopup="dialog"
          onClick={() => setDraft({ ...filters })}
        >
          Filters{count ? ` (${count})` : ""}
        </Button>
      </div>
      {draft && (
        <Dialog
          title={reports ? "Report filters" : "Case filters"}
          onClose={() => setDraft(null)}
        >
          <FilterFields
            filters={draft}
            onChange={setDraft}
            reports={reports}
            hideSearch
          />
          <div className="flex flex-wrap justify-end gap-2">
            <Button secondary onClick={() => setDraft({ q: filters.q || "" })}>
              Clear
            </Button>
            <Button secondary onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button
              disabled={Boolean(invalid)}
              onClick={() => {
                onChange({ ...draft, q: filters.q || "" });
                setDraft(null);
              }}
            >
              Apply filters
            </Button>
          </div>
        </Dialog>
      )}
    </>
  );
}
