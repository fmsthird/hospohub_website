export default function SearchBar({ placeholder, onSearch }) {
  return (
    <div className="flex w-full max-w-2xl">
      <input 
        type="text" 
        placeholder={placeholder}
        className="flex-1 border border-r-0 border-gray-300 rounded-l-md px-4 py-3 focus:outline-none focus:border-primary"
      />
      <button 
        onClick={onSearch}
        className="bg-primary text-white px-6 py-3 rounded-r-md font-medium hover:bg-secondary transition-colors"
      >
        Search
      </button>
    </div>
  );
}

