import { Link } from "react-router-dom";
import { DateText, Empty, Status } from "./HubUI";
export default function ApplicationTable({ applications, detailed = false }) {
  if (!applications.length)
    return (
      <Empty>
        No applications yet. Start with Get Started, then save and complete a
        digital form in My Hub.
      </Empty>
    );
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-100">
      <table className="w-full min-w-[580px] text-left text-sm">
        <thead className="bg-[#f6f9fc] text-xs text-[#668094]">
          <tr>
            {[
              "Application",
              "Type",
              "Status",
              "Submitted on",
              ...(detailed ? ["Last updated", "Next step"] : []),
            ].map((heading) => (
              <th key={heading} className="px-4 py-3 font-semibold">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {applications.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-4">
                <Link
                  to={`/my-applications/${item.id}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {item.name}
                </Link>
                <span className="mt-1 block text-xs text-slate-500">
                  {item.id}
                </span>
              </td>
              <td className="px-4 py-4 capitalize">{item.category}</td>
              <td className="px-4 py-4">
                <Status>{item.status}</Status>
              </td>
              <td className="px-4 py-4">
                <DateText value={item.submittedDate} />
              </td>
              {detailed && (
                <>
                  <td className="px-4 py-4">
                    <DateText value={item.lastUpdated} />
                  </td>
                  <td className="min-w-48 px-4 py-4 text-xs leading-5 text-slate-600">
                    {item.nextStep}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
