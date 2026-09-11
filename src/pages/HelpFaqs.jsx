import { Link } from "react-router-dom";
import { FaBookOpen, FaQuestionCircle, FaSearch } from "react-icons/fa";
import { helpFaqs } from "../data/helpFaqs";
import { helpGlossary } from "../data/helpGlossary";
import { HELP_CATEGORIES, HELP_SERVICES } from "../data/helpCategories";
import { resourcesById } from "../data/resources";
import { filterHelpTopics } from "../utils/helpSearch";
import { useContentFilters } from "../hooks/useContentFilters";
import HelpPageFrame from "../components/HelpPageFrame";
import ContentFilterBar, {
  FilterChoices,
  contentButtonClass,
} from "../components/ContentFilterBar";
import ResourceLink from "../components/ResourceLink";

const topics = [
  ...helpFaqs.map((item) => ({
    ...item,
    title: item.question,
    text: item.answer,
    contentType: "faqs",
  })),
  ...helpGlossary.map((item) => ({
    ...item,
    title: item.term,
    text: item.definition,
    contentType: "glossary",
  })),
];
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export default function HelpFaqs() {
  const { filters, update, clear, active } = useContentFilters();
  const matches = filterHelpTopics(topics, filters.search, filters);
  const categoryBase = filterHelpTopics(topics, filters.search, {
    ...filters,
    category: "",
    letter: "",
  });
  const categoryCounts = Object.fromEntries(
    HELP_CATEGORIES.map((category) => [
      category,
      categoryBase.filter((item) => item.category === category).length,
    ]),
  );
  const alphabetBase = filterHelpTopics(topics, filters.search, {
    ...filters,
    letter: "",
  });
  return (
    <HelpPageFrame
      title="FAQs & glossary"
      description="Find answers to common hospitality questions, understand important terms and access useful resources."
    >
      <ContentFilterBar
        filters={filters}
        onChange={update}
        categories={HELP_CATEGORIES}
        categoryCounts={categoryCounts}
        total={categoryBase.length}
        services={HELP_SERVICES}
        types={[
          { value: "all", label: "All" },
          { value: "faqs", label: "FAQs" },
          { value: "glossary", label: "Glossary" },
        ]}
        searchLabel={
          filters.type === "glossary" ? "Search glossary" : "Search help topics"
        }
        placeholder="Search questions, terms, licences or topics..."
        active={active}
        onClear={clear}
      />
      {filters.type === "glossary" && (
        <section className="mb-6" aria-label="Glossary A–Z">
          <p className="mb-3 text-sm font-semibold text-gray-800">
            Browse terms A–Z
          </p>
          <FilterChoices
            label="First letter"
            value={filters.letter}
            onChange={(letter) => update({ letter })}
            choices={[
              { value: "", label: "All" },
              ...letters.map((letter) => ({
                value: letter,
                label: letter,
                disabled: !alphabetBase.some((item) =>
                  item.term?.toUpperCase().startsWith(letter),
                ),
              })),
            ]}
          />
        </section>
      )}
      <p
        role="status"
        aria-live="polite"
        className="mb-4 text-sm text-slate-500"
      >
        {matches.length} {matches.length === 1 ? "topic" : "topics"}
        {filters.search.trim() ? ` matching “${filters.search.trim()}”` : ""}
      </p>
      {matches.length ? (
        <div
          key={`${filters.type}-${filters.category}-${filters.letter}`}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {matches.map((item) => {
            const Icon =
              item.contentType === "glossary" ? FaBookOpen : FaQuestionCircle;
            return (
              <details
                key={item.id}
                id={item.id}
                className="group border-b border-slate-100 p-5 last:border-0 sm:p-6"
              >
                <summary className="cursor-pointer list-none rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    <span className="flex min-w-0 items-start gap-3">
                      <Icon
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-primary"
                      />
                      <span>
                        <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {item.category} ·{" "}
                          {item.contentType === "faqs" ? "FAQ" : "Glossary"}
                        </span>
                        <span className="font-semibold leading-6 text-gray-900">
                          {item.title}
                        </span>
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-xl text-primary transition-transform group-open:rotate-45 motion-reduce:transition-none"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <div className="ml-7 mt-4">
                  <p className="text-sm leading-7 text-slate-600">
                    {item.text}
                  </p>
                  {item.relatedLinks.length > 0 && (
                    <div className="mt-4">
                      <h2 className="text-xs font-bold text-gray-800">
                        Related information
                      </h2>
                      <ul className="mt-2 space-y-2">
                        {item.relatedLinks.map((link) => (
                          <li key={link.to}>
                            <Link
                              to={link.to}
                              className="inline-flex rounded text-sm font-semibold text-primary hover:underline focus-visible:outline-primary"
                            >
                              {link.label} →
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.relatedResourceIds.length > 0 && (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <h2 className="text-xs font-bold text-gray-800">
                        Related resources
                      </h2>
                      <ul className="mt-2 space-y-2">
                        {item.relatedResourceIds
                          .map((id) => resourcesById[id])
                          .filter(Boolean)
                          .map((resource) => (
                            <li key={resource.id}>
                              <ResourceLink
                                resource={resource}
                                className="inline-flex items-center gap-2 rounded text-sm text-primary hover:underline focus-visible:outline-primary"
                              />
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <FaSearch
            aria-hidden="true"
            className="mx-auto mb-4 text-2xl text-slate-300"
          />
          <h2 className="text-lg font-bold text-gray-900">
            No matching help topics
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Try another keyword or clear your filters.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className={contentButtonClass}
              onClick={clear}
            >
              Clear filters
            </button>
            <Link
              to="/resources"
              className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-blue-50"
            >
              Browse Resources
            </Link>
          </div>
        </section>
      )}
      <section className="mt-8 rounded-2xl border border-blue-100 bg-[#edf6fb] p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900">
          Still looking for information?
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
          Browse the Hospo Hub Resource Library for guides, checklists, training
          and official information.
        </p>
        <Link className={`${contentButtonClass} mt-5`} to="/resources">
          Browse Resources →
        </Link>
      </section>
    </HelpPageFrame>
  );
}
