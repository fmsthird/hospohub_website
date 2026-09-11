import { Link } from "react-router-dom";
import Card from "../components/Card";
import { FaStore, FaExchangeAlt, FaPen } from "react-icons/fa";

export default function GetStarted() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
        What are you doing?
      </h1>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl">
        Tell us about your situation so we can guide you to the right
        information and application process.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/get-started/new-business" className="block group h-full">
          <Card className="h-full flex flex-col justify-between p-8 hover:border-primary hover:shadow-md transition-all border-2 border-gray-100">
            <div>
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-lg flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <FaStore />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                I'm opening a new business
              </h3>
              <p className="text-sm text-gray-600 mb-8">
                Find out what you need to get started.
              </p>
            </div>
            <div className="text-primary font-bold text-xl group-hover:translate-x-2 transition-transform">
              &rarr;
            </div>
          </Card>
        </Link>

        <Link to="/get-started/buying-business" className="block group h-full">
          <Card className="h-full flex flex-col justify-between p-8 hover:border-primary hover:shadow-md transition-all border-2 border-gray-100">
            <div>
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-lg flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <FaExchangeAlt />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                I'm buying an existing business
              </h3>
              <p className="text-sm text-gray-600 mb-8">
                Check what you need to transfer or update licences.
              </p>
            </div>
            <div className="text-primary font-bold text-xl group-hover:translate-x-2 transition-transform">
              &rarr;
            </div>
          </Card>
        </Link>

        <Link
          to="/get-started/changing-business"
          className="block group h-full"
        >
          <Card className="h-full flex flex-col justify-between p-8 hover:border-primary hover:shadow-md transition-all border-2 border-gray-100">
            <div>
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-lg flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <FaPen />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                I'm changing an existing operation
              </h3>
              <p className="text-sm text-gray-600 mb-8">
                Update your licences (e.g. menu, hours, seating, ownership).
              </p>
            </div>
            <div className="text-primary font-bold text-xl group-hover:translate-x-2 transition-transform">
              &rarr;
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
