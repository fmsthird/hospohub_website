# Light appearance, responsive staff pages and public guidance

Hospo Hub has three public hospitality services: Food business registration, Alcohol licensing and Outdoor dining. Verification remains part of Food, including preparation, recognised verifiers, records, corrective actions, follow-up, resources and separate variable fees.

## Public guidance and home page

- `src/pages/LicensingGuide.jsx` nests verification in the Food guide. `/licensing-guide?guide=food&tab=verification` opens it directly. Legacy `guide=verification` and `type=verification` bookmarks open the same section. Guide and tab selection follow the URL, including browser history; unknown values fall back to the overview.
- `src/pages/Home.jsx` and `src/data/homeContent.js` retain the hero, add four journey steps, show three service cards in each service area and offer next steps based on the existing account state.
- `src/components/Footer.jsx` is shared through `src/layouts/PublicLayout.jsx`, with existing guide, support and account destinations. Staff login remains a secondary link. Verification is reached through Food.
- `src/data/helpCategories.js`, `helpFaqs.js`, `helpGlossary.js` and `resources.js` place verification under Food. All 125 FAQs, 32 glossary terms and 57 resources remain; the 11 moved FAQs retain their IDs. There are now 10 FAQ categories and eight resource categories. `src/utils/helpSearch.js` also supports old verification category/service filters.
- `src/pages/Resources.jsx`, `CallbackRequest.jsx`, `LearningCentre.jsx` and `RequirementsResult.jsx` use the Food hierarchy. Food requirement results include registration, the applicable programme and verification together, using the existing eligibility rules.
- `src/data/helpAssistantQuestions.js` and `trainingModules.js` link to the Food verification section. The food training module ID remains unchanged. Shared fee values and internal staff verification workflows remain intact.

## Shared appearance

All public, customer and staff pages use the light appearance. Theme controls, appearance settings, the theme provider/store and dark CSS variants have been removed. The site does not follow the OS colour preference.

`index.html` and `src/index.css` specify a light canvas and native controls. `src/main.jsx` removes the old root class and saved appearance key without changing customer or staff data. `tailwind.config.js` uses fixed light colours. `src/components/staff/StaffCharts.jsx` uses a fixed palette for labels, grid lines, series and tooltips.

## Staff on smaller screens

`src/layouts/StaffLayout.jsx` uses a permanent sidebar from 1024px and a native modal drawer below it. The drawer supports Escape, backdrop dismissal, focus containment and scroll locking. Search expands beneath the compact header. The same permission-filtered navigation serves both layouts.

`src/components/staff/StaffUI.jsx` and CSS present existing table rows as labelled cards below desktop, retaining one set of records and actions. Cases, tasks, teams, content and users share this behavior. Tabs scroll horizontally. `StaffCaseFilters.jsx` adds mobile filter dialogs for Cases and Reports; changes apply only on Apply, and invalid date ranges prevent application. `StaffCaseDetail.jsx` collapses mobile actions. Staff controls use 44px minimum heights, and cards wrap long values.

## Verification

Run `npm test`, `npm run build` and `npm run lint`. The regression suite covers public/customer/staff rendering without theme controls, role restrictions, footer destinations, legacy verification URLs, preserved content/search, requirements and existing customer/staff state operations.

Server rendering and source checks do not establish actual viewport layout or interactive behavior. No connected browser was available for screenshots, console inspection or the requested mobile/desktop visual pass. The production build retains the existing large-chunk advisory.
