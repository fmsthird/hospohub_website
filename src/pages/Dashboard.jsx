import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FaRegFileAlt,
  FaRegClock,
  FaRegCheckCircle,
  FaPlusCircle,
  FaSearch,
  FaEdit,
  FaRegFolder,
  FaCreditCard,
  FaRegEnvelope,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useHub } from "../hooks/useHub";
import { Panel, DateText, Empty } from "../components/HubUI";
import ApplicationTable from "../components/ApplicationTable";
import skyline from "../assets/auckland-skyline.png";
import { dashboardCounts } from "../services/customerSelectors";
import { formatNZD } from "../utils/formatNZD";
export default function Dashboard() {
  const { user } = useAuth();
  const { data } = useHub();
  const [today] = useState(() => Date.now());
  const counts = dashboardCounts(data, today);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const summaries = [
    [
      "Active applications",
      counts.activeApplications,
      FaRegFileAlt,
      "text-teal-600",
    ],
    [
      "Pending review",
      counts.pendingReview,
      FaRegClock,
      "text-amber-500",
    ],
    [
      "Active licences / approvals",
      counts.activeLicences,
      FaRegCheckCircle,
      "text-primary",
    ],
  ];
  return (
    <>
      <div className="relative mb-6 overflow-hidden rounded-lg py-3 pr-4 sm:pr-40">
        <img
          src={skyline}
          alt=""
          className="pointer-events-none absolute inset-y-0 right-0 h-full w-72 object-cover opacity-15"
        />
        <h1 className="relative text-2xl font-extrabold">
          {greeting}, {user.firstName || "there"}!
        </h1>
        <p className="relative mt-2 text-sm text-slate-600">
          {data.profile.businessName
            ? `Here’s an overview of ${data.profile.businessName}.`
            : "Here’s an overview of your Hospo Hub account."}
        </p>
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_250px]">
        <div className="min-w-0 space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {summaries.map(([label, count, Icon, color]) => (
              <Panel key={label}>
                <div className="flex items-start gap-4">
                  <Icon className={`mt-1 text-2xl ${color}`} />
                  <div>
                    <strong className="text-2xl">{count}</strong>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      {label}
                    </p>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
          <Panel>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-bold">Recent Applications</h2>
              <Link
                to="/my-applications"
                className="text-sm font-semibold text-primary"
              >
                View all →
              </Link>
            </div>
            <ApplicationTable
              applications={[...data.applications]
                .sort(
                  (a, b) =>
                    Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated),
                )
                .slice(0, 5)}
            />
          </Panel>
          <Panel title="Recent activity">
            {data.applications.length ? (
              <ul className="space-y-3 text-sm">
                {data.applications
                  .flatMap((app) =>
                    app.timeline.map((event, index) => ({
                      ...event,
                      id: `${app.id}-${index}`,
                      applicationId: app.id,
                      name: app.name,
                    })),
                  )
                  .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
                  .slice(0, 5)
                  .map((event) => (
                    <li key={event.id}>
                      <Link
                        to={`/my-applications/${event.applicationId}`}
                        className="font-semibold text-primary"
                      >
                        {event.name}
                      </Link>
                      <p className="mt-1 text-slate-600">
                        {event.label} • <DateText value={event.date} />
                      </p>
                    </li>
                  ))}
              </ul>
            ) : (
              <Empty>No activity recorded yet.</Empty>
            )}
          </Panel>
          <Panel title="Saved requirements">
            {data.requirements ? (
              <>
                <p className="text-sm text-slate-600">
                  {data.requirements.business?.name || "Your business"} • Saved{" "}
                  <DateText value={data.requirements.savedAt} />
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {data.requirements.categories.map((id) => (
                    <li key={id}>
                      <Link
                        to={`/licensing-guide?guide=${id}`}
                        className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold capitalize text-primary"
                      >
                        {id} →
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/training"
                  className="mt-4 inline-block text-sm font-bold text-primary"
                >
                  View assigned training →
                </Link>
                <Link
                  to="/forms"
                  className="mt-3 block text-sm font-bold text-primary"
                >
                  Prepare a form for your business →
                </Link>
              </>
            ) : (
              <Empty>
                Save the results of the public Get Started flow to build your
                checklist and assign training.
              </Empty>
            )}
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel title="Quick Actions">
            {[
              [FaPlusCircle, "/get-started", "Start a new application"],
              [FaSearch, "/get-started", "Check requirements"],
              [FaEdit, "/forms", "Continue a form"],
              [FaRegFolder, "/documents", "View documents"],
              [FaCreditCard, "/payments", "Pay fees"],
              [FaRegEnvelope, "/messages", "View messages"],
            ].map(([Icon, to, label]) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-3 border-b border-slate-100 py-3 text-sm text-[#526d80] last:border-0 hover:text-primary"
              >
                <Icon className="shrink-0 text-lg text-primary" />
                {label}
              </Link>
            ))}
          </Panel>
          <Panel title="Outstanding fees">
            <strong className="text-2xl">
              {formatNZD(counts.outstanding)}
            </strong>
            <p className="mt-2 text-sm text-slate-600">
              Prototype payment items awaiting action.
              {counts.unassessed > 0 &&
                ` ${counts.unassessed} item(s) still need assessment and are excluded from this total.`}
            </p>
          </Panel>
          <Panel title="Keep up to date">
            <Link
              to="/messages"
              className="block text-sm text-primary"
            >
              {counts.unreadMessages} unread messages →
            </Link>
            <Link
              to="/training"
              className="mt-3 block text-sm text-primary"
            >
              {counts.requiredTraining} training modules to complete →
            </Link>
          </Panel>
        </div>
      </div>
    </>
  );
}
