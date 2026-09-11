import { Link } from "react-router-dom";
import { useHub } from "../hooks/useHub";
import { DateText, Empty, PageHeading, Panel } from "../components/HubUI";
export default function Messages() {
  const { data, update } = useHub();
  return (
    <>
      <PageHeading title="Messages">
        Application updates from council specialists will appear here when a
        council service is connected. Sample messages are labelled.
      </PageHeading>
      <Panel>
        {!data.messages.length && (
          <Empty>
            No messages yet.{" "}
            <Link
              to="/help"
              className="font-bold text-primary"
            >
              Visit Help & Support →
            </Link>
          </Empty>
        )}
        {[...data.messages]
          .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
          .map((item) => (
            <details
              key={item.id}
              className="border-b py-4 last:border-0"
              onToggle={(event) => {
                if (event.currentTarget.open && !item.read)
                  update((state) => ({
                    ...state,
                    messages: state.messages.map((message) =>
                      message.id === item.id
                        ? { ...message, read: true }
                        : message,
                    ),
                  }));
              }}
            >
              <summary className="cursor-pointer text-sm font-bold">
                {!item.read && (
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
                )}
                {item.subject}
              </summary>
              <div className="mt-3 text-sm leading-6 text-slate-600">
                <p>
                  {item.from} • <DateText value={item.date} />
                  {item.demo && " • Sample message"}
                </p>
                <p className="my-3">{item.body}</p>
                {item.applicationId && (
                  <Link
                    to={`/my-applications/${item.applicationId}`}
                    className="font-semibold text-primary"
                  >
                    View application {item.applicationId} →
                  </Link>
                )}
              </div>
            </details>
          ))}
      </Panel>
    </>
  );
}
