import { Link } from "react-router-dom";
import { useHub } from "../hooks/useHub";
import {
  PageHeading,
  Panel,
  Empty,
  DateText,
  Status,
} from "../components/HubUI";
export default function CustomerNotifications() {
  const { data, update } = useHub();
  const notifications = [...(data.notifications || [])].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
  const markRead = (id) =>
    update((state) => ({
      ...state,
      notifications: state.notifications.map((item) =>
        !id || item.id === id ? { ...item, read: true } : item,
      ),
    }));
  return (
    <>
      <PageHeading title="Notifications">
        Updates for your selected business. Sample notifications are fictional.
      </PageHeading>
      <Panel>
        {notifications.some((item) => !item.read) && (
          <button
            onClick={() => markRead()}
            className="mb-5 text-sm font-bold text-primary"
          >
            Mark all as read
          </button>
        )}
        {!notifications.length && <Empty>No notifications yet.</Empty>}
        {notifications.map((item) => (
          <article key={item.id} className="border-b py-4 last:border-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-bold">{item.title}</h2>
              <Status>{item.read ? "Read" : "Unread"}</Status>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              <DateText value={item.createdAt} />
              {item.demo && " • Sample notification"}
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-primary">
              <Link
                to={
                  item.applicationId
                    ? `/my-applications/${item.applicationId}`
                    : item.paymentId
                      ? "/payments"
                      : item.licenceId
                        ? "/documents"
                        : "/dashboard"
                }
                onClick={() => markRead(item.id)}
              >
                View details →
              </Link>
              {!item.read && (
                <button onClick={() => markRead(item.id)}>Mark as read</button>
              )}
            </div>
          </article>
        ))}
      </Panel>
    </>
  );
}
