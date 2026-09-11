import { Link } from "react-router-dom";
import {
  FaUtensils,
  FaWineGlassAlt,
  FaUmbrellaBeach,
  FaShieldAlt,
  FaBuilding,
  FaClipboardList,
  FaBookOpen,
  FaFileAlt,
  FaSearch,
  FaClipboardCheck,
} from "react-icons/fa";
import {
  resources,
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
} from "../data/resources";
import { filterHelpTopics } from "../utils/helpSearch";
import { useContentFilters } from "../hooks/useContentFilters";
import ContentFilterBar, {
  contentButtonClass,
} from "../components/ContentFilterBar";
import ResourceLink from "../components/ResourceLink";
const icons = {
  Food: FaUtensils,
  Alcohol: FaWineGlassAlt,
  "Outdoor Dining": FaUmbrellaBeach,
  Verification: FaClipboardCheck,
  "Health & Safety": FaShieldAlt,
  "Business & Council": FaBuilding,
  "Planning & Preparation": FaClipboardList,
  "Applications & Forms": FaFileAlt,
  Training: FaBookOpen,
};
export default function Resources() {
  const { filters, update, clear, active } = useContentFilters("resources");
  const matches = filterHelpTopics(resources, filters.search, filters);
  const categoryBase = filterHelpTopics(resources, filters.search, {
    ...filters,
    category: "",
  });
  const categoryCounts = Object.fromEntries(
    RESOURCE_CATEGORIES.map((category) => [
      category,
      categoryBase.filter((item) => item.category === category).length,
    ]),
  );
  return (
    <div className="mx-auto max-w-5xl py-6">
      <header className="mb-7">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-primary">
          Resources
        </p>
        <h1 className="max-w-4xl text-3xl font-extrabold text-gray-900 md:text-4xl">
          Everything you need to find the right hospitality information.
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600">
          Find helpful Hospo Hub guidance, official council information and
          useful resources for running a hospitality business.
        </p>
      </header>
      <nav
        aria-label="Quick access"
        className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          ["Check requirements", "/get-started"],
          ["Licensing Guide", "/licensing-guide"],
          ["Learning Centre", "/learning-centre"],
          ["FAQs & glossary", "/help/faqs"],
        ].map(([label, to]) => (
          <Link
            key={to}
            to={to}
            className="flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-primary transition hover:border-blue-300 hover:bg-blue-100 focus-visible:outline-primary"
          >
            {label}
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </nav>
      <ContentFilterBar
        filters={filters}
        onChange={update}
        categories={RESOURCE_CATEGORIES}
        categoryCounts={categoryCounts}
        total={categoryBase.length}
        types={[
          { value: "", label: "All resource types" },
          ...RESOURCE_TYPES.map((type) => ({ value: type, label: type })),
        ]}
        searchLabel="Search resources"
        placeholder="Search resources..."
        active={active}
        onClear={clear}
      />
      <p
        role="status"
        aria-live="polite"
        className="mb-4 text-sm text-slate-500"
      >
        {matches.length} {matches.length === 1 ? "resource" : "resources"}
        {filters.search.trim() ? ` matching “${filters.search.trim()}”` : ""}
      </p>
      {matches.length ? (
        <section
          aria-label="Resource results"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {matches.map((resource) => {
            const Icon = icons[resource.category] || FaBookOpen;
            return (
              <article
                key={resource.id}
                id={resource.id}
                className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg text-primary">
                    <Icon aria-hidden="true" />
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${resource.internal ? "bg-blue-50 text-blue-800" : "bg-emerald-50 text-emerald-800"}`}
                  >
                    {resource.internal ? "Hospo Hub" : "Official source"}
                  </span>
                </div>
                <div className="mb-2 flex flex-wrap gap-x-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  <span>{resource.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{resource.type}</span>
                </div>
                <h2 className="text-base font-bold leading-6 text-gray-900">
                  {resource.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {resource.description}
                </p>
                <ul
                  className="mb-5 mt-4 flex flex-wrap gap-1.5"
                  aria-label="Topics"
                >
                  {resource.tags.slice(0, 3).map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md bg-slate-50 px-2 py-1 text-[10px] text-slate-500"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <ResourceLink
                  resource={resource}
                  className="mt-auto inline-flex min-h-10 items-center gap-2 rounded border-t border-slate-100 pt-3 text-sm font-semibold text-primary hover:underline focus-visible:outline-primary"
                >
                  {resource.internal
                    ? "Open resource"
                    : "Visit official source"}
                </ResourceLink>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <FaSearch
            aria-hidden="true"
            className="mx-auto mb-4 text-2xl text-slate-300"
          />
          <h2 className="text-lg font-bold text-gray-900">
            No resources found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Try another keyword or clear your filters.
          </p>
          <button
            type="button"
            onClick={clear}
            className={`${contentButtonClass} mt-5`}
          >
            Clear filters
          </button>
        </section>
      )}
      <section className="mt-8 rounded-2xl border border-blue-100 bg-[#edf6fb] p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900">
          Not sure where to begin?
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Use Get Started to identify the guidance that fits your business, or
          explore the FAQs for an explanation of a topic.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/get-started" className={contentButtonClass}>
            Check my requirements →
          </Link>
          <Link
            to="/help/faqs"
            className="inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-semibold text-primary hover:bg-blue-100"
          >
            Browse FAQs →
          </Link>
        </div>
      </section>
    </div>
  );
}
