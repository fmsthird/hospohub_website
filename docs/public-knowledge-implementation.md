# Public Help and Resources

The public support routes remain separate: `/help`, `/help/assistant`, `/help/callback`, `/help/faqs` and `/resources`. Help retains its three main support cards and now includes a secondary Resources link. There is no second requirements wizard; planning links use the existing Get Started flows.

## Content

- `src/data/helpFaqs.js`: 125 questions with complete answers across 10 categories, stable IDs, services, keywords, related links and resource IDs. Verification questions are grouped under Food Business.
- `src/data/helpGlossary.js`: 32 structured, alphabetically sorted terms with definitions, keywords and related information.
- `src/data/resources.js`: 57 resource records across eight categories and all six resource types. Verification resources are grouped under Food. These are directory entries pointing to existing guides, learning pages, FAQ answers and official sources rather than duplicated guide content.
- `src/data/helpCategories.js`: category names, service mapping and shared related-link defaults.

NP1–3 official cards reuse `NATIONAL_PROGRAMME_REFERENCES` from the existing data file. Related FAQ resources resolve by ID, so their titles and destinations remain centralised. Product answers explain the actual prototype behaviour, including local submissions, simulated payments, document storage, training records and callback downloads.

## Filters and navigation

FAQs default to questions. All, FAQs and Glossary views combine with search, category and service filters using AND logic. Search includes answers/definitions, categories, service labels and keywords. Glossary has A–Z navigation; letters without matching terms are disabled. Category counts reflect search, content type and service before applying the selected category. Result counts reflect every active filter.

Resources combine search, category and resource type, with tags included in search. Cards distinguish Hospo Hub information from official external sources. Quick links connect Get Started, Licensing Guide, Learning Centre and FAQs. Internal links use React Router; external links use `target="_blank"`, `rel="noopener noreferrer"` and an external-link icon.

Filters are held in the URL. Examples:

- `/help/faqs?category=alcohol&search=licence`
- `/help/faqs?type=glossary&letter=O`
- `/help/faqs?type=all&search=verification`
- `/resources?category=food&type=official-information`
- `/resources?search=site+plan`

Clear filters resets to the default view. The control is only shown when filters are active. Empty states provide recovery actions. Neither public page exposes private Document Vault files or requires authentication.

## Sources and link checks

External library destinations reuse URLs already present in the project. General food and verification guidance was checked against MPI material available through its search index, including [National Programmes](https://www.mpi.govt.nz/food-business/running-a-food-business/national-programmes), [verification guidance](https://www.mpi.govt.nz/food-business/running-a-food-business/verifying-your-food-business/getting-your-food-business-verified) and [template Food Control Plans](https://www.mpi.govt.nz/food-business/running-a-food-business/food-control-plans/use-a-template-food-control-plan/steps-to-a-simply-safe-and-suitable-template-food-control-plan).

The existing [alcohol licensing](https://www.aucklandcouncil.govt.nz/licences-regulations/business-licences/alcohol-licences-fines/Pages/default.aspx) and [outdoor dining](https://www.aucklandcouncil.govt.nz/licences-regulations/business-licences/outdoor-dining-licenses/apply-outdoor-dining-licence/Pages/know-the-outdoor-dining-rules.aspx) references resolved through the browsing service to Auckland Council’s newer site. [WorkSafe guidance](https://www.worksafe.govt.nz/managing-health-and-safety/) and [Business.govt.nz](https://www.business.govt.nz/) were also accessible.

Some direct official-page fetches were blocked by access controls or robots restrictions, so this is not a claim that every external link was manually opened in a browser. The tests validate official hostnames, safe external-link attributes, every internal destination and non-empty results for FAQ resource links. No guessed official PDF URLs were added. Existing fee schedules and regulatory guides were not changed.

## Files changed

Modified:

- `src/pages/HelpSupport.jsx`, `HelpFaqs.jsx`, `Resources.jsx`
- `src/data/helpFaqs.js`, `helpGlossary.js`
- `src/utils/helpSearch.js`
- `tests/helpPages.test.mjs`

Created:

- `src/data/helpCategories.js`, `resources.js`
- `src/components/ContentFilterBar.jsx`, `ResourceLink.jsx`
- `src/hooks/useContentFilters.js`
- `tests/publicKnowledge.test.mjs`
- This implementation note

## Validation

All 56 project tests passed, covering knowledge filters, counts, URLs, glossary terms, resource relationships, empty states, public access and existing Help, customer and staff flows. The production build passed. Lint reports only the existing `LicensingGuide.jsx` effect warning; build output retains bundle-size advisories.

FAQs and Resources share width, typography, filter inputs, focus styles and card treatment. Filters stack at smaller widths; Resources uses one, two and three columns across mobile, tablet and desktop breakpoints. Native details/summary elements provide keyboard-operable accordions. Visual browser checks remain unavailable because the in-app browser reported no connected instance.
