import { Link } from "react-router-dom";
import { FaExternalLinkAlt, FaArrowRight } from "react-icons/fa";
export default function ResourceLink({ resource, children, className = "" }) {
  if (resource.internal)
    return (
      <Link to={resource.to} className={className}>
        {children || resource.title}
        <FaArrowRight aria-hidden="true" className="shrink-0 text-xs" />
      </Link>
    );
  return (
    <a
      href={resource.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children || resource.title}
      <FaExternalLinkAlt aria-hidden="true" className="shrink-0 text-xs" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
