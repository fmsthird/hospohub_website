import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';

export default function Requirements() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/requirements/result');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/4">
        <h3 className="font-bold text-gray-900 mb-4 hidden md:block">Steps</h3>
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((s, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s ? 'bg-primary text-white' : step > s ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? '✓' : s}
              </div>
              <span className={`font-medium ${step === s ? 'text-gray-900' : 'text-gray-500'}`}>
                {s === 1 ? 'Business Type' : s === 2 ? 'Activities' : s === 3 ? 'Location' : 'Results'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="md:w-3/4 max-w-2xl">
        <Card>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Find out what approvals you need</h1>
            <p className="text-gray-600">Answer a few questions about your business and we'll show you the licences and approvals you may need.</p>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">1. What type of business are you operating?</h2>
              <select className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-primary">
                <option value="">Select a business type...</option>
                <option value="cafe">Cafe</option>
                <option value="restaurant">Restaurant</option>
                <option value="food-truck">Food Truck</option>
                <option value="bar">Bar</option>
                <option value="club">Club</option>
              </select>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">2. What activities will you be doing?</h2>
              <div className="space-y-3">
                {['Prepare food', 'Serve alcohol', 'Outdoor dining', 'Entertainment'].map((activity, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary" />
                    <span>{activity}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">3. Where is your business located?</h2>
              <input type="text" placeholder="Start typing your address..." className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-primary" />
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
            <button 
              onClick={handleBack}
              disabled={step === 1}
              className={`px-6 py-2 rounded-md font-medium border ${step === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-primary text-primary hover:bg-blue-50'}`}
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-secondary"
            >
              {step === 3 ? 'View Results' : 'Continue'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

