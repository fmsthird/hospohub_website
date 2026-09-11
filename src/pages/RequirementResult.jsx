import { Link } from "react-router-dom";
import { FaUtensils, FaWineGlass, FaUmbrella } from "react-icons/fa";
import Card from "../components/Card";

export default function RequirementResult() {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/4">
        <h3 className="font-bold text-gray-900 mb-4 hidden md:block">
          Steps
        </h3>
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((s, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s === 4 ? "bg-primary text-white" : "bg-green-500 text-white"
                }`}
              >
                {s === 4 ? s : "✓"}
              </div>
              <span
                className={`font-medium ${s === 4 ? "text-gray-900" : "text-gray-500"}`}
              >
                {s === 1
                  ? "Business Type"
                  : s === 2
                    ? "Activities"
                    : s === 3
                      ? "Location"
                      : "Results"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="md:w-3/4 max-w-2xl">
        <Card>
          <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-8 flex gap-3">
            <div className="text-green-600 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-900">
                Based on your answers:
              </h3>
              <p className="text-sm text-green-800">
                You will need 3 approvals to operate your business.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="border border-border rounded-md p-4 flex gap-4">
              <div className="bg-blue-50 w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 text-primary">
                <FaUtensils className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  Food Business Registration
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Required because you selected "Prepare food".
                </p>
                <Link
                  to="/licensing-guide"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View details
                </Link>
              </div>
            </div>

            <div className="border border-border rounded-md p-4 flex gap-4">
              <div className="bg-blue-50 w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 text-primary">
                <FaWineGlass className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  Alcohol Licence
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Required because you selected "Serve alcohol".
                </p>
                <Link
                  to="/licensing-guide"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View details
                </Link>
              </div>
            </div>

            <div className="border border-border rounded-md p-4 flex gap-4">
              <div className="bg-blue-50 w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 text-primary">
                <FaUmbrella className="text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  Outdoor Dining Approval
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Required because you selected "Outdoor dining".
                </p>
                <Link
                  to="/licensing-guide"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View details
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <Link
              to="/licensing-guide"
              className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-secondary"
            >
              Explore licensing
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
