import { Link } from 'react-router-dom';
import {
  FaUtensils,
  FaWineGlassAlt,
  FaUmbrellaBeach,
  FaClipboardCheck,
} from 'react-icons/fa';

import heroImage from '../assets/auckland-skyline.png';

const services = [
  {
    title: 'Food business\nregistration',
    description: 'Register or update your\nfood business',
    icon: FaUtensils,
    to: '/licensing-guide?guide=food',
    accent: 'text-[#0069a6]',
  },
  {
    title: 'Alcohol licensing',
    description: 'On, off or club licences',
    icon: FaWineGlassAlt,
    to: '/licensing-guide?guide=alcohol',
    accent: 'text-[#0069a6]',
  },
  {
    title: 'Outdoor dining\napprovals',
    description: 'Apply for outdoor\nseating or dining areas',
    icon: FaUmbrellaBeach,
    to: '/licensing-guide?guide=outdoor',
    accent: 'text-[#e5b900]',
  },
  {
    title: 'Verification\nrequirements',
    description: "Find out what's needed\nfor your activities",
    icon: FaClipboardCheck,
    to: '/get-started',
    accent: 'text-[#0069a6]',
  },
];

export default function Home() {
  return (
    <div className="w-full bg-[#f4f8fb]">
      {/* HERO */}
      <section className="relative min-h-[505px] overflow-hidden">
        {/* AUCKLAND LANDING IMAGE */}
        <img
          src={heroImage}
          alt="Auckland skyline"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* LIGHT OVERLAY SO TEXT IS READABLE */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#dff2ff]/95 via-[#dff2ff]/65 to-transparent" />

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto w-full max-w-[1180px] px-6 pb-36 pt-10 md:px-10 md:pt-12">
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#387899]">
            Auckland Council
          </p>

          <h1 className="max-w-[600px] text-[42px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#071b2b] md:text-[54px]">
            Hospitality licensing
            <br />
            made simpler
          </h1>

          <p className="mt-5 max-w-[620px] text-[17px] font-medium leading-7 text-[#253b49] md:text-[19px]">
            Explore licensing requirements, practical guides
            <br className="hidden sm:block" />
            and resources for your hospitality business.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/get-started"
              className="inline-flex min-w-[145px] items-center justify-center rounded-md bg-[#0076b8] px-7 py-3.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#005f95]"
            >
              Get started
            </Link>

            <Link
              to="/get-started"
              className="inline-flex min-w-[180px] items-center justify-center rounded-md border-2 border-[#5eb6e3] bg-white/90 px-7 py-3 text-[15px] font-semibold text-[#1173aa] shadow-sm transition hover:bg-white"
            >
              Check requirements
            </Link>

            <Link
              to="/licensing-guide"
              className="inline-flex min-w-[180px] items-center justify-center rounded-md border-2 border-[#5eb6e3] bg-white/90 px-7 py-3 text-[15px] font-semibold text-[#1173aa] shadow-sm transition hover:bg-white"
            >
              Explore licensing
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICE CARDS */}
      <section className="relative z-20 mx-auto -mt-[72px] w-full max-w-[1180px] px-6 pb-16 md:px-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(
            ({ title, description, icon: Icon, to, accent }) => (
              <Link
                key={title}
                to={to}
                className="
                  group
                  min-h-[205px]
                  rounded-lg
                  border border-[#e0e7ec]
                  bg-white
                  px-7
                  py-7
                  shadow-[0_5px_18px_rgba(28,58,77,0.10)]
                  transition
                  hover:-translate-y-1
                  hover:shadow-[0_10px_24px_rgba(28,58,77,0.16)]
                "
              >
                <Icon className={`mb-5 text-[34px] ${accent}`} />

                <h2 className="whitespace-pre-line text-[18px] font-extrabold leading-[1.15] text-[#0d1d29]">
                  {title}
                </h2>

                <p className="mt-3 whitespace-pre-line text-[13px] font-medium leading-[1.45] text-[#61717d]">
                  {description}
                </p>
              </Link>
            ),
          )}
        </div>
      </section>
    </div>
  );
}