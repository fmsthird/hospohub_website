import { useSearchParams } from "react-router-dom";
import { readContentFilters, contentFilterParams } from "../utils/helpSearch";
export function useContentFilters(kind = "help") {
  const [params, setParams] = useSearchParams();
  const filters = readContentFilters(params, kind);
  const update = (changes) =>
    setParams(contentFilterParams({ ...filters, ...changes }, kind), {
      replace: true,
    });
  const clear = () => setParams({}, { replace: true });
  const active = !!(
    filters.search ||
    filters.category ||
    filters.service ||
    filters.letter ||
    filters.type !== (kind === "help" ? "faqs" : "")
  );
  return { filters, update, clear, active };
}
