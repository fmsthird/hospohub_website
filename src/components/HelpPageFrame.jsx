import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function HelpPageFrame({ title, description, children }) {
  return (
    <div className="mx-auto max-w-5xl py-6">
      <Link
        to="/help"
        className="mb-6 inline-flex items-center gap-2 rounded text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <FaArrowLeft aria-hidden="true" />
        Back to Help &amp; Support
      </Link>
      <header className="mb-7">
        <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600">
          {description}
        </p>
      </header>
      {children}
    </div>
  );
}
