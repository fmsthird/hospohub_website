import {
  HELP_CATEGORIES,
  HELP_SERVICES,
  slug,
} from "../data/helpCategories.js";
import { RESOURCE_CATEGORIES, RESOURCE_TYPES } from "../data/resources.js";

export const normaliseSearch = (value) =>
  String(value || "")
    .normalize("NFKC")
    .toLocaleLowerCase("en-NZ")
    .replace(/[’']/g, "")
    .replace(/[–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
export function filterHelpTopics(topics, query = "", filters = {}) {
  const search = normaliseSearch(query);
  return topics.filter((item) => {
    const text = [
      item.question,
      item.answer,
      item.term,
      item.definition,
      item.title,
      item.text,
      item.description,
      item.category,
      item.service,
      item.type,
      ...(item.keywords || []),
      ...(item.tags || []),
    ]
      .filter(Boolean)
      .join(" ");
    return (
      (!search || normaliseSearch(text).includes(search)) &&
      (!filters.category || item.category === filters.category) &&
      (!filters.type ||
        filters.type === "all" ||
        item.contentType === filters.type ||
        item.type === filters.type) &&
      (!filters.service || item.service === filters.service) &&
      (!filters.letter || item.term?.toUpperCase().startsWith(filters.letter))
    );
  });
}
export function readContentFilters(params, kind = "help") {
  const isHelp = kind === "help";
  const categoryAliases = isHelp
    ? {
        food: "Food Business",
        verification: "Food Business",
        alcohol: "Alcohol Licensing",
        outdoor: "Outdoor Dining",
        fees: "Fees & Payments",
        learning: "Learning Centre",
        help: "Help & Support",
      }
    : {
        verification: "Food",
        outdoor: "Outdoor Dining",
        safety: "Health & Safety",
        business: "Business & Council",
        planning: "Planning & Preparation",
        forms: "Applications & Forms",
      };
  const resolve = (value, options) =>
    options.find((option) => slug(option) === slug(value || "")) || "";
  const rawCategory = params.get("category") || "";
  const type = params.get("type") || "";
  return {
    search:
      params.get("search") ||
      (slug(rawCategory) === "verification" ||
      slug(params.get("service") || "") === "verification"
        ? "verification"
        : ""),
    category:
      categoryAliases[rawCategory.toLowerCase()] ||
      resolve(rawCategory, isHelp ? HELP_CATEGORIES : RESOURCE_CATEGORIES),
    type: isHelp
      ? { faq: "faqs", faqs: "faqs", glossary: "glossary", all: "all" }[
          type.toLowerCase()
        ] || "faqs"
      : resolve(type, RESOURCE_TYPES),
    service: isHelp
      ? resolve(
          params.get("service")?.toLowerCase() === "verification"
            ? "Food"
            : params.get("service"),
          HELP_SERVICES,
        )
      : "",
    letter:
      isHelp &&
      type.toLowerCase() === "glossary" &&
      /^[a-z]$/i.test(params.get("letter") || "")
        ? params.get("letter").toUpperCase()
        : "",
  };
}
export function contentFilterParams(filters, kind = "help") {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", slug(filters.category));
  if (filters.type && filters.type !== (kind === "help" ? "faqs" : ""))
    params.set("type", slug(filters.type));
  if (kind === "help" && filters.service)
    params.set("service", slug(filters.service));
  if (kind === "help" && filters.type === "glossary" && filters.letter)
    params.set("letter", filters.letter);
  return params;
}
