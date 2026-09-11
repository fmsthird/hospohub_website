import { CATEGORY_HELP, slug } from "./helpCategories.js";

// Glossary terms are structured records so the same search/category filters work
// for definitions and FAQs. Acronyms and alternative spellings stay searchable.
const terms = [
  [
    "Application reference",
    "Applications",
    "A unique identifier for a particular application. Quote the official reference when asking about a real case; a local Hospo Hub reference identifies a prototype record.",
    ["reference number", "case ID"],
  ],
  [
    "Approval",
    "Applications",
    "Permission granted by the relevant authority for a specified activity, usually subject to conditions. A prototype application status does not grant that permission.",
    ["approved", "permission"],
  ],
  [
    "Annual fee",
    "Fees & Payments",
    "A recurring charge associated with an ongoing licence or service. It may be separate from the original application charge; check the official notice for the amount and due date.",
    ["yearly", "recurring charge"],
  ],
  [
    "Applicant",
    "Applications",
    "The person or organisation applying for a registration, licence or approval. The application should identify the correct legal operator and contact details.",
    ["operator", "business owner"],
  ],
  [
    "Club licence",
    "Alcohol Licensing",
    "An alcohol licence for an eligible club to supply authorised people such as members and qualifying guests. Its conditions define the permitted activity.",
    ["club alcohol"],
  ],
  [
    "Corrective action",
    "Verification",
    "A change made to address a food safety problem and help prevent it happening again. Keep the evidence needed to show your verifier what was done.",
    ["fix", "follow-up", "non-conformance"],
  ],
  [
    "Digital form",
    "My Hub",
    "An online form used to enter and save application information. Hospo Hub’s current digital forms are local practice records, not official council submissions.",
    ["forms", "draft application"],
  ],
  [
    "Document Vault",
    "Documents",
    "The signed-in My Hub area for saved document records and available files. It is distinct from the public Resources library and currently stores information in this browser.",
    ["documents", "files", "storage"],
  ],
  [
    "Draft",
    "Applications",
    "A form or application that has been started and saved but has not been submitted. You can return to a prototype draft to finish the information.",
    ["save", "unfinished"],
  ],
  [
    "Food Act",
    "Food Business",
    "The Food Act 2014 is the New Zealand legislation underpinning the food safety framework for food businesses. Use MPI’s guidance to understand which plan, programme or registration pathway applies.",
    ["Food Act 2014", "legislation"],
  ],
  [
    "Food Control Plan",
    "Food Business",
    "A documented system describing how a food business manages its food safety risks. The appropriate plan depends on the operation and must be followed in daily work.",
    ["FCP", "custom plan"],
  ],
  [
    "Host responsibility",
    "Alcohol Licensing",
    "The practices a licensed business uses to support responsible alcohol service and customer safety. Staff need to understand the procedures and obligations relevant to their role.",
    ["responsible service", "alcohol safety"],
  ],
  [
    "In review",
    "Applications",
    "A status indicating that an application record is marked as being assessed. Check for requests and next steps; a prototype status is not a live council update.",
    ["under review", "assessment"],
  ],
  [
    "Licensed area",
    "Alcohol Licensing",
    "The part of a site or premises covered by an alcohol licence. Use the approved plan and conditions to identify where the licensed activity is permitted.",
    ["footprint", "licensed premises"],
  ],
  [
    "Manager's certificate",
    "Alcohol Licensing",
    "A certificate relating to a person approved to manage alcohol sales where a certified manager is required. It is separate from the licence for the premises.",
    ["certified manager", "duty manager"],
  ],
  [
    "National Programme",
    "Food Business",
    "A risk-based food safety measure for certain businesses. The three levels have requirements based on the activities involved, including relevant registration, records and verification.",
    ["NP1", "NP2", "NP3", "NP 1", "NP 2", "NP 3", "national program"],
  ],
  [
    "Off-licence",
    "Alcohol Licensing",
    "An alcohol licence generally allowing sales for consumption away from the licensed premises. Check its conditions for the activities it permits.",
    ["off license", "takeaway alcohol"],
  ],
  [
    "On-licence",
    "Alcohol Licensing",
    "An alcohol licence generally allowing sales or supply for consumption at the licensed premises. The approved area and conditions limit how it can be used.",
    ["on license", "restaurant", "bar"],
  ],
  [
    "Outdoor dining approval",
    "Outdoor Dining",
    "Permission to use a specified outdoor space for dining under the applicable conditions. Use of council-managed public space may require an outdoor dining licence.",
    ["footpath dining", "tables and chairs"],
  ],
  [
    "Public space",
    "Outdoor Dining",
    "Space used by the public, such as a footpath or shared area. Confirm who controls the land and what permission is needed before using it for business activities.",
    ["public place", "footpath"],
  ],
  [
    "Renewal",
    "Applications",
    "The process of applying to continue a licence or approval for another period. Check the official expiry date and renewal instructions; a saved reminder does not renew anything.",
    ["expiry", "extend licence"],
  ],
  [
    "Risk rating",
    "Alcohol Licensing",
    "The cost/risk category used to calculate relevant alcohol licensing fees. It is based on applicable assessment factors, not a customer review or guarantee of approval.",
    ["risk category", "cost rating"],
  ],
  [
    "Special licence",
    "Alcohol Licensing",
    "An alcohol licence that can authorise sales or supply for a particular event or occasion. Check the event requirements and conditions before relying on it.",
    ["event licence", "occasion"],
  ],
  [
    "Submitted",
    "Applications",
    "A status normally indicating that an application has been sent for processing. In this Hospo Hub prototype, it only means a local application record has been saved.",
    ["submission", "sent"],
  ],
  [
    "Template Food Control Plan",
    "Food Business",
    "An approved ready-made Food Control Plan for eligible businesses. Operators select the relevant procedures and put them into practice rather than merely keeping a copy.",
    ["TFCP", "Simply Safe & Suitable", "template FCP"],
  ],
  [
    "Verification",
    "Verification",
    "An independent check of how a food business implements its food safety requirements. It is a separate process from registration.",
    ["food safety check", "inspection"],
  ],
  [
    "Verifier",
    "Verification",
    "A person or agency with appropriate recognition to check the relevant type of food business. Confirm that their scope covers your operation before arranging verification.",
    ["recognised verifier", "verification agency"],
  ],
  [
    "Action required",
    "Applications",
    "A status indicating that the applicant needs to do something before the case can progress. Read the request to find the required documents, information or other next step.",
    ["information requested", "next step"],
  ],
  [
    "Application fee",
    "Fees & Payments",
    "A charge associated with processing an application. It does not by itself guarantee approval or cover every ongoing charge.",
    ["processing fee", "application cost"],
  ],
  [
    "Levy",
    "Fees & Payments",
    "A charge collected for a specified purpose under applicable arrangements. The food business levy is separate from council registration and verification charges.",
    ["food business levy", "collection fee"],
  ],
  [
    "Licence",
    "Applications",
    "An authorisation from the relevant authority for an activity under stated terms and conditions. A local form, estimate or sample document is not an issued licence.",
    ["license", "authorisation"],
  ],
  [
    "Registration",
    "Food Business",
    "The recording of a food business and its applicable food safety measure with the registration authority. Registration and verification are separate parts of the process.",
    ["register", "food registration"],
  ],
];
export const helpGlossary = terms
  .map(([term, category, definition, keywords]) => ({
    id: `glossary-${slug(term)}`,
    term,
    definition,
    category,
    service: CATEGORY_HELP[category].service,
    keywords,
    relatedLinks: [
      { label: CATEGORY_HELP[category].label, to: CATEGORY_HELP[category].to },
    ],
    relatedResourceIds: CATEGORY_HELP[category].resources,
  }))
  .sort((a, b) => a.term.localeCompare(b.term, "en-NZ"));
