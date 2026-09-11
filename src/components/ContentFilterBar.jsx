import { useId } from "react";
import { FaSearch } from "react-icons/fa";
export const contentInputClass =
  "w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-blue-100";
export const contentButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
export function FilterChoices({ label, choices, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {choices.map((choice) => (
        <button
          type="button"
          key={choice.value}
          aria-pressed={value === choice.value}
          disabled={choice.disabled}
          onClick={() => onChange(choice.value)}
          className={`min-h-10 min-w-10 rounded-lg border px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-35 ${value === choice.value ? "border-primary bg-primary text-white" : "border-slate-200 bg-white text-slate-700 enabled:hover:border-blue-300 enabled:hover:bg-blue-50"}`}
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}
export default function ContentFilterBar({
  filters,
  onChange,
  categories,
  categoryCounts,
  types,
  services,
  placeholder,
  searchLabel,
  active,
  onClear,
  total,
}) {
  const id = useId();
  return (
    <section
      aria-label="Filter library"
      className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <label
        htmlFor={`${id}-search`}
        className="mb-2 block text-sm font-semibold text-gray-800"
      >
        {searchLabel}
      </label>
      <div className="relative">
        <FaSearch
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          id={`${id}-search`}
          type="search"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder={placeholder}
          className={`${contentInputClass} pl-11`}
        />
      </div>
      <div
        className={`mt-4 grid gap-4 ${services ? "md:grid-cols-3" : "md:grid-cols-2"}`}
      >
        <label className="block text-sm font-semibold text-gray-800">
          Category
          <select
            value={filters.category}
            onChange={(event) => onChange({ category: event.target.value })}
            className={`${contentInputClass} mt-2 font-normal`}
          >
            <option value="">All categories ({total})</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category} ({categoryCounts[category] || 0})
              </option>
            ))}
          </select>
        </label>
        {services && (
          <label className="block text-sm font-semibold text-gray-800">
            Service
            <select
              value={filters.service}
              onChange={(event) => onChange({ service: event.target.value })}
              className={`${contentInputClass} mt-2 font-normal`}
            >
              <option value="">All services</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </label>
        )}
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-800">
            Content type
          </p>
          {types.length <= 3 ? (
            <FilterChoices
              label="Content type"
              choices={types}
              value={filters.type}
              onChange={(type) => onChange({ type, letter: "" })}
            />
          ) : (
            <select
              aria-label="Resource type"
              className={contentInputClass}
              value={filters.type}
              onChange={(event) => onChange({ type: event.target.value })}
            >
              {types.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      {active && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-primary">
            {[
              filters.category,
              filters.service,
              filters.letter && `Starts with ${filters.letter}`,
            ]
              .filter(Boolean)
              .map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-blue-50 px-3 py-1.5"
                >
                  {label}
                </span>
              ))}
          </div>
          <button
            type="button"
            onClick={onClear}
            className="min-h-10 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-blue-50 focus-visible:outline-primary"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
