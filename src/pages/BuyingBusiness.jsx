import EstimatedFees, { FeeGuideLink } from '../components/EstimatedFees';
import SaveRequirements from '../components/SaveRequirements';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCheckCircle,
  FaClipboardCheck,
  FaGlassMartiniAlt,
  FaInfoCircle,
  FaStore,
  FaUmbrellaBeach,
  FaUtensils,
  FaUserEdit,
} from 'react-icons/fa';

const STEPS = [
  { id: 'details', label: 'Business details' },
  { id: 'approvals', label: 'Existing approvals' },
  { id: 'changes', label: 'Changes' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'summary', label: 'Summary' },
];

const CHANGE_OPTIONS = [
  {
    id: 'owner',
    title: 'Change of owner',
    description: 'Transfer the business to a new owner.',
  },
  {
    id: 'name',
    title: 'New business name',
    description: 'Change the trading or registered business name.',
  },
  {
    id: 'food',
    title: 'New menu / food activities',
    description: 'Change the way food is prepared, handled or sold.',
  },
  {
    id: 'hours',
    title: 'Change trading hours',
    description: 'Open earlier, later or on different days.',
  },
  {
    id: 'alcohol',
    title: 'Add or remove alcohol',
    description: 'Change how alcohol is sold or served.',
  },
  {
    id: 'outdoor',
    title: 'Add outdoor dining',
    description: 'Introduce outdoor tables or seating.',
  },
  {
    id: 'layout',
    title: 'Renovations / layout changes',
    description: 'Make physical changes to the premises.',
  },
];

const inputClass =
  'w-full rounded-lg border border-[#C5D5DE] bg-white px-4 py-3 text-sm text-[#203746] outline-none transition focus:border-[#0086C9] focus:ring-2 focus:ring-[#DDF2FC]';

export default function BuyingBusiness() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState('details');

  const [business, setBusiness] = useState({
    name: '',
    owner: '',
    type: '',
  });

  const [approvals, setApprovals] = useState({
    foodRegistration: true,
    foodProgramme: true,
    alcoholLicence: true,
    outdoorDining: false,
  });

  const [changes, setChanges] = useState([
    'owner',
    'hours',
  ]);

  const currentIndex = STEPS.findIndex(
    (step) => step.id === current,
  );

  const updateBusiness = (field, value) => {
    setBusiness((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const toggleApproval = (field) => {
    setApprovals((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const toggleChange = (id) => {
    setChanges((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const requirements = useMemo(() => {
    const items = [];

    if (changes.includes('owner')) {
      items.push({
        id: 'ownership',
        title: 'Update ownership details',
        description:
          'Council records and relevant registrations may need to be updated for the new owner.',
        icon: FaUserEdit,
      });
    }

    if (
      approvals.alcoholLicence &&
      (changes.includes('owner') ||
        changes.includes('alcohol') ||
        changes.includes('hours'))
    ) {
      items.push({
        id: 'alcohol',
        title: 'Update alcohol licence information',
        description:
          'Your existing alcohol licence should be reviewed to confirm what needs to change.',
        icon: FaGlassMartiniAlt,
      });
    }

    if (changes.includes('hours')) {
      items.push({
        id: 'hours',
        title: 'Review trading hours',
        description:
          'Confirm whether your proposed trading hours affect any existing approvals or licence conditions.',
        icon: FaClipboardCheck,
      });
    }

    if (
      approvals.foodRegistration ||
      approvals.foodProgramme
    ) {
      items.push({
        id: 'food',
        title: 'Reconfirm food programme details',
        description:
          'Check that the current food registration and food programme remain suitable after the business changes.',
        icon: FaUtensils,
      });
    }

    if (
      changes.includes('outdoor') ||
      approvals.outdoorDining
    ) {
      items.push({
        id: 'outdoor',
        title: 'Review outdoor dining approval',
        description:
          'Outdoor seating may require an existing approval to be transferred, updated or reapplied for.',
        icon: FaUmbrellaBeach,
      });
    }

    return items;
  }, [changes, approvals]);

  const next = () => {
    const index = STEPS.findIndex(
      (step) => step.id === current,
    );

    if (index < STEPS.length - 1) {
      setCurrent(STEPS[index + 1].id);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const back = () => {
    const index = STEPS.findIndex(
      (step) => step.id === current,
    );

    if (index === 0) {
      navigate('/get-started');
      return;
    }

    setCurrent(STEPS[index - 1].id);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1180px] py-6">
      {/* BACK */}

      <button
        type="button"
        onClick={() => navigate('/get-started')}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#46606F] transition hover:text-primary"
      >
        <FaArrowLeft className="text-xs" />
        Back to Get Started
      </button>

      {/* PAGE HEADER */}

      <div className="mb-7 flex items-start justify-between gap-6">
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-primary">
            Buying an existing business
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#071B2B] md:text-[38px]">
            Take over an existing hospitality business
          </h1>

          <p className="mt-3 max-w-[760px] text-[15px] leading-6 text-[#607382]">
            Tell us what approvals the business already has
            and what you plan to change. We&apos;ll help
            identify which registrations, licences and
            approvals should be reviewed.
          </p>
        </div>

        <div className="hidden rounded-lg border border-[#CFE3EF] bg-[#F3FAFE] px-5 py-4 text-right lg:block">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#718493]">
            Scenario
          </p>

          <p className="mt-1 text-sm font-extrabold text-primary">
            Buying existing business
          </p>
        </div>
      </div>

      {/* STEPPER */}

      <div className="mb-8 rounded-xl border border-[#DFE7EC] bg-white px-7 py-5 shadow-[0_2px_10px_rgba(20,50,68,0.04)]">
        <div className="relative flex justify-between">
          <div className="absolute left-[9%] right-[9%] top-[17px] h-[2px] bg-[#D8E3EA]" />

          <div
            className="absolute left-[9%] top-[17px] h-[2px] bg-[#0076B8] transition-all duration-300"
            style={{
              width: `${(currentIndex / 4) * 82}%`,
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
                className="relative z-10 flex w-[20%] flex-col items-center"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-extrabold transition ${
                    active
                      ? 'border-[#0086C9] bg-[#0086C9] text-white'
                      : complete
                        ? 'border-[#0066A1] bg-[#0066A1] text-white'
                        : 'border-[#C7D6E0] bg-white text-[#718493]'
                  }`}
                >
                  {complete ? (
                    <FaCheck className="text-xs" />
                  ) : (
                    index + 1
                  )}
                </div>

                <span
                  className={`mt-2 text-center text-[11px] font-semibold ${
                    active
                      ? 'text-primary'
                      : 'text-[#6B7F8C]'
                  }`}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DESKTOP CONTENT */}

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_290px]">
        <section className="rounded-xl border border-[#DFE7EC] bg-white p-8 shadow-[0_4px_18px_rgba(20,50,68,0.06)] md:p-10">
          {/* ===================== */}
          {/* STEP 1 */}
          {/* ===================== */}

          {current === 'details' && (
            <>
              <StepHeading
                eyebrow="Business details"
                title="Tell us about the business"
                description="Enter the details of the hospitality business you are purchasing."
              />

              <div className="grid grid-cols-2 gap-6">
                <Field label="Business name">
                  <input
                    type="text"
                    value={business.name}
                    onChange={(event) =>
                      updateBusiness(
                        'name',
                        event.target.value,
                      )
                    }
                    placeholder="e.g. The Bay Bistro"
                    className={inputClass}
                  />
                </Field>

                <Field label="Current owner">
                  <input
                    type="text"
                    value={business.owner}
                    onChange={(event) =>
                      updateBusiness(
                        'owner',
                        event.target.value,
                      )
                    }
                    placeholder="e.g. John Smith"
                    className={inputClass}
                  />
                </Field>

                <Field label="Business type">
                  <select
                    value={business.type}
                    onChange={(event) =>
                      updateBusiness(
                        'type',
                        event.target.value,
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Select business type
                    </option>

                    <option>Restaurant</option>
                    <option>Cafe</option>
                    <option>Bar or pub</option>
                    <option>Takeaway</option>
                    <option>Food shop</option>
                    <option>Catering</option>
                    <option>Other</option>
                  </select>
                </Field>
              </div>

              <InfoBox>
                We&apos;ll use these details together with
                the existing approvals to determine what
                may need to be transferred or updated.
              </InfoBox>
            </>
          )}

          {/* ===================== */}
          {/* STEP 2 */}
          {/* ===================== */}

          {current === 'approvals' && (
            <>
              <StepHeading
                eyebrow="Existing approvals"
                title="What approvals does the business currently have?"
                description="Turn on each registration, programme or approval that is already in place."
              />

              <div className="overflow-hidden rounded-xl border border-[#DCE6EB]">
                <ApprovalRow
                  icon={FaUtensils}
                  title="Food Business Registration"
                  checked={approvals.foodRegistration}
                  onChange={() =>
                    toggleApproval('foodRegistration')
                  }
                />

                <ApprovalRow
                  icon={FaClipboardCheck}
                  title="Food Programme (e.g. TFCP)"
                  checked={approvals.foodProgramme}
                  onChange={() =>
                    toggleApproval('foodProgramme')
                  }
                />

                <ApprovalRow
                  icon={FaGlassMartiniAlt}
                  title="Alcohol Licence"
                  checked={approvals.alcoholLicence}
                  onChange={() =>
                    toggleApproval('alcoholLicence')
                  }
                />

                <ApprovalRow
                  icon={FaUmbrellaBeach}
                  title="Outdoor Dining Approval"
                  checked={approvals.outdoorDining}
                  onChange={() =>
                    toggleApproval('outdoorDining')
                  }
                />
              </div>

              <InfoBox>
                If you&apos;re unsure about an approval,
                leave it switched off for now. The final
                details should be confirmed with Auckland
                Council.
              </InfoBox>
            </>
          )}

          {/* ===================== */}
          {/* STEP 3 */}
          {/* ===================== */}

          {current === 'changes' && (
            <>
              <StepHeading
                eyebrow="Changes"
                title="What will change?"
                description="Select everything that will change when you take over the business."
              />

              <div className="grid grid-cols-2 gap-4">
                {CHANGE_OPTIONS.map((option) => {
                  const selected =
                    changes.includes(option.id);

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        toggleChange(option.id)
                      }
                      className={`relative min-h-[120px] rounded-xl border-2 p-5 text-left transition ${
                        selected
                          ? 'border-[#0086C9] bg-[#F1FAFE]'
                          : 'border-[#DFE7EC] bg-white hover:border-[#8CCBEA]'
                      }`}
                    >
                      <div
                        className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded border-2 ${
                          selected
                            ? 'border-[#0086C9] bg-[#0086C9] text-white'
                            : 'border-[#B6C8D3] bg-white'
                        }`}
                      >
                        {selected && (
                          <FaCheck className="text-[10px]" />
                        )}
                      </div>

                      <h3 className="pr-10 text-sm font-extrabold text-[#102B3A]">
                        {option.title}
                      </h3>

                      <p className="mt-2 max-w-[280px] text-xs leading-5 text-[#718493]">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ===================== */}
          {/* STEP 4 */}
          {/* ===================== */}

          {current === 'requirements' && (
            <>
              <StepHeading
                eyebrow="Your requirements"
                title="What you may need to update"
                description="Based on the existing approvals and planned changes, review the following actions."
              />

              <div className="space-y-4">
                {requirements.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      className="flex gap-5 rounded-xl border border-[#DCE6EB] bg-white p-6"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF7FC] text-xl text-primary">
                        <Icon />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="text-secondary" />

                          <h3 className="font-extrabold text-[#203746]">
                            {item.title}
                          </h3>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-[#607382]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex gap-4 rounded-lg border border-[#D7E9F4] bg-[#F2F9FD] p-5">
                <FaInfoCircle className="mt-1 shrink-0 text-primary" />

                <p className="text-sm leading-6 text-[#526A78]">
                  Existing licences may sometimes remain
                  relevant after a business sale, but
                  ownership, licence details or conditions
                  may still need to be reviewed and
                  updated.
                </p>
              </div>
            </>
          )}

          {/* ===================== */}
          {/* STEP 5 */}
          {/* ===================== */}

          {current === 'summary' && (
            <>
              <StepHeading
                eyebrow="Summary"
                title="Your business takeover summary"
                description="Review the information and likely actions identified for the business."
              />

              <div className="rounded-xl border border-[#DCE6EB] bg-[#F8FAFB] p-6">
                <div className="flex items-start gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#EAF5FB] text-2xl text-primary">
                    <FaStore />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-[#071B2B]">
                      {business.name ||
                        'Business name not provided'}
                    </h3>

                    <p className="mt-1 text-sm text-[#607382]">
                      {business.type ||
                        'Business type not selected'}
                    </p>

                    {business.owner && (
                      <p className="mt-1 text-sm text-[#607382]">
                        Current owner: {business.owner}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-4 font-extrabold text-[#203746]">
                  Recommended actions
                </h3>

                <div className="space-y-3">
                  {requirements.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg border border-[#E0E8ED] px-5 py-4"
                    >
                      <FaCheck className="text-secondary" />

                      <div className="text-sm font-semibold text-[#405966]">
                        {item.title}
                        <div><FeeGuideLink category={item.id} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <EstimatedFees
                food={requirements.some((item) => item.id === 'food')}
                alcohol={requirements.some((item) => item.id === 'alcohol')}
                outdoor={requirements.some((item) => item.id === 'outdoor')}
                review
              />
              <SaveRequirements categories={requirements.map((item) => item.id).filter((id) => ['food', 'alcohol', 'outdoor'].includes(id))} business={business} />
              <div className="mt-7">

                <div className="rounded-xl border border-[#D7E9F4] bg-[#F2F9FD] p-6">
                  <FaCheckCircle className="text-2xl text-primary" />

                  <h3 className="mt-3 font-extrabold text-[#203746]">
                    Ready for the next step
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#607382]">
                    Review the detailed guidance for
                    each registration and approval before
                    submitting updates.
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

            {current !== 'summary' ? (
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
                onClick={() =>
                  navigate('/licensing-guide')
                }
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
              Takeover progress
            </h3>

            <div className="mt-5 space-y-4">
              <SummaryRow
                label="Business"
                value={
                  business.name || 'Not provided yet'
                }
              />

              <SummaryRow
                label="Business type"
                value={
                  business.type || 'Not selected yet'
                }
              />

              <SummaryRow
                label="Existing approvals"
                value={`${Object.values(approvals).filter(Boolean).length} selected`}
              />

              <SummaryRow
                label="Planned changes"
                value={
                  changes.length
                    ? `${changes.length} selected`
                    : 'None selected'
                }
              />

              <SummaryRow
                label="Likely actions"
                value={`${requirements.length} identified`}
              />
            </div>
          </div>

          <div className="rounded-xl border border-[#D7E9F4] bg-[#F2F9FD] p-6">
            <FaInfoCircle className="mb-3 text-xl text-primary" />

            <h3 className="font-extrabold text-[#203746]">
              Buying an existing business
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#607382]">
              Existing registrations or approvals do not
              necessarily mean nothing needs to be
              changed. Hospo Hub helps identify the
              items you should review when ownership
              changes.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StepHeading({
  eyebrow,
  title,
  description,
}) {
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

function ApprovalRow({
  icon: Icon,
  title,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center gap-5 border-b border-[#E8EEF2] px-6 py-5 last:border-0">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EEF7FC] text-lg text-primary">
        <Icon />
      </div>

      <span className="flex-1 text-sm font-extrabold text-[#304957]">
        {title}
      </span>

      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        className={`relative h-7 w-12 rounded-full transition ${
          checked
            ? 'bg-[#0086C9]'
            : 'bg-[#C8D5DD]'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
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
