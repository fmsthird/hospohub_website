import { Link } from "react-router-dom";
import {
  FaUtensils,
  FaWineGlassAlt,
  FaUmbrellaBeach,
  FaClipboardCheck,
  FaStore,
  FaBookOpen,
  FaUserCircle,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { homeSteps, homeServices } from "../data/homeContent";

import heroImage from "../assets/auckland-skyline.png";

const services = [
  {
    title: "Food business\nregistration",
    description: "Registration, food safety\nand verification",
    icon: FaUtensils,
    to: "/licensing-guide?guide=food",
    accent: "text-[#0069a6]",
  },
  {
    title: "Alcohol licensing",
    description: "On, off or club licences",
    icon: FaWineGlassAlt,
    to: "/licensing-guide?guide=alcohol",
    accent: "text-[#0069a6]",
  },
  {
    title: "Outdoor dining\napprovals",
    description: "Apply for outdoor\nseating or dining areas",
    icon: FaUmbrellaBeach,
    to: "/licensing-guide?guide=outdoor",
    accent: "text-[#e5b900]",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const stepIcons = {
    business: FaStore,
    requirements: FaClipboardCheck,
    guidance: FaBookOpen,
    hub: FaUserCircle,
  };
  const serviceIcons = {
    food: FaUtensils,
    alcohol: FaWineGlassAlt,
    outdoor: FaUmbrellaBeach,
  };
  const textLink =
    "inline-flex min-h-11 items-center py-2 text-sm font-bold text-primary hover:underline";
  return (
    <div className="w-full bg-[#f4f8fb]">
      {/* HERO */}
      <section className="relative min-h-[505px] overflow-hidden">
        {/* AUCKLAND LANDING IMAGE */}
        <img
          src={heroImage}
          alt="Auckland skyline"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* LIGHT OVERLAY SO TEXT IS READABLE */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#dff2ff]/95 via-[#dff2ff]/65 to-transparent" />

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto w-full max-w-[1180px] px-6 pb-36 pt-10 md:px-10 md:pt-12">
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#387899]">
            Auckland Council
          </p>

          <h1 className="max-w-[600px] text-[42px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#071b2b] md:text-[54px]">
            Hospitality licensing
            <br />
            made simpler
          </h1>

          <p className="mt-5 max-w-[620px] text-[17px] font-medium leading-7 text-[#253b49] md:text-[19px]">
            Explore licensing requirements, practical guides
            <br className="hidden sm:block" />
            and resources for your hospitality business.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              to="/get-started"
              className="inline-flex min-w-[145px] items-center justify-center rounded-md bg-[#0076b8] px-7 py-3.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#005f95]"
            >
              Get Started
            </Link>

            <Link
              to="/licensing-guide"
              className="inline-flex min-w-[180px] items-center justify-center rounded-md border-2 border-[#5eb6e3] bg-white/90 px-7 py-3 text-[15px] font-semibold text-[#1173aa] shadow-sm transition hover:bg-white"
            >
              Explore Licensing Guide
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICE CARDS */}
      <section
        aria-label="Quick service links"
        className="relative z-20 mx-auto -mt-[72px] w-full max-w-[1180px] px-6 pb-12 md:px-10"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ title, description, icon: Icon, to, accent }) => (
            <Link
              key={title}
              to={to}
              className="
                  group
                  min-h-[205px]
                  rounded-lg
                  border border-[#e0e7ec]
                  bg-white
                  px-7
                  py-7
                  shadow-[0_5px_18px_rgba(28,58,77,0.10)]
                  transition
                  hover:-translate-y-1
                  hover:shadow-[0_10px_24px_rgba(28,58,77,0.16)]
                "
            >
              <Icon className={`mb-5 text-[34px] ${accent}`} />

              <h2 className="whitespace-pre-line text-[18px] font-extrabold leading-[1.15] text-[#0d1d29]">
                {title}
              </h2>

              <p className="mt-3 whitespace-pre-line text-[13px] font-medium leading-[1.45] text-[#61717d]">
                {description}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <section
        aria-labelledby="home-how-heading"
        className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          How it works
        </p>
        <h2
          id="home-how-heading"
          className="mt-3 max-w-3xl text-2xl font-extrabold text-slate-900 md:text-3xl"
        >
          A clearer path from business idea to approval
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Hospo Hub brings guidance, requirements and support together so you
          can understand what may apply to your hospitality business and what to
          do next.
        </p>
        <ol className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {homeSteps.map((step, index) => {
            const Icon = stepIcons[step.id];
            return (
              <li
                key={step.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon
                    aria-hidden="true"
                    className="text-xl text-primary"
                  />
                </div>
                <h3 className="text-lg font-bold leading-6 text-slate-900">
                  {step.title}
                </h3>
                <p className="mb-3 mt-3 flex-1 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
                <div className="flex flex-wrap gap-x-4">
                  {step.links.map((link) => (
                    <Link key={link.to} to={link.to} className={textLink}>
                      {link.label} →
                    </Link>
                  ))}
                  {step.id === "hub" && (
                    <Link
                      to={isAuthenticated ? "/dashboard" : "/create-account"}
                      className={textLink}
                    >
                      {isAuthenticated ? "Open My Hub" : "Create an account"} →
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
      <section
        aria-labelledby="home-guidance-heading"
        className="border-y border-slate-200 bg-white py-12"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Hospitality guidance
          </p>
          <h2
            id="home-guidance-heading"
            className="mt-3 max-w-3xl text-2xl font-extrabold text-slate-900 md:text-3xl"
          >
            Find the information that matches your business
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Hospo Hub helps you navigate common hospitality requirements without
            having to search across multiple areas first.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {homeServices.map((service) => {
              const Icon = serviceIcons[service.id];
              return (
                <article
                  key={service.id}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-xl text-primary">
                    <Icon aria-hidden="true" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">
                    {service.category}
                  </p>
                  <h3 className="mt-2 text-lg font-bold leading-6 text-slate-900">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {service.description}
                  </p>
                  <ul className="my-4 flex-1 list-disc space-y-1 pl-4 text-sm leading-6 text-slate-600">
                    {service.topics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                  <Link
                    to={service.to}
                    className={`${textLink} border-t border-slate-100 pt-4`}
                  >
                    {service.linkLabel} →
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section
        aria-labelledby="home-next-heading"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
          <h2
            id="home-next-heading"
            className="text-2xl font-extrabold text-slate-900"
          >
            Ready to work out what your business may need?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Start with a few guided questions and use your results to explore
            the right licensing information.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/get-started"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-secondary"
            >
              Get Started
            </Link>
            <Link
              to="/licensing-guide"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-primary px-5 py-3 text-sm font-bold text-primary hover:bg-white"
            >
              Browse Licensing Guide
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className={textLink}>
                Go to My Hub →
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
