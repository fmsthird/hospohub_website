// Short public summaries; detailed guidance stays in the existing guides and journeys.
export const homeSteps = [
  {
    id: "business",
    title: "Tell us about your business",
    description:
      "Let us know whether you are opening a new business, buying an existing business or changing an existing operation.",
    links: [{ label: "Start with Get Started", to: "/get-started" }],
  },
  {
    id: "requirements",
    title: "Identify your requirements",
    description:
      "Answer a few guided questions to identify food registration (including verification), alcohol licensing and outdoor dining approval requirements that may apply.",
    links: [],
  },
  {
    id: "guidance",
    title: "Prepare with the right guidance",
    description:
      "Use the Licensing Guide, Learning Centre and Resources to understand documents, fees and preparation steps.",
    links: [
      { label: "Licensing Guide", to: "/licensing-guide" },
      { label: "Resources", to: "/resources" },
    ],
  },
  {
    id: "hub",
    title: "Manage your progress",
    description:
      "Create an account when you are ready to save requirements and manage applications, documents, payments, messages and training through My Hub.",
    links: [],
  },
];
export const homeServices = [
  {
    id: "food",
    category: "Food businesses",
    title: "Food business registration",
    description:
      "Understand food registration, food safety programmes, verification requirements and preparation for operating a food business.",
    topics: [
      "Food Control Plans",
      "National Programmes",
      "Verification",
      "Food safety preparation",
    ],
    linkLabel: "Explore food registration",
    to: "/licensing-guide?guide=food",
  },
  {
    id: "alcohol",
    category: "Licensed premises",
    title: "Alcohol licensing",
    description:
      "Understand licence types, application requirements, fees and responsibilities for businesses that sell or supply alcohol.",
    topics: [
      "On-licence",
      "Off-licence",
      "Club licence",
      "Host responsibility",
    ],
    linkLabel: "Explore alcohol licensing",
    to: "/licensing-guide?guide=alcohol",
  },
  {
    id: "outdoor",
    category: "Outdoor spaces",
    title: "Outdoor dining approvals",
    description:
      "Find guidance for using outdoor areas or council-managed public space for hospitality activities.",
    topics: [
      "Site plans",
      "Public-space requirements",
      "Pedestrian access",
      "Outdoor dining fees",
    ],
    linkLabel: "Explore outdoor dining",
    to: "/licensing-guide?guide=outdoor",
  },
];
