import { Link, Navigate, useLocation } from "react-router-dom";
import EstimatedFees from "../components/EstimatedFees";
import SaveRequirements from "../components/SaveRequirements";
import {
  FaUtensils,
  FaWineGlass,
  FaUmbrella,
  FaArrowRight,
} from "react-icons/fa";

export default function RequirementsResult() {
  const location = useLocation();
  const answers = location.state;
  if (!answers || !Array.isArray(answers.activities)) {
    return <Navigate to="/get-started" replace />;
  }

  const activities = answers.activities || [];
  const hasFood = activities.some((item) =>
    ["Prepare food", "Takeaway", "Delivery"].includes(item),
  );
  const hasAlcohol = activities.includes("Serve alcohol");
  const hasOutdoor = activities.includes("Outdoor dining");

  const requirements = [
    hasFood && {
      id: "food",
      title: "Food business registration",
      status: "Likely required",
      statusClass:
        "bg-red-100 text-red-800",
      description:
        "Food preparation or food sales may require registration under the Food Act and an applicable food control plan or national programme. Registered food businesses are generally verified against the food safety requirements that apply to their operation.",
      icon: FaUtensils,
      guide: "/licensing-guide?guide=food",
    },
    hasAlcohol && {
      id: "alcohol",
      title: "Alcohol licence",
      status: "Likely required",
      statusClass:
        "bg-red-100 text-red-800",
      description:
        "Selling or serving alcohol requires the appropriate licence type for the way alcohol will be supplied and consumed.",
      icon: FaWineGlass,
      guide: "/licensing-guide?guide=alcohol",
    },
    hasOutdoor && {
      id: "outdoor",
      title: "Outdoor dining approval",
      status: "May be required",
      statusClass:
        "bg-yellow-100 text-yellow-800",
      description:
        "Approval may be needed if tables or seating will occupy a footpath or other council-managed public space.",
      icon: FaUmbrella,
      guide: "/licensing-guide?guide=outdoor",
    },
  ].filter(Boolean);

  const steps = [
    "Business type",
    "Business activities",
    "Location",
    "Seating & capacity",
    "Results",
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 flex flex-col md:flex-row gap-12">
      <div className="w-full md:w-64 flex-shrink-0 border-r border-gray-200 pr-4">
        <nav className="flex flex-col space-y-6">
          {steps.map((label, index) => {
            const isCurrent = index === 4;
            return (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isCurrent ? "bg-primary text-white" : "bg-green-500 text-white"}`}
                >
                  {isCurrent ? "5" : "✓"}
                </div>
                <span
                  className={`text-sm font-medium ${isCurrent ? "font-bold text-gray-900" : "text-gray-900"}`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="flex-1">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.1em] text-primary">
          Your requirement guide
        </p>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Based on your answers, you may need:
        </h1>
        <p className="text-gray-600 mb-6">
          This is an initial guide only. Final requirements depend on the full
          details of your business and site.
        </p>

        <div className="mb-8 grid gap-3 rounded-lg border border-gray-200 bg-[#F8FBFD] p-5 text-sm sm:grid-cols-2">
          <div>
            <span className="font-bold text-gray-900">
              Business:
            </span>{" "}
            <span className="text-gray-600">
              {answers.businessType}
            </span>
          </div>
          <div>
            <span className="font-bold text-gray-900">
              Location:
            </span>{" "}
            <span className="text-gray-600">
              {answers.location || "Not provided"}
            </span>
          </div>
          <div className="sm:col-span-2">
            <span className="font-bold text-gray-900">
              Activities:
            </span>{" "}
            <span className="text-gray-600">
              {activities.length ? activities.join(", ") : "None selected"}
            </span>
          </div>
        </div>

        {requirements.length > 0 ? (
          <div className="space-y-4 mb-12">
            {requirements.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-5 bg-white hover:border-gray-300 transition-colors"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 shrink-0 bg-blue-50 text-primary rounded-lg flex items-center justify-center text-xl">
                        <Icon />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {item.title}
                        </h3>
                        <span
                          className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${item.statusClass}`}
                        >
                          {item.status}
                        </span>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                          {item.description}
                        </p>
                        {item.id === "food" && (
                          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
                            <li>Food registration</li>
                            <li>
                              Food Control Plan / National Programme as
                              applicable
                            </li>
                            <li>
                              <Link
                                className="font-semibold text-primary underline"
                                to="/licensing-guide?guide=food&tab=verification"
                              >
                                Verification requirements and preparation
                              </Link>
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                    <Link
                      to={item.guide}
                      className="inline-flex shrink-0 items-center gap-2 self-start rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-primary hover:bg-gray-50 sm:self-center"
                    >
                      View guide <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mb-12 rounded-lg border border-green-200 bg-green-50 p-6">
            <h3 className="font-bold text-gray-900">
              No core Hospo Hub requirement was triggered by these answers.
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Other planning, building, environmental health or
              location-specific requirements may still apply, so use the
              Licensing Guide or Help pages if your activity is not covered
              here.
            </p>
          </div>
        )}

        <EstimatedFees
          food={hasFood}
          alcohol={hasAlcohol}
          outdoor={hasOutdoor}
        />
        <SaveRequirements
          categories={[
            hasFood && "food",
            hasAlcohol && "alcohol",
            hasOutdoor && "outdoor",
          ].filter(Boolean)}
          business={{ type: answers.businessType, location: answers.location }}
          answers={answers}
        />

        <div className="flex flex-wrap justify-between gap-3 border-t border-gray-200 pt-6">
          <Link
            to="/get-started"
            className="px-6 py-2 rounded-md font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Check again
          </Link>
          <Link
            to="/licensing-guide"
            className="bg-primary text-white px-8 py-2 rounded-md font-medium hover:bg-secondary transition-colors"
          >
            Explore licensing
          </Link>
        </div>
      </div>
    </div>
  );
}
