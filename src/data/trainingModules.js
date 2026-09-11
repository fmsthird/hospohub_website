const module = (id, category, title, lessons) => ({
  id,
  category,
  title,
  lessons,
  guide: `/licensing-guide?guide=${category}`,
  refresher:
    category === "food"
      ? "Recommended before your next verification."
      : category === "alcohol"
        ? "Recommended before licence renewal."
        : "Review when your approved outdoor layout changes.",
});
export const TRAINING_MODULES = [
  module("food-basics", "food", "Food Safety Basics", [
    "Read the food registration overview in the Licensing Guide.",
    "Review the food safety programme that applies to your activities.",
    "Identify who is responsible for keeping your food safety records.",
  ]),
  module("food-plan", "food", "Food Control Plan Essentials", [
    "Review your applicable plan or national programme.",
    "Locate the procedures your team uses in daily operations.",
    "Identify records you need to keep and review.",
  ]),
  {
    ...module("verification", "food", "Preparing for Verification", [
      "Read the verification guide.",
      "Gather the records relevant to your food programme.",
      "Review any corrective actions with your verifier.",
    ]),
    guide: "/licensing-guide?guide=verification",
  },
  module("host", "alcohol", "Host Responsibility", [
    "Read the alcohol licensing guide.",
    "Locate your host responsibility policy.",
    "Identify the responsibilities of the team working on your premises.",
  ]),
  module("supply", "alcohol", "Responsible Sale & Supply of Alcohol", [
    "Review the licence type for your premises.",
    "Read the conditions on your own licence.",
    "Identify the guidance your staff need before selling alcohol.",
  ]),
  module("premises", "alcohol", "Licensed Premises Compliance", [
    "Review the approved premises layout.",
    "Locate the operating conditions and hours on your licence.",
    "Review your process for keeping licence information current.",
  ]),
  module("outdoor-safety", "outdoor", "Outdoor Dining Safety", [
    "Read the outdoor dining guide.",
    "Review the boundaries of your approved dining area.",
    "Check how your team will maintain the approved layout.",
  ]),
  module("access", "outdoor", "Public Accessibility Requirements", [
    "Review council guidance on public access.",
    "Identify the clear access routes shown on your plan.",
    "Review how your team checks access during service.",
  ]),
];
export const assignedModules = (categories) =>
  TRAINING_MODULES.filter((item) => categories.includes(item.category));
