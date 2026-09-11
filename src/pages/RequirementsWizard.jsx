import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCoffee,
  FaUtensils,
  FaGlassMartini,
  FaMusic,
  FaTruck,
  FaShoppingCart,
  FaEllipsisH,
} from "react-icons/fa";

export default function RequirementsWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("Cafe");
  const [activities, setActivities] = useState([
    "Prepare food",
    "Serve alcohol",
    "Outdoor dining",
  ]);
  const [location, setLocation] = useState("123 Queen Street, Auckland");
  const [capacity, setCapacity] = useState({
    indoor: "40",
    outdoor: "20",
    maximum: "60",
  });

  const steps = [
    "Business type",
    "Business activities",
    "Location",
    "Seating & capacity",
    "Review results",
  ];

  const businessTypes = [
    { name: "Cafe", icon: <FaCoffee /> },
    { name: "Restaurant", icon: <FaUtensils /> },
    { name: "Bar", icon: <FaGlassMartini /> },
    { name: "Club", icon: <FaMusic /> },
    { name: "Food truck / mobile", icon: <FaTruck /> },
    { name: "Catering", icon: <FaShoppingCart /> },
    { name: "Other", icon: <FaEllipsisH /> },
  ];

  const activityOptions = [
    "Prepare food",
    "Serve alcohol",
    "Outdoor dining",
    "Takeaway",
    "Delivery",
  ];

  const toggleActivity = (activity) => {
    setActivities((current) =>
      current.includes(activity)
        ? current.filter((item) => item !== activity)
        : [...current, activity],
    );
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate("/requirements/result", {
      state: {
        businessType: selectedType,
        activities,
        location,
        capacity,
      },
    });
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 flex flex-col md:flex-row gap-12">
      <div className="w-full md:w-64 flex-shrink-0 border-r border-gray-200 pr-4">
        <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-primary">
            Check requirements
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-600">
            Your answers are used only to show guidance in this prototype.
          </p>
        </div>

        <nav className="flex flex-col space-y-6">
          {steps.map((label, index) => {
            const number = index + 1;
            const isCompleted = step > number;
            const isCurrent = step === number;

            return (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isCurrent
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? "✓" : number}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isCurrent
                      ? "text-gray-900 font-bold"
                      : isCompleted
                        ? "text-gray-900"
                        : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.1em] text-primary">
              Step 1 of 4
            </p>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              What type of business are you operating?
            </h1>
            <p className="text-gray-600 mb-8">
              Select the option that best describes your business.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
              {businessTypes.map((type) => (
                <button
                  key={type.name}
                  type="button"
                  onClick={() => setSelectedType(type.name)}
                  className={`flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-all ${
                    selectedType === type.name
                      ? "border-primary bg-blue-50 text-primary shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:border-primary hover:shadow-md"
                  }`}
                >
                  <div className="text-3xl">{type.icon}</div>
                  <span className="text-sm font-bold text-center">
                    {type.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.1em] text-primary">
              Step 2 of 4
            </p>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Business activities
            </h1>
            <p className="text-gray-600 mb-8">
              Select everything you plan to do. This is what drives the
              recommendation.
            </p>
            <div className="space-y-3 mb-12">
              {activityOptions.map((activity) => (
                <label
                  key={activity}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={activities.includes(activity)}
                    onChange={() => toggleActivity(activity)}
                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="font-medium text-gray-800">
                    {activity}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.1em] text-primary">
              Step 3 of 4
            </p>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Location
            </h1>
            <p className="text-gray-600 mb-8">
              Where is your business located or proposed to operate?
            </p>
            <div className="space-y-4 mb-12">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Start typing your address..."
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.1em] text-primary">
              Step 4 of 4
            </p>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Seating & capacity
            </h1>
            <p className="text-gray-600 mb-8">
              Provide estimates so the result has useful context.
            </p>
            <div className="space-y-6 mb-12">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Indoor seating
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={capacity.indoor}
                    onChange={(event) =>
                      setCapacity((current) => ({
                        ...current,
                        indoor: event.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Outdoor seating
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={capacity.outdoor}
                    onChange={(event) =>
                      setCapacity((current) => ({
                        ...current,
                        outdoor: event.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum capacity
                </label>
                <input
                  type="number"
                  min="0"
                  value={capacity.maximum}
                  onChange={(event) =>
                    setCapacity((current) => ({
                      ...current,
                      maximum: event.target.value,
                    }))
                  }
                  className="w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 rounded-md font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="bg-primary text-white px-8 py-2 rounded-md font-medium hover:bg-secondary transition-colors"
          >
            {step === 4 ? "See my requirements" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
