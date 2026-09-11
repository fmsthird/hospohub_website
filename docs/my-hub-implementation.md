# Customer / business prototype architecture

Hospo Hub's existing customer authentication and `useHub` now use one customer repository. Public pages remain public. Customer records, sessions and mutations are independent of the existing staff portal; no staff files were changed for this work.

## Demo accounts

All names, addresses, NZBNs and records are fictional. The development login page offers account-fill buttons; enter any non-empty made-up password and sign in. The buttons are hidden by `import.meta.env.DEV` in production builds. Authentication itself is still a prototype in every build.

| Customer | Email | Businesses | Scenario |
| --- | --- | --- | --- |
| CUS-001 Pauline Guerra | pauline@example.com | BUS-001 Harbour Table | Food registration update in review; alcohol on-licence needs an updated plan and payment |
| CUS-002 James Lee | james.lee@example.com | BUS-002 City Corner Cafe | Outdoor dining draft; food and outdoor requirements/training |
| CUS-003 Olivia Martin | olivia.martin@example.com | BUS-003 Central Taproom; BUS-004 North Shore Events | Existing taproom licence with recorded expiry; a separate events business |

Olivia's sidebar business selector changes every customer page's scope and persists her preferred business. Switching resets page-local state, including open records and unfinished form editors, so another business's details do not linger. The selected business is identified in the sidebar and dashboard; profile saves apply to that business.

New registration creates the next available `CUS-xxx` identity and, if a business name is supplied, a `BUS-xxx` business. New workspaces contain no sample applications, documents, payments, messages, licences or training completions. Customers without a business can add one from My Profile. Business records and business preferences require a selected business.

## Data and relationships

`src/data/customerMockData.js` exports `customerUsers`, `businesses`, `customerRequirements`, `customerApplications`, `applicationHistory`, `customerForms`, `customerDocuments`, `customerVaultRecords`, `customerLicences`, `customerPayments`, `customerMessages`, `customerNotifications`, `customerTraining`, `trainingCompletionRecords`, and `customerReminders`.

The seed is copied into a versioned runtime repository containing customers, businesses and workspaces keyed by business ID. Pages never import seed arrays. `customerStore.js` verifies that a business belongs to both the customer's business list and its owner ID; it returns only matching `userId`/`businessId` records. Writes check ownership, duplicate IDs and related record IDs before saving. Imported seed constants are never mutated.

- Applications belong to a customer and business. Their recorded history is nested as a timeline in the runtime application. The tracker supports search, status/type filters and scoped detail URLs.
- Forms point to applications through `applicationId`; applications point back through `formId`. Creating a draft creates the related Draft application. Saving updates its progress/date. Submission changes that same application to Submitted exactly once. A newly submitted form does not receive an invented council decision.
- Supporting documents reference an optional application. Uploading a document does not issue a licence or create an approved vault record. Application details show the related documents, messages and payments together.
- Payments reference applications and shared fee keys. The food levy comes from `FEE_DATA.food.levy`; Pauline's explicitly fictional medium-risk alcohol fee comes from `FEE_DATA.alcohol.riskLevels.medium.application`. No fixed rates are duplicated in customer records. Payment required, Paid, Pending assessment and Refunded are supported. Simulation updates the payment and resolves its payment notification; no funds move.
- Messages reference applications and are sorted newest first. Reading one persists its read state. Customer notifications have their own read state and header badge, plus links to applications, fees or licence records. They are independent of staff notifications.
- Saved requirements retain the existing public journey's scenario, answers and category results. Existing eligibility logic is reused. Digital forms preselect a relevant category and new drafts retain the saved requirement ID.
- Training uses the existing `trainingModules.js` IDs and content. Assignment follows business activities, saved requirements and application categories. Lesson progress is business-specific. Completing all lessons creates one completion record and one vault reference; repeating completion does not duplicate either. The downloadable text is explicitly a **Hospo Hub training completion record**, not a regulatory certificate.
- Vault entries reference licence/registration or completion records rather than duplicating their status and dates. Supporting uploads appear separately. Sample metadata without a file offers details and a reference, not a fake download.
- Active licence counts use licence records, status and any recorded expiry. Renewal reminders derive from valid recorded licence expiry dates. Pauline's existing food registration has no invented expiry; her separate pending application updates that earlier registration. Olivia's taproom on-licence expires on 15 November 2026. Her events business does not inherit it.
- Profile edits update the customer identity and selected business. Settings persist email, application, payment, renewal and training preferences for that business; only on-page renewal visibility currently consumes its preference. Email and push delivery are not implemented.

## Derived dashboard

`customerSelectors.js` supplies shared counts and amounts:

- Active applications: all except Approved and Declined, including drafts.
- Pending review: Submitted or In review.
- Active licences: Active records with no expiry or a date that has not passed.
- Outstanding fees: sum of known Payment required amounts; unassessed amounts are disclosed separately and excluded.
- Unread messages and notifications: records whose read flag is false.
- Required training: assigned modules without completion dates.

Recent applications sort by their last update. Recent activity sorts actual recorded application timeline events. No per-page placeholder totals are used. At the seeded 11 September 2026 state, Pauline has two active applications, one pending review, one active existing registration, NZ$816.50 outstanding, one unread message, two unread notifications and five modules remaining.

## Persistence, migration and limits

- `hospoHub.customer.workspace.v2` in localStorage holds customer profiles, businesses and their scoped metadata/workspaces. A normal reload reuses this repository instead of resetting seed data.
- `hospoHub.customer.session.v2` holds only `{ userId, selectedBusinessId }`. It uses sessionStorage by default or localStorage for Remember me. Logout clears only customer session keys. No password or confirmation value is saved or checked.
- Old `hospoHub.prototype.profiles`, per-user `hospoHub.workspace.v1.*` data and customer sessions migrate on first use. Original profile/workspace keys remain intact. Migrated session keys are removed to prevent a logged-out session from being restored. Existing accounts take precedence over fictional seed identities with the same email. Corrupt current repository data produces an error and is not silently overwritten.
- Existing IndexedDB file storage is reused: `hospoHub.files`, keyed by customer ID and document ID. File metadata is scoped through the customer repository. PDF/JPG/PNG uploads must be non-empty and at most 10 MB. Use sample files only. Missing files display an error; copy-reference does not expose a public sharing URL.
- Mutations reload the latest stored repository and update only the selected workspace. Cross-tab storage events refresh state. The provider rejects late asynchronous saves if the selected account/business changed.
- Browser storage is not an authorization boundary. Production requires secure identity, server-side access control, a database, council application APIs, real file storage, payment processing, messaging and notification delivery. No council action, licence issuance, payment or email occurs here.

## Files added for this change

| File | Purpose |
| --- | --- |
| `src/data/customerMockData.js` | Connected fictional customers, businesses and seed records |
| `src/services/customerStore.js` | Repository, migration, scoping and write validation |
| `src/services/customerSelectors.js` | Counts, shared-fee resolution, vault joins and renewal dates |
| `src/services/customerActions.js` | Draft creation/save, payment simulation and training completion |
| `src/pages/CustomerNotifications.jsx` | Customer notification list and read actions |
| `tests/customerStore.test.mjs` | Customer scenarios, ownership, persistence, migration and action tests |

## Files modified for this change

- `src/services/authService.js`, `src/context/AuthContext.jsx`: seeded customer identities, ID-only sessions, registration, profile changes and business selection.
- `src/context/HubContext.jsx`, `src/services/hubStore.js`: existing `useHub` integration, scoped writes, business-aware training categories and idempotent form submission. Removed the generic unowned sample loader.
- `src/layouts/DashboardLayout.jsx`, `src/components/AuthForm.jsx`, `src/data/hubNavigation.js`, `src/routes/hubRoutes.js`, `src/utils/authValidation.js`: business selector, notification badge/route and development demo account buttons.
- `src/pages/Dashboard.jsx`, `MyApplications.jsx`, `DigitalForms.jsx`, `DocumentUpload.jsx`, `DocumentVault.jsx`, `PaymentsFees.jsx`, `Messages.jsx`, `Training.jsx`, `HubSettings.jsx`: connected data and actions across the customer experience.
- `src/components/HubUI.jsx`: consistent status colours; `src/components/SaveRequirements.jsx`: scenario/answer persistence and selected-business context.
- `src/pages/NewBusiness.jsx`, `BuyingBusiness.jsx`, `ChangingBusiness.jsx`, `RequirementsResult.jsx`: pass existing answers/results to the shared save component without changing their rules.
- `src/data/licensingFees.js`: explicit `.js` import for direct Node tests; fee values unchanged.
- `src/data/helpFaqs.js`: updated dashboard help to describe separate demo accounts.
- `tests/hubStore.test.mjs`, `tests/hubRoutes.test.mjs`: use the owned customer seed and verify rendered business scopes and foreign detail routes.
- `docs/my-hub-implementation.md`: this architecture and validation reference.

## Validation

Run `npm test`, `npm run build` and `npm run lint`. Tests include customer login/register/logout, session isolation from staff, all protected route renders, empty and seeded workspaces, all four business scopes, foreign IDs, duplicate submission/completion, profile creation, training assignment, shared fees, metadata uploads, read flags, preferences, migration and corrupt-storage preservation. Existing staff tests remain unchanged.

No connected browser was available for interaction, screenshots or console inspection. Responsive desktop/mobile layouts still need a visual pass. The build reports the existing large-chunk advisory. The later Food guidance refactor replaced the Licensing Guide state-sync effect with URL-derived state; see `docs/presentation-and-food-guidance.md` for the light appearance and presentation updates.
