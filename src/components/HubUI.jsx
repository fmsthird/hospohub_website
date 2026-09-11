import { Link } from "react-router-dom";
export function PageHeading({ title, children, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#173346] sm:text-3xl">
          {title}
        </h1>
        {children && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {children}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
export function Panel({ title, children, className = "" }) {
  return (
    <section
      className={`rounded-xl border border-[#dde8ef] bg-white p-5 shadow-sm ${className}`}
    >
      {title && (
        <h2 className="mb-4 font-bold text-[#173346]">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
export function Status({ children }) {
  const color = [
    "Approved",
    "Accepted",
    "Active",
    "Completed",
    "Paid",
  ].includes(children)
    ? "bg-green-100 text-green-800"
    : [
          "Action required",
          "Update required",
          "Payment required",
          "Declined",
        ].includes(children)
      ? "bg-red-100 text-red-800"
      : children === "Draft"
        ? "bg-slate-100 text-slate-700"
        : "bg-amber-100 text-amber-900";
  return (
    <span
      className={`inline-block rounded px-2 py-1 text-xs font-semibold ${color}`}
    >
      {children}
    </span>
  );
}
export function Empty({ children }) {
  return (
    <p className="rounded-lg bg-slate-50 p-5 text-sm leading-6 text-slate-600">
      {children}
    </p>
  );
}
export function ActionLink({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-secondary"
    >
      {children}
    </Link>
  );
}
export function DateText({ value }) {
  const date = value && new Date(value);
  return (
    <>
      {date && !Number.isNaN(date.getTime())
        ? date.toLocaleDateString("en-NZ", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Not recorded"}
    </>
  );
}
