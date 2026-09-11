# Hospo Hub

Hospo Hub is a React prototype for an Auckland Council-style hospitality licensing website. Visitors can explore requirements, business owners can manage a local workspace, and staff can try case-management workflows.

**This project is a local demonstration.** Sign-in selects a prototype identity; passwords are not checked or stored. Applications, payments, messages and callback requests are not sent to council. Use fictional details and sample documents.

## 1. Run the website

Install Node.js and npm. The installed Vite version requires Node **20.19+ within version 20, or 22.12+**; Node 22.12 or newer satisfies this requirement. No API keys, environment file or backend service are needed for the current prototype.

From the project folder:

```powershell
cd C:\hospoHub_marketing
npm ci
npm run dev
```

Open the address printed by Vite, normally `http://localhost:5173`. If that port is occupied, Vite may choose another. Stop the server with `Ctrl+C`.

| Command | Purpose |
| --- | --- |
| `npm ci` | Install dependencies using `package-lock.json` |
| `npm run dev` | Start the development server with live updates |
| `npm test` | Run the automated tests |
| `npm run lint` | Check code with Oxlint |
| `npm run build` | Create the production files in `dist/` |
| `npm run preview` | Serve the existing production build locally |

To preview a production build, run `npm run build` followed by `npm run preview`, then open the printed address. A deployed host must serve `index.html` for application routes such as `/dashboard` and `/staff/cases`; otherwise refreshing a nested URL can produce a 404.

## 2. Understand the three areas

| Area | Who uses it | Access |
| --- | --- | --- |
| Public website | Visitors exploring hospitality requirements | No sign-in needed |
| My Hub | Customers managing their businesses and applications | Customer sign-in at `/login` |
| Staff Portal | Staff reviewing fictional cases and managing work | Separate staff sign-in at `/staff/login` |

The whole website uses a **light appearance**. There is no dark-mode switch. Responsive navigation, mobile staff cards and reduced-motion-aware page transitions remain available.

The three public service areas are **Food business registration**, **Alcohol licensing** and **Outdoor dining approvals**. Verification belongs inside the Food journey. Staff may still track verification as a distinct internal work category.

## 3. Explore the public website

| Page | Route | What it does |
| --- | --- | --- |
| Home | `/` | Introduces the service, explains the journey and links to guidance |
| Get Started | `/get-started` | Lets you choose opening, buying or changing a business |
| Opening a business | `/get-started/new-business` | Guided questions and an initial requirements summary |
| Buying a business | `/get-started/buying-business` | Guidance based on taking over an existing operation |
| Changing a business | `/get-started/changing-business` | Questions about changes to the operation |
| Licensing Guide | `/licensing-guide` | Requirements, processes, fees, forms and FAQs |
| Learning Centre | `/learning-centre` | Public learning topics and related guidance |
| Resources | `/resources` | Searchable and filterable guides and official-source links |
| Help | `/help` | Links to the guided assistant, callback form and FAQs |
| Help assistant | `/help/assistant` | Prepared answers to a small set of common questions |
| Callback request | `/help/callback` | Preview and download a request; does not submit it |
| FAQs and glossary | `/help/faqs` | Search questions and definitions by topic and service |

The shared footer also links to account pages, privacy, terms and staff sign-in. Public browsing does not require an account.

Useful guide links:

```text
/licensing-guide?guide=food
/licensing-guide?guide=food&tab=verification
/licensing-guide?guide=alcohol
/licensing-guide?guide=outdoor
/help/faqs?category=food&search=verification
/resources?category=food
```

Old `guide=verification` bookmarks open Food verification. FAQ and resource filters are reflected in the URL, so filtered views can be bookmarked. Fee estimates use shared data; variable or unassessed charges are not presented as fixed totals.

## 4. Try the customer journey

Open `/login` and use one of these fictional accounts with any non-empty made-up password. Development builds also offer demo-account buttons. The password field is present for the interface only.

| Customer | Email | Business and scenario |
| --- | --- | --- |
| Pauline Guerra | `pauline@example.com` | Harbour Table: an application in review, another needing action, linked documents and fees |
| James Lee | `james.lee@example.com` | City Corner Cafe: an outdoor dining draft and food/outdoor requirements |
| Olivia Martin | `olivia.martin@example.com` | Central Taproom and North Shore Events: demonstrates switching between separate business workspaces |

A practical walkthrough:

1. Sign in as Pauline and open **My Hub**. Dashboard totals come from her saved applications, licences and other records.
2. Open **My Applications** and select an application to inspect its status, timeline and related records.
3. Visit **Get Started**, complete a requirements check and select **Save to My Hub**. If you check requirements while signed out, sign in and run the check again to save it.
4. Open **Forms**, create a draft, fill in the business details and save it. Local submission updates the linked application to Submitted; it does not send an official application.
5. Try a sample document upload, inspect messages, simulate a payment or complete the assigned training lessons.
6. Sign out, then sign in as Olivia. Use the business selector to see that each business has its own records.

You can also create an account at `/create-account`. Registration requires matching passwords of at least eight characters for form validation, but does not persist or verify them. New accounts start with an empty workspace. Supply a business name during registration or add a business through **My Profile**.

| My Hub page | Route | Purpose |
| --- | --- | --- |
| Dashboard | `/dashboard` | Counts, recent applications, activity and next actions |
| My Applications | `/my-applications` | Search/filter applications and open their details |
| Forms | `/forms` | Create, save and locally submit application drafts |
| Document upload | `/document-upload` | Attach sample PDF, JPG or PNG files up to 10 MB |
| Document Vault | `/documents` | View licence, registration, upload and training records |
| Payments | `/payments` | View estimated/outstanding fees and simulate payment |
| Messages | `/messages` | Read local application messages |
| Notifications | `/notifications` | Read alerts and follow links to related records |
| Training | `/training` | Track lessons and create local completion records |
| My Profile | `/profile` | Edit customer and selected-business details |
| Settings | `/settings` | Save business notification and reminder preferences |

Application and form details use `/my-applications/:id` and `/forms/:id`. Customer records are scoped to the signed-in customer and selected business. A training completion record is not a regulatory certificate, and a document upload does not issue a licence.

## 5. Try the staff workflow

Open `/staff/login`. Select a demo identity or enter an active staff email, then choose **Sign in**. The staff password field is optional and ignored.

| Staff member | Email | Role |
| --- | --- | --- |
| Jane Smith | `jane.smith@council.example.nz` | Licensing Officer |
| Emma Taylor | `emma.taylor@council.example.nz` | Administrator |
| Michael Chen | `michael.chen@council.example.nz` | Team Leader |
| Sophie Williams | `sophie.williams@council.example.nz` | Verifier |
| Daniel Brown | `daniel.brown@council.example.nz` | Content Manager |

Start with Jane to review cases and tasks, then Emma to explore administration. Navigation and actions follow the selected role's permissions. The inactive Noah Wilson seed account cannot sign in.

| Staff page | Route | Purpose |
| --- | --- | --- |
| Dashboard | `/staff` | Shared case counts, charts and current work |
| Cases | `/staff/cases` | Search, filter, sort and export cases |
| Case details | `/staff/cases/:id` | Review documents, history, tasks, messages and payments; use permitted case actions |
| My Tasks | `/staff/tasks` | View and update assigned work |
| Teams | `/staff/teams` | Inspect team members, case assignments and workloads |
| Reports | `/staff/reports` | Filter shared case data, view charts and export CSV |
| Content Management | `/staff/content` | Edit local editorial records and their publication status |
| Notifications | `/staff/notifications` | View the current staff member's alerts |
| Users | `/staff/users` | Administrator-only staff provisioning and account changes |
| Settings | `/staff/settings` | Profile, notification preferences and permitted administration settings |

For an administration demo, sign in as Emma and use **Users → Add staff user**. The new identity exists only in this browser; no invitation is sent. Content publication changes local editorial records, not the public website. Staff messages and case changes do not update the separate customer demo workspace.

## 6. How data is stored

There is no remote database. Seed data initializes browser storage, and later actions update those local records. Reloading normally preserves saved changes; editing a seed file does not overwrite an existing workspace.

| Storage | Key or database | Contents |
| --- | --- | --- |
| localStorage | `hospoHub.customer.workspace.v2` | Customer profiles, businesses and their workspaces |
| sessionStorage or localStorage | `hospoHub.customer.session.v2` | Customer ID and selected business ID |
| localStorage | `hospoHub.staff.workspace.v1` | Staff users, cases, tasks, content and settings |
| sessionStorage or localStorage | `hospoHub.staff.session.v1` | Staff identity ID |
| IndexedDB | `hospoHub.files` | Uploaded sample file contents |

**Remember me** stores the corresponding session in localStorage; otherwise it uses sessionStorage. Signing out clears that area's session, not its saved work. Customer and staff sessions are independent.

Storage belongs to the browser profile and origin. `localhost`, `127.0.0.1` and different ports can show different workspaces. To try untouched seed data without deleting current work, use a separate browser profile. Clearing this site's storage removes local changes and uploaded files; older storage keys can also be migrated by the app.

## 7. Project structure and editing guide

The stack is React 19, React Router 7, Tailwind CSS 3, Vite 8, React Icons and Recharts. The project uses JavaScript and JSX.

```text
src/
  App.jsx              Main routing and public/customer providers
  main.jsx             React entry point and light appearance setup
  index.css            Shared styles and responsive staff tables
  pages/               Public and customer pages
    staff/             Staff pages
  layouts/             PublicLayout, DashboardLayout and StaffLayout
  components/          Shared UI, navigation, forms and footer
    staff/             Staff tables, filters, charts and dialogs
  context/             Customer authentication, customer workspace and staff state
  hooks/               Context access and shared filter hooks
  routes/              Customer and staff route definitions
  data/                Public content, shared fees, training and fictional seed data
  services/            Local storage, customer actions, files and staff operations
  utils/               Validation, filtering, dates and formatting
tests/                 Automated state, permissions, content and route checks
docs/                  Detailed implementation notes
```

| Change | Start here |
| --- | --- |
| Home content | [Home.jsx](src/pages/Home.jsx), [homeContent.js](src/data/homeContent.js) |
| Public navigation/footer | [Header.jsx](src/components/Header.jsx), [Footer.jsx](src/components/Footer.jsx) |
| Guide content and Food verification | [LicensingGuide.jsx](src/pages/LicensingGuide.jsx) |
| Fees and National Programme references | [licensingFees.js](src/data/licensingFees.js), [nationalProgrammes.js](src/data/nationalProgrammes.js) |
| FAQ questions, glossary and resources | [helpFaqs.js](src/data/helpFaqs.js), [helpGlossary.js](src/data/helpGlossary.js), [resources.js](src/data/resources.js) |
| Guided assistant and training | [helpAssistantQuestions.js](src/data/helpAssistantQuestions.js), [trainingModules.js](src/data/trainingModules.js) |
| Customer demo records | [customerMockData.js](src/data/customerMockData.js) |
| Customer storage and actions | [customerStore.js](src/services/customerStore.js), [customerActions.js](src/services/customerActions.js), [customerSelectors.js](src/services/customerSelectors.js) |
| Staff demo records and permissions | [staffMockData.js](src/data/staffMockData.js), [staffRoles.js](src/data/staffRoles.js), [staffStore.js](src/services/staffStore.js) |
| Routes | [App.jsx](src/App.jsx), [hubRoutes.js](src/routes/hubRoutes.js), [staffRoutes.js](src/routes/staffRoutes.js) |

Pages consume shared context and storage helpers. Update these common sources so dashboard counts, tables and related records stay consistent. Reuse the shared fee source instead of copying amounts into individual screens.

## 8. Checks and known limits

After code changes, run `npm test`, `npm run lint` and `npm run build`. Tests cover identity selection, customer/business scoping, staff permissions, local actions, shared fees, content links and route rendering. A passing build does not replace checking desktop/mobile interactions in a browser. The build can report an advisory about JavaScript chunks larger than 500 kB.

Common troubleshooting:

- **Sign-in fails:** use a seeded email or create a local customer account; staff identities must be active.
- **Data seems missing:** check the selected business, browser profile and exact host/port.
- **A sample document will not download:** some seed records contain metadata only. Only stored files and explicitly provided samples have downloadable contents.
- **Reports show no recent cases:** staff seed dates are fixed in August/September 2026. Choose a matching report period.
- **A refreshed deployed route returns 404:** configure the host's single-page-app fallback to `index.html`.

Prototype role and ownership checks help demonstrate behavior, but browser storage is not a security boundary. Production would require secure authentication, server-side permissions, persistent backend/file storage and actual council, payment and communication integrations. The Help assistant uses prepared answers, callback requests are downloads, and saved notification preferences do not send email or push notifications.

More detail:

- [Customer and business architecture](docs/my-hub-implementation.md)
- [Staff Portal workflows and permissions](docs/staff-portal-implementation.md)
- [Public Help and Resources](docs/public-knowledge-implementation.md)
- [Public guidance, light appearance and responsive layouts](docs/presentation-and-food-guidance.md)
