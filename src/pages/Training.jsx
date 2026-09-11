import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useHub } from "../hooks/useHub";
import { assignedModules } from "../data/trainingModules";
import { requirementCategories } from "../services/hubStore";
import { downloadText } from "../services/documentStore";
import {
  ActionLink,
  DateText,
  Empty,
  PageHeading,
  Panel,
  Status,
} from "../components/HubUI";
export default function Training() {
  const { user } = useAuth();
  const { data, update } = useHub();
  const [record, setRecord] = useState(null);
  const modules = assignedModules(requirementCategories(data));
  const reviewLesson = (module, index) =>
    update((state) => {
      const current = state.training[module.id] || { reviewed: [] };
      if (current.reviewed.includes(index)) return state;
      const reviewed = [...current.reviewed, index];
      const complete = reviewed.length === module.lessons.length;
      const now = new Date().toISOString();
      const completionText = `Hospo Hub training completion record\n${module.title}\nParticipant: ${user.firstName} ${user.lastName}\nCompleted: ${new Date(now).toLocaleDateString("en-NZ")}\nSelf-reported review of prototype learning activities. This is not an official regulatory qualification or certificate.`;
      return {
        ...state,
        training: {
          ...state.training,
          [module.id]: { reviewed, completedAt: complete ? now : null },
        },
        documents: complete
          ? [
              ...state.documents.filter(
                (item) => item.id !== `training-${module.id}`,
              ),
              {
                id: `training-${module.id}`,
                name: module.title,
                type: "Training completion records",
                status: "Completed",
                uploadedDate: now,
                completionText,
              },
            ]
          : state.documents,
      };
    });
  return (
    <>
      <PageHeading
        title="Your training"
        action={
          <ActionLink to="/learning-centre">Reference library</ActionLink>
        }
      >
        Modules assigned from your saved requirements and applications. These
        self-guided prototype activities do not replace official training or
        qualifications.
      </PageHeading>
      <Panel title="Required Training">
        {!modules.length && (
          <Empty>
            Save your requirements from Get Started to assign relevant modules.{" "}
            <Link to="/get-started" className="font-bold text-primary">
              Check requirements →
            </Link>
          </Empty>
        )}
        <div className="grid gap-4 lg:grid-cols-2">
          {modules.map((module) => {
            const progress = data.training[module.id] || { reviewed: [] };
            const percent = Math.round(
              (progress.reviewed.length / module.lessons.length) * 100,
            );
            const completedRecord = data.documents.find(
              (item) => item.id === `training-${module.id}`,
            );
            return (
              <article
                key={module.id}
                className="rounded-xl border border-slate-200 p-5"
              >
                <h3 className="font-bold">{module.title}</h3>
                <p className="my-2 text-xs capitalize text-slate-500">
                  Assigned for: {module.category}
                </p>
                <Status>
                  {percent === 100
                    ? "Completed"
                    : percent
                      ? "In progress"
                      : "Not started"}
                </Status>
                <div className="mt-3 flex items-center gap-3">
                  <progress
                    aria-label={`${module.title} progress`}
                    value={percent}
                    max={100}
                    className="h-2 w-full accent-primary"
                  />
                  <span className="text-xs font-bold">{percent}%</span>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-bold text-primary">
                    {percent === 100 ? "Review module" : "Open module"}
                  </summary>
                  <Link
                    to={module.guide}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="my-3 inline-block text-sm text-primary underline"
                  >
                    Read the relevant guide ↗
                  </Link>
                  <ul className="space-y-4">
                    {module.lessons.map((lesson, index) => (
                      <li
                        key={lesson}
                        className="text-sm leading-6 text-slate-600"
                      >
                        <p>{lesson}</p>
                        <button
                          disabled={progress.reviewed.includes(index)}
                          onClick={() => reviewLesson(module, index)}
                          className="mt-1 text-sm font-semibold text-primary disabled:text-green-700"
                        >
                          {progress.reviewed.includes(index)
                            ? "Reviewed ✓"
                            : "Mark as reviewed"}
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
                {completedRecord && (
                  <div className="mt-4 border-t pt-3 text-xs text-slate-600">
                    <p>
                      Completion record available •{" "}
                      <DateText value={progress.completedAt} />
                    </p>
                    <div className="mt-2 flex gap-4 text-sm font-semibold text-primary">
                      <button onClick={() => setRecord(completedRecord)}>
                        View record
                      </button>
                      <button
                        onClick={() =>
                          downloadText(
                            `${module.title}.txt`,
                            completedRecord.completionText,
                          )
                        }
                      >
                        Download record
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </Panel>
      {record && (
        <Panel title="Hospo Hub training completion record" className="mt-5">
          <p className="whitespace-pre-line text-sm leading-7">
            {record.completionText}
          </p>
          <button
            onClick={() => setRecord(null)}
            className="mt-4 font-bold text-primary"
          >
            Close record
          </button>
        </Panel>
      )}
      <Panel title="Refresher / renewal training" className="mt-5">
        {modules.length ? (
          [...new Set(modules.map((item) => item.refresher))].map((text) => (
            <p key={text} className="mb-2 text-sm text-slate-600">
              {text}
            </p>
          ))
        ) : (
          <Empty>Recommendations will follow your saved requirements.</Empty>
        )}
        <p className="mt-3 text-xs text-slate-500">
          No renewal dates are assumed. Consult your recorded licence dates and
          verifier’s advice.
        </p>
      </Panel>
    </>
  );
}
