import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "Get Started", path: "/get-started" },
    { name: "Licensing Guide", path: "/licensing-guide" },
    { name: "Learning Centre", path: "/learning-centre" },
    { name: "Resources", path: "/resources" },
    { name: "Help", path: "/help" },
  ];

  const isActive = (path) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path));

  return (
    <nav
      className="
        sticky
        top-[58px]
        sm:top-[70px]
        z-40
        w-full
        border-b
        border-[#dfe7ec]
        bg-white
        shadow-[0_1px_5px_rgba(0,0,0,0.05)]
      "
    >
      {/* DESKTOP NAV */}
      <div
        className="
          hidden
          md:flex
          mx-auto
          max-w-[1180px]
          items-center
          gap-6
          lg:gap-8
          px-6
          lg:px-10
        "
      >
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`
              whitespace-nowrap
              border-b-[3px]
              py-3
              text-[13px]
              font-semibold
              transition-colors
              ${
                isActive(link.path)
                  ? "border-[#0076b8] text-[#0076b8]"
                  : "border-transparent text-[#334b5a] hover:text-[#0076b8]"
              }
            `}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* MOBILE NAV INDICATOR */}
      <div
        className="
          md:hidden
          flex
          items-center
          justify-center
          h-1
          bg-[#0076b8]
          w-16
        "
      />
    </nav>
  );
}
