import {
  CATEGORY_HELP,
  FOOD_VERIFICATION_HELP,
  slug,
} from "./helpCategories.js";

// One editorial source for the public FAQ library. Product answers describe the
// current local prototype; regulatory topics link to guides and official resources.
const sections = {
  "Getting Started": [
    [
      "What should I do first when opening a new hospitality business?",
      "Start with Get Started and choose the new-business option. Answer questions about food, alcohol and outdoor public space to identify approvals that may apply. Use the result to prepare your documents and confirm the requirements with the relevant authority.",
    ],
    [
      "What if I am buying an existing hospitality business?",
      "Choose the buying-an-existing-business option in Get Started. Record what the business currently does and what you intend to change. Do not assume the previous operator’s registrations or licences transfer to you; confirm the arrangements before taking over.",
    ],
    [
      "What if I am changing an existing operation?",
      "Use the changing-an-existing-operation flow to describe your proposed activities. Changes to food handling, alcohol service, premises or outdoor space can affect approvals. Review your existing conditions and discuss the proposed change with the relevant authority.",
    ],
    [
      "Can I check requirements without creating an account?",
      "Yes. Get Started, Licensing Guide, Learning Centre, Resources and Help are public. You can complete the requirements questions without signing in; an account is optional for saving results and using My Hub.",
    ],
    [
      "Why should I create an account before preparing my business?",
      "A customer account lets you save requirements and use My Hub forms, documents and training progress. In this prototype, those records belong to your profile in this browser. Creating an account does not register a business with council.",
    ],
    [
      "Does Hospo Hub automatically approve my business?",
      "No. Hospo Hub helps you understand likely requirements and prepare information. It does not issue regulatory decisions or grant permission to trade. Submit formal applications through the relevant authority’s official process.",
    ],
    [
      "How does the requirements checker work?",
      "Get Started asks about whether you are opening, buying or changing a business and the activities you plan to carry out. Your answers determine which guidance and estimated charges appear. Review the result carefully because this guided check is not a formal assessment.",
    ],
    [
      "Can I save my requirements?",
      "Yes. Sign in to a customer account and use the save option on your requirements result. My Hub can use saved categories to show relevant information and training. Storage is local to this browser, so it is not a council record or cross-device backup.",
    ],
    [
      "What happens after I identify my requirements?",
      "Read the relevant Licensing Guide sections, gather the listed information and check variable fees with the authority. Resources can help you find official information and forms. My Hub also offers local practice forms, but these do not replace an official application.",
    ],
  ],
  "Food Business": [
    [
      "Do I need to register my food business?",
      "Many businesses that prepare, manufacture or sell food need registration under the Food Act 2014. The applicable risk-based measure depends on the activities involved. Use MPI’s food business guidance and confirm your registration pathway before operating.",
    ],
    [
      "What is a Food Control Plan?",
      "A Food Control Plan is a documented system for managing food safety risks in your operation. It explains what staff must do to keep food safe. Check whether a template or custom plan fits your activities, then use the Food guide to prepare for registration.",
    ],
    [
      "What is a Template Food Control Plan?",
      "A Template Food Control Plan is an approved ready-made plan for eligible food businesses. You still need to select the relevant procedures, put them into practice and keep required records. MPI’s guidance explains whether its template suits your activities.",
    ],
    [
      "What is a National Programme?",
      "A National Programme is a risk-based food safety measure for certain food businesses. There are three levels with requirements that reflect the activities involved. Businesses still need to meet applicable standards, keep records, register and be verified; use the MPI NP1–3 references to find the right guidance.",
      ["national-programme-1", "national-programme-2", "national-programme-3"],
    ],
    [
      "How do I know which food safety measure applies?",
      "The measure depends on what food you make or sell and how you handle it, not just the name of your business. Use MPI’s My food rules guidance to describe all your activities. If the outcome is unclear, ask your registration authority before choosing a plan or programme.",
    ],
    [
      "What documents might I need for food business registration?",
      "Prepare your business and operator details, the scope of your food activities and the registration form. A plan, site information or verifier confirmation may also be needed for your pathway. Check the current official application instructions so you provide the right supporting documents.",
    ],
    [
      "Do I need a site plan for a new food business?",
      "A site plan may be needed to explain the premises and the areas used for food activities. Check the application instructions rather than assuming an old plan will be accepted. Make sure any plan you provide reflects the operation you actually intend to run.",
    ],
    [
      "What information should a food business site plan contain?",
      "A useful plan identifies the premises boundaries and the layout of preparation, storage and service areas. Label the relevant spaces clearly and show measurements where requested. Follow the authority’s current checklist for the level of detail and any additional facilities it needs to see.",
    ],
    [
      "Is food registration the same as verification?",
      "No. Registration records your business and its food safety measure. Verification checks how you follow those requirements in practice. Plan for both processes and ask about their separate fees when preparing your application.",
    ],
    [
      "What happens after food registration?",
      "Put the registered plan or programme into daily practice, keep the required records and arrange verification when it is due. Make sure staff understand their responsibilities. Your registration and verifier guidance explain the next steps for your particular operation.",
    ],
    [
      "What if my food activities change?",
      "Review whether your current plan or programme still covers the proposed activities. Tell your registration authority about changes that affect your registration and ask what needs updating. The Changing an Existing Operation flow can help you identify the guidance to review.",
    ],
    [
      "Can I operate before food registration is complete?",
      "Do not treat a saved form, fee estimate or Hospo Hub result as permission to trade. Confirm with the registration authority what approvals must be in place for your activities before opening. Use the Food guide to prepare the information needed for that discussion.",
    ],
  ],
  FoodVerification: [
    [
      "What is food business verification?",
      "Verification is an independent check of how your business follows its food safety requirements. It considers the work you actually do, not just whether a plan is on file. Read the Food guide’s Verification section and arrange the appropriate verifier for your registration pathway.",
    ],
    [
      "Why is verification required?",
      "Verification provides a check that your food safety system is being used in practice. It helps identify gaps between written procedures and daily work. Keep evidence of the checks your plan or programme requires so you can demonstrate how you manage food safety.",
    ],
    [
      "Who carries out verification?",
      "An appropriately recognised verifier carries out the check. Depending on your plan, activities and registration arrangement, that may be the council or an independent agency. Confirm that the verifier can cover your type of operation before making arrangements.",
    ],
    [
      "How should I prepare for verification?",
      "Review your plan or programme with staff and check that the relevant procedures are being followed. Have required records available and note how previous issues were addressed. Agree practical arrangements with your verifier and use the preparation resources as a starting point.",
    ],
    [
      "What records may be checked during verification?",
      "The records depend on your food activities and plan or programme. Relevant examples can include temperature checks, cleaning, staff instruction, suppliers and actions taken when something went wrong. Ask your verifier what should be ready and use your own applicable record requirements.",
    ],
    [
      "What happens during verification?",
      "The verifier discusses your operation, looks at relevant practices and checks supporting evidence. Staff may be asked to explain the procedures they use. At the end, clarify the findings, any required actions and how you will demonstrate that those actions are complete.",
    ],
    [
      "What happens if problems are found during verification?",
      "The verifier will explain the findings and any corrective actions or follow-up needed. Record what needs to change, who will do it and the required timing. If you do not understand a finding, clarify it promptly with the verifier.",
    ],
    [
      "What is a corrective action?",
      "A corrective action addresses a problem found in your food safety system or practice. It should deal with the issue and help stop it happening again. Record what you changed and keep the evidence requested by your verifier.",
    ],
    [
      "Can follow-up verification be required?",
      "Yes, further checks may be needed to confirm that an issue has been resolved. Ask your verifier what evidence or visit is required and whether there will be additional charges. Keep the relevant correspondence with your food safety records.",
    ],
    [
      "Are verification charges separate from registration?",
      "Yes. Verification charges are separate from registration and applicable levies. Verifiers set their own fees, so ask for a quote that explains the work included and any possible follow-up charges. Hospo Hub does not invent a fixed verification total.",
    ],
    [
      "How often can verification occur?",
      "The timing depends on your plan or programme, your business circumstances and verification outcomes. It is not one universal annual interval. Confirm your next due date with your verifier and record it instead of relying on a general estimate.",
    ],
  ],
  "Alcohol Licensing": [
    [
      "Do I need an alcohol licence?",
      "Selling or supplying alcohol generally requires an appropriate licence. The type depends on your activity and where alcohol will be consumed. Describe your proposed service clearly and check the official licensing pathway before beginning sales.",
    ],
    [
      "What is an on-licence?",
      "An on-licence generally permits alcohol to be sold or supplied for consumption at the licensed premises. Restaurants and bars commonly use this licence type. Review the Alcohol guide and the proposed licensed area, hours and conditions before applying.",
    ],
    [
      "What is an off-licence?",
      "An off-licence generally permits alcohol sales for consumption away from the licensed premises. It is different from permission for customers to drink on site. Check the official off-licence information against the way you intend to sell alcohol.",
    ],
    [
      "What is a club licence?",
      "A club licence covers eligible clubs supplying alcohol to authorised people, such as members and qualifying guests. It is not the same as unrestricted public bar service. Check the club’s eligibility and the relevant licence conditions with the licensing authority.",
    ],
    [
      "What is a special licence?",
      "A special licence can authorise alcohol sales or supply for a particular event or occasion. It is separate from a continuing premises licence. Review the official event guidance early and confirm whether the proposed event needs this application.",
    ],
    [
      "What is a manager's certificate?",
      "A manager’s certificate relates to the person responsible for managing alcohol sales where a certified manager is required. It is separate from the premises licence. Check the certificate requirements and how they apply to staffing your operation.",
    ],
    [
      "Which alcohol licence type applies to my business?",
      "Consider whether customers drink on site, take alcohol away, attend a particular event or are authorised club patrons. More than one activity may need consideration. Use the Alcohol guide to compare licence types and confirm the correct application with the authority.",
    ],
    [
      "Can I use the previous owner's alcohol licence after buying a business?",
      "Do not assume that an existing licence automatically covers a new operator. A takeover may require a new application or temporary authority arrangements. Use the buying-business flow and confirm what must be in place before you take over alcohol sales.",
    ],
    [
      "Can I serve alcohol in my outdoor dining area?",
      "The outdoor area must be covered by the relevant alcohol licence and its conditions. Permission to occupy public space does not itself authorise alcohol service. Compare your proposed outdoor layout with the licensed plan and discuss any change with the authority.",
    ],
    [
      "What is a licensed area?",
      "The licensed area is the part of a premises or site covered by the alcohol licence. The approved plan and conditions help establish its boundaries. Check those documents before changing the layout or serving alcohol in an additional space.",
    ],
    [
      "What is host responsibility?",
      "Host responsibility means putting responsible service and customer safety into practice at licensed premises. It includes staff understanding their alcohol-service obligations and the procedures used at the business. Review the Alcohol guide and Learning Centre topics when preparing staff.",
    ],
    [
      "Why do alcohol licence fees differ between businesses?",
      "Relevant alcohol fees depend on the premises cost/risk category rather than a single flat amount for every operation. The type of business and other rating factors can affect the category. Use the fee guidance and confirm the assessment for your application.",
    ],
    [
      "What is an alcohol risk rating?",
      "A cost/risk rating groups premises for the relevant licensing fee calculation. It is not a customer review score or an approval decision. Check the factors in the official fee guidance and confirm the category used for your premises.",
    ],
    [
      "Are alcohol application and annual fees separate?",
      "Yes. Relevant licences can involve an application fee and a separate annual fee. Do not treat one as automatically covering the other. Review both parts of the fee guidance and confirm which charges apply to your licence type.",
    ],
    [
      "What happens when an alcohol licence is due for renewal?",
      "Check the expiry date and renewal instructions in the official licence records. Prepare the required information and apply within the applicable timeframe. Do not assume a Hospo Hub reminder or a local record renews your licence.",
    ],
  ],
  "Outdoor Dining": [
    [
      "Do I need approval for outdoor tables and chairs?",
      "Using council-managed public space for dining can require an outdoor dining licence. Start by identifying the land involved and your proposed use. The Outdoor Dining guide points you to the council application process.",
    ],
    [
      "When is outdoor dining approval required?",
      "Check approval requirements before placing dining furniture or using a public footpath outside your business. Include the whole area you intend customers to use. Confirm the proposed footprint with council rather than relying on a neighbouring business’s arrangement.",
    ],
    [
      "What if my outdoor area is private property?",
      "Establish the property boundary and who controls the space. An outdoor public-space licence is not the only approval that could matter; private land may have other applicable conditions. Ask the relevant authority or property owner about your proposed use.",
    ],
    [
      "What should an outdoor dining site plan show?",
      "Show the proposed dining footprint, dimensions and furniture layout. Mark the surrounding footpath, building edge and relevant obstacles. Use the official outdoor dining instructions to check what your application sketch needs to include.",
    ],
    [
      "Why is pedestrian access important for outdoor dining?",
      "People must be able to move safely through public space. Plan the layout with accessibility in mind and keep the required route clear. Confirm the applicable clearance for your location using the official guidance.",
    ],
    [
      "Can I install outdoor dining barriers?",
      "Check the official furniture rules before choosing barriers or planters. Show them on the proposed layout and ask council whether the arrangement is acceptable. Do not install fixed structures on the basis of a Hospo Hub result.",
    ],
    [
      "Can I use umbrellas in my outdoor dining area?",
      "Check whether umbrellas are permitted for your location and layout. Include them in your plan and follow the applicable furniture and safety conditions. The official outdoor dining resource explains the relevant rules.",
    ],
    [
      "Can I use outdoor heaters?",
      "Include proposed heaters in your layout and check both the outdoor dining conditions and safe-use requirements. Confirm their location before using them near customers or pedestrian routes. Your approval and equipment instructions should guide their use.",
    ],
    [
      "Can alcohol be served outdoors?",
      "Outdoor dining permission and alcohol licensing address different activities. Check that the alcohol licence covers the outdoor area before serving drinks there. Use the Alcohol guide alongside the Outdoor Dining guide when preparing a combined proposal.",
    ],
    [
      "Are outdoor dining fees fixed?",
      "The total is not the same for every location and footprint. Check the current council estimate and ask for confirmation of the charge for your proposed area. Hospo Hub keeps variable amounts separate from known charges.",
    ],
    [
      "Is there a public-space rental charge?",
      "Outdoor dining costs can include payment for occupying public space in addition to the licensing charge. Check the current council calculation for your proposed location and area. Keep both cost components in your budget.",
    ],
    [
      "What happens if I change the outdoor dining layout?",
      "Compare the proposed change with your approved plan and conditions. Ask council whether an amendment or new application is needed before changing the use of the space. Update your planning documents so they describe the proposed arrangement accurately.",
    ],
  ],
  "Fees & Payments": [
    [
      "Are all Hospo Hub fees fixed?",
      "No. Some published amounts can be shown directly, while other charges depend on your activity or assessment. Hospo Hub separates known and variable charges so you can see the limits of an estimate. Confirm the final fees with the relevant authority.",
    ],
    [
      "Why does Hospo Hub show some fees as 'Varies'?",
      "Varies means one amount cannot be applied reliably to every business. The charge may depend on the location, area, risk category or work involved. Follow the relevant guide to find out what information is needed for a confirmed amount.",
    ],
    [
      "Is the estimated fee shown by Hospo Hub my final cost?",
      "No. The estimate is a planning aid, not an invoice or final quote. Registration, verification, annual or rental charges may remain to be confirmed. Read the notes beside the estimate and ask about any unpriced components.",
    ],
    [
      "Why are known and variable charges shown separately?",
      "This shows which amounts can currently be calculated and which still need assessment. Adding only the known items could otherwise look like a complete total. Include the variable items when planning your budget, even though their amounts are not yet known.",
    ],
    [
      "What is an application fee?",
      "An application fee is a charge associated with processing an application. It does not itself guarantee approval or cover every ongoing cost. Check the relevant application instructions for what the charge includes and how payment is made.",
    ],
    [
      "What is an annual fee?",
      "An annual fee is a recurring charge that may apply to an ongoing licence or service. It can be separate from the original application fee. Check the official payment notice for the amount and due date relevant to your business.",
    ],
    [
      "What is a levy?",
      "A levy is a charge collected for a specified purpose under the applicable arrangements. The food business levy is separate from council registration and verification charges. Review the Food guide for the current displayed levy information and its limitations.",
    ],
    [
      "Are food verification fees separate?",
      "Yes. Budget for verification separately from registration and the food business levy. Ask the verifier what their quote includes and how extra work is charged. Hospo Hub displays verification as a separate variable cost.",
    ],
    [
      "Are outdoor dining rental fees separate?",
      "A public-space rental component may apply alongside an outdoor dining licensing charge. Its calculation can depend on your approved area and location. Use the Outdoor Dining guide and confirm both components with council.",
    ],
    [
      "Where can I see my outstanding payments?",
      "Sign in to My Hub and open Payments & Fees to see the payment records saved for your account. The current page uses local prototype records and fee guidance. It does not retrieve your council balance or accept a real payment.",
    ],
    [
      "What does Payment required mean?",
      "It indicates that a record expects a payment before the relevant next step. Read the associated reference and official instructions before making any real payment. A prototype status in Hospo Hub does not create a council invoice.",
    ],
    [
      "What does Paid mean?",
      "In a real payment record, Paid indicates that the recorded charge has been settled. In this prototype it can be a sample value or the result of Simulate payment. No money is transferred, so confirm actual payment through the official payment service.",
    ],
    [
      "Can fees change?",
      "Yes. Published schedules and the circumstances used to assess a charge can change. Recheck the official amount when preparing to apply or pay. A previously saved estimate should not be treated as a permanently fixed price.",
    ],
  ],
  Applications: [
    [
      "How do I start an application?",
      "Use Get Started to identify the likely requirements and read the relevant guide. For an official application, follow the authority’s current forms and submission instructions. My Hub Digital Forms can save a practice application locally but do not send it to council.",
    ],
    [
      "Can I save a form and finish it later?",
      "Yes. Sign in, open Digital Forms and save a draft before leaving. You can continue that draft through the same customer profile in this browser. Download important information separately because clearing browser data can remove local records.",
    ],
    [
      "What does 'Draft' mean?",
      "Draft means you have started a form and saved it without submitting it. You can return to the form to complete or correct the information. A draft is not an approval or evidence that council has received an application.",
    ],
    [
      "What does 'Submitted' mean?",
      "Submitted normally means an application has been sent for processing, not approved. In the current Hospo Hub prototype, submission only saves a local application record. Use the official authority’s process to make a real submission.",
    ],
    [
      "What does 'In review' mean?",
      "In review means an application record is marked as being assessed. Read its next step and any messages for information requests. Prototype sample statuses do not represent live council processing.",
    ],
    [
      "What does 'Action required' mean?",
      "Action required means the applicant needs to complete a next step, such as supplying information or a document. Read the recorded request carefully and note any official deadline. Use the channel specified by the authority for a real response.",
    ],
    [
      "What does 'Approved' mean?",
      "Approved indicates an approval decision in the relevant application record. In a real process, read the issued document and conditions before relying on the approval. A sample or locally changed Hospo Hub status is not a council authorisation.",
    ],
    [
      "What does 'Declined' mean?",
      "Declined indicates that an application was not approved. Read the official decision and its reasons, including any information about available next steps. A prototype record cannot replace that decision or explain a real application outcome.",
    ],
    [
      "How can I track my application?",
      "Sign in to My Hub and select My Applications to see locally saved applications, status history and next steps. Open an individual reference for more detail. For live council progress, use the official tracking or contact arrangements supplied with your application.",
    ],
    [
      "Where can I see my application’s next step?",
      "Open My Applications and select the relevant reference. Read the Next step information and associated messages. If an official instruction is unclear, contact the authority with the application reference rather than guessing what evidence is needed.",
    ],
    [
      "Can I edit an application after submitting it?",
      "Submitted prototype forms are locked to preserve the saved submission. For a real application, follow the authority’s process for corrections or additional information. Keep your reference handy and explain exactly what needs changing.",
    ],
    [
      "How do I respond when information is requested?",
      "Read the request, identify each item required and prepare a clear response with the application reference. Send it through the channel specified by the authority. Uploading into this prototype’s Document Vault stores a local copy and does not deliver it to council.",
    ],
    [
      "Where do I see messages from council?",
      "My Hub has a Messages area for messages associated with the saved workspace. It currently contains prototype records, not a live council inbox. For actual correspondence, check the contact channel used for your official application.",
    ],
    [
      "How do I find my application reference?",
      "Open My Applications and look for the identifier displayed with the application and on its detail page. Official acknowledgements also normally identify the submitted application. Use the correct official reference when contacting council; a local HH reference belongs to the prototype.",
    ],
  ],
  Documents: [
    [
      "What documents should I keep in My Hub?",
      "Keep the supporting information relevant to your business, such as plans, registration records, licences and training records. Check your application guide for its specific document list. This prototype stores local copies, so retain important originals and a separate backup.",
    ],
    [
      "How do I upload a document?",
      "Sign in to My Hub and open Upload Centre. Select a supported file, enter its details and link it to an application if relevant. Saving adds the file to this browser’s Document Vault; it does not submit it to council.",
    ],
    [
      "Which file types are accepted?",
      "The current Upload Centre accepts PDF, JPG/JPEG and PNG files up to 10 MB per file. Empty files and unsupported types are rejected. Choose a readable copy and keep the original file elsewhere as a backup.",
    ],
    [
      "What is the Document Vault?",
      "Document Vault is the signed-in area for the documents and records associated with your customer profile. You can inspect saved metadata and open available files. It is separate from the public Resources library and currently uses local browser storage.",
    ],
    [
      "What is the difference between Upload Centre and Document Vault?",
      "Upload Centre is where you add a file and describe it. Document Vault is where you browse the records already saved to your account and open or download available files. Both belong to My Hub rather than the public resource library.",
    ],
    [
      "Can I download documents from the Document Vault?",
      "Yes, where the record has an available file or a generated training record. A sample metadata entry may not include a downloadable original. Open the record to check availability and download important files before clearing browser storage.",
    ],
    [
      "Can I replace an uploaded document?",
      "The current prototype does not provide an in-place replacement action. Upload the corrected file as a new record with a clear name so you can identify the latest version. For an official application, follow the authority’s instructions for replacing submitted evidence.",
    ],
    [
      "Where can I find my approved licence?",
      "Look in the official correspondence or service that issued the licence. You can save a copy to My Hub’s Document Vault for your own reference. A sample licence entry or local Approved status does not mean the prototype has issued a licence.",
    ],
    [
      "Can I share a document from My Hub?",
      "You can download an available file and share that copy through a channel you choose. Copy reference copies the record identifier, not a public download link. The prototype does not publish files or send documents to council.",
    ],
    [
      "Will Hospo Hub remind me when a licence expires?",
      "My Hub can display reminders for records with a valid saved expiry date. It does not invent a date when one is missing or send scheduled reminder emails. Check the original document and keep your own renewal reminder.",
    ],
  ],
  "Learning Centre": [
    [
      "What is the public Learning Centre?",
      "The Learning Centre introduces hospitality topics such as food safety, alcohol responsibilities, outdoor dining and verification preparation. It helps you find relevant guides and learning material. It is a reference library, not a licence application or regulatory approval.",
    ],
    [
      "Can I use the Learning Centre without signing in?",
      "Yes. The public Learning Centre and its reference topics are available without an account. Sign in only if you want to use personalised training and save your progress in My Hub.",
    ],
    [
      "What changes in learning when I sign in?",
      "You can open My Hub Training to see modules associated with your saved requirement or application categories. Reviewed lessons and completion records can be saved to your profile. That progress is local to this browser and is separate from public browsing.",
    ],
    [
      "What training is available after I sign in?",
      "My Hub offers self-guided modules for saved food, alcohol and outdoor dining categories. Topics include food safety, verification preparation, host responsibility and outdoor dining practices. Save relevant requirements or applications first if your training list is empty.",
    ],
    [
      "How is required training selected?",
      "The prototype selects modules using the categories in your saved requirements and applications. For example, food-related records can show food safety and verification preparation modules. This selection is a learning aid, not an official determination of mandatory training.",
    ],
    [
      "Can I track my training progress?",
      "Yes. In My Hub Training, mark the lessons you have reviewed and return to continue later. Progress is saved for the current profile in this browser. Public Learning Centre browsing does not create a personal progress record.",
    ],
    [
      "What does Completed mean in My Hub Training?",
      "Completed means all lessons in that prototype module have been marked reviewed. The system records the completion date and creates a completion record. It does not mean an examiner assessed your competence or granted a regulatory qualification.",
    ],
    [
      "Can I download a training completion record?",
      "After completing a module, use its completion-record action or find the record in Document Vault. The prototype creates a downloadable text record identifying the module and completion. Keep a copy if you need to preserve it outside this browser.",
    ],
    [
      "Are Hospo Hub completion records official regulatory certificates?",
      "No. The current self-guided prototype records show that lessons were marked reviewed in Hospo Hub. They do not replace recognised qualifications, a manager’s certificate or any legally required certification. Confirm any formal training requirement with the relevant authority.",
    ],
    [
      "What is refresher training?",
      "Refresher training revisits a topic so staff can maintain their knowledge and adapt to changes. Use it when procedures change or you identify a learning need. The prototype provides guidance rather than inventing a mandatory refresher due date.",
    ],
  ],
  "My Hub": [
    [
      "What is My Hub?",
      "My Hub is the customer workspace for saved requirements, forms, applications, documents, payments, messages and training. Sign in with your customer profile to use it. In this version, the workspace is a local prototype and is not synchronised with council systems.",
    ],
    [
      "Why should I create a Hospo Hub account?",
      "An account lets you keep your prototype workspace together and return to saved work. Public guidance remains available without one. The prototype stores profile information locally and does not verify passwords, so it is not a production identity service.",
    ],
    [
      "What can I see on the My Hub dashboard?",
      "The dashboard summarises your selected business’s applications and licence records and offers quick actions. Its counts come from saved records. New accounts start empty; the fictional demo customers have separate sample businesses and records.",
    ],
    [
      "Where are My Applications?",
      "Sign in and select My Applications from the My Hub navigation. Choose a reference to read its status, history and next step. The list shows saved prototype applications rather than a live feed from council.",
    ],
    [
      "What are Digital Forms?",
      "Digital Forms let you create and save a prototype application for food, alcohol or outdoor dining. You can continue a draft and save a local submission when ready. For a real application, use the current official forms and submission process.",
    ],
    [
      "Where can I view my documents?",
      "Open Document Vault from My Hub to browse saved records and available files. Use Upload Centre to add another file. The public Resources page is for guidance and official links rather than your personal documents.",
    ],
    [
      "Where can I view my payments?",
      "Open Payments & Fees in My Hub to see locally saved payment records and relevant fee guidance. Simulate payment only changes a prototype status. Use the official payment service to check a real balance or pay council.",
    ],
    [
      "Where can I read council messages in My Hub?",
      "Select Messages in the My Hub navigation to read the workspace’s message records. This is currently a prototype inbox. Actual council correspondence remains in the official channel used for your application.",
    ],
    [
      "Where is my training?",
      "Select Training in My Hub to see modules matched to saved food, alcohol or outdoor categories. You can review lessons, track progress and download completion records. The public Learning Centre remains available for browsing without a personal record.",
    ],
    [
      "What happens when I sign out?",
      "Signing out ends the customer session, so My Hub requires another sign-in. Public pages stay available and saved local workspace records remain in this browser. Signing out does not delete those records or end a separate staff session.",
    ],
  ],
  "Help & Support": [
    [
      "What can the Hospo Hub assistant help me with?",
      "The guided assistant answers a small set of common questions about requirements, documents, verification, fees and application status. Choose a question to see prepared guidance and a relevant link. It is not a live AI chat or a check of your actual application.",
    ],
    [
      "Is the Hospo Hub assistant a council officer?",
      "No. It is a guided information tool with prepared answers. It cannot make a council decision, inspect your premises or confirm a licence. Use official contact channels when you need an answer about your specific application.",
    ],
    [
      "Is the assistant giving legal advice?",
      "No. The assistant provides general information and navigation help. It does not assess your legal position or replace advice about a specific situation. Confirm formal requirements with the relevant authority or a qualified adviser.",
    ],
    [
      "How do I request help from a specialist?",
      "Open Book a specialist callback from Help & Support. Enter your contact details, choose a topic and describe your question, then preview the request. The current prototype lets you download that request but does not book a call or send it to council.",
    ],
    [
      "What should I include in a callback request?",
      "Include your name, phone or email, topic, preferred contact period and a short description of the problem. Add the application reference if it helps identify an existing case. Include enough context to explain what help you need without adding unnecessary sensitive information.",
    ],
    [
      "Can I include an application reference in my callback request?",
      "Yes. Enter it in the application-reference field. Signed-in customers can use suggestions from their saved applications, while visitors can enter a reference manually. Check it against the official correspondence before using the downloaded request.",
    ],
    [
      "Is the callback request actually submitted in the prototype?",
      "No. Preview and download prepare a copy of the information only. They do not send an email, create a council case or reserve a callback time. Use the official council contact arrangements to request real assistance.",
    ],
    [
      "How do I find a definition in the glossary?",
      "Open FAQs & glossary and select Glossary. Search for the term or use the category and A–Z filters; select a result to read its definition. Clear the filters if a term is hidden by another selection.",
    ],
    [
      "Where can I find official resources?",
      "Open Resources and choose Official information, or look for the Official source badge on a card. External sources open in a new tab and are distinct from Hospo Hub guides. Read the authority’s current instructions for your actual application.",
    ],
  ],
};

export const helpFaqs = Object.entries(sections).flatMap(
  ([section, entries]) => {
    const category = section === "FoodVerification" ? "Food Business" : section;
    const context =
      section === "FoodVerification"
        ? FOOD_VERIFICATION_HELP
        : CATEGORY_HELP[category];
    return entries.map(([question, answer, relatedResourceIds]) => ({
      id: `${section === "FoodVerification" ? "verification" : slug(category)}-${slug(question)}`,
      category,
      service: context.service,
      question,
      answer,
      keywords: [
        ...context.keywords,
        ...question
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter((word) => word.length > 3),
      ],
      relatedLinks: [{ label: context.label, to: context.to }],
      relatedResourceIds: relatedResourceIds || context.resources,
    }));
  },
);
