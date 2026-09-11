# My Hub implementation

The public website remains open. Business accounts add a browser-only prototype workspace, using the existing prototype authentication. Staff routes are not introduced or changed.

## Behaviour and data

- Public Get Started journeys retain their existing requirements logic. Signed-in users can save the current result to My Hub; no second wizard is introduced.
- `services/hubStore.js` stores requirements, forms, application cases, document metadata, simulated payment records, messages, preferences and training progress under a key containing the signed-in profile ID. Signing out retains the workspace but hides protected pages. This is prototype data separation, not production security.
- Fresh accounts start empty. Settings offers **Load sample workspace** only in an empty workspace. It adapts the existing `data/mockDatabase.js` records and labels them as samples. It does not create real licences, council decisions, or attachments.
- Digital forms save drafts. A prototype submission creates one case and a recorded timeline. Submitted forms are read-only. The tracker shows statuses, dates, next steps and related messages.
- File uploads accept non-empty PDF/JPG/PNG files up to 10 MB. Files are stored in IndexedDB under the profile ID and record ID; metadata is in the workspace. View/download actions load only that profile's file key. Copy reference does not expose a public document URL.
- Payments and upcoming estimates read `data/licensingFees.js`. Food prototype submissions create an illustrative levy payment item. Variable charges and unknown alcohol risk are never converted into invented bills. Payment simulation collects no money and issues no real receipt.
- `data/trainingModules.js` assigns modules from saved requirements and application categories. Reviewing activities saves progress. Completion creates a **Hospo Hub training completion record** in Document Vault, viewable and downloadable as text. It is not a regulatory qualification. Refreshers have no invented renewal dates.
- `/learning-centre` stays a public reference library with no personal progress. Signed-in visitors get a link to `/training`, which is protected and contains the saved progress and completion records.
- Verification is an additional public Licensing Guide option, using existing tabs and shared variable verification fee data. Official sources: [MPI verification guidance](https://www.mpi.govt.nz/food-business/running-a-food-business/verifying-your-food-business/getting-your-food-business-verified) and [MPI verification topics](https://www.mpi.govt.nz/dmsdocument/11680/direct).
- Help provides fixed guided answers, searchable FAQs/glossary, and a callback request preview/download. It has no live AI, booking, or council submission API.

## Files created

| Files | Purpose |
| --- | --- |
| `src/context/HubContext.jsx`, `src/hooks/useHub.js`, `src/services/hubStore.js` | Per-profile shared workspace, persistence and cross-tab refresh |
| `src/services/documentStore.js` | Local file persistence, file validation and text downloads |
| `src/data/trainingModules.js` | Single training assignment/content configuration |
| `src/routes/hubRoutes.js` | Protected My Hub route definitions |
| `src/components/UserMenu.jsx` | Shared avatar/profile/settings/help/sign-out menu |
| `src/components/HubUI.jsx`, `src/components/ApplicationTable.jsx` | Reusable cards, headings, dates, statuses and application list |
| `src/components/SaveRequirements.jsx` | Save existing journey results without changing eligibility rules |
| `src/pages/Dashboard.jsx` | Data-driven summary cards, recent cases, saved checklist and quick actions |
| `src/pages/MyApplications.jsx` | Application list and case detail timeline |
| `src/pages/DigitalForms.jsx` | Create, save, continue and submit prototype forms |
| `src/pages/DocumentUpload.jsx`, `src/pages/DocumentVault.jsx` | Local uploads, categories, reminders and record actions |
| `src/pages/PaymentsFees.jsx` | Shared fee estimates and payment simulation |
| `src/pages/Messages.jsx` | Message details, application links and read status |
| `src/pages/Training.jsx` | Assigned modules, saved review progress, completion records and refresher guidance |
| `src/pages/HubSettings.jsx` | Profile, reminder preference and opt-in sample data |
| `tests/hubStore.test.mjs`, `tests/hubRoutes.test.mjs` | Workflow, isolation, route and public-page regressions |
| `docs/my-hub-implementation.md` | Implementation and validation reference |

## Files modified

- `src/App.jsx`: workspace provider and protected route integration.
- `src/layouts/DashboardLayout.jsx`: dedicated authenticated header, responsive sidebar and workspace notices matching the supplied visual direction.
- `src/components/Header.jsx`, `src/components/AccountActions.jsx`: shared user menu and authenticated Requirements navigation; mobile actions stay inside the menu.
- `src/data/hubNavigation.js`: icons and grouped My Hub sidebar destinations.
- `src/utils/authValidation.js`: safe post-login destinations for added routes and form/application details.
- `src/pages/NewBusiness.jsx`, `BuyingBusiness.jsx`, `ChangingBusiness.jsx`, `RequirementsResult.jsx`: save CTA on existing results.
- `src/pages/LicensingGuide.jsx`: public verification option and sources.
- `src/pages/LearningCentre.jsx`: authenticated training entry, preserving the public library.
- `src/pages/HelpSupport.jsx`: guided help, callback preparation, FAQs and glossary.
- `src/pages/AccountInformation.jsx`: disclosure of local workspace/file storage.
- `package.json`: serial test command avoids competing Vite test websocket ports.
- Removed `src/pages/MyHub.jsx`: replaced obsolete all-in-one placeholder with dedicated pages.

Shared licensing fee values, authentication storage behaviour, public Resources and staff functionality are unchanged.

## Validation

Run `npm test`, `npm run build`, and `npm run lint`.

Tests cover all protected route renders for signed-out and signed-in users, empty/sample states, public informational renders, verification deep links, public versus private training entry, per-profile persistence, draft-to-case submission, duplicate submission prevention, category assignment, upload limits, login redirects, auth/session/logout behaviour and shared fee calculations.

Browser interaction and visual verification were unavailable because no browser was connected. Responsive layouts are implemented but still need a visual pass at desktop and mobile widths. Authentication remains a prototype; real accounts, council submissions, payments, messaging and cloud documents require backend services before production.
