import { Link } from "react-router-dom";

const content = {
  recovery: {
    title: "Forgot password?",
    paragraphs: [
      "Password reset emails are not available in this prototype. Passwords are neither stored nor checked.",
      "To return to a prototype account created in this browser, sign in with its email and any made-up password. If the browser profile data has been cleared, create a new prototype account.",
    ],
  },
  terms: {
    title: "Prototype Terms of Use",
    paragraphs: [
      "Hospo Hub is a demonstration website. The optional account provides access to a browser-only prototype of My Hub, not a council account or application service.",
      "Use sample information when testing. Do not submit real applications, sensitive documents or reusable passwords. Registration does not submit anything to Auckland Council.",
      "Public guidance remains available without signing in. Production account terms will need to be provided before a live account service is launched.",
    ],
  },
  privacy: {
    title: "Prototype Privacy Policy",
    paragraphs: [
      "Creating a prototype account saves your name, email address, optional business name and a generated profile ID in this browser’s local storage. The account form does not send these details to an authentication server.",
      "Your saved requirements, draft forms, prototype applications, payment records, preferences and training progress are kept in local storage under your profile ID. Uploaded sample files are kept in this browser using IndexedDB. Signing out retains this workspace for your next session.",
      "Passwords are used only for frontend form validation. They are never stored or checked against an account.",
      "Your current session uses session storage unless you choose Remember me when signing in. Remember me keeps the session in local storage. Signing out removes session data but retains prototype profiles.",
      "Browser storage is not secure authentication. Anyone with access to this browser may access prototype profiles. Use sample details. Clear this site’s browser data to remove saved prototype profiles; this also removes other data saved by this site.",
    ],
  },
};

export default function AccountInformation({ type }) {
  const page = content[type];
  return (
    <section className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
      <h1 className="text-3xl font-extrabold text-gray-900">
        {page.title}
      </h1>
      {page.paragraphs.map((text) => (
        <p
          key={text}
          className="mt-4 leading-7 text-gray-600"
        >
          {text}
        </p>
      ))}
      <Link
        to="/login"
        className="mt-6 inline-block font-bold text-primary hover:underline"
      >
        Back to sign in →
      </Link>
    </section>
  );
}
