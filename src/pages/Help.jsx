import Card from '../components/Card';
import { FaPhone, FaEnvelope, FaComments } from 'react-icons/fa';

export default function Help() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Help and Support</h1>
        <p className="text-gray-600">Need assistance? Here are the ways you can get help with your hospitality licensing.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center text-xl mx-auto mb-4">
            <FaPhone />
          </div>
          <h3 className="font-bold mb-2">Call Us</h3>
          <p className="text-sm text-gray-500 mb-4">Available Monday to Friday, 8am to 5pm.</p>
          <p className="font-bold text-lg text-primary">09 301 0101</p>
        </Card>
        
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center text-xl mx-auto mb-4">
            <FaEnvelope />
          </div>
          <h3 className="font-bold mb-2">Email</h3>
          <p className="text-sm text-gray-500 mb-4">Send us your query and we'll reply within 2 working days.</p>
          <a href="mailto:hospohub@aucklandcouncil.govt.nz" className="font-medium text-primary hover:underline text-sm">
            Email Hospo Hub
          </a>
        </Card>

        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center text-xl mx-auto mb-4">
            <FaComments />
          </div>
          <h3 className="font-bold mb-2">Live Chat</h3>
          <p className="text-sm text-gray-500 mb-4">Chat with our licensing specialists online.</p>
          <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary">
            Start Chat
          </button>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            'How long does an alcohol licence take to process?',
            'What happens during a food business verification?',
            'Can I transfer my licence to a new owner?',
            'How do I renew my outdoor dining approval?'
          ].map((q, i) => (
            <details key={i} className="group bg-gray-50 rounded-md">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-gray-900">
                <span>{q}</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="text-gray-600 px-4 pb-4 text-sm">
                This is a placeholder answer for the frequently asked question. In a real application, this would contain detailed guidance from Auckland Council regarding {q.toLowerCase()}
              </div>
            </details>
          ))}
        </div>
      </Card>
    </div>
  );
}

