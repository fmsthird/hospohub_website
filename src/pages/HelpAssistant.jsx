import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRobot, FaInfoCircle, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { helpAssistantQuestions as answers } from "../data/helpAssistantQuestions";
import { Panel } from "../components/HubUI";
import HelpPageFrame from "../components/HelpPageFrame";

export default function HelpAssistant() {
  const { isAuthenticated } = useAuth();
  const [selected, setSelected] = useState(null);
  return (
    <HelpPageFrame
      title="AI assistant"
      description="Get quick guidance about licences, requirements, verification, applications and fees."
    >
      <section id="guided-help" className="mb-8 scroll-mt-28">
        <Panel title="AI assistant">
          <div className="mb-5 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <FaInfoCircle className="mt-1 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-bold text-gray-900">
                Hospo Hub guided assistant — not a live AI service
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Choose a common question below to quickly find relevant
                information and guidance.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {answers.map((item, index) => (
              <button
                key={item.question}
                type="button"
                onClick={() => setSelected(index)}
                aria-pressed={selected === index}
                className={`rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  selected === index
                    ? "border-primary bg-blue-50 text-primary"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {item.question}
              </button>
            ))}
          </div>

          {selected !== null && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-blue-100 bg-[#F4F9FC] p-5"
            >
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <FaRobot className="text-sm" />
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Hospo Hub
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {answers[selected].answer}
                  </p>

                  <Link
                    state={
                      answers[selected].private && !isAuthenticated
                        ? { from: answers[selected].to }
                        : undefined
                    }
                    to={
                      answers[selected].private && !isAuthenticated
                        ? "/login"
                        : answers[selected].to
                    }
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                  >
                    {answers[selected].private && !isAuthenticated
                      ? "Sign in to view applications"
                      : answers[selected].label}

                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Panel>
      </section>
    </HelpPageFrame>
  );
}
