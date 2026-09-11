import { FEE_DATA } from "../data/licensingFees";
import { NATIONAL_PROGRAMME_REFERENCES } from "../data/nationalProgrammes";
import { formatNZD } from "../utils/formatNZD";
import { Link, useSearchParams } from "react-router-dom";

import {
  FaUtensils,
  FaWineGlass,
  FaUmbrella,
  FaClipboardCheck,
  FaCheckCircle,
  FaArrowRight,
  FaExternalLinkAlt,
  FaInfoCircle,
} from "react-icons/fa";

/* =========================================================
   LICENSING GUIDE DATA
   ========================================================= */

const FOOD_VERIFICATION = {
  name: "Food verification",
  strapline: "Prepare for an independent check of your food safety practices.",
  image:
    "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
  hero: "Be ready to show how your business keeps food safe.",
  overview: [
    "Registration records your business. Verification independently checks food safety practices under your applicable plan or programme.",
    "A verifier must hold the appropriate recognition. Council or an independent recognised agency may verify your business, depending on your registration pathway.",
  ],
  requirements: [
    "Your applicable food control plan or national programme.",
    "Relevant operating records and access to your food operation.",
    "Previous findings and evidence of corrective actions, where applicable.",
  ],
  process: [
    [
      "Confirm your verifier",
      "Check who can verify your registration pathway and agree timing.",
    ],
    ["Prepare", "Gather relevant records and make your team available."],
    [
      "Verification visit",
      "Show the verifier how your food safety procedures work.",
    ],
    [
      "Follow up",
      "Address agreed corrective actions and keep evidence of completion.",
    ],
  ],
  fees: {
    updated: FEE_DATA.food.year,
    intro: "Verification charges are separate from registration and levies.",
    cards: [
      {
        label: FEE_DATA.food.verification.label,
        amount: FEE_DATA.food.verification.display,
        description:
          "Ask your verifier for a quote, including possible follow-up charges.",
      },
    ],
    note: "Verifiers set their own fees. No fixed verification estimate is provided here.",
    source: {
      label: "MPI: getting your food business verified",
      href: "https://www.mpi.govt.nz/food-business/running-a-food-business/verifying-your-food-business/getting-your-food-business-verified",
    },
  },
  forms: [
    {
      label: "MPI verification guidance and finding a recognised verifier",
      href: "https://www.mpi.govt.nz/food-business/running-a-food-business/verifying-your-food-business/getting-your-food-business-verified",
    },
    {
      label: "MPI: verification topics and relevant records",
      href: "https://www.mpi.govt.nz/dmsdocument/11680/direct",
    },
  ],
  faq: [
    [
      "Is registration the same as verification?",
      "No. Registration and verification are separate requirements.",
    ],
    [
      "When does verification happen?",
      "Timing depends on your registration and programme. Confirm your applicable dates with your verifier.",
    ],
    [
      "What happens after a finding?",
      "Agree the required corrective actions and timeframe with your verifier.",
    ],
  ],
};

const GUIDE_DATA = {
  /* =======================================================
     FOOD BUSINESS REGISTRATION
     ======================================================= */

  food: {
    verification: FOOD_VERIFICATION,
    name: "Food business registration",
    shortName: "Food registration",
    icon: FaUtensils,

    strapline:
      "Register your food business and understand your food safety obligations.",

    image:
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",

    hero: "Prepare, register and operate your food business with confidence.",

    overview: [
      "Most businesses that prepare, manufacture or sell food must operate under the Food Act 2014 and use the risk-based measure that applies to their activities.",

      "Depending on what you do, that may be a Template Food Control Plan (TFCP) or a National Programme. Registration and verification are separate parts of the food safety process.",
    ],

    requirements: [
      "Completed food business registration application.",

      "Completed scope of operations / My Food Rules information.",

      "A site plan for a new food business showing the physical boundaries and layout.",

      "NZ Business Number if the applicant is a registered company.",

      "Confirmation from an independent verification agency if Auckland Council is not your verifier.",

      "Any other approvals relevant to your setup, such as alcohol licensing or outdoor dining.",
    ],

    process: [
      [
        "Check your food activities",
        "Use your proposed menu and food-handling activities to identify the correct Food Control Plan or National Programme.",
      ],

      [
        "Prepare your documents",
        "Gather the registration form, scope of operations, site plan and supporting business details.",
      ],

      [
        "Submit your registration",
        "Lodge the completed registration information with Auckland Council or the relevant registration authority.",
      ],

      [
        "Council reviews the application",
        "Incomplete applications can be delayed or returned. Auckland Council advises that processing can take up to 25 working days.",
      ],

      [
        "Arrange verification",
        "A recognised verifier checks that your business is following the food safety requirements that apply to you.",
      ],
    ],

    fees: {
      updated: FEE_DATA.food.year,

      intro:
        "Food business costs can include council registration, the annual Food Business Levy and separate verification charges.",

      cards: [
        {
          label: FEE_DATA.food.levy.label,
          amount: FEE_DATA.food.levy.display,
          period: FEE_DATA.food.levy.period,

          description:
            "The annual Food Business Levy. For Food Control Plans it is generally charged per registered place, while National Programmes are generally charged per registered business.",
        },

        {
          label: FEE_DATA.food.collectionFee.label,
          amount: FEE_DATA.food.collectionFee.display,
          period: FEE_DATA.food.collectionFee.period,

          description:
            "Territorial authorities may add an administration charge when collecting the Food Business Levy on behalf of MPI.",
        },

        {
          label: FEE_DATA.food.registration.label,
          amount: FEE_DATA.food.registration.display,
          period: "registration / renewal",

          description:
            "Council registration charges depend on your registration pathway, business activities and circumstances.",
        },

        {
          label: FEE_DATA.food.verification.label,
          amount: FEE_DATA.food.verification.display,
          period: "as required",

          description:
            "Verification is separate from registration. Additional fees can apply for follow-up work, corrective actions or additional verification time.",
        },
      ],

      note: FEE_DATA.food.note,

      source: {
        label: "View current Food Act fees and levies",
        href: "https://www.mpi.govt.nz/legal/legislation-standards-and-reviews/legislation-fees-and-charges/food-act-2014-fees-charges-and-levies",
      },
    },

    forms: [
      ...NATIONAL_PROGRAMME_REFERENCES,
      {
        label: "Food business registration application",

        href: "https://www.aucklandcouncil.govt.nz/licences-regulations/business-licences/food-businesses-quality-grading/open-food-business/apply-food-registration/docsapplyforfoodregistration/application-registration-food-business.pdf",
      },

      {
        label: "Food business site guidance",

        href: "https://www.aucklandcouncil.govt.nz/licences-regulations/business-licences/food-businesses-quality-grading/food-business-sites-codes-of-practice/Pages/default.aspx",
      },
    ],

    faq: [
      [
        "Do all food businesses need registration?",

        "Many do, but the exact requirement depends on the food activities and risk-based measure that applies. Use Get Started to identify the requirements that may apply to your business.",
      ],

      [
        "What is the difference between registration and verification?",

        "Registration records the business and its food safety programme. Verification is the follow-up check that confirms the business is actually meeting those food safety requirements.",
      ],

      [
        "Do I need a site plan?",

        "For a new food business, Auckland Council's registration form asks for a site plan showing the physical boundaries and layout of the business.",
      ],

      [
        "Can I also need alcohol or outdoor dining approval?",

        "Yes. Food registration does not replace other approvals. Selling alcohol or using public space for outdoor dining can trigger separate requirements.",
      ],

      [
        "Is the Food Business Levy my total registration cost?",

        "No. The Food Business Levy is one component. Council registration, verification and other applicable charges may also apply.",
      ],
    ],
  },

  /* =======================================================
     ALCOHOL LICENSING
     ======================================================= */

  alcohol: {
    name: "Alcohol licensing",
    shortName: "Alcohol licensing",
    icon: FaWineGlass,

    strapline:
      "Understand on-, off-, club and special licence requirements for selling or supplying alcohol.",

    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",

    hero: "Plan your alcohol licence before you start selling or supplying alcohol.",

    overview: [
      "Businesses that sell or supply alcohol generally need the appropriate licence under the Sale and Supply of Alcohol Act 2012.",

      "The main licence types are on-licence, off-licence, club licence and special licence. The correct type depends on where the alcohol will be consumed and the nature of the business or event.",
    ],

    requirements: [
      "A completed application for the correct alcohol licence type.",

      "Planning and building certificates where required for the licence type.",

      "Floor plans that clearly show the proposed licensed area and entrances.",

      "Food and drinks menus for relevant hospitality premises.",

      "Host responsibility information and other operating policies requested by the application.",

      "Public notification and supporting information required under the alcohol licensing process.",
    ],

    process: [
      [
        "Choose the correct licence",
        "Identify whether you need an on-, off-, club or special licence based on how alcohol will be sold and consumed.",
      ],

      [
        "Prepare certificates and supporting documents",
        "For relevant applications, obtain the required planning and building certificates and prepare plans, menus and host responsibility material.",
      ],

      [
        "Calculate and pay the application fee",
        "For on-, off- and club licences, the application fee depends on the cost/risk rating of the premises.",
      ],

      [
        "Public notification and agency assessment",
        "Applications may require public notice and assessment by the licensing inspector, Police and the Medical Officer of Health.",
      ],

      [
        "District Licensing Committee decision",
        "The District Licensing Committee considers the application and any objections before a licence is granted or declined.",
      ],

      [
        "Pay the annual fee",
        "If the licence is approved, the applicable annual fee must also be paid before the licence is issued.",
      ],
    ],

    fees: {
      updated: FEE_DATA.alcohol.year,

      intro:
        "For on-, off- and club licences, application and annual fees are based on the cost/risk rating of the licensed premises.",

      table: Object.values(FEE_DATA.alcohol.riskLevels).map((fee) => ({
        rating: fee.label,
        score: fee.score,
        application: formatNZD(fee.application),
        annual: formatNZD(fee.annual),
      })),

      note: FEE_DATA.alcohol.note,

      source: {
        label: "View Auckland Council alcohol application guidance",

        href: "https://www.aucklandcouncil.govt.nz/licences-regulations/Documents/alcohol-new-on-licence.pdf",
      },
    },

    forms: [
      {
        label: "New on-licence application",

        href: "https://www.aucklandcouncil.govt.nz/licences-regulations/Documents/alcohol-new-on-licence.pdf",
      },

      {
        label: "Auckland Council alcohol licensing information",

        href: "https://www.aucklandcouncil.govt.nz/licences-regulations/business-licences/alcohol-licences-fines/Pages/default.aspx",
      },
    ],

    faq: [
      [
        "Which alcohol licence do I need?",

        "An on-licence is generally for alcohol consumed at the premises, an off-licence for alcohol taken away, a club licence for eligible clubs, and a special licence for certain events or occasions.",
      ],

      [
        "Can I rely on the previous owner's licence?",

        "A change of operator or ownership can affect licensing. Use the Buying an Existing Business flow under Get Started to identify what needs to be transferred, replaced or updated.",
      ],

      [
        "Why does the application need public notification?",

        "Public notification gives affected members of the community an opportunity to make an objection where the legislation allows it.",
      ],

      [
        "Are fees the same for every business?",

        "No. Application and annual fees for on-, off- and club licences are tied to the premises cost/risk rating.",
      ],

      [
        "Do I pay both the application fee and annual fee?",

        "If your application is approved, yes. The application fee is required to process the application, and the annual fee applies before the approved licence is issued.",
      ],
    ],
  },

  /* =======================================================
     OUTDOOR DINING
     ======================================================= */

  outdoor: {
    name: "Outdoor dining approvals",
    shortName: "Outdoor dining",
    icon: FaUmbrella,

    strapline:
      "Find out when you need approval to use a footpath or other public space for dining.",

    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",

    hero: "Create an outdoor dining area that is safe, accessible and properly approved.",

    overview: [
      "Outdoor dining approval is generally relevant when a hospitality business wants to occupy council-managed public space such as a footpath, shared space or other public area immediately outside the premises.",

      "The approval focuses on safe pedestrian movement, the location and layout of furniture, and compatibility with any food or alcohol licences that also apply.",
    ],

    requirements: [
      "Completed outdoor dining licence application.",

      "A measured site plan showing the public space requested and the proposed furniture layout.",

      "Current food registration or food licence details.",

      "Details or photographs of furniture, screens, umbrellas, heaters or other items proposed for the area.",

      "Compliance with access, safety and public-space conditions.",

      "If alcohol will be served outside, the alcohol licence must also cover the outdoor area.",
    ],

    process: [
      [
        "Confirm the land is public space",
        "If the proposed dining area is on council-managed public land, an outdoor dining approval may be required.",
      ],

      [
        "Prepare the layout plan",
        "Show measurements, accessways, furniture and the area you want to occupy.",
      ],

      [
        "Submit the application and documents",
        "Provide the application form, site plan, current food registration details and any requested supporting information.",
      ],

      [
        "Council assessment and site visit",
        "Auckland Council assesses the proposal and may conduct a site visit to confirm safety and access requirements.",
      ],

      [
        "Pay applicable charges",
        "If approved, applicable licence, application or public-space rental charges must be paid.",
      ],

      [
        "Receive the outdoor dining licence",
        "Once the application is approved and applicable charges are paid, the licence can be issued subject to its conditions.",
      ],
    ],

    fees: {
      updated: FEE_DATA.outdoor.year,

      intro:
        "Outdoor dining costs can include an application or approval charge plus rental for occupying council-managed public space.",

      cards: [
        {
          label: FEE_DATA.outdoor.application.label,
          amount: FEE_DATA.outdoor.application.display,
          period: "non-refundable",

          description:
            "The correct application fee must be provided when lodging an outdoor dining application. Confirm the current Auckland Council amount before submitting.",
        },

        {
          label: FEE_DATA.outdoor.rental.label,
          amount: FEE_DATA.outdoor.rental.display,
          period: "location + approved area",

          description:
            "If your application is approved, a rental or occupation charge may apply for the council-managed public space used by your business.",
        },

        {
          label: "Area used",
          amount: "Measured in m²",
          period: "approved dining footprint",

          description:
            "The size of the approved dining area can affect the public-space rental amount.",
        },

        {
          label: "Location",
          amount: "Location dependent",
          period: "council charging area",

          description:
            "Charges can vary depending on the location and value of the public space occupied.",
        },
      ],

      note: "The final charge can depend on the location and size of the approved outdoor dining area. Confirm the current council application and rental charges before lodging.",

      source: {
        label: "View outdoor dining application information",

        href: "https://www.aucklandcouncil.govt.nz/licences-regulations/business-licences/outdoor-dining-licenses/Documents/outdoordiningapplication2015.pdf",
      },
    },

    forms: [
      {
        label: "Outdoor dining licence application",

        href: "https://www.aucklandcouncil.govt.nz/licences-regulations/business-licences/outdoor-dining-licenses/Documents/outdoordiningapplication2015.pdf",
      },

      {
        label: "Outdoor dining rules and guidance",

        href: "https://www.aucklandcouncil.govt.nz/licences-regulations/business-licences/outdoor-dining-licenses/apply-outdoor-dining-licence/Pages/know-the-outdoor-dining-rules.aspx",
      },
    ],

    faq: [
      [
        "Do I need approval if the tables are on private property?",

        "Outdoor dining approval is mainly about occupying council-managed public space. Other planning, building, food or alcohol requirements may still apply on private land.",
      ],

      [
        "What should the site plan show?",

        "It should clearly show the area requested, measurements, the building edge and kerb, pedestrian access and the position of tables, chairs and other furniture.",
      ],

      [
        "Can I serve alcohol in the outdoor area?",

        "Only if your alcohol licence allows alcohol to be supplied in that area. The licensed footprint may need to include the outdoor dining space.",
      ],

      [
        "Why can Council require a site visit?",

        "The site visit helps confirm that the proposed layout maintains safe and accessible public movement and matches the information in the application.",
      ],

      [
        "Is there one fixed outdoor dining fee?",

        "Not necessarily. An application charge may apply, and public-space rental can depend on the location and size of the approved area.",
      ],
    ],
  },
};

/* =========================================================
   TABS
   ========================================================= */

const TABS = [
  {
    id: "overview",
    label: "Overview",
  },

  {
    id: "requirements",
    label: "Requirements",
  },

  {
    id: "process",
    label: "Process",
  },

  {
    id: "fees",
    label: "Fees",
  },

  {
    id: "forms",
    label: "Forms",
  },

  {
    id: "faq",
    label: "FAQ",
  },
];

/* =========================================================
   COMPONENT
   ========================================================= */

export default function LicensingGuide() {
  const [searchParams, setSearchParams] = useSearchParams();

  /*
    Supports BOTH:
    /licensing-guide?guide=food

    and:
    /licensing-guide?type=food
  */

  const urlGuide = searchParams.get("guide") || searchParams.get("type");

  const activeGuide = Object.hasOwn(GUIDE_DATA, urlGuide) ? urlGuide : "food";
  const tabs =
    activeGuide === "food"
      ? [
          ...TABS.slice(0, 2),
          { id: "verification", label: "Verification" },
          ...TABS.slice(2),
        ]
      : TABS;
  const requestedTab =
    urlGuide === "verification" ? "verification" : searchParams.get("tab");
  const activeTab = tabs.some((tab) => tab.id === requestedTab)
    ? requestedTab
    : "overview";
  const setActiveTab = (tab) => setSearchParams({ guide: activeGuide, tab });
  const guide = GUIDE_DATA[activeGuide];

  const GuideIcon = guide.icon;

  /* =======================================================
     SELECT GUIDE
     ======================================================= */

  const chooseGuide = (id) => {
    setSearchParams({
      guide: id,
    });

    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  return (
    <div className="flex flex-col gap-8 py-8 md:flex-row">
      {/* ================================================= */}
      {/* LEFT SIDEBAR */}
      {/* ================================================= */}

      <aside className="w-full flex-shrink-0 md:w-72">
        <h3 className="mb-4 px-4 font-bold text-gray-900">
          Licensing Guide
        </h3>

        <nav
          aria-label="Hospitality services"
          className="flex flex-col space-y-1"
        >
          {Object.entries(GUIDE_DATA).map(([id, item]) => {
            const Icon = item.icon;

            const active = activeGuide === id;

            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => chooseGuide(id)}
                className={`flex items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-50 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`text-lg ${
                    active
                      ? "text-primary"
                      : "text-gray-400"
                  }`}
                />

                {item.name}
              </button>
            );
          })}

          {/* GET STARTED */}

          <Link
            to="/get-started"
            className="mt-2 flex items-center gap-3 rounded-md border border-[#D6E5EE] bg-[#F7FBFD] px-4 py-3 text-left text-sm font-semibold text-primary transition hover:bg-blue-50"
          >
            <FaClipboardCheck className="text-lg" />
            Check requirements
          </Link>
        </nav>

        {/* SIDEBAR CTA */}

        <div className="mt-6 rounded-lg border border-[#DCE7EE] bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
            Not sure where to start?
          </p>

          <p className="mt-2 text-sm leading-5 text-gray-600">
            Tell us whether you are opening, buying or changing a hospitality
            business and we will guide you through the relevant requirements.
          </p>

          <Link
            to="/get-started"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary"
          >
            Get started
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </aside>

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <main className="max-w-4xl flex-1">
        {/* PAGE HEADING */}

        <div className="mb-6 flex items-start gap-4">
          <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl text-primary">
            <GuideIcon />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {guide.name}
            </h1>

            <p className="mt-2 text-lg text-gray-600">
              {guide.strapline}
            </p>
          </div>
        </div>

        {/* ================================================= */}
        {/* HERO IMAGE */}
        {/* ================================================= */}

        <div className="relative mb-8 h-64 w-full overflow-hidden rounded-xl bg-gray-200">
          <img
            src={guide.image}
            alt=""
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 flex items-center bg-gradient-to-r from-black/65 via-black/30 to-transparent p-8">
            <h2 className="max-w-lg text-3xl font-bold leading-tight text-white">
              {guide.hero}
            </h2>
          </div>
        </div>

        {/* ================================================= */}
        {/* TABS */}
        {/* ================================================= */}

        <div className="mb-8 overflow-x-auto border-b border-gray-200">
          <nav className="flex min-w-max space-x-8 px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* ================================================= */}
        {/* CONTENT AREA */}
        {/* ================================================= */}

        <section className="mb-12 min-h-[330px]">
          {/* ================================================= */}
          {/* OVERVIEW */}
          {/* ================================================= */}

          {activeGuide === "food" &&
            ["overview", "requirements", "forms", "faq"].includes(
              activeTab,
            ) && (
              <p className="mb-6 rounded-lg bg-blue-50 p-4 text-gray-700">
                Food registration includes planning for verification.{" "}
                <Link
                  to="/licensing-guide?guide=food&tab=verification"
                  className="font-bold text-primary underline"
                >
                  Explore verification, preparation and recognised verifier
                  resources
                </Link>
                .
              </p>
            )}
          {activeTab === "overview" && (
            <div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                About {guide.shortName.toLowerCase()}
              </h2>

              <div className="space-y-4 text-[15px] leading-7 text-gray-700">
                {guide.overview.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/get-started"
                  className="rounded-md bg-primary px-6 py-3 font-medium text-white transition hover:bg-secondary"
                >
                  Check requirements
                </Link>

                <button
                  type="button"
                  onClick={() => setActiveTab("forms")}
                  className="rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-primary transition hover:bg-gray-50"
                >
                  View forms
                </button>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* REQUIREMENTS */}
          {/* ================================================= */}

          {activeTab === "requirements" && (
            <div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                What you may need
              </h2>

              <p className="mb-6 text-gray-600">
                Use this as a preparation checklist. Your exact requirements can
                vary by business activity and location.
              </p>

              <div className="grid gap-3">
                {guide.requirements.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <FaCheckCircle className="mt-1 shrink-0 text-green-600" />

                    <span className="text-sm leading-6 text-gray-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-gray-700">
                <div className="flex gap-3">
                  <FaInfoCircle className="mt-0.5 shrink-0 text-primary" />

                  <p>
                    For guidance based on your business situation, use{" "}
                    <Link
                      to="/get-started"
                      className="font-bold text-primary underline"
                    >
                      Get Started
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* PROCESS */}
          {/* ================================================= */}

          {activeTab === "verification" && guide.verification && (
            <div className="space-y-6 text-gray-700">
              <h2 className="text-2xl font-bold text-gray-900">
                Verification for food businesses
              </h2>
              <p className="font-semibold">{guide.verification.hero}</p>
              {guide.verification.overview.map((text) => (
                <p key={text} className="leading-7">
                  {text}
                </p>
              ))}
              <section className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  Preparing for verification
                </h3>
                <ul className="list-disc space-y-2 pl-5">
                  {guide.verification.requirements.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  Your verifier, visit and follow-up
                </h3>
                <ol className="list-decimal space-y-4 pl-5">
                  {guide.verification.process.map(([title, text]) => (
                    <li key={title}>
                      <strong>{title}</strong>
                      <p className="mt-1 leading-7">{text}</p>
                    </li>
                  ))}
                </ol>
              </section>
              <section className="rounded-lg border border-gray-200 p-5">
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  Separate verification charges
                </h3>
                <p>{guide.verification.fees.intro}</p>
                {guide.verification.fees.cards.map((card) => (
                  <p key={card.label} className="mt-3">
                    <strong>
                      {card.label}: {card.amount}.
                    </strong>{" "}
                    {card.description}
                  </p>
                ))}
                <p className="mt-3 text-sm">{guide.verification.fees.note}</p>
              </section>
              <section>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  Verification resources
                </h3>
                <ul className="space-y-2">
                  {guide.verification.forms.map((resource) => (
                    <li key={resource.href}>
                      <a
                        className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline"
                        href={resource.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resource.label}
                        <FaExternalLinkAlt aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  Food verification FAQs
                </h3>
                {guide.verification.faq.map(([question, answer]) => (
                  <details
                    key={question}
                    className="border-b border-gray-200 py-3"
                  >
                    <summary className="min-h-11 cursor-pointer font-semibold">
                      {question}
                    </summary>
                    <p className="pb-3 leading-7">{answer}</p>
                  </details>
                ))}
                <Link
                  className="inline-flex min-h-11 items-center font-semibold text-primary underline"
                  to="/help/faqs?category=food&search=verification"
                >
                  More food verification questions
                </Link>
              </section>
            </div>
          )}

          {activeTab === "process" && (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Typical process
              </h2>

              <div className="space-y-4">
                {guide.process.map(([title, description], index) => (
                  <div
                    key={title}
                    className="flex gap-4 rounded-lg border border-gray-200 bg-white p-5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-white">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900">
                        {title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* FEES */}
          {/* ================================================= */}

          {activeTab === "fees" && (
            <div>
              {/* FEES HEADER */}

              <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Fees and charges
                  </h2>

                  <p className="mt-2 max-w-2xl text-gray-600">
                    {guide.fees.intro}
                  </p>
                </div>

                <span className="inline-flex w-fit whitespace-nowrap rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-primary">
                  {guide.fees.updated}
                </span>
              </div>

              {/* ============================================= */}
              {/* FOOD / OUTDOOR DINING FEE CARDS */}
              {/* ============================================= */}

              {guide.fees.cards && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {guide.fees.cards.map((fee) => (
                    <div
                      key={fee.label}
                      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400">
                        {fee.label}
                      </p>

                      <div className="mt-3">
                        <p className="text-2xl font-extrabold text-gray-900">
                          {fee.amount}
                        </p>

                        {fee.period && (
                          <p className="mt-1 text-xs font-medium text-gray-500">
                            {fee.period}
                          </p>
                        )}
                      </div>

                      <p className="mt-4 text-sm leading-6 text-gray-600">
                        {fee.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* ============================================= */}
              {/* ALCOHOL FEE TABLE */}
              {/* ============================================= */}

              {guide.fees.table && (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px]">
                      <thead className="bg-[#F4F8FB]">
                        <tr>
                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                            Risk rating
                          </th>

                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                            Score
                          </th>

                          <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                            Application fee
                          </th>

                          <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                            Annual fee
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {guide.fees.table.map((fee) => (
                          <tr
                            key={fee.rating}
                            className="transition hover:bg-gray-50"
                          >
                            <td className="px-5 py-4">
                              <span className="font-semibold text-gray-900">
                                {fee.rating}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-600">
                              {fee.score}
                            </td>

                            <td className="px-5 py-4 text-right font-bold text-gray-900">
                              {fee.application}
                            </td>

                            <td className="px-5 py-4 text-right font-bold text-primary">
                              {fee.annual}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-xs text-gray-500">
                    Amounts shown include GST.
                  </div>
                </div>
              )}

              {/* ============================================= */}
              {/* IMPORTANT FEE NOTE */}
              {/* ============================================= */}

              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex gap-3">
                  <FaInfoCircle className="mt-0.5 shrink-0 text-primary" />

                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Important
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {guide.fees.note}
                    </p>
                  </div>
                </div>
              </div>

              {/* OFFICIAL FEE SOURCE */}

              {guide.fees.source && (
                <a
                  href={guide.fees.source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                >
                  {guide.fees.source.label}

                  <FaExternalLinkAlt className="text-xs" />
                </a>
              )}

              <p className="mt-4 text-xs leading-5 text-gray-500">
                Fees and charges can change. Always confirm the latest amount
                with Auckland Council or the relevant authority before
                submitting an application.
              </p>
            </div>
          )}

          {/* ================================================= */}
          {/* FORMS */}
          {/* ================================================= */}

          {activeTab === "forms" && (
            <div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Forms and official guidance
              </h2>

              <p className="mb-6 text-gray-600">
                Open the current Auckland Council or MPI form or guidance page
                in a new tab.
              </p>

              <div className="space-y-3">
                {guide.forms.map((form) => (
                  <a
                    key={form.href}
                    href={form.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-5 font-semibold text-primary transition hover:border-primary hover:bg-blue-50"
                  >
                    <span>{form.label}</span>

                    <FaExternalLinkAlt className="shrink-0 text-xs" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* FAQ */}
          {/* ================================================= */}

          {activeTab === "faq" && (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Frequently asked questions
              </h2>

              <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
                {guide.faq.map(([question, answer]) => (
                  <details key={question} className="group p-5">
                    <summary className="cursor-pointer list-none font-bold text-gray-900 marker:hidden">
                      <div className="flex items-center justify-between gap-4">
                        <span>{question}</span>

                        <span className="text-xl font-normal text-primary transition group-open:rotate-45">
                          +
                        </span>
                      </div>
                    </summary>

                    <p className="mt-3 pr-8 text-sm leading-6 text-gray-600">
                      {answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ================================================= */}
        {/* BOTTOM CTA */}
        {/* ================================================= */}

        <div className="rounded-xl bg-[#F2F8FC] p-6 md:flex md:items-center md:justify-between md:gap-6">
          <div>
            <h3 className="font-extrabold text-gray-900">
              Still unsure what applies to your business?
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              Start with your business situation and Hospo Hub will guide you
              through the requirements that may apply.
            </p>
          </div>

          <Link
            to="/get-started"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary md:mt-0"
          >
            Get started
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </main>
    </div>
  );
}
