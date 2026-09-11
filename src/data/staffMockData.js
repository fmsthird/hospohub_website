// Prototype/mock council staff data.
// Replace with authenticated council APIs/backend before production.
import { STAFF_ROLES } from "./staffRoles.js";
import { FEE_DATA } from "./licensingFees.js";

// Fixed fictional dates and deterministic records keep development reports reproducible.
// Prices for the two illustrative charges are resolved from the existing shared fee schedule.
export function staffChargeAmount(item) {
  if (item.feeKey === "food.levyAndCollection")
    return (
      Math.round(
        (FEE_DATA.food.levy.amount + FEE_DATA.food.collectionFee.amount) * 100,
      ) / 100
    );
  if (item.feeKey === "alcohol.medium.application")
    return FEE_DATA.alcohol.riskLevels.medium.application;
  return typeof item.amount === "number" ? item.amount : null;
}

export const staffUsers = [
  {
    id: "STF-001",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@council.example.nz",
    role: "Licensing Officer",
    teamId: "TEAM-FOOD",
    status: "Active",
    phone: "09 555 0101",
    lastActive: "2026-09-11T09:45:00",
  },

  {
    id: "STF-002",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@council.example.nz",
    role: "Team Leader",
    teamId: "TEAM-ALCOHOL",
    status: "Active",
    phone: "09 555 0102",
    lastActive: "2026-09-11T08:30:00",
  },

  {
    id: "STF-003",
    firstName: "Sophie",
    lastName: "Williams",
    email: "sophie.williams@council.example.nz",
    role: "Verifier",
    teamId: "TEAM-VERIFY",
    status: "Active",
    phone: "09 555 0103",
    lastActive: "2026-09-10T16:20:00",
  },

  {
    id: "STF-004",
    firstName: "Daniel",
    lastName: "Brown",
    email: "daniel.brown@council.example.nz",
    role: "Content Manager",
    teamId: "TEAM-CONTENT",
    status: "Active",
    phone: "09 555 0104",
    lastActive: "2026-09-10T15:00:00",
  },

  {
    id: "STF-005",
    firstName: "Emma",
    lastName: "Taylor",
    email: "emma.taylor@council.example.nz",
    role: "Administrator",
    teamId: "TEAM-ADMIN",
    status: "Active",
    phone: "09 555 0105",
    lastActive: "2026-09-11T09:15:00",
  },

  {
    id: "STF-006",
    firstName: "Noah",
    lastName: "Wilson",
    email: "noah.wilson@council.example.nz",
    role: "Licensing Officer",
    teamId: "TEAM-OUTDOOR",
    status: "Inactive",
    phone: "09 555 0106",
    lastActive: "2026-08-30T11:20:00",
  },
];

export const staffTeams = [
  {
    id: "TEAM-FOOD",
    name: "Food Licensing Team",
    leadId: "STF-001",
    description: "Food registration and related licensing work.",
  },

  {
    id: "TEAM-ALCOHOL",
    name: "Alcohol Licensing Team",
    leadId: "STF-002",
    description: "Alcohol licence assessment and monitoring.",
  },

  {
    id: "TEAM-OUTDOOR",
    name: "Outdoor Dining Team",
    leadId: "STF-006",
    description: "Outdoor dining and public-space applications.",
  },

  {
    id: "TEAM-VERIFY",
    name: "Verification Team",
    leadId: "STF-003",
    description: "Food verification and compliance work.",
  },

  {
    id: "TEAM-CONTENT",
    name: "Content & Guidance",
    leadId: "STF-004",
    description: "Hospo Hub public guidance and learning content.",
  },

  {
    id: "TEAM-ADMIN",
    name: "System Administration",
    leadId: "STF-005",
    description: "Staff access and system administration.",
  },
];

export const staffCases = [
  {
    id: "APP-2026-1042",
    businessName: "Harbour Kitchen",
    applicantName: "James Lee",
    applicantEmail: "james@example.com",
    type: "Food registration",
    category: "Food",
    status: "In review",
    priority: "High",
    submittedAt: "2026-09-10T08:30:00",
    updatedAt: "2026-09-11T09:10:00",
    assignedOfficerId: "STF-001",
    teamId: "TEAM-FOOD",
    nextAction: "Review site plan",
    feeStatus: "Paid",
    amount: null,
    feeKey: "food.levyAndCollection",
  },

  {
    id: "APP-2026-1043",
    businessName: "Central Taproom",
    applicantName: "Olivia Martin",
    applicantEmail: "olivia@example.com",
    type: "Alcohol on-licence",
    category: "Alcohol",
    status: "Action required",
    priority: "Urgent",
    submittedAt: "2026-09-09T13:20:00",
    updatedAt: "2026-09-11T08:55:00",
    assignedOfficerId: "STF-002",
    teamId: "TEAM-ALCOHOL",
    nextAction: "Applicant to provide floor plan",
    feeStatus: "Payment required",
    amount: null,
    feeKey: "alcohol.medium.application",
  },

  {
    id: "APP-2026-1044",
    businessName: "Queen Street Cafe",
    applicantName: "Amelia Clark",
    applicantEmail: "amelia@example.com",
    type: "Outdoor dining approval",
    category: "Outdoor dining",
    status: "Submitted",
    priority: "Normal",
    submittedAt: "2026-09-08T11:00:00",
    updatedAt: "2026-09-08T11:00:00",
    assignedOfficerId: null,
    teamId: "TEAM-OUTDOOR",
    nextAction: "Assign assessing officer",
    feeStatus: "Pending assessment",
    amount: null,
  },

  {
    id: "APP-2026-1045",
    businessName: "North Shore Eats",
    applicantName: "Ethan Hall",
    applicantEmail: "ethan@example.com",
    type: "Food verification",
    category: "Verification",
    status: "Approved",
    priority: "Normal",
    submittedAt: "2026-08-29T10:00:00",
    updatedAt: "2026-09-07T15:20:00",
    assignedOfficerId: "STF-003",
    teamId: "TEAM-VERIFY",
    nextAction: "None",
    feeStatus: "Paid",
    amount: null,
  },
];

export const staffTasks = [
  {
    id: "TASK-001",
    title: "Review site plan",
    caseId: "APP-2026-1042",
    assignedTo: "STF-001",
    assignedBy: "STF-002",
    type: "Document review",
    priority: "High",
    status: "Open",
    dueDate: "2026-09-12",
  },

  {
    id: "TASK-002",
    title: "Check alcohol floor plan",
    caseId: "APP-2026-1043",
    assignedTo: "STF-002",
    assignedBy: "STF-005",
    type: "Document review",
    priority: "Urgent",
    status: "Open",
    dueDate: "2026-09-11",
  },

  {
    id: "TASK-003",
    title: "Follow up verification records",
    caseId: "APP-2026-1045",
    assignedTo: "STF-003",
    assignedBy: "STF-002",
    type: "Follow-up",
    priority: "Normal",
    status: "Completed",
    dueDate: "2026-09-10",
  },
];

export const staffNotifications = [
  {
    id: "NOT-001",
    staffId: "STF-001",
    type: "case",
    title: "New application assigned",
    message: "Harbour Kitchen food registration has been assigned to you.",
    relatedId: "APP-2026-1042",
    read: false,
    createdAt: "2026-09-11T09:30:00",
  },

  {
    id: "NOT-002",
    staffId: "STF-002",
    type: "case",
    title: "Applicant uploaded information",
    message: "Central Taproom uploaded an updated supporting document.",
    relatedId: "APP-2026-1043",
    read: false,
    createdAt: "2026-09-11T08:45:00",
  },

  {
    id: "NOT-003",
    staffId: "STF-001",
    type: "task",
    title: "Task due soon",
    message: "Review site plan is due tomorrow.",
    relatedId: "TASK-001",
    read: true,
    createdAt: "2026-09-10T15:00:00",
  },
];

export const staffContent = [
  {
    id: "CONTENT-001",
    title: "Food business registration",
    section: "Licensing Guide",
    status: "Published",
    updatedAt: "2026-09-08T14:30:00",
    updatedBy: "STF-004",
  },

  {
    id: "CONTENT-002",
    title: "Alcohol licensing guidance",
    section: "Licensing Guide",
    status: "Published",
    updatedAt: "2026-09-07T12:00:00",
    updatedBy: "STF-004",
  },

  {
    id: "CONTENT-003",
    title: "Verification FAQ update",
    section: "Help & FAQs",
    status: "Draft",
    updatedAt: "2026-09-10T16:15:00",
    updatedBy: "STF-004",
  },

  {
    id: "CONTENT-004",
    title: "Outdoor dining refresher",
    section: "Learning Centre",
    status: "Draft",
    updatedAt: "2026-09-09T09:45:00",
    updatedBy: "STF-004",
  },
];

const sampleBusinesses = [
  "Bayside Bistro",
  "Kauri Kitchen",
  "Laneway Lunch",
  "Market Table",
  "Harbour Roasters",
  "Garden Deli",
];
const sampleCategories = ["Food", "Alcohol", "Outdoor dining", "Verification"];
const sampleTypes = [
  "Food registration",
  "Alcohol on-licence",
  "Outdoor dining approval",
  "Food verification",
];
const sampleTeams = [
  "TEAM-FOOD",
  "TEAM-ALCOHOL",
  "TEAM-OUTDOOR",
  "TEAM-VERIFY",
];
const sampleOfficers = ["STF-001", "STF-002", null, "STF-003"];
const sampleStatuses = [
  "Submitted",
  "In review",
  "Action required",
  "Approved",
  "Declined",
];
for (let index = 0; index < 24; index++) {
  const category = index % 4;
  const submitted = new Date(Date.UTC(2026, 7, 14 + index, 0));
  const status = sampleStatuses[index % 5];
  const decided = ["Approved", "Declined"].includes(status)
    ? new Date(submitted.getTime() + (2 + (index % 4)) * 86400000).toISOString()
    : null;
  staffCases.push({
    id: `APP-2026-${1046 + index}`,
    businessName: `${sampleBusinesses[index % 6]} ${Math.floor(index / 6) + 1}`,
    applicantName: `Sample Applicant ${index + 1}`,
    applicantEmail: `applicant${index + 1}@example.com`,
    type: sampleTypes[category],
    category: sampleCategories[category],
    status,
    priority: ["Normal", "High", "Urgent"][index % 3],
    submittedAt: submitted.toISOString(),
    updatedAt: decided || submitted.toISOString(),
    decidedAt: decided,
    assignedOfficerId: sampleOfficers[category],
    teamId: sampleTeams[category],
    nextAction: decided
      ? "None"
      : status === "Action required"
        ? "Await supporting information"
        : "Assess application",
    dueDate: new Date(submitted.getTime() + 21 * 86400000)
      .toISOString()
      .slice(0, 10),
    feeStatus: "Pending assessment",
    amount: null,
  });
}

for (const item of staffCases) {
  // The seed records explicitly establish these events; later events come only from actions.
  item.history = [
    {
      id: `${item.id}-received`,
      title: "Application received (sample)",
      at: item.submittedAt,
      staffId: null,
    },
  ];
  item.application = {
    businessName: item.businessName,
    applicantName: item.applicantName,
    applicantEmail: item.applicantEmail,
    applicationType: item.type,
    requirements: ["Supporting information to be assessed"],
    answers: [
      {
        question: "Is this a new application?",
        answer: "Yes — fictional development example",
      },
    ],
  };
  item.documents = [];
  item.messages = [];
  item.notes = [];
  if (item.id === "APP-2026-1045") item.decidedAt = item.updatedAt;
  if (item.decidedAt)
    item.history.push({
      id: `${item.id}-decision`,
      title: `Decision recorded: ${item.status} (sample)`,
      at: item.decidedAt,
      staffId: item.assignedOfficerId,
    });
}
staffCases[0].documents = [
  {
    id: "DOC-STAFF-001",
    name: "Harbour Kitchen site-plan notes.txt",
    type: "Supporting information",
    uploadedAt: "2026-09-10T08:30:00+12:00",
    reviewStatus: "Awaiting review",
    text: "Fictional prototype document. Harbour Kitchen site-plan review: confirm the preparation area, handwashing facilities and storage areas. This text sample is not an actual submitted site plan.",
  },
];
staffCases[1].documents = [
  {
    id: "DOC-STAFF-002",
    name: "Central Taproom floor plan.pdf",
    type: "Floor plan",
    uploadedAt: "2026-09-11T08:45:00+12:00",
    reviewStatus: "Awaiting review",
  },
];
staffCases[1].messages = [
  {
    id: "MSG-STAFF-001",
    sender: "Applicant",
    text: "Here is the updated supporting document for review. (Sample message)",
    at: "2026-09-11T08:45:00+12:00",
    staffId: null,
  },
];
staffCases[1].history.push({
  id: "EVT-STAFF-DOC-002",
  title: "Supporting document received (sample metadata)",
  at: "2026-09-11T08:45:00+12:00",
  staffId: null,
});
staffTasks[2].completedAt = "2026-09-10T10:00:00+12:00";
staffTasks.push(
  {
    id: "TASK-004",
    title: "Check applicant details",
    caseId: "APP-2026-1042",
    assignedTo: "STF-001",
    assignedBy: "STF-005",
    type: "Review",
    priority: "Normal",
    status: "Open",
    dueDate: "2026-09-11",
  },
  {
    id: "TASK-005",
    title: "Follow up supporting information",
    caseId: "APP-2026-1046",
    assignedTo: "STF-001",
    assignedBy: "STF-002",
    type: "Follow-up",
    priority: "Urgent",
    status: "Open",
    dueDate: "2026-09-09",
  },
  {
    id: "TASK-006",
    title: "Confirm application contact",
    caseId: "APP-2026-1042",
    assignedTo: "STF-001",
    assignedBy: "STF-002",
    type: "Callback",
    priority: "Normal",
    status: "Completed",
    dueDate: "2026-09-10",
    completedAt: "2026-09-10T11:00:00+12:00",
  },
  {
    id: "TASK-007",
    title: "Review unassigned outdoor case",
    caseId: "APP-2026-1044",
    assignedTo: "STF-005",
    assignedBy: "STF-002",
    type: "Review",
    priority: "High",
    status: "Open",
    dueDate: "2026-09-12",
  },
);
staffNotifications.push({
  id: "NOT-004",
  staffId: "STF-005",
  type: "system",
  title: "Prototype workspace ready",
  message: "Explore staff access, case assignments and local content drafts.",
  relatedId: null,
  read: false,
  createdAt: "2026-09-11T09:00:00+12:00",
});
for (const item of staffContent) {
  item.category = item.section === "Licensing Guide" ? "Guidance" : "General";
  item.summary = `Prototype editorial record for ${item.title.toLowerCase()}.`;
  item.body =
    "This is a fictional editorial sample. Review current official sources before publishing guidance. Changes here are stored in this browser and do not update the public website.";
}
// Interpret all seed date-times without offsets as New Zealand standard time (Aug/Sep 2026).
function normaliseDates(value) {
  if (Array.isArray(value)) return value.map(normaliseDates);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normaliseDates(item)]),
    );
  return typeof value === "string" &&
    /^2026-\d\d-\d\dT\d\d:\d\d:\d\d$/.test(value)
    ? `${value}+12:00`
    : value;
}
export function createStaffSeed() {
  return normaliseDates({
    version: 1,
    staffUsers: staffUsers.map((user) => ({
      ...user,
      permissions: user.status === "Active" ? STAFF_ROLES[user.role] : [],
      availability: user.status === "Active" ? "Available" : "Unavailable",
    })),
    staffTeams,
    staffCases,
    staffTasks,
    staffNotifications,
    staffContent,
    preferences: {},
    settings: {
      assignments: Object.fromEntries(
        sampleCategories.map((category, index) => [
          category,
          sampleTeams[index],
        ]),
      ),
      contentReview: true,
      systemName: "Hospo Hub Staff Portal",
    },
  });
}
