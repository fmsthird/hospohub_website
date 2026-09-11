import EstimatedFees, { FeeGuideLink } from '../components/EstimatedFees';
import SaveRequirements from '../components/SaveRequirements';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaClipboardCheck,
  FaGlassMartiniAlt,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaShoppingBasket,
  FaStore,
  FaUmbrellaBeach,
  FaUsers,
  FaUtensils,
} from 'react-icons/fa';

const STEPS = [
  { id: 'details', label: 'Business details' },
  { id: 'activities', label: 'Activities' },
  { id: 'programme', label: 'Food programme' },
  { id: 'alcohol', label: 'Alcohol licence' },
  { id: 'outdoor', label: 'Outdoor dining' },
  { id: 'summary', label: 'Summary' },
];

const ACTIVITIES = [
  {
    id: 'prepare',
    title: 'Prepare food',
    description: 'e.g. sandwiches, salads',
    icon: FaUtensils,
  },
  {
    id: 'cook',
    title: 'Cook food',
    description: 'e.g. meals, baking',
    icon: FaUtensils,
  },
  {
    id: 'packaged',
    title: 'Sell packaged food',
    description: 'e.g. retail food',
    icon: FaShoppingBasket,
  },
  {
    id: 'alcohol',
    title: 'Sell or serve alcohol',
    description: 'Alcohol sales or service',
    icon: FaGlassMartiniAlt,
  },
  {
    id: 'outdoor',
    title: 'Have outdoor dining',
    description: 'Tables or seating outside',
    icon: FaUmbrellaBeach,
  },
  {
    id: 'events',
    title: 'Host events',
    description: 'e.g. functions or events',
    icon: FaUsers,
  },
];

const ALCOHOL_OPTIONS = [
  {
    id: 'on',
    title: 'For on-site consumption',
    description: 'e.g. restaurant, bar or cafe',
  },
  {
    id: 'off',
    title: 'For off-site consumption (takeaway)',
    description: 'e.g. bottle shop or supermarket',
  },
  {
    id: 'club',
    title: 'Club or membership model',
    description: 'e.g. sports club or RSA',
  },
  {
    id: 'special',
    title: 'Temporary or one-off event',
    description: 'e.g. festival, market or private event',
  },
  {
    id: 'none',
    title: 'Not selling alcohol',
    description: 'No alcohol licence recommendation',
  },
];

const inputClass =
  'w-full rounded-lg border border-[#C7D6E0] bg-white px-4 py-3 text-sm text-[#1F3442] outline-none transition focus:border-secondary focus:ring-2 focus:ring-[#DDF2FC]';

export default function NewBusiness() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState('details');

  const [business, setBusiness] = useState({
    name: '',
    type: '',
    location: '',
    openingDate: '',
  });

  const [activities, setActivities] = useState([]);

  const [alcoholUse, setAlcoholUse] = useState('on');

  const [alcoholMainActivity, setAlcoholMainActivity] =
    useState('part');

  const [outdoorAnswer, setOutdoorAnswer] = useState('yes');

  const [outdoorLocation, setOutdoorLocation] = useState([]);

  const currentIndex = STEPS.findIndex(
    (step) => step.id === current,
  );

  const hasFood =
    activities.includes('prepare') ||
    activities.includes('cook') ||
    activities.includes('packaged');

  const hasPreparedFood =
    activities.includes('prepare') ||
    activities.includes('cook');

  const hasAlcohol = activities.includes('alcohol');

  const hasOutdoor = activities.includes('outdoor');

  /* =========================================
     FOOD PROGRAMME RECOMMENDATION
  ========================================= */

  const foodProgramme = useMemo(() => {
    if (!hasFood) return null;

    if (hasPreparedFood) {
      return {
        code: 'TFCP',
        title: 'Template Food Control Plan (TFCP)',
        description:
          'Best suited to many cafes, restaurants and similar businesses that prepare and serve food to the public.',
      };
    }

    return {
      code: 'NP1',
      title: 'National Programme 1 (NP1)',
      description:
        'A lower-complexity food programme that may suit businesses handling lower-risk packaged food activities.',
    };
  }, [hasFood, hasPreparedFood]);

  /* =========================================
     ALCOHOL LICENCE RECOMMENDATION
  ========================================= */

  const alcoholLicence = useMemo(() => {
    if (!hasAlcohol || alcoholUse === 'none') {
      return null;
    }

    if (alcoholUse === 'off') {
      return {
        title: 'Off Licence',
        description:
          'For alcohol sold for consumption away from the premises.',
      };
    }

    if (alcoholUse === 'club') {
      return {
        title: 'Club Licence',
        description:
          'For eligible clubs and member-based organisations.',
      };
    }

    if (alcoholUse === 'special') {
      return {
        title: 'Special Licence',
        description:
          'For temporary events or one-off functions.',
      };
    }

    return {
      title: 'On Licence',
      description:
        'For alcohol consumed on the premises, such as a restaurant, bar or cafe.',
    };
  }, [hasAlcohol, alcoholUse]);

  /* =========================================
     OUTDOOR DINING
  ========================================= */

  const outdoorApprovalRequired =
    hasOutdoor &&
    outdoorAnswer === 'yes' &&
    (outdoorLocation.includes('footpath') ||
      outdoorLocation.includes('combination'));

  /* =========================================
     SUMMARY ITEMS
  ========================================= */

  const summaryItems = useMemo(() => {
    const items = [];

    if (foodProgramme) {
      items.push({
        id: 'programme',
        title: foodProgramme.title,
        subtitle: 'Food safety programme',
        icon: FaClipboardCheck,
      });

      items.push({
        id: 'registration',
        title: 'Food Business Registration',
        subtitle:
          'Required for the selected food activities',
        icon: FaStore,
      });
    }

    if (alcoholLicence) {
      items.push({
        id: 'alcohol',
        title: alcoholLicence.title,
        subtitle: alcoholLicence.description,
        icon: FaGlassMartiniAlt,
      });
    }

    if (outdoorApprovalRequired) {
      items.push({
        id: 'outdoor',
        title: 'Outdoor Dining Approval',
        subtitle:
          'For outdoor seating on council-managed public space',
        icon: FaUmbrellaBeach,
      });
    }

    return items;
  }, [
    foodProgramme,
    alcoholLicence,
    outdoorApprovalRequired,
  ]);

  /* =========================================
     ESTIMATED FEES
  ========================================= */

  const updateBusiness = (field, value) => {
    setBusiness((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleActivity = (id) => {
    setActivities((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id],
    );
  };

  const toggleOutdoorLocation = (id) => {
    setOutdoorLocation((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id],
    );
  };

  /* =========================================
     NEXT STEP LOGIC
  ========================================= */

  const next = () => {
    if (current === 'details') {
      setCurrent('activities');
    }

    if (current === 'activities') {
      if (hasFood) {
        setCurrent('programme');
      } else if (hasAlcohol) {
        setCurrent('alcohol');
      } else if (hasOutdoor) {
        setCurrent('outdoor');
      } else {
        setCurrent('summary');
      }
    }

    if (current === 'programme') {
      if (hasAlcohol) {
        setCurrent('alcohol');
      } else if (hasOutdoor) {
        setCurrent('outdoor');
      } else {
        setCurrent('summary');
      }
    }

    if (current === 'alcohol') {
      if (hasOutdoor) {
        setCurrent('outdoor');
      } else {
        setCurrent('summary');
      }
    }

    if (current === 'outdoor') {
      setCurrent('summary');
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /* =========================================
     BACK STEP LOGIC
  ========================================= */

  const back = () => {
    if (current === 'details') {
      navigate('/get-started');
    }

    if (current === 'activities') {
      setCurrent('details');
    }

    if (current === 'programme') {
      setCurrent('activities');
    }

    if (current === 'alcohol') {
      setCurrent(
        hasFood ? 'programme' : 'activities',
      );
    }

    if (current === 'outdoor') {
      if (hasAlcohol) {
        setCurrent('alcohol');
      } else if (hasFood) {
        setCurrent('programme');
      } else {
        setCurrent('activities');
      }
    }

    if (current === 'summary') {
      if (hasOutdoor) {
        setCurrent('outdoor');
      } else if (hasAlcohol) {
        setCurrent('alcohol');
      } else if (hasFood) {
        setCurrent('programme');
      } else {
        setCurrent('activities');
      }
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const isStepApplicable = (id) => {
    if (id === 'programme') return hasFood;

    if (id === 'alcohol') return hasAlcohol;

    if (id === 'outdoor') return hasOutdoor;

    return true;
  };

  return (
    <div className="mx-auto w-full max-w-[1180px] py-6">
      {/* BACK TO GET STARTED */}

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
            Opening a new business
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#071B2B] md:text-[38px]">
            Set up your new hospitality business
          </h1>

          <p className="mt-3 max-w-[760px] text-[15px] leading-6 text-[#607382]">
            Tell us about your business and planned
            activities. Hospo Hub will use your answers
            to show the likely food programme, alcohol
            licence and outdoor dining approvals you may
            need.
          </p>
        </div>

        <div className="hidden rounded-lg border border-[#CFE3EF] bg-[#F3FAFE] px-5 py-4 text-right lg:block">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#718493]">
            Scenario
          </p>

          <p className="mt-1 text-sm font-extrabold text-primary">
            Opening a new business
          </p>
        </div>
      </div>

      {/* STEPPER */}

      <div className="mb-8 rounded-xl border border-border bg-white px-7 py-5 shadow-[0_2px_10px_rgba(20,50,68,0.04)]">
        <div className="relative flex justify-between">
          <div className="absolute left-[7%] right-[7%] top-[17px] h-[2px] bg-[#D8E3EA]" />

          {STEPS.map((step, index) => {
            const active = current === step.id;
            const completed = currentIndex > index;
            const applicable =
              isStepApplicable(step.id);

            return (
              <div
                key={step.id}
                className={`relative z-10 flex w-[16.66%] flex-col items-center ${
                  applicable ? '' : 'opacity-40'
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-extrabold ${
                    active
                      ? 'border-secondary bg-secondary text-white'
                      : completed
                        ? 'border-primary bg-primary text-white'
                        : 'border-[#C7D6E0] bg-white text-[#718493]'
                  }`}
                >
                  {completed ? (
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
              </div>
            );
          })}
        </div>
      </div>

      {/* DESKTOP LAYOUT */}

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_290px]">
        {/* MAIN CONTENT */}

        <section className="rounded-xl border border-border bg-white p-8 shadow-[0_4px_18px_rgba(20,50,68,0.06)] md:p-10">
          {/* ======================== */}
          {/* BUSINESS DETAILS */}
          {/* ======================== */}

          {current === 'details' && (
            <>
              <StepHeading
                eyebrow="Business details"
                title="Tell us about your business"
                description="These details help us tailor the guidance to your proposed hospitality business."
              />

              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <Field label="Business name (optional)">
                  <input
                    type="text"
                    value={business.name}
                    onChange={(event) =>
                      updateBusiness(
                        'name',
                        event.target.value,
                      )
                    }
                    placeholder="e.g. Ocean View Restaurant"
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
                    <option>
                      Takeaway or food shop
                    </option>
                    <option>
                      Food truck / mobile business
                    </option>
                    <option>Catering</option>
                    <option>Other</option>
                  </select>
                </Field>

                <Field label="Proposed location">
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718493]" />

                    <input
                      type="text"
                      value={business.location}
                      onChange={(event) =>
                        updateBusiness(
                          'location',
                          event.target.value,
                        )
                      }
                      placeholder="e.g. Mission Bay, Auckland"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                <Field label="Proposed opening date">
                  <input
                    type="date"
                    value={business.openingDate}
                    onChange={(event) =>
                      updateBusiness(
                        'openingDate',
                        event.target.value,
                      )
                    }
                    className={inputClass}
                  />
                </Field>
              </div>

              <InfoBox>
                We&apos;ll use your business type and
                Auckland location to make the later
                recommendations more relevant.
              </InfoBox>
            </>
          )}

          {/* ======================== */}
          {/* BUSINESS ACTIVITIES */}
          {/* ======================== */}

          {current === 'activities' && (
            <>
              <StepHeading
                eyebrow="Business activities"
                title="What will your business do?"
                description="Select all activities that apply to your business."
              />

              <div className="grid grid-cols-3 gap-4">
                {ACTIVITIES.map((item) => {
                  const Icon = item.icon;

                  const selected =
                    activities.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        toggleActivity(item.id)
                      }
                      className={`relative min-h-[165px] rounded-xl border-2 p-5 text-left transition ${
                        selected
                          ? 'border-secondary bg-[#F1FAFE] shadow-[0_3px_12px_rgba(0,134,201,0.08)]'
                          : 'border-[#DFE7EC] bg-white hover:border-[#8CCBEA]'
                      }`}
                    >
                      <div
                        className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded border-2 ${
                          selected
                            ? 'border-secondary bg-secondary text-white'
                            : 'border-[#B6C8D3] bg-white'
                        }`}
                      >
                        {selected && (
                          <FaCheck className="text-[10px]" />
                        )}
                      </div>

                      <Icon className="mb-5 text-[30px] text-primary" />

                      <h3 className="pr-8 text-sm font-extrabold text-[#102B3A]">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-[#718493]">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <InfoBox>
                Based on these selections, we&apos;ll
                identify the relevant food programme and
                whether alcohol or outdoor dining
                approvals should be checked.
              </InfoBox>
            </>
          )}

          {/* ======================== */}
          {/* FOOD PROGRAMME */}
          {/* ======================== */}

          {current === 'programme' && (
            <>
              <StepHeading
                eyebrow="Food programme"
                title="Your recommended food programme"
                description="We use your selected food activities to suggest the most suitable programme for this prototype."
              />

              <div className="rounded-xl border-2 border-[#9ED4EE] bg-[#F2FAFE] p-7">
                <div className="flex items-start gap-6">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white text-[30px] text-primary shadow-sm">
                    <FaClipboardCheck />
                  </div>

                  <div className="flex-1">
                    <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-white">
                      Recommended
                    </span>

                    <h3 className="mt-3 text-xl font-extrabold text-[#071B2B]">
                      {foodProgramme?.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#587080]">
                      {foodProgramme?.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-[#DDE6EB] bg-white p-6">
                <h3 className="font-extrabold text-[#203746]">
                  Why this recommendation?
                </h3>

                <div className="mt-4 space-y-3">
                  {hasPreparedFood && (
                    <CheckLine>
                      You selected preparing or cooking
                      food.
                    </CheckLine>
                  )}

                  <CheckLine>
                    Your food activities determine the
                    level of food-safety controls likely
                    to apply.
                  </CheckLine>

                  <CheckLine>
                    The final programme should be
                    confirmed against Auckland Council
                    requirements.
                  </CheckLine>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-3 text-sm font-extrabold text-[#304957]">
                  Other programmes for reference
                </h3>

                <div className="grid gap-3">
                  {[
                    'National Programme 1 (NP1)',
                    'National Programme 2 (NP2)',
                    'National Programme 3 (NP3)',
                  ].map((name) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-lg border border-[#DFE7EC] bg-[#F8FAFB] px-5 py-4"
                    >
                      <span className="text-sm font-semibold text-[#526A78]">
                        {name}
                      </span>

                      <span className="text-xs font-bold text-[#80919B]">
                        Reference only
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ======================== */}
          {/* ALCOHOL LICENSING */}
          {/* ======================== */}

          {current === 'alcohol' && (
            <>
              <StepHeading
                eyebrow="Alcohol licensing"
                title="How will alcohol be sold?"
                description="Choose the option that best matches how alcohol will be supplied by your business."
              />

              <div className="space-y-3">
                {ALCOHOL_OPTIONS.map((option) => {
                  const selected =
                    alcoholUse === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setAlcoholUse(option.id)
                      }
                      className={`flex w-full items-start gap-4 rounded-xl border-2 p-5 text-left transition ${
                        selected
                          ? 'border-secondary bg-[#F1FAFE]'
                          : 'border-[#DFE7EC] bg-white hover:border-[#9BCFE8]'
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          selected
                            ? 'border-secondary bg-secondary'
                            : 'border-[#AFC2CE] bg-white'
                        }`}
                      >
                        {selected && (
                          <div className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-extrabold text-[#203746]">
                          {option.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-[#718493]">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {alcoholUse !== 'none' && (
                <div className="mt-6 rounded-xl border border-[#DCE7ED] bg-[#F8FAFB] p-6">
                  <p className="text-sm font-extrabold text-[#304957]">
                    Will alcohol be the main business
                    activity or only part of your service?
                  </p>

                  <div className="mt-4 flex gap-3">
                    <ChoicePill
                      selected={
                        alcoholMainActivity === 'main'
                      }
                      onClick={() =>
                        setAlcoholMainActivity('main')
                      }
                    >
                      Main activity
                    </ChoicePill>

                    <ChoicePill
                      selected={
                        alcoholMainActivity === 'part'
                      }
                      onClick={() =>
                        setAlcoholMainActivity('part')
                      }
                    >
                      Part of service
                    </ChoicePill>
                  </div>
                </div>
              )}

              {alcoholLicence && (
                <div className="mt-6 rounded-xl border border-[#CFE3EF] bg-[#F3FAFE] p-6">
                  <span className="text-xs font-extrabold uppercase tracking-[0.08em] text-primary">
                    Current recommendation
                  </span>

                  <h3 className="mt-2 text-lg font-extrabold text-[#071B2B]">
                    {alcoholLicence.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#607382]">
                    {alcoholLicence.description}
                  </p>
                </div>
              )}
            </>
          )}

          {/* ======================== */}
          {/* OUTDOOR DINING */}
          {/* ======================== */}

          {current === 'outdoor' && (
            <>
              <StepHeading
                eyebrow="Outdoor dining"
                title="Tell us about your outdoor dining"
                description="This helps determine whether a council approval may be required."
              />

              <div className="rounded-xl border border-[#DCE6EB] p-6">
                <p className="text-sm font-extrabold text-[#304957]">
                  Will you have outdoor dining?
                </p>

                <div className="mt-4 flex gap-3">
                  <ChoicePill
                    selected={outdoorAnswer === 'yes'}
                    onClick={() =>
                      setOutdoorAnswer('yes')
                    }
                  >
                    Yes
                  </ChoicePill>

                  <ChoicePill
                    selected={outdoorAnswer === 'no'}
                    onClick={() =>
                      setOutdoorAnswer('no')
                    }
                  >
                    No
                  </ChoicePill>
                </div>
              </div>

              {outdoorAnswer === 'yes' && (
                <div className="mt-6 rounded-xl border border-[#DCE6EB] p-6">
                  <p className="text-sm font-extrabold text-[#304957]">
                    Where will the outdoor dining be
                    located?
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      [
                        'footpath',
                        'Council footpath',
                      ],
                      [
                        'private',
                        'Private land / your property',
                      ],
                      [
                        'combination',
                        'A combination',
                      ],
                    ].map(([id, label]) => {
                      const selected =
                        outdoorLocation.includes(id);

                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() =>
                            toggleOutdoorLocation(id)
                          }
                          className={`rounded-lg border-2 px-4 py-5 text-left text-sm font-bold transition ${
                            selected
                              ? 'border-secondary bg-[#F1FAFE] text-primary'
                              : 'border-[#DFE7EC] bg-white text-[#455E6D]'
                          }`}
                        >
                          <div className="mb-3 flex h-5 w-5 items-center justify-center rounded border-2 border-current">
                            {selected && (
                              <FaCheck className="text-[9px]" />
                            )}
                          </div>

                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <InfoBox>
                Outdoor dining on council-managed public
                space may require an approval.
                Private-property requirements can differ.
              </InfoBox>
            </>
          )}

          {/* ======================== */}
          {/* SUMMARY */}
          {/* ======================== */}

          {current === 'summary' && (
            <>
              <StepHeading
                eyebrow="Summary"
                title="Your business setup plan"
                description="Based on your answers, these are the likely programmes, registrations and approvals to review."
              />

              {summaryItems.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {summaryItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.id}
                        className="rounded-xl border border-[#DCE6EB] bg-white p-6 shadow-[0_2px_8px_rgba(20,50,68,0.04)]"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EEF7FC] text-xl text-primary">
                          <Icon />
                        </div>

                        <h3 className="mt-4 text-base font-extrabold text-[#071B2B]">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#607382]">
                          {item.subtitle}
                        </p>
                        <FeeGuideLink category={['programme', 'registration'].includes(item.id) ? 'food' : item.id} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-[#DCE6EB] bg-[#F8FAFB] p-7 text-sm text-[#607382]">
                  No licensing recommendation has been
                  generated from the current activity
                  selections.
                </div>
              )}

              <EstimatedFees
                food={Boolean(foodProgramme)}
                alcohol={Boolean(alcoholLicence)}
                outdoor={outdoorApprovalRequired}
                specialLicence={alcoholUse === 'special'}
              />
              <SaveRequirements categories={[foodProgramme && 'food', alcoholLicence && 'alcohol', outdoorApprovalRequired && 'outdoor'].filter(Boolean)} business={business} specialLicence={alcoholUse === 'special'} />
            </>
          )}

          {/* ======================== */}
          {/* BOTTOM NAV */}
          {/* ======================== */}

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
                View full details

                <FaArrowRight className="text-xs" />
              </button>
            )}
          </div>
        </section>

        {/* ======================== */}
        {/* RIGHT SIDE SUMMARY */}
        {/* ======================== */}

        <aside className="space-y-5">
          <div className="rounded-xl border border-border bg-white p-6 shadow-[0_3px_14px_rgba(20,50,68,0.05)]">
            <h3 className="text-lg font-extrabold text-[#071B2B]">
              Your progress
            </h3>

            <div className="mt-5 space-y-4">
              <SummaryRow
                label="Business"
                value={
                  business.name ||
                  'Not provided yet'
                }
              />

              <SummaryRow
                label="Type"
                value={
                  business.type ||
                  'Not selected yet'
                }
              />

              <SummaryRow
                label="Activities"
                value={
                  activities.length
                    ? `${activities.length} selected`
                    : 'None selected yet'
                }
              />

              <SummaryRow
                label="Food programme"
                value={
                  foodProgramme?.code ||
                  'Not determined'
                }
              />

              <SummaryRow
                label="Alcohol"
                value={
                  alcoholLicence?.title ||
                  'Not required / not determined'
                }
              />

              <SummaryRow
                label="Outdoor"
                value={
                  outdoorApprovalRequired
                    ? 'Approval likely'
                    : 'Not determined / may not apply'
                }
              />
            </div>
          </div>

          <div className="rounded-xl border border-[#CFE3EF] bg-[#F3FAFE] p-6">
            <FaInfoCircle className="mb-3 text-xl text-primary" />

            <h3 className="font-extrabold text-[#203746]">
              How recommendations work
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#607382]">
              Hospo Hub uses your answers to narrow down
              the likely approvals. This prototype does
              not replace a formal Auckland Council
              assessment.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* =========================================
   SMALL COMPONENTS
========================================= */

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

function CheckLine({ children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
        <FaCheck className="text-[8px]" />
      </div>

      <p className="text-sm leading-6 text-[#526A78]">
        {children}
      </p>
    </div>
  );
}

function ChoicePill({
  selected,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border-2 px-5 py-2.5 text-sm font-bold transition ${
        selected
          ? 'border-primary bg-primary text-white'
          : 'border-[#C5D5DE] bg-white text-[#455E6D] hover:border-secondary'
      }`}
    >
      {children}
    </button>
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
