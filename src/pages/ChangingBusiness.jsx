import EstimatedFees, { FeeGuideLink } from "../components/EstimatedFees";
import SaveRequirements from "../components/SaveRequirements";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCheckCircle,
  FaGlassMartiniAlt,
  FaInfoCircle,
  FaStore,
  FaUmbrellaBeach,
  FaUtensils,
  FaUsers,
  FaClock,
  FaBuilding,
} from "react-icons/fa";

const STEPS = [
  { id: "details", label: "Current details" },
  { id: "changes", label: "What's changing" },
  { id: "requirements", label: "Requirements" },
  { id: "summary", label: "Summary" },
];

const CHANGE_OPTIONS = [
  {
    id: "alcohol",
    title: "Add alcohol",
    description: "Begin selling or serving alcohol.",
    icon: FaGlassMartiniAlt,
  },
  {
    id: "outdoor",
    title: "Add outdoor dining",
    description: "Add outdoor tables or seating.",
    icon: FaUmbrellaBeach,
  },
  {
    id: "food",
    title: "Change menu / food activities",
    description: "Change the type of food prepared or sold.",
    icon: FaUtensils,
  },
  {
    id: "capacity",
    title: "Increase seating capacity",
    description: "Increase the number of customers or seats.",
    icon: FaUsers,
  },
  {
    id: "layout",
    title: "Renovations / layout changes",
    description: "Make physical changes to the premises.",
    icon: FaBuilding,
  },
  {
    id: "hours",
    title: "Change trading hours",
    description: "Open earlier, later or on different days.",
    icon: FaClock,
  },
];

const inputClass =
  "w-full rounded-lg border border-[#C5D5DE] bg-white px-4 py-3 text-sm text-[#203746] outline-none transition focus:border-[#0086C9] focus:ring-2 focus:ring-[#DDF2FC]";

export default function ChangingBusiness() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState("details");

  const [business, setBusiness] = useState({
    name: "",
    type: "",
    location: "",
  });

  const [changes, setChanges] = useState(["alcohol", "outdoor"]);

  const currentIndex = STEPS.findIndex((step) => step.id === current);

  const updateBusiness = (field, value) => {
    setBusiness((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const toggleChange = (id) => {
    setChanges((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  /*
   * REQUIREMENT LOGIC
   */

  const requirements = useMemo(() => {
    const items = [];

    if (changes.includes("alcohol")) {
      items.push({
        id: "alcohol",
        title: "Alcohol On Licence",
        description:
          "You may need an On Licence if alcohol will be sold or served for consumption on the premises.",
        icon: FaGlassMartiniAlt,
      });
    }

    if (changes.includes("outdoor")) {
      items.push({
        id: "outdoor",
        title: "Outdoor Dining Approval",
        description:
          "Outdoor tables or seating on council-managed public space may require approval.",
        icon: FaUmbrellaBeach,
      });
    }

    if (changes.includes("food")) {
      items.push({
        id: "food",
        title: "Update food registration",
        description:
          "Review your food registration and food programme if your menu or food activities are changing.",
        icon: FaUtensils,
      });
    }

    if (changes.includes("capacity")) {
      items.push({
        id: "capacity",
        title: "Review premises capacity",
        description:
          "An increase in seating capacity may affect existing conditions, layouts or other approvals.",
        icon: FaUsers,
      });
    }

    if (changes.includes("layout")) {
      items.push({
        id: "layout",
        title: "Review premises or layout requirements",
        description:
          "Renovations or physical layout changes may require additional council review.",
        icon: FaBuilding,
      });
    }

    if (changes.includes("hours")) {
      items.push({
        id: "hours",
        title: "Review trading hours",
        description:
          "Changing trading hours may affect existing licence conditions or approvals.",
        icon: FaClock,
      });
    }

    return items;
  }, [changes]);

  /*
   * NAVIGATION
   */

  const next = () => {
    const index = STEPS.findIndex((step) => step.id === current);

    if (index < STEPS.length - 1) {
      setCurrent(STEPS[index + 1].id);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const back = () => {
    const index = STEPS.findIndex((step) => step.id === current);

    if (index === 0) {
      navigate("/get-started");
      return;
    }

    setCurrent(STEPS[index - 1].id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1180px] py-6">
      {/* BACK TO GET STARTED */}

      <button
        type="button"
        onClick={() => navigate("/get-started")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#46606F] transition hover:text-primary"
      >
        <FaArrowLeft className="text-xs" />
        Back to Get Started
      </button>

      {/* PAGE HEADER */}

      <div className="mb-7 flex items-start justify-between gap-6">
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-primary">
            Changing an existing operation
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#071B2B] md:text-[38px]">
            Update your hospitality business
          </h1>

          <p className="mt-3 max-w-[760px] text-[15px] leading-6 text-[#607382]">
            Tell us what you&apos;re changing and Hospo Hub will help identify
            which licences, registrations or approvals may need to be updated.
          </p>
        </div>

        <div className="hidden rounded-lg border border-[#CFE3EF] bg-[#F3FAFE] px-5 py-4 text-right lg:block">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#718493]">
            Scenario
          </p>

          <p className="mt-1 text-sm font-extrabold text-primary">
            Changing an existing operation
          </p>
        </div>
      </div>

      {/* STEPPER */}

      <div className="mb-8 rounded-xl border border-[#DFE7EC] bg-white px-7 py-5 shadow-[0_2px_10px_rgba(20,50,68,0.04)]">
        <div className="relative flex justify-between">
          <div className="absolute left-[12%] right-[12%] top-[17px] h-[2px] bg-[#D8E3EA]" />

          <div
            className="absolute left-[12%] top-[17px] h-[2px] bg-[#0076B8] transition-all duration-300"
            style={{
              width: `${(currentIndex / 3) * 76}%`,
            }}
          />

          {STEPS.map((step, index) => {
            const active = step.id === current;
            const complete = index < currentIndex;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (index <= currentIndex) {
                    setCurrent(step.id);
                  }
                }}
                className="relative z-10 flex w-1/4 flex-col items-center"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-extrabold transition ${
                    active
                      ? "border-[#0086C9] bg-[#0086C9] text-white"
                      : complete
                        ? "border-[#0066A1] bg-[#0066A1] text-white"
                        : "border-[#C7D6E0] bg-white text-[#718493]"
                  }`}
                >
                  {complete ? <FaCheck className="text-xs" /> : index + 1}
                </div>

                <span
                  className={`mt-2 text-center text-[11px] font-semibold ${
                    active
                      ? "text-primary"
                      : "text-[#6B7F8C]"
                  }`}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DESKTOP WORKSPACE */}

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_290px]">
        {/* MAIN PANEL */}

        <section className="rounded-xl border border-[#DFE7EC] bg-white p-8 shadow-[0_4px_18px_rgba(20,50,68,0.06)] md:p-10">
          {/* ============================= */}
          {/* STEP 1 - CURRENT DETAILS */}
          {/* ============================= */}

          {current === "details" && (
            <>
              <StepHeading
                eyebrow="Current details"
                title="Tell us about your current business"
                description="Enter your existing hospitality business details before telling us what will change."
              />

              <div className="grid grid-cols-2 gap-6">
                <Field label="Business name">
                  <input
                    type="text"
                    value={business.name}
                    onChange={(event) =>
                      updateBusiness("name", event.target.value)
                    }
                    placeholder="e.g. The Bay Bistro"
                    className={inputClass}
                  />
                </Field>

                <Field label="Business type">
                  <select
                    value={business.type}
                    onChange={(event) =>
                      updateBusiness("type", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Select business type</option>

                    <option>Cafe</option>
                    <option>Restaurant</option>
                    <option>Bar or pub</option>
                    <option>Takeaway</option>
                    <option>Food shop</option>
                    <option>Catering</option>
                    <option>Other</option>
                  </select>
                </Field>

                <Field label="Business location">
                  <select
                    value={business.location}
                    onChange={(event) =>
                      updateBusiness("location", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Select location</option>

                    <option>Auckland Central</option>

                    <option>Ponsonby, Auckland</option>

                    <option>Mission Bay, Auckland</option>

                    <option>Newmarket, Auckland</option>

                    <option>Takapuna, Auckland</option>

                    <option>Other Auckland area</option>
                  </select>
                </Field>
              </div>

              <InfoBox>
                We&apos;ll use these business details together with your planned
                changes to determine what may need to be reviewed.
              </InfoBox>
            </>
          )}

          {/* ============================= */}
          {/* STEP 2 - WHAT'S CHANGING */}
          {/* ============================= */}

          {current === "changes" && (
            <>
              <StepHeading
                eyebrow="What's changing"
                title="What are you changing?"
                description="Select everything that applies to your business."
              />

              <div className="grid grid-cols-2 gap-4">
                {CHANGE_OPTIONS.map((item) => {
                  const Icon = item.icon;
                  const selected = changes.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleChange(item.id)}
                      className={`relative min-h-[135px] rounded-xl border-2 p-5 text-left transition ${
                        selected
                          ? "border-[#0086C9] bg-[#F1FAFE] shadow-[0_3px_12px_rgba(0,134,201,0.07)]"
                          : "border-[#DFE7EC] bg-white hover:border-[#8CCBEA]"
                      }`}
                    >
                      {/* CHECK BOX */}

                      <div
                        className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded border-2 ${
                          selected
                            ? "border-[#0086C9] bg-[#0086C9] text-white"
                            : "border-[#B6C8D3] bg-white"
                        }`}
                      >
                        {selected && <FaCheck className="text-[10px]" />}
                      </div>

                      <Icon className="mb-4 text-2xl text-primary" />

                      <h3 className="pr-10 text-sm font-extrabold text-[#102B3A]">
                        {item.title}
                      </h3>

                      <p className="mt-2 max-w-[280px] text-xs leading-5 text-[#718493]">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <InfoBox>
                Select all relevant changes. Your answers determine which
                existing approvals should be reviewed and which new approvals
                may be required.
              </InfoBox>
            </>
          )}

          {/* ============================= */}
          {/* STEP 3 - REQUIREMENTS */}
          {/* ============================= */}

          {current === "requirements" && (
            <>
              <StepHeading
                eyebrow="Your requirements"
                title="What you may need"
                description="Based on the changes you selected, these are the likely items to review."
              />

              {requirements.length > 0 ? (
                <div className="space-y-4">
                  {requirements.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-5 rounded-xl border border-[#DCE6EB] bg-white p-6"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF7FC] text-xl text-primary">
                          <Icon />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <FaCheckCircle className="shrink-0 text-[#0086C9]" />

                            <h3 className="font-extrabold text-[#203746]">
                              {item.title}
                            </h3>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-[#607382]">
                            {item.description}
                          </p>
                        </div>

                        <FaArrowRight className="mt-4 text-primary" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-[#DCE6EB] bg-[#F8FAFB] p-7">
                  <FaInfoCircle className="mb-3 text-xl text-primary" />

                  <h3 className="font-extrabold text-[#203746]">
                    No changes selected
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#607382]">
                    Go back and select the changes you plan to make so Hospo Hub
                    can suggest the relevant requirements.
                  </p>
                </div>
              )}

              <div className="mt-6 rounded-lg border border-[#D7E9F4] bg-[#F2F9FD] p-5">
                <div className="flex gap-4">
                  <FaInfoCircle className="mt-1 shrink-0 text-primary" />

                  <p className="text-sm leading-6 text-[#526A78]">
                    We&apos;ll guide you through the relevant requirements based
                    on the changes you selected. Final requirements should be
                    confirmed with Auckland Council.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ============================= */}
          {/* STEP 4 - SUMMARY */}
          {/* ============================= */}

          {current === "summary" && (
            <>
              <StepHeading
                eyebrow="Summary"
                title="Your business change summary"
                description="Review your current business and the likely approvals or updates identified."
              />

              {/* BUSINESS */}

              <div className="rounded-xl border border-[#DCE6EB] bg-[#F8FAFB] p-6">
                <div className="flex items-start gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#EAF5FB] text-2xl text-primary">
                    <FaStore />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-[#071B2B]">
                      {business.name || "Business name not provided"}
                    </h3>

                    <p className="mt-1 text-sm text-[#607382]">
                      {business.type || "Business type not selected"}
                    </p>

                    {business.location && (
                      <p className="mt-1 text-sm text-[#607382]">
                        {business.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* CHANGES */}

              <div className="mt-6">
                <h3 className="mb-4 font-extrabold text-[#203746]">
                  Changes selected
                </h3>

                <div className="flex flex-wrap gap-2">
                  {changes.length > 0 ? (
                    changes.map((id) => {
                      const item = CHANGE_OPTIONS.find(
                        (option) => option.id === id,
                      );

                      return (
                        <span
                          key={id}
                          className="rounded-full border border-[#BBDCED] bg-[#F1FAFE] px-4 py-2 text-sm font-semibold text-primary"
                        >
                          {item?.title}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-sm text-[#718493]">
                      No changes selected
                    </span>
                  )}
                </div>
              </div>

              {/* REQUIREMENTS */}

              <div className="mt-7">
                <h3 className="mb-4 font-extrabold text-[#203746]">
                  Likely requirements
                </h3>

                <div className="space-y-3">
                  {requirements.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg border border-[#E0E8ED] px-5 py-4"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF5FB]">
                        <FaCheck className="text-[9px] text-primary" />
                      </div>

                      <div className="text-sm font-semibold text-[#405966]">
                        {item.title}
                        <div>
                          <FeeGuideLink category={item.id} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SUMMARY LOWER GRID */}

              <EstimatedFees
                food={requirements.some((item) => item.id === "food")}
                alcohol={requirements.some((item) => item.id === "alcohol")}
                outdoor={requirements.some((item) => item.id === "outdoor")}
                review
              />
              <SaveRequirements
                categories={requirements
                  .map((item) => item.id)
                  .filter((id) => ["food", "alcohol", "outdoor"].includes(id))}
                business={business}
                scenario="changing-existing-business"
                answers={{ changes }}
              />
              <div className="mt-7">
                <div className="rounded-xl border border-[#D7E9F4] bg-[#F2F9FD] p-6">
                  <FaCheckCircle className="text-2xl text-primary" />

                  <h3 className="mt-3 font-extrabold text-[#203746]">
                    Review before applying
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#607382]">
                    Review the detailed guidance for each relevant approval
                    before submitting your changes.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* BOTTOM NAV */}

          <div className="mt-10 flex items-center justify-between border-t border-[#E1E9ED] pt-6">
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-2 rounded-md border border-[#B8CBD6] bg-white px-6 py-3 text-sm font-bold text-[#405966] transition hover:bg-[#F6F9FA]"
            >
              <FaArrowLeft className="text-xs" />
              Back
            </button>

            {current !== "summary" ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-3 rounded-md bg-primary px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-secondary"
              >
                Next
                <FaArrowRight className="text-xs" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/licensing-guide")}
                className="inline-flex items-center gap-3 rounded-md bg-primary px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-secondary"
              >
                View full summary
                <FaArrowRight className="text-xs" />
              </button>
            )}
          </div>
        </section>

        {/* RIGHT SIDEBAR */}

        <aside className="space-y-5">
          <div className="rounded-xl border border-[#DCE6EB] bg-white p-6 shadow-[0_3px_14px_rgba(20,50,68,0.05)]">
            <h3 className="text-lg font-extrabold text-[#071B2B]">
              Change summary
            </h3>

            <div className="mt-5 space-y-4">
              <SummaryRow
                label="Business"
                value={business.name || "Not provided yet"}
              />

              <SummaryRow
                label="Business type"
                value={business.type || "Not selected yet"}
              />

              <SummaryRow
                label="Location"
                value={business.location || "Not selected yet"}
              />

              <SummaryRow
                label="Changes"
                value={
                  changes.length
                    ? `${changes.length} selected`
                    : "None selected"
                }
              />

              <SummaryRow
                label="Requirements"
                value={`${requirements.length} identified`}
              />
            </div>
          </div>

          {/* HELP */}

          <div className="rounded-xl border border-[#D7E9F4] bg-[#F2F9FD] p-6">
            <FaInfoCircle className="mb-3 text-xl text-primary" />

            <h3 className="font-extrabold text-[#203746]">
              Need more help?
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#607382]">
              Use the licensing guide or contact Auckland Council if you&apos;re
              unsure whether your proposed changes require an update.
            </p>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={() => navigate("/licensing-guide")}
                className="flex w-full items-center justify-between rounded-md border border-[#C6DBE7] bg-white px-4 py-3 text-sm font-bold text-primary transition hover:border-secondary"
              >
                View Licensing Guide
                <FaArrowRight className="text-xs" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/help")}
                className="flex w-full items-center justify-between rounded-md border border-[#C6DBE7] bg-white px-4 py-3 text-sm font-bold text-primary transition hover:border-secondary"
              >
                Contact us
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ==============================
   SMALL COMPONENTS
============================== */

function StepHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-primary">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#071B2B]">
        {title}
      </h2>

      <p className="mt-2 max-w-[720px] text-[15px] leading-6 text-[#607382]">
        {description}
      </p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-extrabold text-[#304957]">
        {label}
      </label>

      {children}
    </div>
  );
}

function InfoBox({ children }) {
  return (
    <div className="mt-7 flex gap-4 rounded-lg border border-[#D8EAF5] bg-[#F3FAFE] p-5">
      <FaInfoCircle className="mt-1 shrink-0 text-primary" />

      <p className="text-sm leading-6 text-[#526A78]">
        {children}
      </p>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="border-b border-[#EDF1F4] pb-4 last:border-0 last:pb-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#81929C]">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold leading-5 text-[#304957]">
        {value}
      </p>
    </div>
  );
}
