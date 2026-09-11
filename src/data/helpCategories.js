export const HELP_CATEGORIES = [
  "Getting Started",
  "Food Business",
  "Alcohol Licensing",
  "Outdoor Dining",
  "Fees & Payments",
  "Applications",
  "Documents",
  "Learning Centre",
  "My Hub",
  "Help & Support",
];
export const HELP_SERVICES = ["Food", "Alcohol", "Outdoor dining", "General"];
export const slug = (value) =>
  value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const CATEGORY_HELP = {
  "Getting Started": {
    service: "General",
    to: "/get-started",
    label: "Start your requirements check",
    resources: ["requirements-checker", "new-business-checklist"],
    keywords: ["opening", "buying", "changing", "requirements"],
  },
  "Food Business": {
    service: "Food",
    to: "/licensing-guide?guide=food",
    label: "Food business registration guide",
    resources: ["food-registration-guide", "food-control-plan"],
    keywords: [
      "food safety",
      "FCP",
      "TFCP",
      "national programme",
      "registration",
    ],
  },
  "Alcohol Licensing": {
    service: "Alcohol",
    to: "/licensing-guide?guide=alcohol",
    label: "Alcohol licensing guide",
    resources: ["alcohol-guide", "alcohol-official"],
    keywords: ["licence", "license", "alcohol", "licensed premises"],
  },
  "Outdoor Dining": {
    service: "Outdoor dining",
    to: "/licensing-guide?guide=outdoor",
    label: "Outdoor dining guide",
    resources: ["outdoor-guide", "outdoor-official"],
    keywords: ["footpath", "public space", "site plan", "outdoor"],
  },
  "Fees & Payments": {
    service: "General",
    to: "/licensing-guide",
    label: "Explore fees in the Licensing Guide",
    resources: ["fees-guide"],
    keywords: ["fees", "payment", "cost", "charges", "estimate"],
  },
  Applications: {
    service: "General",
    to: "/get-started",
    label: "Check application requirements",
    resources: ["application-preparation", "application-statuses"],
    keywords: ["application", "status", "forms", "reference"],
  },
  Documents: {
    service: "General",
    to: "/help/faqs?category=documents",
    label: "Document help",
    resources: ["supporting-documents", "site-plan-checklist"],
    keywords: ["upload", "files", "documents", "vault"],
  },
  "Learning Centre": {
    service: "General",
    to: "/learning-centre",
    label: "Browse the Learning Centre",
    resources: ["learning-centre"],
    keywords: ["learning", "training", "completion", "refresher"],
  },
  "My Hub": {
    service: "General",
    to: "/login",
    label: "Sign in to My Hub",
    resources: ["my-hub-introduction"],
    keywords: ["account", "dashboard", "sign in", "login"],
  },
  "Help & Support": {
    service: "General",
    to: "/help",
    label: "Choose a support option",
    resources: ["resource-library"],
    keywords: ["help", "support", "callback", "assistant"],
  },
};

export const FOOD_VERIFICATION_HELP = {
  service: "Food",
  to: "/licensing-guide?guide=food&tab=verification",
  label: "Food verification guidance",
  resources: ["verification-guide", "verification-preparation"],
  keywords: ["verifier", "records", "corrective action", "food safety"],
};
