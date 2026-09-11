export default function Timeline({ steps, currentStep }) {
  return (
    <div className="relative border-l border-gray-200 ml-3">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={index} className="mb-8 ml-6">
            <span
              className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ring-white ${
                isCompleted
                  ? "bg-green-500"
                  : isCurrent
                    ? "bg-primary"
                    : "bg-gray-200"
              }`}
            >
              {isCompleted ? (
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : isCurrent ? (
                <span className="w-2 h-2 bg-white rounded-full"></span>
              ) : null}
            </span>
            <h3
              className={`font-medium leading-tight ${isCurrent ? "text-gray-900" : "text-gray-500"}`}
            >
              {step.title}
            </h3>
            {step.description && (
              <p className="text-sm text-gray-500 mt-1">
                {step.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
