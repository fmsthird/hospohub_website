# Staff Portal implementation

Open `/staff/login`. Select Jane Smith (Licensing Officer) or Emma Taylor (Administrator), then select **Sign in**. Both are fictional development identities. Password input is optional, ignored and never persisted.

## Routes and functionality

| Route                  | Function                                                                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/staff/login`         | Separate staff sign-in, remember option, prototype recovery explanation, demo identities                                                           |
| `/staff`               | Shared-data totals, 30-day applications chart, status chart, recent cases and own tasks                                                            |
| `/staff/cases`         | Search, type/status/priority/officer/team/date filters, overdue filter, sorting, CSV export                                                        |
| `/staff/cases/:id`     | Overview, application, documents, messages, tasks, payments and history; assignment, status changes, internal notes and local information requests |
| `/staff/tasks`         | Own tasks, due/overdue/completed views, completion and authorised reassignment                                                                     |
| `/staff/teams`         | Team members, availability, workloads, expandable team cases and links to officer cases                                                            |
| `/staff/reports`       | Date/type/team/officer/status filters, charts, calculated processing time and CSV export                                                           |
| `/staff/content`       | Draft/edit/preview/publish/archive local editorial records and planned publication dates                                                           |
| `/staff/notifications` | Own notifications, unread/type filters, mark read, related case/task links                                                                         |
| `/staff/users`         | Administrator-only provisioning, editing, account status confirmation and staff details                                                            |
| `/staff/settings`      | Profile, local notification preferences, fixed workflow statuses and administrator configuration                                                   |

## Data and calculations

`src/data/staffMockData.js` is the single seed source: 6 fictional staff users, 6 teams, 28 deterministic cases, 7 tasks, 4 notifications and 4 content records. Cases use fixed August/September 2026 dates. No dashboard/report statistics are seeded separately. Empty chart periods remain empty; dates are not moved to inflate current figures.

The staff workspace is saved under `hospoHub.staff.workspace.v1`. `staffStore.js` validates all mutations and their permissions. The provider shares updates across staff screens and responds to storage changes from other tabs. Unsupported saved data shows an error and is not overwritten silently.

- Dashboard counts derive from `staffCases.length`, category and status filters.
- Reports apply one common filter to cases; all report charts use that result. Processing days are elapsed submission-to-decision time for completed decisions with a recorded date. Missing dates are excluded.
- Cases are overdue when still open and either their explicit due date or a related open task is overdue. Approved/declined cases are not counted as overdue.
- Tasks join cases through `caseId` and staff through `assignedTo`/`assignedBy`. The sidebar badge counts the current user's incomplete tasks.
- Team cases use `case.teamId`. Team tasks follow their related case's team; officer workloads use `assignedOfficerId` and task `assignedTo`. Assigned totals include historical cases; active totals exclude decisions.
- Notifications use `staffId`; only that staff member can mark them read. Header/sidebar unread counts share the same helper.
- NZ calendar dates use `Pacific/Auckland`, display uses `en-NZ`, and currency reuses `formatNZD`. Food/alcohol illustrative charges resolve from the existing `FEE_DATA` rather than duplicating schedule amounts.

## Authentication and permissions

This is **prototype identity selection, not real authentication**. The session contains only `{ staffId }`, stored under `hospoHub.staff.session.v1` in sessionStorage or localStorage when remembered. Passwords are neither validated nor saved. Browser storage and client-side role checks are not a security boundary; production must use a council identity service and authorised backend APIs.

Staff and customer sessions, accounts and workspaces are separate. Customer authentication cannot satisfy the staff route guard. Staff sign-in does not sign a customer in. Staff sign-out removes only the staff session.

`src/data/staffRoles.js` centralises role permissions. Navigation, route guards and mutation functions use them. Administrators have all actions; team leaders may assign work and see reports; licensing officers and verifiers review cases and complete their own tasks; content managers edit/publish local content; analysts have read-only cases and reports. Everyone can access their profile, preferences and own notifications. Users management and system configuration require administrator access.

To create staff: sign in as Emma → Users → Add staff user. A sequential `STF-###` ID is supplied, required fields and duplicate identity values are validated, and the local record appears in Users and can sign in. No invitation is sent. Editing roles affects access immediately. Activation/deactivation requires a confirmation dialog. Deactivation prevents sign-in and invalidates a stored session without deleting historical ownership. The current account cannot deactivate itself, and at least one active administrator must remain.

## Prototype boundaries

All operational changes remain in the local staff workspace. Internal notes are in their own collection and do not enter applicant message threads or customer data. Information requests and messages are labelled as saved locally, not sent. Content publishing/scheduling changes local records only; it does not publish to public pages or run scheduled jobs. Team-routing and notification preferences are saved configuration for future integration.

One supporting document is a downloadable fictional text sample. Metadata-only PDFs explicitly say their files are unavailable. Payment statuses are fictional; no payments, receipts or council decisions are transmitted. CSV exports are prototype reports, with quoted cells and spreadsheet-formula escaping.

## Files

Modified: `src/App.jsx` adds a lazy `/staff/*` branch and is formatted. Existing public, Help, authentication, fee and customer My Hub implementations remain unchanged.

Created:

- `src/pages/StaffPortal.jsx`, `src/pages/StaffLogin.jsx`
- `src/pages/staff/StaffDashboard.jsx`, `StaffCases.jsx`, `StaffCaseDetail.jsx`, `StaffTasks.jsx`, `StaffTeams.jsx`, `StaffReports.jsx`, `StaffContent.jsx`, `StaffNotifications.jsx`, `StaffUsers.jsx`, `StaffSettings.jsx`
- `src/layouts/StaffLayout.jsx`, `src/routes/staffRoutes.js`
- `src/components/staff/StaffUI.jsx`, `StaffProtectedRoute.jsx`, `StaffUserMenu.jsx`, `StaffCaseFilters.jsx`, `StaffCaseTable.jsx`, `StaffCaseActions.jsx`, `StaffTaskTable.jsx`, `StaffCharts.jsx`
- `src/context/StaffAuthContext.jsx`, `src/hooks/useStaffAuth.js`
- `src/services/staffAuthService.js`, `src/services/staffStore.js`
- `src/data/staffMockData.js`, `src/data/staffRoles.js`, `src/utils/staffDataHelpers.js`
- `tests/staffPortal.test.mjs`, this implementation note

## Validation and responsive behaviour

Automated tests cover the officer/admin flows, all configured role permissions, provisioning/edit/deactivation/reactivation, session isolation, forbidden writes, shared statistics, notes/messages separation, document review, content/configuration persistence, missing/empty records, route rendering and safe destinations. The existing public, customer authentication, fee, My Hub and Help suites remain part of `npm test`.

The layout uses a full sidebar at large desktop widths and a modal navigation drawer for tablets/mobile, with native dialog focus management. Filters wrap, cards stack, and dense tables scroll within their containers. Forms remain scrollable at small heights rather than clipping fields. Charts include text values or an accessible data table. Existing reduced-motion-aware page transitions are reused.

Browser visual verification was unavailable because the in-app browser had no connected instance. Responsive behaviour has been reviewed in code, but desktop/tablet/mobile interaction and screenshot checks still need a connected browser. Build output may report chunk-size advisories; the staff bundle is lazy loaded so public navigation does not load Recharts.
