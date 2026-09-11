export default function Notification({ message, type = 'info' }) {
  return (
    <div className={`p-4 rounded-md mb-4 ${type === 'error' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}

