import { Link } from "react-router-dom";
import { FaRobot, FaHeadset, FaBook, FaArrowRight } from "react-icons/fa";

export default function HelpSupport() {
  return (
    <div className="mx-auto max-w-6xl py-6">
      <section className="mb-10">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-primary">
          Help & Support
        </p>

        <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
          How can we help?
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
          Choose the type of support you need. Get guided help, prepare a
          specialist callback request or browse common questions and terms.
        </p>
      </section>

      {/* ================================================= */}
      {/* SUPPORT CARDS */}
      {/* ================================================= */}

      <section className="mb-10 grid gap-5 lg:grid-cols-3">
        <Link
          to="/help/assistant"
          className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transform-none motion-reduce:transition-none"
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-primary">
            <FaRobot />
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            Guided help
          </p>

          <h2 className="text-xl font-bold text-gray-900">
            AI assistant
          </h2>

          <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
            Get instant answers to common questions about licences,
            requirements, applications and fees.
          </p>

          <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
            Start a chat
            <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          to="/help/callback"
          className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transform-none motion-reduce:transition-none"
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">
            <FaHeadset />
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">
            Specialist support
          </p>

          <h2 className="text-xl font-bold text-gray-900">
            Book a specialist callback
          </h2>

          <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
            Speak with a council specialist about your business, application or
            licensing questions.
          </p>

          <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
            Book a callback
            <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          to="/help/faqs"
          className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transform-none motion-reduce:transition-none"
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl text-purple-600">
            <FaBook />
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-purple-600">
            Self-service
          </p>

          <h2 className="text-xl font-bold text-gray-900">
            FAQs & glossary
          </h2>

          <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
            Browse common questions and understand important hospitality
            licensing terms.
          </p>

          <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-purple-700">
            View FAQs
            <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </section>
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-600">
        Looking for guides, checklists or official information?{" "}
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 rounded font-semibold text-primary hover:underline focus-visible:outline-primary"
        >
          Browse resources{" "}
          <FaArrowRight aria-hidden="true" className="text-xs" />
        </Link>
      </div>
    </div>
  );
}
