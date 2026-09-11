import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FaBookOpen,
  FaUtensils,
  FaWineGlassAlt,
  FaUmbrellaBeach,
  FaShieldAlt,
  FaClipboardCheck,
  FaArrowRight,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaLightbulb,
} from "react-icons/fa";

export default function LearningCentre() {
  const { isAuthenticated } = useAuth();
  const modules = [
    {
      icon: <FaUtensils />,
      title: "Food Safety & Registration",
      eyebrow: "Food businesses",
      description:
        "Learn about food registration, Food Control Plans, National Programmes, verification and preparing for compliance checks.",
      topics: [
        "Food business registration",
        "Food Control Plans & National Programmes",
        "Safe food handling and hygiene",
        "Verification and inspections",
        "Record keeping",
      ],
      internalLink: "/licensing-guide?type=food",
      linkText: "Explore food guide",
      reference:
        "https://www.aucklandcouncil.govt.nz/licences-regulations/business-licences/food-businesses",
      iconBg: "bg-orange-50",
      iconText: "text-orange-600",
      accent: "bg-orange-500",
    },

    {
      icon: <FaWineGlassAlt />,
      title: "Alcohol Licensing",
      eyebrow: "Licensed premises",
      description:
        "Learn about alcohol licence types, host responsibility and the obligations businesses have when selling alcohol.",
      topics: [
        "Types of alcohol licences",
        "On-licence requirements",
        "Manager's certificates",
        "Host responsibility",
        "Licence renewals and compliance",
      ],
      internalLink: "/licensing-guide?type=alcohol",
      linkText: "Explore alcohol guide",
      reference:
        "https://www.aucklandcouncil.govt.nz/licences-regulations/business-licences/alcohol-licences-fines",
      iconBg: "bg-purple-50",
      iconText: "text-purple-600",
      accent: "bg-purple-500",
    },

    {
      icon: <FaUmbrellaBeach />,
      title: "Outdoor Dining",
      eyebrow: "Public spaces",
      description:
        "Know what to consider when using a footpath or public space for tables, chairs and outdoor dining.",
      topics: [
        "Outdoor dining approvals",
        "Public space requirements",
        "Pedestrian accessibility",
        "Furniture placement",
        "Site plans and licence conditions",
      ],
      internalLink: "/licensing-guide?type=outdoor",
      linkText: "Explore outdoor dining guide",
      reference:
        "https://www.aucklandcouncil.govt.nz/licences-regulations/business-licences",
      iconBg: "bg-sky-50",
      iconText: "text-sky-600",
      accent: "bg-sky-500",
    },

    {
      icon: <FaShieldAlt />,
      title: "Health & Safety",
      eyebrow: "Running your workplace",
      description:
        "Review essential workplace health and safety responsibilities for owners, operators and staff.",
      topics: [
        "Health and safety duties",
        "Hazard identification",
        "Managing workplace risks",
        "Emergency procedures",
        "Incident reporting",
      ],
      reference: "https://www.worksafe.govt.nz/",
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-600",
      accent: "bg-emerald-500",
    },

    {
      icon: <FaClipboardCheck />,
      title: "Compliance Readiness",
      eyebrow: "Prepare your business",
      description:
        "Keep the right documents, records and business information ready for inspections and compliance checks.",
      topics: [
        "Required licences and approvals",
        "Food safety records",
        "Business documentation",
        "Display requirements",
        "Responding to compliance issues",
      ],
      internalLink: "/get-started",
      linkText: "Check my requirements",
      reference: "https://www.aucklandcouncil.govt.nz/",
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
      accent: "bg-blue-600",
    },
  ];

  return (
    <div className="w-full">
      {/* ================================================= */}
      {isAuthenticated && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
          <div>
            <h2 className="font-bold text-primary">
              Your assigned training
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Continue modules and view completion records in My Hub.
            </p>
          </div>
          <Link
            to="/training"
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white"
          >
            Open training
          </Link>
        </div>
      )}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative mb-12 overflow-hidden rounded-[28px] bg-[#062c48] px-7 py-12 text-white md:px-12 md:py-14">
        {/* Decorative circles */}
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/10" />
        <div className="absolute -bottom-28 right-40 h-64 w-64 rounded-full bg-blue-400/10" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-50">
              <FaBookOpen />
              Hospitality knowledge hub
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
              Learn what your hospitality business needs to know.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              Practical guidance on food safety, alcohol licensing, outdoor
              dining, workplace safety and compliance.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/get-started"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-[#07365a] transition hover:bg-blue-50"
              >
                Check requirements
                <FaArrowRight className="text-sm" />
              </Link>

              <Link
                to="/licensing-guide"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Browse licensing guides
              </Link>
            </div>
          </div>

          {/* RIGHT INFO CARD */}
          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-lg">
              <FaLightbulb />
            </div>

            <h2 className="text-lg font-bold">Use this as a reference</h2>

            <p className="mt-2 text-sm leading-6 text-blue-100">
              The Learning Centre does not track progress or require you to
              complete lessons. Browse the topics that are relevant to your
              business whenever you need them.
            </p>

            <div className="mt-5 border-t border-white/15 pt-5">
              <div className="mb-3 flex items-center gap-3 text-sm">
                <FaCheckCircle className="text-cyan-300" />
                No course completion
              </div>

              <div className="flex items-center gap-3 text-sm">
                <FaCheckCircle className="text-cyan-300" />
                Official reference links included
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* INTRO */}
      {/* ================================================= */}

      <section className="mb-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Learning Centre
            </p>

            <h2 className="text-3xl font-bold text-gray-900">
              Essential topics for hospitality businesses
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              Choose a topic below to understand the main responsibilities,
              requirements and good practices relevant to operating a
              hospitality business.
            </p>
          </div>

          <div className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
            5 reference topics
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* FEATURED 3 CARDS */}
      {/* ================================================= */}

      <section className="mb-8 grid gap-6 xl:grid-cols-3">
        {modules.slice(0, 3).map((module, index) => (
          <article
            key={index}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className={`h-1.5 w-full ${module.accent}`} />

            <div className="p-6">
              <div className="mb-5 flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${module.iconBg} ${module.iconText}`}
                >
                  {module.icon}
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                  Reference
                </span>
              </div>

              <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                {module.eyebrow}
              </p>

              <h3 className="text-xl font-bold text-gray-900">
                {module.title}
              </h3>

              <p className="mt-3 min-h-[84px] text-sm leading-6 text-gray-600">
                {module.description}
              </p>

              {/* TOPICS */}
              <div className="mt-6 rounded-xl bg-gray-50 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Key topics
                </p>

                <ul className="space-y-2.5">
                  {module.topics.slice(0, 4).map((topic, topicIndex) => (
                    <li
                      key={topicIndex}
                      className="flex items-start gap-2.5 text-sm text-gray-700"
                    >
                      <FaCheckCircle
                        className={`mt-0.5 shrink-0 text-xs ${module.iconText}`}
                      />

                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5">
                {module.internalLink && (
                  <Link
                    to={module.internalLink}
                    className={`inline-flex items-center justify-between font-semibold ${module.iconText}`}
                  >
                    {module.linkText}

                    <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                  </Link>
                )}

                <a
                  href={module.reference}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800"
                >
                  Official reference
                  <FaExternalLinkAlt className="text-[10px]" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* ================================================= */}
      {/* SECONDARY TOPICS */}
      {/* ================================================= */}

      <section className="grid gap-6 lg:grid-cols-2">
        {modules.slice(3).map((module, index) => (
          <article
            key={index}
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow-lg"
          >
            <div className="flex flex-col gap-5 sm:flex-row">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl ${module.iconBg} ${module.iconText}`}
              >
                {module.icon}
              </div>

              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
                  {module.eyebrow}
                </p>

                <h3 className="mt-1 text-xl font-bold text-gray-900">
                  {module.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {module.description}
                </p>

                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {module.topics.map((topic, topicIndex) => (
                    <div
                      key={topicIndex}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <FaCheckCircle
                        className={`mt-1 shrink-0 text-xs ${module.iconText}`}
                      />

                      {topic}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-5">
                  {module.internalLink && (
                    <Link
                      to={module.internalLink}
                      className={`inline-flex items-center gap-2 text-sm font-semibold ${module.iconText}`}
                    >
                      {module.linkText}
                      <FaArrowRight />
                    </Link>
                  )}

                  <a
                    href={module.reference}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800"
                  >
                    Official reference
                    <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* ================================================= */}
      {/* BOTTOM CTA */}
      {/* ================================================= */}

      <section className="relative mt-12 overflow-hidden rounded-2xl border border-blue-100 bg-[#eef7fc] p-7 md:p-9">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-200/30" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Not sure where to start?
            </p>

            <h2 className="text-2xl font-bold text-gray-900">
              Find the requirements that may apply to your business.
            </h2>

            <p className="mt-2 leading-7 text-gray-600">
              Tell us what type of hospitality business you are operating and
              the activities you plan to provide.
            </p>
          </div>

          <Link
            to="/get-started"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-secondary"
          >
            Check my requirements
            <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
