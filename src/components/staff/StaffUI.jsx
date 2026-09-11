import { useEffect, useId, useRef } from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useStaffAuth } from "../../hooks/useStaffAuth";
export { PageHeading, Panel, Empty } from "../HubUI";
export const inputClass =
  "w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100 disabled:text-slate-500";
export const buttonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-50";
export const secondaryClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-600 disabled:opacity-50";
export function Button({ secondary, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`${secondary ? secondaryClass : buttonClass} ${className}`}
      {...props}
    />
  );
}
export function Field({ label, children, hint, ...props }) {
  const id = useId();
  return (
    <label className="block min-w-0 text-sm font-medium text-slate-700">
      <span className="mb-1.5 block">{label}</span>
      {children || (
        <input
          className={inputClass}
          aria-describedby={hint ? id : undefined}
          {...props}
        />
      )}
      {hint && (
        <span id={id} className="mt-1 block text-xs font-normal text-slate-500">
          {hint}
        </span>
      )}
    </label>
  );
}
export function Select({ label, options, value, onChange, all, ...props }) {
  return (
    <Field label={label}>
      <select
        className={inputClass}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      >
        {all !== undefined && <option value="">{all}</option>}
        {options.map((option) => {
          const item =
            typeof option === "string"
              ? { value: option, label: option }
              : option;
          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </Field>
  );
}
export function Badge({ children }) {
  const colour = [
    "Approved",
    "Active",
    "Completed",
    "Paid",
    "Published",
    "Accepted",
    "Available",
  ].includes(children)
    ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
    : ["In review", "High", "Scheduled"].includes(children)
      ? "bg-amber-50 text-amber-800 ring-amber-200"
      : [
            "Action required",
            "Urgent",
            "Declined",
            "Overdue",
            "Payment required",
            "Needs information",
          ].includes(children)
        ? "bg-rose-50 text-rose-800 ring-rose-200"
        : ["Submitted", "Open"].includes(children)
          ? "bg-sky-50 text-sky-800 ring-sky-200"
          : "bg-slate-100 text-slate-600 ring-slate-200";
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${colour}`}
    >
      {children}
    </span>
  );
}
export function Stats({ items }) {
  return (
    <div
      className={`mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 ${items.length === 4 ? "xl:grid-cols-4" : items.length === 5 ? "xl:grid-cols-5" : "xl:grid-cols-3 2xl:grid-cols-6"}`}
    >
      {items.map(({ label, value, to, icon: Icon, onClick }) => {
        const Tag = to ? Link : onClick ? "button" : "div";
        return (
          <Tag
            key={label}
            {...(to ? { to } : onClick ? { onClick, type: "button" } : {})}
            className={`rounded-xl border border-[#dde8ef] bg-white p-4 text-left shadow-sm ${to || onClick ? "transition hover:border-sky-400 hover:shadow-md focus-visible:outline-sky-600" : ""}`}
          >
            <span className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-500">
              {label}
              {Icon && <Icon className="text-lg text-primary" />}
            </span>
            <span className="mt-2 block text-2xl font-bold text-[#173346]">
              {typeof value === "number"
                ? value.toLocaleString("en-NZ")
                : value}
            </span>
          </Tag>
        );
      })}
    </div>
  );
}
export function Table({ headers, children, empty, caption }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#dde8ef] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-slate-50 text-xs text-slate-600">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="whitespace-nowrap border-b px-4 py-3 font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {empty ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="p-8 text-center text-slate-500"
                >
                  {empty}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export function Cell({ children, className = "" }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}
export function Tabs({ items, active, onChange, label = "Views" }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="mb-5 flex flex-wrap gap-1 border-b border-slate-200 pb-2"
    >
      {items.map((item) => (
        <button
          type="button"
          key={item}
          aria-pressed={active === item}
          onClick={() => onChange(item)}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-sky-600 ${active === item ? "bg-sky-100 text-sky-900" : "text-slate-500 hover:bg-white hover:text-slate-800"}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
export function Dialog({ title, onClose, children }) {
  const ref = useRef(null);
  const id = useId();
  const { error } = useStaffAuth();
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onCancel={onClose}
      onClose={onClose}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-xl border-0 bg-white p-0 text-slate-800 shadow-xl backdrop:bg-slate-950/50"
    >
      <div className="flex items-center justify-between gap-4 border-b p-5">
        <h2 id={id} className="text-lg font-bold">
          {title}
        </h2>
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          <FaTimes />
        </button>
      </div>
      <div className="p-5">
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800"
          >
            {error}
          </p>
        )}
        {children}
      </div>
    </dialog>
  );
}
export function Notice({ children }) {
  return (
    <p
      role="status"
      className="mb-4 rounded-lg border border-sky-100 bg-sky-50 p-3 text-sm text-sky-900"
    >
      {children}
    </p>
  );
}
