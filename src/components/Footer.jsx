import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.svg";
const columns = [
  {
    title: "Get Started",
    links: [
      ["Opening a new business", "/get-started/new-business"],
      ["Buying an existing business", "/get-started/buying-business"],
      ["Changing an existing operation", "/get-started/changing-business"],
      ["Check requirements", "/get-started"],
    ],
  },
  {
    title: "Guidance",
    links: [
      ["Licensing Guide", "/licensing-guide"],
      ["Food business registration", "/licensing-guide?guide=food"],
      ["Alcohol licensing", "/licensing-guide?guide=alcohol"],
      ["Outdoor dining", "/licensing-guide?guide=outdoor"],
      ["Learning Centre", "/learning-centre"],
      ["Resources", "/resources"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Help & Support", "/help"],
      ["AI assistant", "/help/assistant"],
      ["Book a specialist callback", "/help/callback"],
      ["FAQs & glossary", "/help/faqs"],
    ],
  },
];
const linkClass =
  "inline-flex min-h-11 items-center py-2 text-sm leading-5 text-slate-300 transition-colors hover:text-white hover:underline focus-visible:outline-sky-300";
export default function Footer() {
  const { isAuthenticated } = useAuth();
  const accountLinks = isAuthenticated
    ? [
        ["My Hub", "/dashboard"],
        ["My Applications", "/my-applications"],
        ["Documents", "/documents"],
        ["Messages", "/messages"],
      ]
    : [
        ["Sign in", "/login"],
        ["Create account", "/create-account"],
      ];
  return (
    <footer
      aria-label="Public footer"
      className="border-t border-white/10 bg-[#062D49] text-slate-300"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Link
              to="/"
              className="inline-flex min-h-11 items-center gap-3 text-white"
            >
              <img src={logo} alt="" className="h-12 w-10 object-contain" />
              <span>
                <span className="block text-xs font-semibold">
                  Auckland Council
                </span>
                <strong className="mt-1 block text-xl">Hospo Hub</strong>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6">
              Guidance and digital support for navigating hospitality
              requirements, applications and ongoing business needs.
            </p>
            <p className="mt-3 text-xs text-slate-300">
              Food | Alcohol | Outdoor Dining
            </p>
            <p className="mt-4 text-xs leading-5 text-slate-300">
              Prototype guidance and workspace. Applications, payments and
              callback requests are not sent to council.
            </p>
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={`Footer ${column.title}`}>
              <h2 className="mb-3 text-sm font-bold text-white">
                {column.title}
              </h2>
              <ul>
                {column.links.map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className={linkClass}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              {column.title === "Support" && (
                <div className="mt-5">
                  <h2 className="mb-2 text-sm font-bold text-white">Account</h2>
                  <ul>
                    {accountLinks.map(([label, to]) => (
                      <li key={to}>
                        <Link to={to} className={linkClass}>
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </nav>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-xs">
            © {new Date().getFullYear()} Hospo Hub · Prototype
          </p>
          <nav aria-label="Footer policies" className="flex flex-wrap gap-x-5">
            <Link to="/privacy" className={linkClass}>
              Privacy
            </Link>
            <Link to="/terms" className={linkClass}>
              Terms
            </Link>
          </nav>
          <Link
            to="/staff/login"
            className="inline-flex min-h-11 items-center text-xs text-slate-300 hover:text-white hover:underline"
          >
            Council staff login
          </Link>
        </div>
      </div>
    </footer>
  );
}
